"""Fetch public company PM guides from nextsprints.com/guide_sitemap1.xml and export Markdown + index."""

import argparse
from collections import Counter, defaultdict
import csv
import json
from pathlib import Path
import time
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup, NavigableString, Tag
import requests

SITEMAP_URL = "https://nextsprints.com/guide_sitemap1.xml"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
OUTPUT_DIR = Path(__file__).resolve().parent
INDEX_FIELDS = ["slug", "title", "guide_type", "url", "updated_at", "word_count", "local_path"]


def classify_guide(url: str) -> str:
    """Classify a guide URL into one of the four guide categories."""
    if "interview-guide" in url:
        return "interview-guide"
    if "strategy-guide" in url:
        return "strategy-guide"
    if "salary-guide" in url:
        return "salary-guide"
    if "teardown" in url:
        return "product-teardown"
    return "other"


def fetch_with_retry(session: requests.Session, url: str, retries: int = 3) -> requests.Response:
    """GET a URL with exponential backoff on transient network or 429/5xx errors."""
    for attempt in range(retries):
        try:
            resp = session.get(url, headers=HEADERS, timeout=25)
            if resp.status_code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                time.sleep(2 ** (attempt + 1))
                continue
            resp.raise_for_status()
            return resp
        except requests.RequestException:
            if attempt >= retries - 1:
                raise
            time.sleep(2 ** (attempt + 1))
    raise RuntimeError(f"Failed after {retries} attempts: {url}")


def inline_md(node: Tag | NavigableString) -> str:
    """Convert inline HTML tags inside paragraphs, headings, and list items to Markdown."""
    if isinstance(node, NavigableString):
        return str(node)
    if not isinstance(node, Tag) or node.name in ("svg", "script", "style", "button"):
        return ""

    inner = "".join(inline_md(child) for child in node.children)
    if node.name in ("strong", "b"):
        text = inner.strip()
        return f"**{text}**" if text else ""
    if node.name in ("em", "i"):
        text = inner.strip()
        return f"*{text}*" if text else ""
    if node.name == "code" and node.parent and node.parent.name != "pre":
        text = inner.strip()
        return f"`{text}`" if text else ""
    if node.name == "a":
        href = node.get("href") or ""
        text = inner.strip()
        return f"[{text}]({href})" if text and href else text
    if node.name == "br":
        return "  \n"
    return inner


def table_to_md(table: Tag) -> str:
    """Convert an HTML table into a GitHub-flavored Markdown table."""
    rows: list[list[str]] = []
    for tr in table.find_all("tr"):
        cells = [
            " ".join(inline_md(c).split()).replace("|", "\\|")
            for c in tr.find_all(["th", "td"], recursive=False)
        ]
        if cells:
            rows.append(cells)
    if not rows:
        return ""
    col_count = max(len(r) for r in rows)
    norm_rows = [r + [""] * (col_count - len(r)) for r in rows]
    header = "| " + " | ".join(norm_rows[0]) + " |"
    sep = "| " + " | ".join("---" for _ in range(col_count)) + " |"
    body = ["| " + " | ".join(r) + " |" for r in norm_rows[1:]]
    return "\n".join([header, sep, *body])


def block_to_md(el: Tag) -> str:
    """Convert a top-level block element inside the guide prose container to Markdown."""
    name = el.name
    if name in ("h1", "h2", "h3", "h4"):
        level = int(name[1])
        text = " ".join(inline_md(el).split())
        return f"{'#' * level} {text}" if text else ""

    if name == "p":
        text = " ".join(inline_md(el).split())
        return text

    if name in ("ul", "ol"):
        lines = []
        for idx, li in enumerate(el.find_all("li", recursive=False), start=1):
            prefix = f"{idx}. " if name == "ol" else "- "
            text = " ".join(inline_md(li).split())
            if text:
                lines.append(f"{prefix}{text}")
        return "\n".join(lines)

    if name == "table":
        return table_to_md(el)

    if name == "blockquote":
        text = " ".join(el.get_text(" ", strip=True).split())
        return "\n".join(f"> {line}" for line in text.splitlines()) if text else ""

    if name == "pre":
        code = el.get_text().strip("\n")
        return f"```\n{code}\n```" if code else ""

    if name == "div":
        classes = el.get("class") or []
        if "mermaid" in classes:
            diagram = el.get_text().strip()
            return f"```mermaid\n{diagram}\n```" if diagram else ""
        # Callout boxes or interactive practice embeds
        text_lines = [line.strip() for line in el.get_text("\n", strip=True).splitlines() if line.strip()]
        if not text_lines:
            return ""
        if any(c.startswith("bg-") for c in classes):
            return "\n".join(f"> {line}" for line in text_lines)
        return "\n\n".join(text_lines)

    return ""


