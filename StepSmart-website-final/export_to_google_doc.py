#!/usr/bin/env python3
"""
Automated Daily Google Doc Exporter & Sync Engine for StepSmart PM Jobs
Extracts fresh jobs posted in the last 24-48 hours from data/jobs.json,
formats an executive daily digest, and syncs directly to a Google Doc via
Google Apps Script Webhook or generates a clean formatted document ready to paste/import.
"""

import os
import json
import requests
from datetime import datetime, timezone, timedelta

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
JOBS_JSON_PATH = os.path.join(DATA_DIR, 'jobs.json')
OUTPUT_MD_PATH = os.path.join(DATA_DIR, 'daily_pm_jobs_google_doc.md')
OUTPUT_HTML_PATH = os.path.join(DATA_DIR, 'daily_pm_jobs_google_doc.html')

def get_fresh_daily_jobs(jobs, max_age_days=2.0, target_count=50):
    """
    Extracts jobs posted today or within the last 24-48 hours.
    Falls back gracefully to the freshest jobs if same-day portal count is small.
    """
    now = datetime.now(timezone.utc)
    today_str = now.strftime('%Y-%m-%d')
    yesterday_str = (now - timedelta(days=1)).strftime('%Y-%m-%d')

    # Parse and sort jobs by recency
    scored_jobs = []
    seen = set()

    for j in jobs:
        title = (j.get('title') or j.get('role_title') or '').strip()
        company = (j.get('company') or j.get('company_name') or '').strip()
        url = (j.get('apply_url') or j.get('job_url') or j.get('post_url') or '').strip()
        
        # Deduplication key
        dedupe_key = f"{title.lower()}::{company.lower()}"
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        posted_date = j.get('posted_at') or j.get('date_posted') or ''
        age = j.get('age_days')
        if age is None:
            try:
                dt = datetime.strptime(str(posted_date)[:10], '%Y-%m-%d').replace(tzinfo=timezone.utc)
                age = (now - dt).total_seconds() / 86400.0
            except Exception:
                age = 999.0

        is_today_or_yesterday = posted_date in (today_str, yesterday_str)
        scored_jobs.append({
            'job': j,
            'title': title,
            'company': company,
            'location': j.get('location') or 'India',
            'source': j.get('source') or j.get('site') or 'Job Board',
            'posted_at': posted_date or today_str,
            'apply_url': url,
            'email': j.get('email') or j.get('extracted_email') or '',
            'seniority': j.get('seniority') or 'Product Manager',
            'age_days': age,
            'is_recent': is_today_or_yesterday or (age <= max_age_days)
        })

    # Sort: Most recent first (by age_days ascending)
    scored_jobs.sort(key=lambda x: (x['age_days'], x['company']))

    # Filter for freshest jobs
    fresh_batch = [item for item in scored_jobs if item['is_recent']]

    # If few jobs were indexed today (e.g. running early morning), pick top target_count freshest
    if len(fresh_batch) < 15:
        fresh_batch = scored_jobs[:target_count]

    return fresh_batch

def generate_markdown_digest(daily_items):
    """Formats jobs into clean LinkedIn-ready lines suitable for Google Docs."""
    today_readable = datetime.now().strftime('%B %d, %Y')
    total_count = len(daily_items)

    lines = [
        f"# StepSmart Daily PM Job Board Digest — {today_readable}",
        f"**Total Fresh Openings:** {total_count} Verified Roles",
        f"",
        f"---",
        f"",
        f"## 📲 LinkedIn-Ready Format (Direct Copy-Paste)",
        f""
    ]

    for item in daily_items:
        comp = item['company'].strip()
        title = item['title'].strip()
        url = item['apply_url'].strip()
        lines.append(f"{comp} - {title} - {url}")

    return "\n".join(lines)

