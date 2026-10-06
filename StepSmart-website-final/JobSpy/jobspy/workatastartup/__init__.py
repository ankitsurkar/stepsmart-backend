from __future__ import annotations

import json
import re
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

log = create_logger("WorkAtAStartup")

class WorkAtAStartup(Scraper):
    base_url = "https://www.workatastartup.com/jobs"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.WORKATASTARTUP, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            query = scraper_input.search_term or "Product Manager"
            url = f"{self.base_url}?query={query}"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
            
            res = self.session.get(url, headers=headers)
            if res.status_code != 200:
                log.error(f"YC Work at a Startup returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            m = re.search(r'data-page=\"(.*?)\"', res.text)
            if not m:
                log.error("Could not parse YC data-page payload")
                return JobResponse(jobs=[])
                
            raw_json = m.group(1).replace("&quot;", '"').replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
            data = json.loads(raw_json)
            raw_jobs = data.get("props", {}).get("jobs", [])
            
            for item in raw_jobs:
                title = item.get("title")
                if not title:
                    continue
                    
                company_name = item.get("companyName") or "YC Startup"
                job_id = str(item.get("id") or "")
                
                company_slug = item.get("companySlug") or ""
                apply_url = item.get("applyUrl") or f"https://www.workatastartup.com/companies/{company_slug}"
                
                location_str = item.get("location") or "Remote"
                location_obj = Location(city=location_str)
                
                batch = item.get("companyBatch") or ""
                one_liner = item.get("companyOneLiner") or ""
                desc = f"Batch: {batch}\n{one_liner}"
                
                job_post = JobPost(
                    id=f"yc-{job_id}",
                    title=title,
                    company_name=company_name,
                    location=location_obj,
                    job_url=apply_url,
                    date_posted=datetime.now().date(),
                    description=desc,
                )
                job_list.append(job_post)
                if len(job_list) >= scraper_input.results_wanted:
                    break

        except Exception as e:
            log.error(f"Error scraping WorkAtAStartup: {e}")

        return JobResponse(jobs=job_list)
