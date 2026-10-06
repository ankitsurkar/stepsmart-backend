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

log = create_logger("Cutshort")

class Cutshort(Scraper):
    base_url = "https://cutshort.io"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.CUTSHORT, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            term = (scraper_input.search_term or "product-manager").lower().replace(" ", "-")
            url = f"{self.base_url}/jobs/{term}-jobs"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
            
            res = self.session.get(url, headers=headers)
            if res.status_code != 200:
                log.error(f"Cutshort returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            soup = BeautifulSoup(res.text, "html.parser")
            
            # Check for embedded script data or Next data
            script_tag = soup.find("script", id="__NEXT_DATA__")
            if script_tag and script_tag.string:
                try:
                    data = json.loads(script_tag.string)
                    jobs_data = data.get("props", {}).get("pageProps", {}).get("initialJobs", [])
                    for j in jobs_data:
                        title = j.get("title") or j.get("designation")
                        if title:
                            comp = j.get("company", {}).get("name") if isinstance(j.get("company"), dict) else "Startup"
                            slug = j.get("slug") or str(j.get("id") or "")
                            apply_url = f"https://cutshort.io/job/{slug}"
                            loc = j.get("location") or "India"
                            
                            job_post = JobPost(
                                id=f"cutshort-{slug}",
                                title=title,
                                company_name=comp,
                                location=Location(city=loc, country="India"),
                                job_url=apply_url,
                                date_posted=datetime.now().date(),
                            )
                            job_list.append(job_post)
                except Exception as ex:
                    log.warning(f"Could not parse Cutshort NEXT_DATA: {ex}")

            if not job_list:
                # HTML fallback card parsing
                cards = soup.find_all(["div", "article"], class_=re.compile(r"job-card|job-item.*"))
                for card in cards:
                    title_elem = card.find(["a", "h2", "h3"])
                    if not title_elem:
                        continue
                    title = title_elem.get_text(strip=True)
                    link = title_elem.get("href") if title_elem.name == "a" else card.find("a", href=True)
                    href = link["href"] if link else ""
                    job_url = f"{self.base_url}{href}" if href.startswith("/") else (href or self.base_url)
                    
                    comp_elem = card.find(class_=re.compile(r"company|organization"))
                    comp_name = comp_elem.get_text(strip=True) if comp_elem else "Cutshort Hiring Startup"
                    
                    job_post = JobPost(
                        id=f"cutshort-{hash(title+comp_name+job_url)}",
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
            log.error(f"Error scraping Cutshort: {e}")

        return JobResponse(jobs=job_list)
