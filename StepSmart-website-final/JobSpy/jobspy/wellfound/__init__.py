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

log = create_logger("Wellfound")

class Wellfound(Scraper):
    base_url = "https://wellfound.com"

    def __init__(
        self, proxies: list[str] | str | None = None, ca_cert: str | None = None, user_agent: str | None = None
    ):
        super().__init__(Site.WELLFOUND, proxies=proxies, ca_cert=ca_cert)
        self.session = create_session(proxies=self.proxies, ca_cert=ca_cert)

    def scrape(self, scraper_input: ScraperInput) -> JobResponse:
        job_list: list[JobPost] = []
        try:
            term = (scraper_input.search_term or "product-manager").lower().replace(" ", "-")
            url = f"{self.base_url}/role/l/{term}/india"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
            
            res = self.session.get(url, headers=headers)
            if res.status_code != 200:
                log.error(f"Wellfound returned status code {res.status_code}")
                return JobResponse(jobs=[])
                
            soup = BeautifulSoup(res.text, "html.parser")
            
            # Extract Next.js script payload if available
            script_tag = soup.find("script", id="__NEXT_DATA__")
            if script_tag and script_tag.string:
                try:
                    data = json.loads(script_tag.string)
                    # Traverse json props for job postings
                    props = data.get("props", {}).get("pageProps", {})
                    listings = props.get("apolloState", {})
                    for key, val in listings.items():
                        if isinstance(val, dict) and val.get("__typename") == "JobListing":
                            title = val.get("title")
                            if title:
                                company = val.get("startup", {}).get("name") or "Startup"
                                job_id = val.get("id") or key.split(":")[-1]
                                apply_url = f"https://wellfound.com/jobs/{job_id}"
                                loc_str = val.get("location") or "India"
                                job_post = JobPost(
                                    id=f"wellfound-{job_id}",
                                    title=title,
                                    company_name=company,
                                    location=Location(city=loc_str, country="India"),
                                    job_url=apply_url,
                                    date_posted=datetime.now().date(),
                                )
                                job_list.append(job_post)
                except Exception as ex:
                    log.warning(f"Could not parse Wellfound NEXT_DATA: {ex}")

            # Fallback HTML cards parsing if NEXT_DATA was sparse
            if not job_list:
                cards = soup.find_all("div", class_=re.compile(r"styles_component.*|job-listing.*"))
                for card in cards:
                    title_elem = card.find(["h2", "h3", "a"], class_=re.compile(r"title|name|job"))
                    if not title_elem:
                        continue
                    title = title_elem.get_text(strip=True)
                    link = title_elem.get("href") if title_elem.name == "a" else card.find("a", href=True)
                    job_url = f"{self.base_url}{link['href']}" if link and link['href'].startswith("/") else (link['href'] if link else self.base_url)
                    
                    comp_elem = card.find(class_=re.compile(r"startup|company"))
                    comp_name = comp_elem.get_text(strip=True) if comp_elem else "Startup"
                    
                    job_post = JobPost(
                        id=f"wellfound-{hash(title+comp_name)}",
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
            log.error(f"Error scraping Wellfound: {e}")

        return JobResponse(jobs=job_list)