def generate_html_digest(daily_items):
    """Formats jobs into clean HTML that can be imported directly into Google Docs."""
    today_readable = datetime.now().strftime('%B %d, %Y')
    total_count = len(daily_items)

    html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>StepSmart Daily PM Job Board — {today_readable}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 20px auto; padding: 0 16px; }}
    h1 {{ color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }}
    .meta {{ font-size: 14px; color: #64748b; margin-bottom: 20px; }}
    .job-item {{ margin: 6px 0; font-size: 13px; }}
    a {{ color: #0284c7; text-decoration: none; }}
  </style>
</head>
<body>
  <h1>StepSmart Daily Product Management Job Board</h1>
  <div class="meta">
    <strong>Date:</strong> {today_readable} &bull; 
    <strong>Total Openings:</strong> {total_count} Verified Roles
  </div>
  <h2>LinkedIn-Ready Jobs</h2>
"""
    for item in daily_items:
        comp = item['company'].strip()
        title = item['title'].strip()
        url = item['apply_url'].strip()
        html += f'  <p class="job-item"><strong>{comp}</strong> - {title} - <a href="{url}" target="_blank">{url}</a></p>\n'

    html += """</body>
</html>"""
    return html

def sync_to_google_doc_webhook(webhook_url, date_str, daily_items, markdown_content, html_content):
    """Sends payload to Google Apps Script Webhook attached to user's Google Doc."""
    if not webhook_url:
        print("[GOOGLE DOC SYNC] No GOOGLE_DOC_WEBHOOK_URL set. Skipping cloud webhook push.")
        return False

    payload = {
        "date": date_str,
        "total_jobs": len(daily_items),
        "markdown": markdown_content,
        "html": html_content,
        "jobs": [
            {
                "title": itm['title'],
                "company": itm['company'],
                "location": itm['location'],
                "source": itm['source'],
                "posted_at": itm['posted_at'],
                "apply_url": itm['apply_url'],
                "email": itm['email'],
                "seniority": itm['seniority']
            }
            for itm in daily_items
        ]
    }

    try:
        print(f"[GOOGLE DOC SYNC] Pushing {len(daily_items)} jobs to Google Doc webhook...")
        resp = requests.post(webhook_url, json=payload, timeout=20)
        if resp.status_code in [200, 201]:
            print(f"✅ [GOOGLE DOC SYNC SUCCESS] Successfully added {len(daily_items)} jobs to your Google Doc!")
            return True
        else:
            print(f"[GOOGLE DOC SYNC WARNING] Webhook returned status {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"[GOOGLE DOC SYNC ERROR] Failed to connect to Google Doc webhook: {e}")
        return False

def run_export():
    if not os.path.exists(JOBS_JSON_PATH):
        print(f"[GOOGLE DOC SYNC] Error: '{JOBS_JSON_PATH}' not found.")
        return

    with open(JOBS_JSON_PATH, 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    daily_items = get_fresh_daily_jobs(jobs)
    today_str = datetime.now().strftime('%Y-%m-%d')
    print(f"[GOOGLE DOC SYNC] Extracted {len(daily_items)} fresh daily PM jobs.")

    # 1. Write Markdown file
    md_content = generate_markdown_digest(daily_items)
    with open(OUTPUT_MD_PATH, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"[GOOGLE DOC SYNC] Saved clean Markdown digest to '{OUTPUT_MD_PATH}'")

    # 2. Write HTML file
    html_content = generate_html_digest(daily_items)
    with open(OUTPUT_HTML_PATH, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"[GOOGLE DOC SYNC] Saved HTML document to '{OUTPUT_HTML_PATH}'")

    # 3. Push to Google Doc webhook if configured in environment / GitHub secrets
    webhook_url = os.getenv('GOOGLE_DOC_WEBHOOK_URL') or os.getenv('GOOGLE_DOCS_WEBHOOK_URL')
    if webhook_url:
        sync_to_google_doc_webhook(webhook_url, today_str, daily_items, md_content, html_content)
    else:
        print("[GOOGLE DOC SYNC NOTE] Set GOOGLE_DOC_WEBHOOK_URL to automatically append each daily run to your Google Doc.")

if __name__ == '__main__':
    run_export()
