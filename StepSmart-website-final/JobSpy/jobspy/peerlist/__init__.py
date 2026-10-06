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

log = create_logger("Peerlist")

class Peerlist(Scraper):
    base_url = "https://peerlist.io/api/v1/jobs"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.PEERLIST, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            url = f"{self.base_url}"
            params = {}
            if scraper_input.search_term:
                params["title"] = scraper_input.search_term
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "application/json",
            }
            
            res = self.session.get(url, params=params, headers=headers)
            if res.status_code != 200:
                log.error(f"Peerlist returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            data = res.json()
            raw_jobs = data.get("data", {}).get("jobs", []) if isinstance(data.get("data"), dict) else []
            
            for item in raw_jobs:
                title = item.get("jobTitle")
                if not title:
                    continue

                company_info = item.get("company") or {}
                company_name = company_info.get("name") if isinstance(company_info, dict) else str(company_info)
                
                job_id = str(item.get("jobId") or item.get("_id") or "")
                apply_link = item.get("applyLink") or f"https://peerlist.io/jobs/{job_id}"
                
                # Safe location extraction
                loc_raw = item.get("location") or item.get("locationPreference") or "Remote"
                city_name = "India"
                if isinstance(loc_raw, str):
                    city_name = loc_raw
                elif isinstance(loc_raw, list) and len(loc_raw) > 0:
                    first_loc = loc_raw[0]
                    if isinstance(first_loc, dict):
                        city_name = first_loc.get("city") or first_loc.get("country") or "India"
                    else:
                        city_name = str(first_loc)
                elif isinstance(loc_raw, dict):
                    city_name = loc_raw.get("city") or loc_raw.get("country") or "India"

                location_obj = Location(city=str(city_name), country="India")
                
                date_posted = None
                pub_date = item.get("publishedAt") or item.get("createdAt")
                if pub_date:
                    try:
                        date_posted = datetime.fromisoformat(pub_date.replace("Z", "+00:00")).date()
                    except Exception:
                        date_posted = datetime.now().date()

                raw_skills = item.get("skills", [])
                clean_skills = []
                if isinstance(raw_skills, list):
                    for s in raw_skills:
                        if isinstance(s, dict):
                            clean_skills.append(str(s.get("name") or s.get("title") or ""))
                        else:
                            clean_skills.append(str(s))
                    clean_skills = [s for s in clean_skills if s]

                job_post = JobPost(
                    id=f"peerlist-{job_id}",
                    title=title,
                    company_name=company_name,
                    location=location_obj,
                    job_url=apply_link,
                    date_posted=date_posted,
                    description=item.get("jobDescription"),
                    skills=clean_skills if clean_skills else None,
                )
                job_list.append(job_post)
                if len(job_list) >= scraper_input.results_wanted:
                    break

        except Exception as e:
            log.error(f"Error scraping Peerlist: {e}")

        return JobResponse(jobs=job_list)
