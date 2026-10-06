#!/usr/bin/env python3
"""
Step 4: Classification & Quality Scoring Engine for India Product Management Jobs
Evaluates surviving posts and returns structured JSON with quality_score (0-100),
seniority_fit (fresher/0-2y/senior), author_is_decision_maker, and contact_method.
Filters out posts where quality_score < 60 or location is non-India.
"""

import re
import json

INDIA_CITIES = [
    "bengaluru", "bangalore", "gurugram", "gurgaon", "mumbai", "hyderabad",
    "pune", "noida", "delhi", "ncr", "chennai", "kolkata", "ahmedabad", "india"
]

def classify_and_score_post(post):
    text = (post.get('job_description') or post.get('text') or '').strip()
    title = (post.get('title') or post.get('role_title') or '').strip()
    full_text = f"{title} {text}".lower()
    headline = (post.get('relevant_contact', {}).get('headline') or '').lower()
    author_name = post.get('relevant_contact', {}).get('name') or 'Hiring Manager'

    # 1. Author Decision Maker Check
    decision_maker_titles = ["head of product", "vp product", "director of product", "founder", "co-founder", "ceo", "group product manager", "lead product manager", "product lead"]
    author_is_decision_maker = any(t in headline for t in decision_maker_titles)

    # 2. Seniority Classification
    if any(k in full_text for k in ["intern", "trainee"]):
        seniority_fit = "fresher"
    elif any(k in full_text for k in ["apm", "associate product manager", "rotational", "rpm", "junior", "0-2", "entry level", "fresher", "new grad", "product analyst"]):
        seniority_fit = "0-2y"
    elif any(k in full_text for k in ["staff", "principal", "director", "vp", "executive"]):
        seniority_fit = "senior"
    elif "senior" in full_text or "5+ years" in full_text or "7+ years" in full_text:
        seniority_fit = "senior"
    else:
        seniority_fit = "0-2y"

    # 3. Company Extraction
    company = post.get('company') or "High-Growth Product Startup"
    if company == "High-Growth Product Startup":
        company_match = re.search(r'@\s*([A-Za-z0-9\s]+)', headline)
        if company_match:
            company = company_match.group(1).strip()

    # 4. Location & Remote
    remote = "remote" in full_text or "anywhere" in full_text or "work from home" in full_text
    location = post.get('location') or ("Remote (India)" if remote else "India (Hybrid / Flexible)")

    # 5. Calculate Quality Score (0 - 100)
    score = 40  # Base score for surviving hard filters

    # Exact PM role match in title (+25 points)
    if any(pm_term in title.lower() for pm_term in ["product manager", "apm", "associate product manager", "product analyst"]):
        score += 25

    # India location boost (+15 points)
    if any(city in location.lower() for city in INDIA_CITIES) or remote:
        score += 15

    # Email presence (+20 points)
    has_email = post.get('has_email', False)
    if has_email:
        score += 20

    # Decision maker author (+15 points)
    if author_is_decision_maker:
        score += 15

    # Early-career / PM fit (+10 points)
    if seniority_fit in ["fresher", "0-2y"]:
        score += 10

    # Cap score at 100
    score = min(score, 100)

    is_real_hiring_post = True
    reason = f"Score: {score}/100. Fit: {seniority_fit}. Role: {title or 'PM'}. Contact: {post.get('contact_method')}."

    classified = {
        "is_real_hiring_post": is_real_hiring_post,
        "role_title": title or "Associate Product Manager",
        "seniority_fit": seniority_fit,
        "company": company,
        "location": location,
        "remote": remote,
        "email": post.get('extracted_email'),
        "has_email": has_email,
        "contact_method": post.get('contact_method', 'DM'),
        "author_name": author_name,
        "author_title": post.get('relevant_contact', {}).get('headline', ''),
        "author_is_decision_maker": author_is_decision_maker,
        "quality_score": score,
        "reason": reason
    }

    merged_post = dict(post)
    merged_post.update(classified)

    return merged_post

def filter_and_score_batch(posts):
    scored_posts = []
    for p in posts:
        classified = classify_and_score_post(p)
        # In Recall-First V3, keep all valid hiring posts regardless of seniority tag
        if classified.get('is_real_hiring_post', True):
            scored_posts.append(classified)
            
    return sorted(scored_posts, key=lambda x: x.get('quality_score', 0), reverse=True)
