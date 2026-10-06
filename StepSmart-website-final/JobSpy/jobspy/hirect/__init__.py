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

log = create_logger("Hirect")

class Hirect(Scraper):
    base_url = "https://hirect.in"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.HIRECT, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            query = scraper_input.search_term or "Product Manager"
            url = f"{self.base_url}/jobs?q={query}"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
            
            res = self.session.get(url, headers=headers)
            if res.status_code != 200:
                log.error(f"Hirect returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            soup = BeautifulSoup(res.text, "html.parser")
            
            job_cards = soup.find_all("div", class_=re.compile(r"job-card|job_item|hirect-job.*"))
            if not job_cards:
                job_cards = soup.find_all("a", href=re.compile(r"/job.*"))

            for card in job_cards:
                if card.name == "a":
                    title = card.get_text(strip=True)
                    href = card.get("href") or ""
                    comp_name = "Hirect Startup"
                else:
                    title_elem = card.find(["a", "h2", "h3"], class_=re.compile(r"title|job_title.*"))
                    if not title_elem:
                        continue
                    title = title_elem.get_text(strip=True)
                    href = title_elem.get("href") or ""
                    comp_elem = card.find(class_=re.compile(r"company|founder.*"))
                    comp_name = comp_elem.get_text(strip=True) if comp_elem else "Hirect Startup"

                if not title:
                    continue

                job_url = f"{self.base_url}{href}" if href.startswith("/") else (href or self.base_url)
                
                job_post = JobPost(
                    id=f"hirect-{hash(title+comp_name+job_url)}",
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
            log.error(f"Error scraping Hirect: {e}")

        return JobResponse(jobs=job_list)
