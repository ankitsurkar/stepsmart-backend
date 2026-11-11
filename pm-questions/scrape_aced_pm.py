"""Fetch public Product Management interview questions from aced.io and export by category."""

from collections import Counter, defaultdict
import csv
import json
from pathlib import Path
import time

from bs4 import BeautifulSoup
import requests

BASE_URL = "https://www.aced.io/questions"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
OUTPUT_DIR = Path(__file__).resolve().parent
CSV_FIELDS = [
    "id",
    "title",
    "url",
    "categories",
    "companies",
    "difficulty",
    "last_asked_on",
    "votes",
    "views",
    "comments",
    "has_expert_solution",
    "published_at",
]


def fetch_page(session: requests.Session, page: int, retries: int = 3) -> dict:
    """Fetch a single paginated PM questions page and parse its __NEXT_DATA__ payload."""
    for attempt in range(retries):
        resp = session.get(
            BASE_URL,
            params={"role": "pm", "page": page},
            headers=HEADERS,
            timeout=20,
        )
        if resp.status_code in (429, 500, 502, 503, 504) and attempt < retries - 1:
            time.sleep(2 ** (attempt + 1))
            continue
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        next_data = soup.find("script", id="__NEXT_DATA__")
        if not next_data or not next_data.string:
            raise ValueError(f"Missing __NEXT_DATA__ on page {page}")
        payload = json.loads(next_data.string)
        return payload["props"]["pageProps"]["initialQuestions"]
    raise RuntimeError(f"Failed to fetch page {page} after {retries} attempts")


def normalize_question(raw: dict) -> dict:
    """Extract clean, non-PII public question fields from a raw aced.io question record."""
    qid = raw.get("id")
    slug = raw.get("slug") or ""
    title = ((raw.get("data") or {}).get("title") or "").strip()
    categories = [c for c in (raw.get("category") or []) if c]
    companies = [c.get("name") for c in (raw.get("companies") or []) if c.get("name")]
    return {
        "id": qid,
        "title": title,
        "url": f"https://www.aced.io/questions/{qid}/{slug}" if slug else f"https://www.aced.io/questions/{qid}",
        "categories": categories,
        "companies": companies,
        "difficulty": raw.get("difficulty") or "",
        "last_asked_on": raw.get("last_asked_on") or "",
        "votes": raw.get("votes") or 0,
        "views": raw.get("views") or 0,
        "comments": raw.get("comments") or 0,
        "has_expert_solution": bool(raw.get("has_expert_solution")),
        "published_at": raw.get("published_at") or "",
    }


def write_dataset(records: list[dict], json_path: Path, csv_path: Path) -> None:
    """Write a list of question dicts to both JSON and CSV."""
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for item in records:
            row = dict(item)
            row["categories"] = ", ".join(item["categories"])
            row["companies"] = ", ".join(item["companies"])
            writer.writerow(row)


def write_summary(records: list[dict], category_counts: Counter, company_counts: Counter) -> None:
    """Generate a concise Markdown summary of the exported PM question bank."""
    lines = [
        "# Aced.io Product Management Questions",
        "",
        f"- **Source:** `{BASE_URL}?role=pm`",
        f"- **Total unique PM questions:** {len(records)}",
        f"- **Categories:** {len(category_counts)}",
        "",
        "## Breakdown by Category",
        "",
        "| Category | Question Count |",
        "| :--- | ---: |",
    ]
    for cat, count in category_counts.most_common():
        lines.append(f"| `{cat}` | {count} |")

    lines.extend(["", "## Top 25 Companies", "", "| Company | Question Count |", "| :--- | ---: |"])
    for company, count in company_counts.most_common(25):
        lines.append(f"| {company} | {count} |")

    (OUTPUT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    seen_ids: set[int] = set()
    questions: list[dict] = []

    with requests.Session() as session:
        page = 1
        while True:
            iq = fetch_page(session, page)
            results = iq.get("results") or []
            for raw in results:
                qid = raw.get("id")
                if qid is not None and qid not in seen_ids:
                    seen_ids.add(qid)
                    questions.append(normalize_question(raw))

            pagination = iq.get("pagination") or {}
            if page % 10 == 0 or not pagination.get("hasMore"):
                print(f"Fetched page {page}: collected {len(questions)} questions", flush=True)
            if not pagination.get("hasMore"):
                break
            page += 1
            time.sleep(0.25)

    write_dataset(
        questions,
        OUTPUT_DIR / "all_pm_questions.json",
        OUTPUT_DIR / "all_pm_questions.csv",
    )

    by_category: dict[str, list[dict]] = defaultdict(list)
    category_counts: Counter = Counter()
    company_counts: Counter = Counter()

    for q in questions:
        cats = q["categories"] or ["uncategorized"]
        for cat in cats:
            by_category[cat].append(q)
            category_counts[cat] += 1
        for comp in q["companies"]:
            company_counts[comp] += 1

    cat_dir = OUTPUT_DIR / "by-category"
    for cat, items in sorted(by_category.items()):
        safe_cat = cat.replace("/", "-")
        write_dataset(items, cat_dir / f"{safe_cat}.json", cat_dir / f"{safe_cat}.csv")

    write_summary(questions, category_counts, company_counts)
    print(f"Done! Exported {len(questions)} PM questions across {len(by_category)} categories to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
