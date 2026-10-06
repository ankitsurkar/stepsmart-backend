#!/usr/bin/env python3
"""
Step 5: Deduplication Engine
Deduplicates posts using 3 keys:
- Key 1: post_url / job_id
- Key 2: hash(email + role)
- Key 3: Fuzzy text similarity (>= 85%) to catch the same post across queries.
"""

import hashlib
from difflib import SequenceMatcher

def fuzzy_similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

def deduplicate_posts(posts):
    unique_posts = []
    seen_urls = set()
    seen_email_role_hashes = set()

    for post in posts:
        # Key 1: URL / Job ID
        url_key = post.get('post_url') or post.get('job_id')
        if url_key in seen_urls:
            continue

        # Key 2: Hash(email + role)
        email = post.get('email') or ''
        role = post.get('role_title') or ''
        if email:
            email_role_str = f"{email.lower().strip()}_{role.lower().strip()}"
            email_hash = hashlib.md5(email_role_str.encode('utf-8')).hexdigest()
            if email_hash in seen_email_role_hashes:
                continue
            seen_email_role_hashes.add(email_hash)

        # Key 3: Fuzzy text similarity comparison against unique_posts
        post_text = (post.get('job_description') or '').strip()
        is_fuzzy_duplicate = False
        import re
        act_match_current = re.search(r'(\d{18,20})', str(url_key))
        
        for existing in unique_posts:
            existing_url = existing.get('post_url') or existing.get('job_id') or ''
            act_match_existing = re.search(r'(\d{18,20})', str(existing_url))
            
            # If both posts have distinct activity IDs, they are distinct LinkedIn posts
            if act_match_current and act_match_existing and act_match_current.group(1) != act_match_existing.group(1):
                continue
                
            existing_text = (existing.get('job_description') or '').strip()
            if fuzzy_similarity(post_text, existing_text) >= 0.85:
                is_fuzzy_duplicate = True
                break

        if is_fuzzy_duplicate:
            continue

        seen_urls.add(url_key)
        unique_posts.append(post)

    print(f"[DEDUPE ENGINE] Input: {len(posts)} posts -> Unique Survivors: {len(unique_posts)} posts.")
    return unique_posts

if __name__ == '__main__':
    p1 = {"job_id": "1", "post_url": "url1", "job_description": "We are hiring APM at Stripe", "email": "a@stripe.com", "role_title": "APM"}
    p2 = {"job_id": "2", "post_url": "url2", "job_description": "We are hiring APM at Stripe", "email": "a@stripe.com", "role_title": "APM"}
    res = deduplicate_posts([p1, p2])
    print(f"Dedupe Result count: {len(res)}")
