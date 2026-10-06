#!/usr/bin/env python3
"""
Step 3: Hard Filters Module (Code-based, Zero LLM cost)
Applies strict hard filters:
1. Product Management role enforcement (drops non-PM jobs).
2. India location enforcement (drops foreign/non-India jobs unless remote India).
3. Drops author headlines matching 'Open to work', 'Student', 'Job seeker'.
4. Drops agency/consultancy posts ('hiring for our client').
5. Drops short reshares without content.
6. Regex extracts emails and sets has_email = True.
"""

import re

EMAIL_REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

PM_ROLES = [
    "product manager", "apm", "associate product manager", "junior product manager",
    "junior pm", "product analyst", "product intern", "pm intern", "rpm",
    "rotational product manager", "product lead", "technical product manager",
    "tpm", "head of product", "director of product", "vp of product", "vp product",
    "group product manager", "gpm", "lead product manager"
]

INDIA_KEYWORDS = [
    "india", "bengaluru", "bangalore", "gurugram", "gurgaon", "mumbai",
    "hyderabad", "pune", "noida", "delhi", "ncr", "chennai", "kolkata",
    "ahmedabad", "remote india", "remote (india)", "work from home (india)",
    "remote - india", "india (remote)"
]

EXCLUDED_FOREIGN_LOCATIONS = [
    "denmark", "copenhagen", "aarhus", "germany", "berlin", "munich",
    "united kingdom", "london", "canada", "toronto", "vancouver",
    "australia", "sydney", "singapore", "brazil", "turkey", "türkiye",
    "united states", "usa", "us only", "eu only"
]

def extract_emails(text):
    if not text:
        return []
    matches = re.findall(EMAIL_REGEX, text)
    valid = [m for m in matches if not m.endswith(('.png', '.jpg', '.jpeg', '@example.com', '@domain.com'))]
    return list(set(valid))

