/**
 * Google Apps Script for Auto-fetching LinkedIn PM Jobs into Google Sheets
 * Instructions:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Paste this script into Code.gs
 * 3. Add a Time-Driven Trigger to run syncPMJobsEvery6Hours() every 6 hours!
 */

function syncPMJobsEvery6Hours() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var webAppUrl = "YOUR_JOB_BOARD_WEB_APP_URL/data/jobs.json"; // Replace with your hosted job tracker JSON endpoint
  
  try {
    var response = UrlFetchApp.fetch(webAppUrl);
    var jobs = JSON.parse(response.getContentText());
    
    // Clear existing data (preserve row 1 header)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 9).clearContent();
    } else {
      // Set Header
      sheet.getRange(1, 1, 1, 9).setValues([[
        "Job ID", "Job Description", "Contact Name", "Contact Headline", 
        "Contact Profile", "Apply Link", "Post URL", "Seniority", "Scraped Date"
      ]]);
    }
    
    var rows = [];
    for (var i = 0; i < jobs.length; i++) {
      var j = jobs[i];
      var c = j.relevant_contact || {};
      rows.push([
        j.job_id || "",
        j.job_description || "",
        c.name || "",
        c.headline || "",
        c.profile_url || "",
        j.apply_link || "",
        j.post_url || "",
        j.seniority || "",
        j.scraped_at || ""
      ]);
    }
    
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, 9).setValues(rows);
      Logger.log("Successfully updated " + rows.length + " PM job posts!");
    }
  } catch(e) {
    Logger.log("Error syncing jobs: " + e.toString());
  }
}
