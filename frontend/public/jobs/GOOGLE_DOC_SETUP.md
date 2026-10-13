# StepSmart PM Job Board — Google Doc Automation Guide

This guide explains how your daily automated PM job scraper updates a Google Doc every day with fresh Product Management roles.

---

## ⚡ How It Works

Every morning at **9:00 AM IST** (03:30 UTC), the GitHub Actions scraper:
1. Crawls **13 portals** (LinkedIn, Naukri, Instahyre, Glassdoor, Indeed, YC Startups, etc.).
2. Deduplicates and filters for verified PM openings (APMs, PMs, Senior PMs).
3. Automatically formats an executive daily digest with:
   - 📅 **Date & Total New Openings**
   - 📊 **Table with clickable application links** (`Apply Now`)
   - 🚀 **Categorized breakdown** (Associate/0-2y, Mid-level, Senior/Lead)
4. Syncs the listings straight into your **Google Doc**!

---

## 🚀 Choose Your Setup Method (Takes 2 Minutes)

### Option A: Webhook Push (Recommended — Powered by GitHub Actions)

Whenever GitHub Actions runs every morning, it pushes the fresh jobs directly to your Google Doc.

#### Step 1: Open or Create your Google Doc
1. Go to [Google Docs](https://docs.google.com/document/create) and create a new doc (e.g. named **"StepSmart Daily PM Jobs"**).

#### Step 2: Add the Apps Script Webhook
1. In your Google Doc, click: **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Open [`google_doc_sync_script.js`](./google_doc_sync_script.js) from this repository, copy its entire contents, and paste it into `Code.gs`.
4. Click the **Save** icon (disk icon).

#### Step 3: Deploy as Web App
1. Click **Deploy** (blue button in top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the following:
   - **Description**: `StepSmart Daily PM Job Sync`
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Click **Authorize access**, select your Google account, and click **Allow** (if you see an "Advanced" prompt, click "Advanced" -> "Go to StepSmart... (unsafe)").
6. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/.../exec`).

#### Step 4: Add the URL to GitHub Secrets
1. Go to your GitHub repository secrets page:
   - For backend monorepo: [ankitsurkar/stepsmart-backend Secrets](https://github.com/ankitsurkar/stepsmart-backend/settings/secrets/actions)
   - Or your fork: [74Sanket/StepSmart-website-final Secrets](https://github.com/74Sanket/StepSmart-website-final/settings/secrets/actions)
2. Click **New repository secret**.
3. Name: `GOOGLE_DOC_WEBHOOK_URL`
4. Value: Paste your Web app URL.
5. Click **Add secret**.

🎉 **That's it!** Every morning at 9:00 AM IST (or whenever you trigger "Run workflow"), the new jobs will be appended to your Google Doc automatically!

---

### Option B: Standalone Google Timer (Zero GitHub Setup Needed!)

If you don't want to configure GitHub secrets, Google can fetch the jobs directly from GitHub on its own timer:

1. Open your Google Doc -> **Extensions** -> **Apps Script**.
2. Paste the contents of [`google_doc_sync_script.js`](./google_doc_sync_script.js).
3. On the left sidebar in Apps Script, click the **Triggers** icon (clock icon) -> **Add Trigger** (bottom right).
4. Configure:
   - Function to run: `fetchDailyJobsFromGitHub`
   - Event source: `Time-driven`
   - Type of time based trigger: `Day timer`
   - Time of day: `9am to 10am` (or preferred time)
5. Click **Save**.

Your Google Doc will now update itself every morning!

---

### Option C: Offline & Local Digest

Every run also automatically commits a markdown file:
- `data/daily_pm_jobs_google_doc.md`
- `data/daily_pm_jobs_google_doc.html`

You can open this file anytime and copy-paste it directly into Google Docs or Slack/Notion.
