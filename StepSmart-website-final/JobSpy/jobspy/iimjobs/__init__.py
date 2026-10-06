from __future__ import annotations

import re
import json
from datetime import datetime
from bs4 import BeautifulSoup
from jobspy.model import (
    JobPost,
    Location,
    JobResponse,
    Scraper,
    ScraperInput,
    Site,
)
from jobspy.util import create_session, create_logger

log = create_logger("iimjobs")

class Iimjobs(Scraper):
    base_url = "https://www.iimjobs.com"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.IIMJOBS, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            term = (scraper_input.search_term or "product-manager").lower().replace(" ", "-")
            url = f"{self.base_url}/k/{term}-jobs"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
            
            res = self.session.get(url, headers=headers, allow_redirects=True)
            if res.status_code != 200:
                log.error(f"iimjobs returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            soup = BeautifulSoup(res.text, "html.parser")
            
            job_cards = soup.find_all("div", class_=re.compile(r"job-card|job-item|jobSnippet|jobbox.*"))
            if not job_cards:
                job_cards = soup.find_all("a", href=re.compile(r"/j/.*"))

            for card in job_cards:
                if card.name == "a":
                    title = card.get_text(strip=True)
                    href = card.get("href") or ""
                    comp_name = "iimjobs Hiring Organization"
                else:
                    title_elem = card.find(["a", "h2", "h3"], class_=re.compile(r"title|jobTitle.*"))
                    if not title_elem:
                        title_elem = card.find("a", href=re.compile(r"/j/.*"))
                    if not title_elem:
                        continue
                    title = title_elem.get_text(strip=True)
                    href = title_elem.get("href") or ""
                    comp_elem = card.find(class_=re.compile(r"company|recruiter.*"))
                    comp_name = comp_elem.get_text(strip=True) if comp_elem else "iimjobs Hiring Organization"

                if not title:
                    continue

                job_url = f"{self.base_url}{href}" if href.startswith("/") else (href or self.base_url)
                
                job_post = JobPost(
                    id=f"iimjobs-{hash(title+comp_name+job_url)}",
                    title=title,
                    company_name=comp_name,
                    location=Location(city="India"),
                    job_url=job_url,
                    date_posted=datetime.now().date(),
                )
                job_list.append(job_post)
                if len(job_list) >= scraper_input.results_wanted:
                    break

        except Exception as e:
            log.error(f"Error scraping iimjobs: {e}")

        return JobResponse(jobs=job_list)
