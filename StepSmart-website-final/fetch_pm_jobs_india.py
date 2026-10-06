import sys
import os
import csv
import pandas as pd
from jobspy import scrape_jobs

def main():
    print("Starting JobSpy scrape across Classic + 8 Startup Portals for PM jobs in India...")
    
    portals = [
        "indeed", "linkedin", "naukri", "glassdoor", "google",
        "peerlist", "workatastartup", "wellfound", "instahyre",
        "cutshort", "hirist", "iimjobs", "hirect"
    ]
    
    search_terms = ["Product Manager", "Senior Product Manager", "Associate Product Manager"]
    locations = ["India", "Bengaluru", "Gurugram", "Mumbai"]
    
    all_jobs = []
    
    for term in search_terms:
        for loc in locations:
            try:
                print(f"--> Scraping '{term}' in '{loc}' across startup & corporate portals...")
                jobs = scrape_jobs(
                    site_name=portals,
                    search_term=term,
                    location=loc,
                    results_wanted=30,
                    country_indeed='India',
                    hours_old=240, # past 10 days
                )
                if jobs is not None and not jobs.empty:
                    print(f"    Found {len(jobs)} jobs for {term} in {loc}")
                    all_jobs.append(jobs)
                else:
                    print(f"    No jobs returned for {term} in {loc}")
            except Exception as e:
                print(f"    Error scraping {term} in {loc}: {e}")
                
    if not all_jobs:
        print("No jobs found across queries.")
        return
        
    combined_df = pd.concat(all_jobs, ignore_index=True)
    
    # Deduplicate by job_url or title+company
    if 'job_url' in combined_df.columns:
        combined_df.drop_duplicates(subset=['job_url'], inplace=True)
    elif 'title' in combined_df.columns and 'company' in combined_df.columns:
        combined_df.drop_duplicates(subset=['title', 'company'], inplace=True)
        
    output_path = "pm_all_portals_india.csv"
    combined_df.to_csv(output_path, quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False)
    print(f"\nSuccessfully scraped and saved {len(combined_df)} unique Product Management jobs to {output_path}")

if __name__ == "__main__":
    main()
