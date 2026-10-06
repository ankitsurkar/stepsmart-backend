#!/usr/bin/env python3
"""
6-Hour Automated Refresh Engine for PM LinkedIn Job Posts.
Orchestrates scraping from Apify, updating local database, and syncing to Google Sheets every 6 hours.
"""

import sys
import os
import time
import json
from datetime import datetime, timezone
from apify_scraper import fetch_linkedin_pm_posts
from gsheets_sync import export_to_json, export_to_csv, sync_to_google_sheets_api

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SYNC_LOG_PATH = os.path.join(DATA_DIR, 'sync_log.json')
REFRESH_INTERVAL_SECONDS = 6 * 3600  # Every 6 hours

def log_sync_event(status, total_jobs, message):
    os.makedirs(DATA_DIR, exist_ok=True)
    logs = []
    if os.path.exists(SYNC_LOG_PATH):
        try:
            with open(SYNC_LOG_PATH, 'r') as f:
                logs = json.load(f)
        except Exception:
            logs = []

    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": status,
        "total_jobs": total_jobs,
        "message": message,
        "next_scheduled_run": datetime.fromtimestamp(time.time() + REFRESH_INTERVAL_SECONDS, timezone.utc).isoformat()
    }
    logs.insert(0, event)
    # Keep last 50 log events
    logs = logs[:50]
    
    with open(SYNC_LOG_PATH, 'w') as f:
        json.dump(logs, f, indent=2)

def run_sync_cycle():
    print(f"\n=======================================================")
    print(f"  RUNNING LINKEDIN PM JOBS SYNC CYCLE: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"=======================================================")
    try:
        jobs = fetch_linkedin_pm_posts()
        updated_jobs = export_to_json(jobs)
        csv_path = export_to_csv(updated_jobs)
        sync_to_google_sheets_api(updated_jobs)
        
        log_sync_event("SUCCESS", len(updated_jobs), "Scraped PM posts and updated Google Sheets CSV & JSON database.")
        print(f"[SCHEDULER SUCCESS] Cycle complete. Next auto-refresh in 6 hours.")
        return len(updated_jobs)
    except Exception as e:
        print(f"[SCHEDULER ERROR] Sync cycle failed: {e}")
        log_sync_event("ERROR", 0, str(e))
        return 0

def start_scheduler(once=False):
    print(f"[SCHEDULER ENGINE] Started PM Job Post Refresher. Interval: 6 hours.")
    run_sync_cycle()
    
    if once:
        print("[SCHEDULER ENGINE] Run once flag set. Exiting.")
        return
        
    while True:
        print(f"[SCHEDULER ENGINE] Waiting 6 hours until next refresh... (Ctrl+C to stop)")
        try:
            time.sleep(REFRESH_INTERVAL_SECONDS)
            run_sync_cycle()
        except KeyboardInterrupt:
            print("\n[SCHEDULER ENGINE] Stopped by user.")
            break

if __name__ == '__main__':
    run_once = '--once' in sys.argv
    start_scheduler(once=run_once)