def parse_guide(url: str, html: str) -> tuple[dict, str]:
    """Extract guide metadata and formatted Markdown body from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    slug = url.rstrip("/").split("/")[-1]
    guide_type = classify_guide(url)

    main = soup.find("main") or soup
    h1 = main.find("h1")
    title = h1.get_text(" ", strip=True) if h1 else (soup.title.string.strip() if soup.title and soup.title.string else slug)

    updated_at = ""
    for node in main.find_all(string=lambda t: t and "Updated " in t):
        cleaned = node.strip()
        if cleaned.startswith("Updated "):
            updated_at = cleaned.removeprefix("Updated ").strip()
            break

    art = soup.find("article")
    prose = art.find("div", class_="prose") if art else None
    blocks: list[str] = [
        f"# {title}",
        "",
        f"- **Source:** {url}",
        f"- **Type:** `{guide_type}`",
    ]
    if updated_at:
        blocks.append(f"- **Updated:** {updated_at}")
    blocks.extend(["", "---", ""])

    body_blocks: list[str] = []
    if prose:
        for child in prose.children:
            if isinstance(child, Tag):
                md = block_to_md(child).strip()
                if md:
                    body_blocks.append(md)
    else:
        text = main.get_text("\n", strip=True)
        if text:
            body_blocks.append(text)

    markdown = "\n\n".join([*blocks, *body_blocks]).strip() + "\n"
    word_count = len(markdown.split())
    local_rel = f"by-type/{guide_type}/{slug}.md"

    meta = {
        "slug": slug,
        "title": title,
        "guide_type": guide_type,
        "url": url,
        "updated_at": updated_at,
        "word_count": word_count,
        "local_path": local_rel,
    }
    return meta, markdown


def extract_practice_questions(body: str) -> list[dict]:
    """Extract embedded practice questions and categories from a guide's Markdown body."""
    questions: list[dict] = []
    lines = body.splitlines()
    for idx, raw in enumerate(lines):
        stripped = raw.strip()
        if stripped.startswith("Practice ") and stripped.endswith(" questions"):
            current_category = ""
            pos = idx + 1
            while pos < len(lines):
                item = lines[pos].strip()
                if item.startswith("## "):
                    break
                if item and item != "View":
                    next_non_empty = next(
                        (lines[j].strip() for j in range(pos + 1, len(lines)) if lines[j].strip()),
                        "",
                    )
                    if next_non_empty == "View":
                        questions.append({"category": current_category, "question": item})
                    else:
                        current_category = item
                pos += 1
            break
    return questions


def parse_guide_markdown(markdown: str) -> dict:
    """Parse a saved guide Markdown file into structured sections, FAQs, and practice questions."""
    parts = markdown.split("\n---\n", 1)
    body = (parts[1] if len(parts) > 1 else markdown).strip()

    sections: list[dict] = []
    current_h2: dict | None = None
    current_h3: dict | None = None
    in_fence = False

    def flush_h3() -> None:
        nonlocal current_h3
        if current_h3 is not None and current_h2 is not None:
            current_h3["content"] = "\n".join(current_h3["lines"]).strip()
            del current_h3["lines"]
            current_h2["subsections"].append(current_h3)
            current_h3 = None

    def flush_h2() -> None:
        nonlocal current_h2
        flush_h3()
        if current_h2 is not None:
            current_h2["content"] = "\n".join(current_h2["lines"]).strip()
            del current_h2["lines"]
            sections.append(current_h2)
            current_h2 = None

    intro_lines: list[str] = []
    for line in body.splitlines():
        if line.strip().startswith("```"):
            in_fence = not in_fence
        if not in_fence and line.startswith("## "):
            flush_h2()
            current_h2 = {"heading": line[3:].strip(), "lines": [], "subsections": []}
        elif not in_fence and line.startswith("### ") and current_h2 is not None:
            flush_h3()
            current_h3 = {"heading": line[4:].strip(), "lines": []}
        elif current_h3 is not None:
            current_h3["lines"].append(line)
        elif current_h2 is not None:
            current_h2["lines"].append(line)
        else:
            intro_lines.append(line)

    flush_h2()
    intro = "\n".join(intro_lines).strip()
    if intro:
        sections.insert(0, {"heading": "Overview", "content": intro, "subsections": []})

    faqs: list[dict] = []
    for sec in sections:
        if sec["heading"].lower().startswith("faq"):
            for sub in sec["subsections"]:
                faqs.append({"question": sub["heading"], "answer": sub["content"]})

    return {
        "sections": sections,
        "practice_questions": extract_practice_questions(body),
        "faqs": faqs,
        "content_markdown": body,
    }


