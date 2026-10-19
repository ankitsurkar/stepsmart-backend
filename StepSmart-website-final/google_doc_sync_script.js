/**
 * ==============================================================================
 * StepSmart PM Job Board — Google Doc Auto-Sync Apps Script
 * ==============================================================================
 * Automatically syncs daily verified PM job listings into your Google Doc.
 * Includes auto-catchup: automatically detects missing dates and adds them!
 *
 * HOW TO SET THIS UP (Takes 1 Minute):
 * ------------------------------------------------------------------------------
 * 1. Open your Google Doc.
 * 2. In Google Docs, click: Extensions -> Apps Script
 * 3. Replace all code in Code.gs with this entire file.
 * 4. Paste your Google Doc URL or ID in TARGET_DOC_ID (line 27).
 * 5. Click the "Save" icon (disk icon).
 * 6. Select "fetchDailyJobsFromGitHub" from the top toolbar dropdown and click "Run".
 *    -> This will immediately catch up and add all recent days (Oct 14-18) to your doc!
 * 7. Click the Clock icon on the left ("Triggers") -> "Add Trigger" (bottom right).
 *    - Function: "fetchDailyJobsFromGitHub"
 *    - Event source: "Time-driven" -> "Day timer"
 *    - Time of day: "2pm to 3pm" (or "3pm to 4pm" IST, after GitHub's daily scrape)
 *    - Save.
 * ==============================================================================
 */

// Paste your Google Doc URL or ID here (e.g. "https://docs.google.com/document/d/.../edit" or raw ID):
var TARGET_DOC_ID = "";

function getTargetDoc() {
  try {
    var activeDoc = DocumentApp.getActiveDocument();
    if (activeDoc) return activeDoc;
  } catch (_) {}

  var raw = (TARGET_DOC_ID || "").trim();
  if (raw) {
    var docId = raw;
    var urlMatch = raw.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch) {
      docId = urlMatch[1];
    }
    try {
      return DocumentApp.openById(docId);
    } catch (err) {
      try {
        return DocumentApp.openByUrl(raw);
      } catch (err2) {
        var userEmail = Session.getActiveUser().getEmail() || "your active Google account";
        throw new Error(
          "Could not open Google Doc. Make sure '" + userEmail + "' has Edit access to the document, or set General Access to 'Anyone with the link can edit'. Doc ID attempted: " + docId
        );
      }
    }
  }

  throw new Error("Target Google Doc not found. Please paste your Google Doc URL or ID into TARGET_DOC_ID at the top of the script.");
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
 * Automatically catches up on all missing dates and prevents duplicates!
 */
function fetchDailyJobsFromGitHub() {
  var rawJsonUrls = [
    "https://raw.githubusercontent.com/ankitsurkar/stepsmart-backend/main/frontend/public/jobs/data/jobs.json",
    "https://raw.githubusercontent.com/ankitsurkar/stepsmart-backend/main/StepSmart-website-final/data/jobs.json",
    "https://raw.githubusercontent.com/74Sanket/StepSmart-website-final/main/data/jobs.json"
  ];

  try {
    var allJobs = [];
    for (var u = 0; u < rawJsonUrls.length; u++) {
      try {
        var resp = UrlFetchApp.fetch(rawJsonUrls[u], { muteHttpExceptions: true });
        if (resp.getResponseCode() === 200) {
          var parsed = JSON.parse(resp.getContentText());
          if (parsed && parsed.length > allJobs.length) {
            allJobs = parsed;
          }
        }
      } catch (fetchErr) {
        Logger.log("Notice fetching " + rawJsonUrls[u] + ": " + fetchErr.toString());
      }
    }

    if (allJobs.length === 0) {
      throw new Error("Unable to fetch job data from any GitHub source. Please verify internet connection or repository permissions.");
    }

    var doc = getTargetDoc();
    var existingText = doc.getBody().getText();

    // Group all jobs by posted_at date
    var byDate = {};
    for (var i = 0; i < allJobs.length; i++) {
      var j = allJobs[i];
      var pDate = (j.posted_at || j.date_posted || "").substring(0, 10);
      if (!pDate || pDate.length !== 10) continue;

      if (!byDate[pDate]) {
        byDate[pDate] = [];
      }
      byDate[pDate].push(j);
    }

    // Sort dates in ascending order (oldest to newest)
    var sortedDates = Object.keys(byDate).sort();
    var addedCount = 0;

    for (var d = 0; d < sortedDates.length; d++) {
      var dateKey = sortedDates[d];
      
      // Skip dates that are already recorded in the Google Doc
      if (existingText.indexOf(dateKey) !== -1) {
        Logger.log("Date " + dateKey + " already in Google Doc. Skipping.");
        continue;
      }

      var dayJobs = byDate[dateKey];
      var seen = {};
      var deduplicated = [];

      for (var k = 0; k < dayJobs.length; k++) {
        var item = dayJobs[k];
        var uKey = ((item.title || "") + "::" + (item.company || "")).toLowerCase();
        if (seen[uKey]) continue;
        seen[uKey] = true;

        deduplicated.push({
          title: item.title || item.role_title || "Product Manager",
          company: item.company || item.company_name || "Company",
          location: item.location || "India",
          source: item.source || item.site || "Job Board",
          posted_at: dateKey,
          apply_url: item.apply_url || item.job_url || item.post_url || ""
        });
      }

      if (deduplicated.length > 0) {
        Logger.log("Appending " + deduplicated.length + " jobs for " + dateKey + " to Google Doc...");
        appendJobsToGoogleDoc(deduplicated, dateKey);
        addedCount++;
        existingText += " " + dateKey;
      }
    }

    if (addedCount === 0) {
      Logger.log("Google Doc is already up to date with all recent job dates.");
    } else {
      Logger.log("Successfully synced " + addedCount + " days of jobs to Google Doc!");
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
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  heading.editAsText().setForegroundColor("#0f172a");

  // Add Subtitle
  var subText = "Verified Daily PM Roles (" + jobs.length + " Openings) • LinkedIn-Ready Format";
  var sub = body.appendParagraph(subText);
  sub.editAsText()
     .setFontSize(10)
     .setForegroundColor("#64748b")
     .setItalic(true);

  body.appendParagraph("");

  // Output each job in the exact format:
  // Company name - Senior Product manager - https://...
  for (var k = 0; k < jobs.length; k++) {
    var item = jobs[k];
    var comp = (item.company || "Company").trim();
    var title = (item.title || "Product Manager").trim();
    var url = (item.apply_url || item.job_url || item.post_url || "").trim();

    var lineText = comp + " - " + title + " - " + url;
    var p = body.appendParagraph(lineText);
    p.setLineSpacing(1.15);

    var textObj = p.editAsText();
    textObj.setFontSize(10);
    textObj.setForegroundColor("#1e293b");

    // Hyperlink the URL portion so it is clickable while keeping full URL text visible
    if (url) {
      var urlStart = lineText.indexOf(url);
      if (urlStart !== -1) {
        var urlEnd = urlStart + url.length - 1;
        textObj.setLinkUrl(urlStart, urlEnd, url);
        textObj.setForegroundColor(urlStart, urlEnd, "#0284c7");
        textObj.setUnderline(urlStart, urlEnd, true);
      }
    }
  }

  // Spacing after date batch
  body.appendParagraph("");
  doc.saveAndClose();
}
