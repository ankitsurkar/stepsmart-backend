# LinkedIn post discovery setup

The dashboard can use Brave Search to discover public LinkedIn post URLs without calling Apify. Search results are candidate leads only: snippets can be incomplete and do not establish the original post's publication date or job details.

## Configure

1. Create a Brave Search API key in the Brave Search API dashboard.
2. Put `BRAVE_SEARCH_API_KEY=...` in the ignored local `.env` file (never in browser storage or a committed file). `.env.example` only contains placeholders.
3. Click **Discover Posts**. The server loads `.env` when a discovery run starts, so a dashboard restart is not needed just to pick up the key.
4. Open **Review Search Candidates**. Open the original LinkedIn post and confirm its text, hiring intent, and displayed posting date.
5. Paste the original post description, enter the role and company exactly as stated, and enter its displayed local date/time. **Verify and add to feed** accepts only the last seven days. Dismiss irrelevant candidates.

When the Brave key is configured, dashboard refresh uses Brave discovery. Without it, dashboard refresh reads the saved feed only and never calls Apify. Apify is reserved for the explicit CLI scrape and scheduler paths.

## Apify spend protection

The scheduler now checks about twice per week (84 hours). Every code path that calls Apify reserves a slot in an ignored local ledger and is blocked after eight run reservations in any rolling 30-day window or if a scrape ran in the previous 72 hours. Defaults can be adjusted in `.env` with `APIFY_MAX_RUNS_PER_MONTH`, `APIFY_MIN_INTERVAL_HOURS`, and `APIFY_SCHEDULE_INTERVAL_HOURS`. At current Free-tier list prices and this code's maximum caps, eight full cycles are approximately $4.19 in Actor charges: up to 100 LinkedIn results ($0.50), five Google result pages ($0.0225), and one infrequent Google Actor start ($0.001) per cycle. The local guard is a run-count ceiling, not account-wide billing telemetry; other projects or changes in actual result counts can change total spend. Check Apify Console usage after the first few runs before keeping the cap at eight.

The review action does not retrieve content from LinkedIn; it records text and a date that a person has inspected. Search snippets remain labeled as unverified candidates and are not included in the jobs feed. Cached records without a saved body display: “Description not available check the original post for reference.”
