#!/usr/bin/env python3
"""
Step 1: Gold Set Benchmark Script
Calculates Recall = (Gold set posts found in scraped dataset) / (Total valid Gold set posts)
Target Recall: >= 70%
"""

import os
import json
import re

def compute_gold_set_recall(gold_path='data/gold_set.json', jobs_path='data/jobs.json'):
    if not os.path.exists(gold_path):
        print(f"Error: Gold set file '{gold_path}' not found.")
        return 0.0

    with open(gold_path, 'r', encoding='utf-8') as f:
        gold_items = json.load(f)

    scraped_jobs = []
    if os.path.exists(jobs_path):
        with open(jobs_path, 'r', encoding='utf-8') as f:
            scraped_jobs = json.load(f)

    # Extract all activity IDs and URLs from scraped jobs
    scraped_ids = set()
    scraped_urls = set()

    for job in scraped_jobs:
        url = job.get('post_url') or job.get('apply_link') or ''
        scraped_urls.add(url.lower())
        match = re.search(r'(\d{18,20})', url)
        if match:
            scraped_ids.add(match.group(1))

    valid_gold = [g for g in gold_items if g.get('activity_id')]
    total_valid = len(valid_gold)

    found_count = 0
    found_details = []
    missed_details = []

    for item in valid_gold:
        act_id = item.get('activity_id')
        url = item.get('final_url', '').lower()
        
        is_found = False
        if act_id and act_id in scraped_ids:
            is_found = True
        elif any(url in su or su in url for su in scraped_urls if su):
            is_found = True

        if is_found:
            found_count += 1
            found_details.append(item)
        else:
            missed_details.append(item)

    recall = (found_count / total_valid * 100.0) if total_valid > 0 else 0.0

    print("=======================================================")
    print("      STEP 1: GOLD SET RECALL BENCHMARK REPORT         ")
    print("=======================================================")
    print(f"Total Gold Set Items Provided : {len(gold_items)}")
    print(f"Valid Resolved Posts         : {total_valid}")
    print(f"Gold Posts Found in Scraper  : {found_count}")
    print(f"Gold Posts Missed            : {len(missed_details)}")
    print(f"CURRENT RECALL SCORE         : {recall:.1f}% (Target: >= 70.0%)")
    print("=======================================================\n")

    if missed_details:
        print("Sample Missed Gold Set Posts:")
        for m in missed_details[:5]:
            print(f"  • ID: {m.get('activity_id')} | URL: {m.get('final_url')[:80]}...")

    return recall

if __name__ == '__main__':
    compute_gold_set_recall()
