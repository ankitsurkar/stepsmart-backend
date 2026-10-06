#!/usr/bin/env python3
"""Discover public LinkedIn post URLs via Brave Search, without scraping LinkedIn.

Search snippets are stored as discovery evidence only. Candidates stay in a
review queue until a person checks the LinkedIn post and confirms its content/date.
"""
import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CANDIDATES_PATH = ROOT / "data" / "linkedin_candidates.json"
QUERIES = [
    'site:linkedin.com/posts "product manager" (hiring OR "we are hiring" OR "open role") India',
    'site:linkedin.com/posts "associate product manager" (hiring OR referral OR "apply") India',
    'site:linkedin.com/posts ("product analyst" OR "product intern") (hiring OR "open role") India',
    'site:linkedin.com/posts ("product manager" OR APM) (Bengaluru OR Bangalore OR Mumbai OR Gurugram OR remote) hiring',
]


def discover_candidates(api_key=None):
    key = api_key or os.getenv("BRAVE_SEARCH_API_KEY")
    if not key:
        raise RuntimeError("Set BRAVE_SEARCH_API_KEY in the local .env file to enable Brave Search discovery.")

    try:
        candidates = json.loads(CANDIDATES_PATH.read_text(encoding="utf-8"))
        if not isinstance(candidates, list):
            candidates = []
    except (OSError, ValueError):
        candidates = []

    by_url = {str(c.get("post_url", "")).split("?", 1)[0].rstrip("/"): c for c in candidates if c.get("post_url")}
    discovered_at = datetime.now(timezone.utc).isoformat()
    added = 0

    for query in QUERIES:
        params = urllib.parse.urlencode({"q": query, "count": 20, "freshness": "pw", "search_lang": "en", "country": "IN"})
        request = urllib.request.Request(
            f"https://api.search.brave.com/res/v1/web/search?{params}",
            headers={"Accept": "application/json", "X-Subscription-Token": key, "User-Agent": "JobTracker/1.0"},
        )
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            # Preserve existing queue and report a useful, credential-safe error.
            raise RuntimeError(f"Brave Search request failed ({type(exc).__name__}). Check the API key, plan, and network.") from exc

        for item in payload.get("web", {}).get("results", []):
            url = str(item.get("url") or "")
            parsed = urllib.parse.urlparse(url)
            if parsed.hostname not in {"linkedin.com", "www.linkedin.com"} or "/posts/" not in parsed.path:
                continue
            canonical = f"https://www.linkedin.com{parsed.path.rstrip('/')}"
            if canonical in by_url:
                by_url[canonical]["last_seen_at"] = discovered_at
                continue
            title = str(item.get("title") or "LinkedIn post")[:300]
            snippet = str(item.get("description") or item.get("snippet") or "")[:1200]
            candidate = {
                "job_id": "brave_" + str(abs(hash(canonical))),
                "post_url": canonical,
                "title": title,
                "search_snippet": snippet,
                "job_description": "Description not available check the original post for reference.",
                "source": "brave_search_discovery",
                "discovered_at": discovered_at,
                "last_seen_at": discovered_at,
                "review_status": "pending",
                "posted_at": None,
                "original_post_body_available": False,
            }
            by_url[canonical] = candidate
            added += 1

    merged = sorted(by_url.values(), key=lambda c: c.get("discovered_at", ""), reverse=True)
    CANDIDATES_PATH.parent.mkdir(parents=True, exist_ok=True)
    CANDIDATES_PATH.write_text(json.dumps(merged[:500], indent=2, ensure_ascii=False), encoding="utf-8")
    return added, len(merged)


if __name__ == "__main__":
    fresh, total = discover_candidates()
    print(f"Brave Search discovery complete: {fresh} new candidate(s), {total} in review queue.")