def export_full_jsons(records: list[dict]) -> None:
    """Build full structured JSON exports (all-in-one, per-type, and per-guide) from local Markdown."""
    full_records: list[dict] = []
    by_type: dict[str, list[dict]] = defaultdict(list)

    for meta in records:
        md_path = OUTPUT_DIR / meta["local_path"]
        markdown = md_path.read_text(encoding="utf-8")
        parsed = parse_guide_markdown(markdown)
        full_entry = {**meta, **parsed}
        full_records.append(full_entry)
        by_type[meta["guide_type"]].append(full_entry)

        per_guide_json = md_path.with_suffix(".json")
        per_guide_json.write_text(
            json.dumps(full_entry, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    (OUTPUT_DIR / "all_guides_full.json").write_text(
        json.dumps(full_records, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    type_json_dir = OUTPUT_DIR / "by-type-json"
    type_json_dir.mkdir(parents=True, exist_ok=True)
    for gtype, items in sorted(by_type.items()):
        (type_json_dir / f"{gtype}.json").write_text(
            json.dumps(items, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )


def write_summary(records: list[dict], failed: list[dict]) -> None:
    """Write README.md summarizing all downloaded NextSprints guides."""
    type_counts = Counter(r["guide_type"] for r in records)
    lines = [
        "# NextSprints Public PM Company Guides",
        "",
        f"- **Source Sitemap:** `{SITEMAP_URL}`",
        f"- **Total Guides Exported:** {len(records)}",
        f"- **Failed:** {len(failed)}",
        "",
        "## Breakdown by Guide Type",
        "",
        "| Guide Type | Count | Folder |",
        "| :--- | ---: | :--- |",
    ]
    for gtype, count in type_counts.most_common():
        lines.append(f"| `{gtype}` | {count} | `by-type/{gtype}/` |")

    lines.extend([
        "",
        "## Files",
        "",
        "- `all_guides_full.json` — **complete JSON of all 274 guides** (all sections, subsections, tables, practice questions, FAQs, and full text)",
        "- `by-type-json/<type>.json` — full JSON split by guide type (`interview-guide`, `strategy-guide`, `salary-guide`, `product-teardown`)",
        "- `by-type/<type>/<slug>.md` & `.json` — individual guide Markdown + structured JSON",
        "- `guides_index.csv` / `guides_index.json` — lightweight metadata catalog",
    ])
    (OUTPUT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Export NextSprints PM company guides.")
    parser.add_argument(
        "--build-json-only",
        action="store_true",
        help="Build full JSON files from already-downloaded Markdown files without scraping.",
    )
    args = parser.parse_args()

    if args.build_json_only:
        records = json.loads((OUTPUT_DIR / "guides_index.json").read_text(encoding="utf-8"))
        export_full_jsons(records)
        write_summary(records, [])
        print(f"Built full JSON exports for {len(records)} guides in {OUTPUT_DIR}")
        return

    with requests.Session() as session:
        sm_resp = fetch_with_retry(session, SITEMAP_URL)
        root = ET.fromstring(sm_resp.text)
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [loc.text.strip() for loc in root.findall(".//s:loc", ns) if loc.text]
        print(f"Found {len(urls)} guide URLs in sitemap", flush=True)

        records: list[dict] = []
        failed: list[dict] = []

        for idx, url in enumerate(urls, start=1):
            try:
                resp = fetch_with_retry(session, url)
                meta, markdown = parse_guide(url, resp.text)
                out_file = OUTPUT_DIR / meta["local_path"]
                out_file.parent.mkdir(parents=True, exist_ok=True)
                out_file.write_text(markdown, encoding="utf-8")
                records.append(meta)
            except Exception as exc:
                failed.append({"url": url, "error": str(exc)})
                print(f"WARN [{idx}/{len(urls)}] failed {url}: {exc}", flush=True)

            if idx % 25 == 0 or idx == len(urls):
                print(f"Processed {idx}/{len(urls)} guides ({len(records)} ok, {len(failed)} failed)", flush=True)
            time.sleep(0.15)

    records.sort(key=lambda r: (r["guide_type"], r["slug"]))
    (OUTPUT_DIR / "guides_index.json").write_text(
        json.dumps(records, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    with (OUTPUT_DIR / "guides_index.csv").open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=INDEX_FIELDS)
        writer.writeheader()
        writer.writerows(records)

    if failed:
        (OUTPUT_DIR / "failed_urls.json").write_text(
            json.dumps(failed, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    export_full_jsons(records)
    write_summary(records, failed)
    print(f"Done! Exported {len(records)} guides to {OUTPUT_DIR}", flush=True)


if __name__ == "__main__":
    main()
