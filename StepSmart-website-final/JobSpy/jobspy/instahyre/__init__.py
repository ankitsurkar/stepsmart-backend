from __future__ import annotations

import logging
from datetime import datetime
from jobspy.model import (
    JobPost,
    Location,
    JobResponse,
    Scraper,
    ScraperInput,
    Site,
)
from jobspy.util import create_session, create_logger

log = create_logger("Instahyre")

class Instahyre(Scraper):
    base_url = "https://www.instahyre.com/api/v1/job_search"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.INSTAHYRE, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            term = scraper_input.search_term or "Product Management"
            url = f"{self.base_url}?offset=0&skills={term}"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://www.instahyre.com/search-jobs/",
            }
            
            res = self.session.get(url, headers=headers)
            if res.status_code != 200:
                log.error(f"Instahyre returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            data = res.json()
            raw_jobs = data.get("objects", []) or data.get("jobs", [])
            
            for item in raw_jobs:
                title = item.get("candidate_title") or item.get("title")
                if not title:
                    continue
                    
                employer = item.get("employer") or {}
                company_name = employer.get("company_name") or item.get("company_name") or "Instahyre Hiring Company"
                
                job_id = str(item.get("id") or "")
                public_url = item.get("public_url") or f"https://www.instahyre.com/job-{job_id}"
                if public_url.startswith("/"):
                    public_url = f"https://www.instahyre.com{public_url}"

                locations = item.get("locations") or ["India"]
                loc_str = locations[0] if isinstance(locations, list) and len(locations) > 0 else "India"

                job_post = JobPost(
                    id=f"instahyre-{job_id}",
                    title=title,
                    company_name=company_name,
                    location=Location(city=str(loc_str), country="India"),
                    job_url=public_url,
                    date_posted=datetime.now().date(),
                )
                job_list.append(job_post)
                if len(job_list) >= scraper_input.results_wanted:
                    break

        except Exception as e:
            log.error(f"Error scraping Instahyre: {e}")

        return JobResponse(jobs=job_list)
