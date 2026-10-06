#!/usr/bin/env python3
"""
Step 3.1: Hirer Watchlist Module
Saves known hiring authors (founders, CPOs, Talent Acquisition leads, Product Managers)
and surfaces their recent LinkedIn hiring posts.
"""

import os
import json
import re

HIRER_WATCHLIST_PATH = os.path.join(os.path.dirname(__file__), 'data', 'hirer_watchlist.json')

DEFAULT_HIRER_SEED = [
    {"name": "Purushottam Ratre", "company": "MakeMyTrip", "role": "Hiring Lead @ MakeMyTrip", "url": "https://www.linkedin.com/in/purushottamratre"},
    {"name": "Malay Krishna", "company": "Kissht", "role": "Head of Product Recruiting", "url": "https://www.linkedin.com/search/results/people/?keywords=Malay%20Krishna%20Kissht"},
    {"name": "Mohammed Mubarak", "company": "Lokal App", "role": "Lead Product Manager", "url": "https://www.linkedin.com/search/results/people/?keywords=Mohammed%20Mubarak%20Lokal%20App"},
    {"name": "Bhanu Priya Singh", "company": "Tech Company", "role": "Talent Acquisition", "url": "https://www.linkedin.com/in/bhanu-priya-singh-11042a190"},
    {"name": "Priyanka Khippal", "company": "Big4 / ServiceNow", "role": "Recruitment Specialist", "url": "https://www.linkedin.com/in/priyanka-khippal-5563b647"},
    {"name": "Neha Jobsguru", "company": "JobsGuru", "role": "Talent Partner", "url": "https://www.linkedin.com/in/nehajobsguru"},
    {"name": "Tanya Goyal", "company": "Tech Company", "role": "Recruiter", "url": "https://www.linkedin.com/in/tanya-goyal-300066224"},
    {"name": "Vijay S Meena", "company": "Tech Startup", "role": "Product Recruiter", "url": "https://www.linkedin.com/in/vijaysmeena"},
    {"name": "Arohi Choudhary", "company": "Flipspaces", "role": "HR Lead", "url": "https://www.linkedin.com/in/arohichoudhary"},
    {"name": "Vedant Awasthi", "company": "Tech Company", "role": "Talent Lead", "url": "https://www.linkedin.com/in/vedant-awasthi"}
]

def load_hirer_watchlist():
    if os.path.exists(HIRER_WATCHLIST_PATH):
        try:
            with open(HIRER_WATCHLIST_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_HIRER_SEED

def save_hirer_watchlist(hirers):
    os.makedirs(os.path.dirname(HIRER_WATCHLIST_PATH), exist_ok=True)
    with open(HIRER_WATCHLIST_PATH, 'w', encoding='utf-8') as f:
        json.dump(hirers, f, indent=2, ensure_ascii=False)

def update_watchlist_from_posts(posts):
    watchlist = load_hirer_watchlist()
    existing_names = {h['name'].lower() for h in watchlist if h.get('name')}

    new_count = 0
    for p in posts:
        author = p.get('author_name') or p.get('relevant_contact', {}).get('name')
        headline = p.get('author_title') or p.get('relevant_contact', {}).get('headline') or ''
        company = p.get('company') or ''

        if author and author.lower() not in existing_names and author != "Hiring Manager":
            # Check if recruiter / founder / manager
            is_hirer = any(k in headline.lower() for k in ["recruit", "talent", "founder", "cpo", "head of product", "vp product", "lead pm", "manager", "hiring"])
            if is_hirer:
                watchlist.append({
                    "name": author,
                    "company": company,
                    "role": headline,
                    "url": p.get('relevant_contact', {}).get('profile_url') or f"https://www.linkedin.com/search/results/people/?keywords={author}"
                })
                existing_names.add(author.lower())
                new_count += 1

    if new_count > 0:
        save_hirer_watchlist(watchlist)
        print(f"[HIRER WATCHLIST] Added {new_count} new hiring authors to watchlist (Total: {len(watchlist)}).")

    return watchlist

if __name__ == '__main__':
    hl = load_hirer_watchlist()
    print(f"Loaded {len(hl)} seed hirers in watchlist.")
