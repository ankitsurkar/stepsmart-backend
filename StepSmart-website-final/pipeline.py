#!/usr/bin/env python3
"""
LinkedIn Hidden-Jobs Engine Pipeline (V3: Recall-First Architecture)
Orchestrates:
1. Wide Collection Layer (Apify Google SERP + Plain Short Queries)
2. Job Card Resolver & Schema Standardizer (Step 3.4 & 4)
3. Hirer Watchlist & Company Watchlist Updates (Step 3.1 & 3.2)
4. Tag-Don't-Drop Hard Filters (Step 5)
5. Quality Scoring & Tag Classification (Step 5 & 6)
6. Deduplication Engine (Step 4)
7. Storage & Google Sheets Sync (Step 7)
8. Gold Set Benchmark Recall Evaluation (Step 1)
"""

import os
import json
import time
from datetime import datetime, timezone
from apify_scraper import fetch_linkedin_pm_posts, load_env_file, get_last_scrape_errors, get_last_scrape_status
from job_card_resolver import standardize_schema
from hirer_watchlist import update_watchlist_from_posts
from hard_filters import filter_posts_batch
from classifier import filter_and_score_batch
from dedupe import deduplicate_posts
from gsheets_sync import export_to_json, export_to_csv, sync_to_google_sheets_api, LINKEDIN_POSTS_JSON_PATH
from benchmark_recall import compute_gold_set_recall

def run_hidden_jobs_pipeline():
    load_env_file()
    print("==========================================================")
    print(f"  EXECUTING LINKEDIN HIDDEN-JOBS PIPELINE (V3 RECALL-FIRST): {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print("==========================================================")

    # 1. Fetch Raw LinkedIn Posts
    raw_posts = fetch_linkedin_pm_posts(max_items=100)
    print(f"[PIPELINE STEP 1-2] Scraped {len(raw_posts)} raw LinkedIn post candidates.")
    if get_last_scrape_status() == "skipped_budget_guard":
        try:
            with open(LINKEDIN_POSTS_JSON_PATH, 'r', encoding='utf-8') as existing:
                cached = json.load(existing)
        except (OSError, ValueError):
            cached = []
        print("[PIPELINE] Budget guard skipped Apify; returning saved feed without writing or syncing.")
        return cached
    if not raw_posts and get_last_scrape_errors():
        raise RuntimeError("LinkedIn scrape failed before returning results; existing feed was left unchanged.")

    # 2. Standardize Schema & Resolve Job Cards
    standardized_posts = [standardize_schema(p) for p in raw_posts]
    print(f"[PIPELINE STEP 3] Standardized schema for {len(standardized_posts)} posts.")

    # 3. Update Hirer Watchlist
    update_watchlist_from_posts(standardized_posts)

    # 4. Tag-Don't-Drop Hard Filters
    filtered_posts, drop_stats = filter_posts_batch(standardized_posts)
    print(f"[PIPELINE STEP 4] Hard Filters Passed: {len(filtered_posts)} / {len(standardized_posts)}. Drops: {drop_stats}")

    # 5. Quality Scoring & Multi-Dimensional Tagging
    scored_posts = filter_and_score_batch(filtered_posts)
    print(f"[PIPELINE STEP 5] Multi-Dimensional Tagged & Scored: {len(scored_posts)} posts.")

    # 6. Deduplication Engine
    deduped_posts = deduplicate_posts(scored_posts)
    print(f"[PIPELINE STEP 6] Deduplication Complete. Final Survived Posts: {len(deduped_posts)}.")

    # 7. Storage & Google Sheets Sync
    final_dataset = export_to_json(deduped_posts, filepath=LINKEDIN_POSTS_JSON_PATH)
    csv_path = export_to_csv(final_dataset)
    sync_to_google_sheets_api(final_dataset)

    # 8. Compute Gold Set Recall Benchmark
    print("\n[PIPELINE STEP 8] Computing Gold Set Recall Benchmark...")
    recall_score = compute_gold_set_recall()

    # Metrics Summary
    with_email_count = sum(1 for p in final_dataset if p.get('has_email') or p.get('email'))
    job_card_count = sum(1 for p in final_dataset if p.get('has_job_card'))
    recruiter_count = sum(1 for p in final_dataset if p.get('author_type') in ['recruiter', 'founder'])

    print("\n==========================================================")
    print("             PIPELINE EXECUTION METRICS SUMMARY           ")
    print("==========================================================")
    print(f"  • Total Surfaced Hidden PM Jobs : {len(final_dataset)}")
    print(f"  • Direct Recruiter Emails      : {with_email_count} ({(with_email_count/max(len(final_dataset),1))*100:.1f}%)")
    print(f"  • Posts with Job Cards         : {job_card_count} ({(job_card_count/max(len(final_dataset),1))*100:.1f}%)")
    print(f"  • Founder & Recruiter Posts    : {recruiter_count} ({(recruiter_count/max(len(final_dataset),1))*100:.1f}%)")
    print(f"  • GOLD SET RECALL SCORE        : {recall_score:.1f}%")
    print("==========================================================\n")

    return final_dataset

if __name__ == '__main__':
    run_hidden_jobs_pipeline()
