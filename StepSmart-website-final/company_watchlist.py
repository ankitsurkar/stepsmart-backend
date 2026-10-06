#!/usr/bin/env python3
"""
Step 3.2: Company Watchlist Module
Tracks high-growth India tech startups & PM hiring companies.
"""

import os
import json

COMPANY_WATCHLIST_PATH = os.path.join(os.path.dirname(__file__), 'data', 'company_watchlist.json')

DEFAULT_COMPANY_SEED = [
    {"name": "MakeMyTrip", "domain": "Travel / Consumer Tech", "location": "Gurugram"},
    {"name": "Swiggy", "domain": "Quick Commerce / Food", "location": "Bengaluru"},
    {"name": "Meesho", "domain": "Social Commerce", "location": "Bengaluru"},
    {"name": "Groww", "domain": "Fintech / Wealth", "location": "Bengaluru"},
    {"name": "Pine Labs", "domain": "Fintech Merchant Payments", "location": "Noida / Gurugram"},
    {"name": "Battery Smart", "domain": "EV Battery Swapping", "location": "Gurugram"},
    {"name": "Dashtoon", "domain": "AI / GenAI Comics", "location": "Bengaluru"},
    {"name": "Navi", "domain": "Fintech Lending & Insurance", "location": "Bengaluru"},
    {"name": "CARS24", "domain": "Auto Tech", "location": "Gurugram"},
    {"name": "Ola", "domain": "Mobility & EV", "location": "Bengaluru"},
    {"name": "StanceBeam", "domain": "Sports Tech / IoT", "location": "Bengaluru"},
    {"name": "Finvasia", "domain": "Fintech / Financial Services", "location": "Chandigarh / Remote"},
    {"name": "Kissht", "domain": "Fintech Credit Risk", "location": "Mumbai"},
    {"name": "Lokal App", "domain": "Vernacular Social & Commerce", "location": "Bengaluru / Remote"},
    {"name": "Razorpay", "domain": "Fintech Payments", "location": "Bengaluru"},
    {"name": "CRED", "domain": "Fintech Rewards", "location": "Bengaluru"},
    {"name": "Blinkit", "domain": "Quick Commerce", "location": "Gurugram"},
    {"name": "Zepto", "domain": "Quick Commerce", "location": "Mumbai / Bengaluru"},
    {"name": "Zomato", "domain": "Food Delivery", "location": "Gurugram"},
    {"name": "Urban Company", "domain": "Home Services", "location": "Gurugram"}
]

def load_company_watchlist():
    if os.path.exists(COMPANY_WATCHLIST_PATH):
        try:
            with open(COMPANY_WATCHLIST_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_COMPANY_SEED

def save_company_watchlist(companies):
    os.makedirs(os.path.dirname(COMPANY_WATCHLIST_PATH), exist_ok=True)
    with open(COMPANY_WATCHLIST_PATH, 'w', encoding='utf-8') as f:
        json.dump(companies, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    cl = load_company_watchlist()
    print(f"Loaded {len(cl)} companies in company watchlist.")
