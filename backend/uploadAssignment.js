// Lambda: lms-uploadAssignment
// Trigger: POST /assignments/upload
// Auth:    Cognito Authorizer (JWT required)
//
// How uploads reach Google Drive
// ─────────────────────────────
// This Lambda POSTs the base64-encoded file to a Google Apps Script web-app
// URL that the admin deploys once. The Apps Script runs as the admin's Google
// account and saves the file into the configured Drive folder — no Service
// Account, no OAuth, no npm packages beyond the built-in AWS SDK.
//
// Admin setup (one time only)
// ───────────────────────────
// 1. Open https://script.google.com and create a new project.
// 2. Replace the default code with the Apps Script below.
// 3. Change FOLDER_ID to the ID from your Drive folder URL
//    (https://drive.google.com/drive/folders/<FOLDER_ID>)
//    and set SECRET to any long random string.
// 4. Deploy → New deployment → Web app
//      Execute as: Me   |   Who has access: Anyone
// 5. Copy the deployment URL.
// 6. Set two Lambda environment variables:
//      GOOGLE_SCRIPT_URL    = <deployment URL from step 5>
//      GOOGLE_SCRIPT_SECRET = <the same SECRET string from the script>
//
// ── Apps Script code ──────────────────────────────────────────────────────
// const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';
// const SECRET    = 'YOUR_SECRET_TOKEN';
//
// function doPost(e) {
//   try {
//     const d = JSON.parse(e.postData.contents);
//     if (d.secret !== SECRET) return json({ ok: false, error: 'Unauthorized' });
//     const blob = Utilities.newBlob(
//       Utilities.base64Decode(d.fileBase64), d.mimeType,
//       `${d.courseId}_${d.weekId}_${d.userId}_${d.fileName}`
//     );
//     const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
//     file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
//     return json({ ok: true, fileId: file.getId(), fileUrl: file.getUrl() });
//   } catch (err) {
//     return json({ ok: false, error: err.toString() });
//   }
// }
// function json(obj) {
//   return ContentService.createTextOutput(JSON.stringify(obj))
//     .setMimeType(ContentService.MimeType.JSON);
// }
// ──────────────────────────────────────────────────────────────────────────
//
// Required environment variables:
//   GOOGLE_SCRIPT_URL     – Apps Script web-app deployment URL
//   GOOGLE_SCRIPT_SECRET  – shared secret token (set same value in Apps Script)
//   ASSIGNMENTS_TABLE     – DynamoDB table name (default: lms-assignments)
//   FRONTEND_URL          – for CORS

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION }),
);

const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || 'lms-assignments';
const FRONTEND_URL      = process.env.FRONTEND_URL      || 'https://stepsmart.net';
const MAX_FILE_BYTES    = 7 * 1024 * 1024; // 7 MB original-file limit

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.presentation',
]);

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };
}
function res(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', ...corsHeaders() }, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return res(400, { message: 'Invalid JSON body' }); }

  const { courseId, weekId, fileName, mimeType, fileBase64 } = body;
  if (!courseId || !weekId || !fileName || !mimeType || !fileBase64)
    return res(400, { message: 'Missing required fields' });

  if (!ALLOWED_MIME_TYPES.has(mimeType))
    return res(400, { message: 'Unsupported file type. Upload PDF, Word, or PowerPoint.' });

  if (Buffer.byteLength(fileBase64, 'base64') > MAX_FILE_BYTES)
    return res(400, { message: 'File exceeds the 7 MB size limit.' });

  const scriptUrl    = process.env.GOOGLE_SCRIPT_URL;
  const scriptSecret = process.env.GOOGLE_SCRIPT_SECRET;
  if (!scriptUrl) return res(500, { message: 'Upload service not configured.' });

  try {
    // POST to the Apps Script web-app. fetch() is available natively in Node 18.
    const scriptRes = await fetch(scriptUrl, {
      method:   'POST',
      headers:  { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body:     JSON.stringify({
        secret: scriptSecret, courseId, weekId, userId, fileName, mimeType, fileBase64,
      }),
    });

    const result = await scriptRes.json();
    if (!result.ok) {
      console.error('Apps Script error:', result.error);
      return res(500, { message: 'Drive upload failed. Please try again.' });
    }

    const uploadedAt = new Date().toISOString();

    await ddb.send(new PutCommand({
      TableName: ASSIGNMENTS_TABLE,
      Item: {
        pk:          `COURSE#${courseId}#WEEK#${weekId}`,
        sk:          `USER#${userId}#${uploadedAt}`,
        userId, courseId, weekId, fileName, mimeType,
        driveFileId: result.fileId,
        driveUrl:    result.fileUrl,
        uploadedAt,
      },
    }));

    return res(200, { driveUrl: result.fileUrl, fileName, uploadedAt });
  } catch (err) {
    console.error('uploadAssignment error:', err);
    return res(500, { message: 'Upload failed. Please try again.' });
  }
};
