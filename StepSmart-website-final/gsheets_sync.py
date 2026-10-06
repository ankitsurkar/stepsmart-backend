#!/usr/bin/env python3
"""
Step 7 Storage & Google Sheets Sync Module
Schema: post_url, posted_at, scraped_at, company, role, location, email, contact_method, author, author_title, quality_score, status, query_id, seniority_fit, has_email
"""

import os
import csv
import json
import re
from datetime import datetime, timezone

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
JOBS_JSON_PATH = os.path.join(DATA_DIR, 'jobs.json')
LINKEDIN_POSTS_JSON_PATH = os.path.join(DATA_DIR, 'linkedin_posts.json')
JOBS_CSV_PATH = os.path.join(DATA_DIR, 'pm_jobs_google_sheets.csv')

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)

def export_to_json(jobs, filepath=JOBS_JSON_PATH):
    ensure_data_dir()
    existing_jobs = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                existing_jobs = json.load(f)
        except Exception:
            existing_jobs = []

    from hard_filters import apply_hard_filters
    require_post_intent = os.path.abspath(filepath) == os.path.abspath(LINKEDIN_POSTS_JSON_PATH)

    jobs_dict = {}
    for j in existing_jobs:
        keep, _, enriched = apply_hard_filters(j, require_post_intent=require_post_intent)
        if keep:
            jid = canonical_job_key(j)
            jobs_dict[jid] = enriched

    for j in jobs:
        keep, _, enriched = apply_hard_filters(j, require_post_intent=require_post_intent)
        if keep:
            jid = canonical_job_key(j)
            jobs_dict[jid] = enriched

    updated_list = sorted(jobs_dict.values(), key=lambda x: (x.get('age_days', 999), -x.get('quality_score', 0)))
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(updated_list, f, indent=2, ensure_ascii=False)
    
    print(f"[GSHEETS SYNC] Updated local database at '{filepath}' with {len(updated_list)} total jobs.")
    return updated_list

def canonical_job_key(job):
    """Prefer LinkedIn activity ID or canonical post URL for stable cross-run upserts."""
    activity_id = str(job.get('activity_id') or '').strip()
    if activity_id.isdigit():
        return f"linkedin_activity_{activity_id}"
    url = str(job.get('post_url') or job.get('job_url') or job.get('url') or '').strip()
    activity = re.search(r'(?:activity[:/-]|-activity-)(\d{8,})', url, re.I)
    if activity:
        return f"linkedin_activity_{activity.group(1)}"
    if url and 'linkedin.com/search/' not in url:
        return url.split('?', 1)[0].rstrip('/')
    return str(job.get('job_id') or url or f"job_{hash(str(job))}")

def export_to_csv(jobs, filepath=JOBS_CSV_PATH):
    ensure_data_dir()
    fieldnames = [
        'post_url',
        'posted_at',
        'scraped_at',
        'company',
        'role',
        'location',
        'email',
        'contact_method',
        'author',
        'author_title',
        'quality_score',
        'status',
        'query_id',
        'seniority_fit',
        'has_email',
        'job_description'
    ]

    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for j in jobs:
            c = j.get('relevant_contact', {})
            writer.writerow({
                'post_url': j.get('post_url', ''),
                'posted_at': j.get('posted_at', ''),
                'scraped_at': j.get('scraped_at', ''),
                'company': j.get('company', 'Tech Startup'),
                'role': j.get('role_title') or j.get('seniority', 'Associate Product Manager'),
                'location': j.get('location', 'Remote'),
                'email': j.get('email') or j.get('extracted_email') or '',
                'contact_method': j.get('contact_method', 'DM'),
                'author': j.get('author_name') or c.get('name', ''),
                'author_title': j.get('author_title') or c.get('headline', ''),
                'quality_score': j.get('quality_score', 80),
                'status': j.get('status', 'Fresh'),
                'query_id': j.get('query_id', 'q_apm_01'),
                'seniority_fit': j.get('seniority_fit', '0-2y'),
                'has_email': j.get('has_email', False),
                'job_description': j.get('job_description', '')
            })

    print(f"[GSHEETS SYNC] Exported {len(jobs)} rows to Google Sheets CSV format: '{filepath}'")
    return filepath

def sync_to_google_sheets_api(jobs, sheet_id=None, service_account_path='service_account.json'):
    sheet_id = sheet_id or os.getenv('GOOGLE_SHEET_ID')
    if not sheet_id or sheet_id == 'your_google_sheet_id_here':
        return export_to_csv(jobs)

    try:
        import gspread
        if not os.path.exists(service_account_path):
            return export_to_csv(jobs)
            
        gc = gspread.service_account(filename=service_account_path)
        sh = gc.open_by_key(sheet_id)
        worksheet = sh.sheet1
        
        header = ['post_url', 'posted_at', 'scraped_at', 'company', 'role', 'location', 'email', 'contact_method', 'author', 'author_title', 'quality_score', 'status', 'seniority_fit', 'has_email']
        rows = [header]
        for j in jobs:
            c = j.get('relevant_contact', {})
            rows.append([
                j.get('post_url'),
                j.get('posted_at'),
                j.get('scraped_at'),
                j.get('company'),
                j.get('role_title') or j.get('seniority'),
                j.get('location'),
                j.get('email') or j.get('extracted_email'),
                j.get('contact_method'),
                j.get('author_name') or c.get('name'),
                j.get('author_title') or c.get('headline'),
                j.get('quality_score'),
                j.get('status', 'Fresh'),
                j.get('seniority_fit'),
                j.get('has_email')
            ])
            
        worksheet.clear()
        worksheet.update('A1', rows)
        print(f"[GSHEETS SYNC SUCCESS] Directly synced {len(jobs)} jobs to Google Sheet ID: {sheet_id}")
        return True
    except Exception as e:
        return export_to_csv(jobs)

if __name__ == '__main__':
    from apify_scraper import fetch_linkedin_pm_posts
    jobs = fetch_linkedin_pm_posts()
    updated = export_to_json(jobs, filepath=LINKEDIN_POSTS_JSON_PATH)
    export_to_csv(updated)
