/**
 * ==============================================================================
 * StepSmart PM Job Board — Google Doc Auto-Sync Apps Script
 * ==============================================================================
 * This script automatically syncs daily verified PM job listings into your Google Doc.
 *
 * HOW TO SET THIS UP (Takes 2 Minutes):
 * ------------------------------------------------------------------------------
 * METHOD 1: Webhook Push (Recommended — Triggered by GitHub Actions Daily)
 * 1. Create or open your Google Doc: https://docs.google.com/document/create
 * 2. In Google Docs, click: Extensions -> Apps Script
 * 3. Delete any default code in Code.gs and paste this entire file.
 * 4. (Optional) Set your GOOGLE_DOC_ID in line 25 if this script is not bound to the doc.
 * 5. Click "Deploy" (top right) -> "New deployment"
 * 6. Select type: "Web app"
 *    - Description: "StepSmart Daily Job Sync"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy" and authorize permissions.
 * 8. Copy the "Web app URL" (ends in /exec).
 * 9. Add this URL as a GitHub Secret named `GOOGLE_DOC_WEBHOOK_URL` in your repository:
 *    https://github.com/ankitsurkar/stepsmart-backend/settings/secrets/actions
 * 
 * METHOD 2: Standalone Daily Timer (No GitHub Secrets Needed!)
 * 1. Follow steps 1-4 above.
 * 2. In Apps Script, click the Clock icon on the left ("Triggers") -> "Add Trigger".
 * 3. Choose function: "fetchDailyJobsFromGitHub"
 * 4. Event source: "Time-driven" -> "Day timer" -> Choose "9am to 10am" (or preferred time).
 * 5. Save. It will automatically fetch and write to your Google Doc every day!
 * ==============================================================================
 */

// If your Apps Script was created from inside the Google Doc, leave this empty.
// If created from script.google.com, paste your Google Doc ID here:
var TARGET_DOC_ID = "";

function getTargetDoc() {
  if (TARGET_DOC_ID && TARGET_DOC_ID.trim() !== "") {
    return DocumentApp.openById(TARGET_DOC_ID.trim());
  }
  try {
    return DocumentApp.getActiveDocument();
  } catch (e) {
    throw new Error("Target Google Doc not found. Please set TARGET_DOC_ID in the script.");
  }
}

/**
 * Webhook receiver for GitHub Actions POST request
 */
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var jobs = payload.jobs || [];
    var dateStr = payload.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");

    if (jobs.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "skipped",
        message: "No jobs in payload."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    appendJobsToGoogleDoc(jobs, dateStr);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: jobs.length,
      date: dateStr
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Standalone scheduled function to fetch latest daily jobs directly from GitHub
 */
function fetchDailyJobsFromGitHub() {
  var rawJsonUrl = "https://raw.githubusercontent.com/ankitsurkar/stepsmart-backend/main/StepSmart-website-final/data/jobs.json";
  try {
    var response = UrlFetchApp.fetch(rawJsonUrl);
    var allJobs = JSON.parse(response.getContentText());
    
    // Filter fresh jobs (last 2 days)
    var todayStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");
    var freshJobs = [];
    var seen = {};

    for (var i = 0; i < allJobs.length; i++) {
      var j = allJobs[i];
      var key = ((j.title || "") + "::" + (j.company || "")).toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;

      freshJobs.push({
        title: j.title || j.role_title || "Product Manager",
        company: j.company || j.company_name || "Company",
        location: j.location || "India",
        source: j.source || j.site || "Job Board",
        posted_at: j.posted_at || j.date_posted || todayStr,
        apply_url: j.apply_url || j.job_url || j.post_url || ""
      });

      if (freshJobs.length >= 60) break; // Limit daily section size
    }

    if (freshJobs.length > 0) {
      appendJobsToGoogleDoc(freshJobs, todayStr);
      Logger.log("Successfully appended " + freshJobs.length + " jobs to Google Doc.");
    }
  } catch (err) {
    Logger.log("Error fetching jobs from GitHub: " + err.toString());
  }
}

/**
 * Appends a formatted daily section with an executive table to the Google Doc
 */
function appendJobsToGoogleDoc(jobs, dateStr) {
  var doc = getTargetDoc();
  var body = doc.getBody();

  // Add Divider
  body.appendHorizontalRule();

  // Add Date & Title Heading
  var headingText = "📅 StepSmart Daily PM Job Board — " + dateStr;
  var heading = body.appendParagraph(headingText);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING_2);
  heading.setForegroundColor("#0f172a");

  // Add Subtitle
  var sub = body.appendParagraph(
    "Verified Daily PM Roles (" + jobs.length + " Openings) • Sources: LinkedIn, Naukri, Instahyre, Glassdoor, Indeed"
  );
  sub.setFontSize(10.5);
  sub.setForegroundColor("#64748b");
  sub.setItalic(true);

  // Build Table
  var tableData = [
    ["#", "Company", "Job Title", "Location", "Source", "Date", "Apply Link"]
  ];

  for (var k = 0; k < jobs.length; k++) {
    var item = jobs[k];
    tableData.push([
      (k + 1).toString(),
      item.company || "Hiring Company",
      item.title || "Product Manager",
      item.location || "India",
      item.source || "Portal",
      item.posted_at || dateStr,
      item.apply_url ? "Apply Now" : "N/A"
    ]);
  }

  var table = body.appendTable(tableData);

  // Style Header Row
  var headerRow = table.getRow(0);
  for (var col = 0; col < headerRow.getNumCells(); col++) {
    var cell = headerRow.getCell(col);
    cell.setBackgroundColor("#f1f5f9");
    cell.editAsText().setBold(true).setForegroundColor("#0f172a").setFontSize(10);
  }

  // Style Data Rows & Hyperlinks
  for (var rowIdx = 1; rowIdx < table.getNumRows(); rowIdx++) {
    var row = table.getRow(rowIdx);
    var jobData = jobs[rowIdx - 1];

    for (var cIdx = 0; cIdx < row.getNumCells(); cIdx++) {
      var dCell = row.getCell(cIdx);
      var text = dCell.editAsText();
      text.setFontSize(9.5);

      // Make Company bold
      if (cIdx === 1) {
        text.setBold(true);
      }

      // Make Apply Link clickable
      if (cIdx === 6 && jobData && jobData.apply_url) {
        text.setLinkUrl(jobData.apply_url);
        text.setForegroundColor("#0284c7");
        text.setUnderline(true);
      }
    }
  }

  // Add spacing after table
  body.appendParagraph("");
  doc.saveAndClose();
}