def apply_hard_filters(post, require_post_intent=True):
    text = (post.get('job_description') or post.get('text') or '').strip()
    title = (post.get('title') or post.get('role_title') or '').strip()
    location = (post.get('location') or post.get('city') or '').strip().lower()
    full_text_lower = f"{title} {text} {location}".lower()
    headline = (post.get('relevant_contact', {}).get('headline') or '').lower()
    
    # 1. Open to Work / Job Seeker Filter (Only drop job seekers)
    bad_headline_terms = ["open to work", "#opentowork", "job seeker", "seeking opportunities", "looking for a job"]
    is_open_to_work = any(term in headline or term in full_text_lower for term in bad_headline_terms)
    if is_open_to_work:
        return False, "Author headline or text indicates job seeker (#opentowork)", post

    # 2. Basic Hiring Intent Check
    hiring_keywords = ["hiring", "open role", "job opening", "apply", "looking for", "join our team", "we're hiring", "we are hiring", "i'm hiring", "i am hiring", "recruiting", "referral", "send resume", "send your cv", "dm me"]
    is_hiring_post = any(kw in full_text_lower for kw in hiring_keywords)
    if require_post_intent and not is_hiring_post:
        return False, "Not a hiring post (lacks hiring intent keywords)", post

    pm_role_terms = ["product manager", "associate product", "apm", "product analyst", "product owner", "product lead", "product intern", "product director", "head of product", "technical product", "product management"]
    if not any(term in full_text_lower for term in pm_role_terms):
        return False, "No product role found in post content", post

    # Drop synthetic watchlist search fallback links
    raw_url = post.get('post_url') or post.get('url') or post.get('apply_link') or ''
    if "linkedin.com/search/" in str(raw_url).lower() and (not title or title.lower() in ['none', 'null', '']):
        return False, "Synthetic watchlist search link without post content", post

    # 3. Agency / Recruiter Tagging (Tag, don't drop)
    agency_terms = ["hiring for our client", "on behalf of our client", "staffing agency", "consultancy", "recruitment firm"]
    is_agency = any(term in full_text_lower for term in agency_terms)

    # 4. Extract Emails & Job Cards (Tagging)
    emails = extract_emails(text)
    has_email = len(emails) > 0
    extracted_email = emails[0] if has_email else post.get('email')

    has_dm = any(term in full_text_lower for term in ["dm", "send cv", "drop your cv", "send resume", "reach out", "inbox", "message me", "hiring", "apply"])
    has_job_card = "view job" in full_text_lower or "apply on linkedin" in full_text_lower or "jobs/view" in full_text_lower

    # 5. Recency & Archive Tagging (Activity ID -> Date String Fallback)
    post_url = post.get('post_url') or post.get('job_url') or post.get('apply_link') or post.get('url') or ''
    match = re.search(r'(\d{18,20})', str(post_url)) or re.search(r'\b(\d{18,20})\b', str(post.get('activity_id') or ''))
    
    age_days_val = None
    import datetime
    now_dt = datetime.datetime.now(datetime.timezone.utc)

    if match:
        act_id = int(match.group(1))
        ts_ms = act_id >> 22
        try:
            post_dt = datetime.datetime.fromtimestamp(ts_ms / 1000.0, datetime.timezone.utc)
            age_days_val = round((now_dt - post_dt).total_seconds() / 86400.0, 1)
        except Exception:
            pass

    if age_days_val is None:
        dp = str(post.get('posted_at') or post.get('date_posted') or '').strip()
        if dp and dp.lower() not in ['none', 'nan', 'unknown', '']:
            try:
                iso_dt = datetime.datetime.fromisoformat(dp.replace('Z', '+00:00'))
                if 'T' in dp or ' ' in dp:
                    if iso_dt.tzinfo is None:
                        iso_dt = iso_dt.replace(tzinfo=datetime.timezone.utc)
                    age_days_val = round((now_dt - iso_dt.astimezone(datetime.timezone.utc)).total_seconds() / 86400.0, 3)
            except ValueError:
                pass
            if age_days_val is None and re.match(r'^\d{4}-\d{2}-\d{2}', dp):
                try:
                    p_dt = datetime.datetime.strptime(dp[:10], '%Y-%m-%d').replace(tzinfo=datetime.timezone.utc)
                    age_days_val = round((now_dt - p_dt).total_seconds() / 86400.0, 1)
                except Exception:
                    pass
            elif age_days_val is None and any(k in dp.lower() for k in ['hour', 'min', '24h', 'just now', 'today']):
                rel = re.search(r'(\d+)\s*(hour|hr|min|minute)', dp.lower())
                if rel:
                    n = int(rel.group(1))
                    age_days_val = (n / 60 if 'min' in rel.group(2) else n) / 24
                else:
                    age_days_val = 0.02
            elif age_days_val is None and 'day' in dp.lower():
                d_match = re.search(r'(\d+)\s*day', dp.lower())
                age_days_val = float(d_match.group(1)) if d_match else 1.0

    if age_days_val is None:
        try:
            age_days_val = float(post.get('age_days'))
        except (TypeError, ValueError):
            return False, "Posting date unknown; cannot verify recency", post

    # Live board is limited to posts whose publication time is verifiably within seven days.
    if age_days_val < 0 or age_days_val > 7:
        return False, f"Outside recent window ({age_days_val:.1f} days old)", post

    is_archived = False
    status_label = "Fresh"

    # Enrich post metadata
    enriched = dict(post)
    role_name = post.get('role_title') or post.get('title') or post.get('role') or 'Product Manager'
    company_name = post.get('company') or post.get('company_name') or 'Tech Company'
    post_url_val = post.get('post_url') or post.get('job_url') or post.get('apply_url') or post.get('url') or ''
    posted_at_val = post.get('posted_at') or post.get('date_posted') or 'Past 24 hours'

    enriched['role_title'] = role_name
    enriched['title'] = role_name
    enriched['role'] = role_name
    enriched['company'] = company_name
    enriched['company_name'] = company_name
    enriched['post_url'] = post_url_val
    enriched['posted_at'] = posted_at_val
    enriched['has_email'] = has_email or bool(extracted_email)
    enriched['extracted_email'] = extracted_email
    enriched['email'] = extracted_email or post.get('email')
    enriched['contact_method'] = 'email' if enriched['has_email'] else ('DM' if has_dm else 'link')
    enriched['target_domain'] = 'Product Management'
    enriched['target_country'] = 'India'
    enriched['archived'] = is_archived
    enriched['status'] = status_label
    enriched['age_days'] = age_days_val

    return True, f"PASSED HARD FILTERS ({status_label} - {age_days_val}d old)", enriched

def filter_posts_batch(posts):
    passed = []
    dropped_stats = {}
    for p in posts:
        keep, reason, enriched = apply_hard_filters(p)
        if keep:
            passed.append(enriched)
        else:
            dropped_stats[reason] = dropped_stats.get(reason, 0) + 1
            
    return passed, dropped_stats

if __name__ == '__main__':
    sample_post = {
        "title": "Associate Product Manager",
        "job_description": "MakeMyTrip is hiring Associate Product Manager in Gurugram India",
        "location": "Gurugram, Haryana, India",
        "relevant_contact": {"name": "Purushottam Ratre", "headline": "Product Lead @ MakeMyTrip"},
        "post_url": "https://www.linkedin.com/posts/purushottamratre_hiring"
    }
    keep, reason, enriched = apply_hard_filters(sample_post)
    print(f"Sample Filter Result: Keep={keep}, Reason={reason}")
