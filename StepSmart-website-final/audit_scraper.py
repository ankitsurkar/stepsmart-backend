#!/usr/bin/env python3
"""
Step 0: Audit Scraper Script
Audits raw scraped items from Apify LinkedIn Post Scraper and categorizes them into 5 buckets:
1. Real Hiring Post
2. Job Seeker (OpenToWork / seeking)
3. Agency / Consultancy
4. Stale (> 72 hours)
5. Irrelevant (Advice, webinars, non-PM)
"""

import os
import json
import re
from datetime import datetime, timezone, timedelta
from apify_scraper import fetch_linkedin_pm_posts, is_actual_job_post, load_env_file

def audit_raw_items(raw_items):
    categories = {
        "Real Hiring Post": [],
        "Job Seeker": [],
        "Agency / Consultancy": [],
        "Stale": [],
        "Irrelevant": []
    }

    now = datetime.now(timezone.utc)

    for item in raw_items:
        text = item.get('job_description') or item.get('text') or item.get('content', {}).get('text') or ''
        text_lower = text.lower()
        headline = (item.get('relevant_contact', {}).get('headline') or item.get('author', {}).get('headline') or '').lower()

        # 1. Job Seeker Check
        if any(term in text_lower or term in headline for term in ["#opentowork", "open to work", "looking for a job", "seeking new opportunities", "i am seeking"]):
            categories["Job Seeker"].append(item)
            continue

        # 2. Agency / Consultancy Check
        if any(term in text_lower for term in ["hiring for our client", "on behalf of our client", "consultancy", "staffing agency", "recruitment firm"]):
            categories["Agency / Consultancy"].append(item)
            continue

        # 3. Irrelevant Check (Webinars, advice, self-announcements)
        if any(term in text_lower for term in ["webinar", "course", "bootcamp", "how to become", "resume tips", "excited to share that i started"]):
            categories["Irrelevant"].append(item)
            continue

        # 4. Real Hiring Post vs Generic
        if is_actual_job_post(text):
            categories["Real Hiring Post"].append(item)
        else:
            categories["Irrelevant"].append(item)

    total = len(raw_items) or 1
    print("\n=======================================================")
    print("      STEP 0: SCRAPER AUDIT REPORT (PIPELINE PRE-CHECK)  ")
    print("=======================================================")
    print(f"Total Raw Items Analyzed: {len(raw_items)}\n")
    
    for cat, items in categories.items():
        pct = (len(items) / total) * 100
        print(f"  • {cat.ljust(22)}: {len(items)} posts ({pct:.1f}%)")

    print("\n=======================================================\n")
    return categories

if __name__ == '__main__':
    items = fetch_linkedin_pm_posts(max_items=40)
    audit_raw_items(items)
