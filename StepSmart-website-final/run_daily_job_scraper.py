#!/usr/bin/env python3
"""
Automated Daily Job Board Pipeline for Product Management Jobs in India
Aggregates from 13 portals: LinkedIn, Indeed, Naukri, Glassdoor, Google,
Instahyre, Peerlist, Y Combinator Work at a Startup, Wellfound, Cutshort, Hirist, iimjobs, Hirect.
Deduplicates, applies strict PM filters, and updates data/jobs.json & strict_pm_jobs_all_portals_india.csv.
"""

import os
import re
import json
import pandas as pd
from datetime import datetime
from jobspy import scrape_jobs

def run_daily_pipeline():
    print(f"==========================================================")
    print(f"  EXECUTING DAILY PM JOB BOARD PIPELINE: {datetime.now().strftime('%Y-%m-%d %H:%M IST')}")
    print(f"==========================================================")

    portals = [
        "indeed", "linkedin", "naukri", "glassdoor", "google",
        "peerlist", "workatastartup", "wellfound", "instahyre",
        "cutshort", "hirist", "iimjobs", "hirect"
    ]
    
    search_terms = ["Product Manager", "Senior Product Manager", "Associate Product Manager"]
    locations = ["India", "Bengaluru", "Gurugram", "Mumbai"]
    
    all_jobs = []
    
    for term in search_terms:
        for loc in locations:
            try:
                print(f"--> Scraping '{term}' in '{loc}'...")
                jobs = scrape_jobs(
                    site_name=portals,
                    search_term=term,
                    location=loc,
                    results_wanted=25,
                    country_indeed='India',
                    hours_old=168, # past 7 days for maximum freshness
                )
                if jobs is not None and not jobs.empty:
                    all_jobs.append(jobs)
            except Exception as e:
                print(f"    Error scraping {term} in {loc}: {e}")

    if not all_jobs:
        print("No new jobs scraped.")
        return

    combined_df = pd.concat(all_jobs, ignore_index=True)
    
    # Deduplicate by job_url or title+company
    if 'job_url' in combined_df.columns:
        combined_df.drop_duplicates(subset=['job_url'], inplace=True)
    elif 'title' in combined_df.columns and 'company' in combined_df.columns:
        combined_df.drop_duplicates(subset=['title', 'company'], inplace=True)

    # Apply strict Product Management role filter
    strict_pm_pattern = re.compile(
        r'\b(product\s+manager|product\s+lead|group\s+product\s+manager|senior\s+product\s+manager|principal\s+product\s+manager|director\s+of\s+product|head\s+of\s+product|vp\s+product|associate\s+product\s+manager|\bapm\b|technical\s+product\s+manager|staff\s+product\s+manager|growth\s+product\s+manager|product\s+owner|chief\s+product\s+officer|\bcpo\b)\b',
        re.IGNORECASE
    )

    def is_strict_pm(title):
        if not isinstance(title, str):
            return False
        title_clean = title.strip()
        if not strict_pm_pattern.search(title_clean):
            return False
        if re.search(r'\b(designer|engineer|developer|writer|sales|marketing)\b', title_clean, re.IGNORECASE):
            if not re.search(r'\bproduct\s+manager\b', title_clean, re.IGNORECASE):
                return False
        return True

    strict_df = combined_df[combined_df['title'].apply(is_strict_pm)].copy()

    def clean_loc(loc):
        if pd.isna(loc):
            return 'India'
        loc = str(loc).strip()
        loc = loc.replace(', Maharashtra, India', '').replace(', Karnataka, India', '').replace(', Haryana, India', '').replace(', Telangana, India', '').replace(', Tamil Nadu, India', '').replace(', Gujarat, India', '').replace(', Delhi, India', '')
        return loc

    strict_df['clean_location'] = strict_df['location'].apply(clean_loc)

    # Update CSV dataset
    csv_path = "strict_pm_jobs_all_portals_india.csv"
    strict_df.to_csv(csv_path, index=False)

    from job_card_resolver import standardize_schema
    from hard_filters import apply_hard_filters
    from gsheets_sync import export_to_json, export_to_csv

    # Prepare normalized objects for Web App UI
    raw_web_jobs = []
    for idx, row in strict_df.reset_index(drop=True).iterrows():
        job_id = f"job-{idx+1}"
        company = str(row.get('company') or 'Hiring Company').strip()
        title = str(row.get('title') or 'Product Manager').strip()
        loc = str(row.get('clean_location') or 'India').strip()
        site_name = str(row.get('site') or 'Job Board').upper()
        url = str(row.get('job_url') or '')
        date_str = str(row.get('date_posted') or datetime.now().strftime('%Y-%m-%d'))
        emails_list = row.get('emails') if isinstance(row.get('emails'), list) else []

        raw_desc = str(row.get('description') or '').strip()
        if raw_desc.lower() in ['nan', 'none', 'null', '']:
            raw_desc = f"{title} opening at {company} ({loc}). Source: {site_name}. Direct link: {url}"

        raw_web_jobs.append({
            "job_id": job_id,
            "id": job_id,
            "title": title,
            "role_title": title,
            "company": company,
            "company_name": company,
            "location": loc,
            "site": site_name,
            "post_url": url,
            "job_url": url,
            "apply_url": url,
            "date_posted": date_str,
            "posted_at": date_str,
            "has_email": len(emails_list) > 0,
            "email": emails_list[0] if len(emails_list) > 0 else None,
            "extracted_email": emails_list[0] if len(emails_list) > 0 else None,
            "emails": emails_list,
            "contact_method": "Email" if len(emails_list) > 0 else "DM",
            "quality_score": 90 if any(k in title for k in ["Senior", "Lead", "Director"]) else 85,
            "job_description": raw_desc,
            "text": raw_desc,
            "seniority": "Senior PM" if "Senior" in title or "Lead" in title else ("Associate / APM" if "Associate" in title or "APM" in title else "Product Manager"),
            "seniority_fit": "0-2y" if ("Associate" in title or "APM" in title or "Analyst" in title or "Intern" in title) else "Senior / All"
        })

    processed_web_jobs = []
    for item in raw_web_jobs:
        std = standardize_schema(item)
        keep, reason, enriched = apply_hard_filters(std, require_post_intent=False)
        if keep:
            processed_web_jobs.append(enriched)

    final_dataset = export_to_json(processed_web_jobs)
    export_to_csv(final_dataset)

    print(f"\n✅ Pipeline Success! {len(final_dataset)} verified PM jobs updated in data/jobs.json and data/pm_jobs_google_sheets.csv")

if __name__ == "__main__":
    run_daily_pipeline()
