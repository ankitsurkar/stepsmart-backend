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
    'Access-Control-Allow-Origin':  '*',
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

  const { courseId, weekId, fileName, mimeType, fileBase64, assignmentId, assignmentTitle } = body;
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
    // Promise.race enforces a 25 s deadline so we always respond before API Gateway's
    // hard 29 s integration timeout (which returns a 504 with no CORS headers).
    const fetchPromise = fetch(scriptUrl, {
      method:   'POST',
      headers:  { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body:     JSON.stringify({
        secret: scriptSecret,
        courseId,
        weekId,
        userId,
        fileName,
        mimeType,
        fileBase64,
        assignmentId,
        assignmentTitle,
      }),
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Apps Script timeout')), 25000)
    );
    const scriptRes = await Promise.race([fetchPromise, timeoutPromise]);

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
        userId,
        courseId,
        weekId,
        assignmentId: assignmentId || null,
        assignmentTitle: assignmentTitle || null,
        fileName,
        mimeType,
        driveFileId: result.fileId,
        driveUrl:    result.fileUrl,
        uploadedAt,
      },
    }));

    return res(200, {
      driveUrl: result.fileUrl,
      fileName,
      uploadedAt,
      assignmentId: assignmentId || null,
      assignmentTitle: assignmentTitle || null,
    });
  } catch (err) {
    console.error('uploadAssignment error:', err);
    return res(500, { message: 'Upload failed. Please try again.' });
  }
};
