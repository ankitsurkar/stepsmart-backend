// Lambda: lms-uploadAssignment
// Trigger: POST /assignments/upload
// Auth:    Cognito Authorizer (JWT required)

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION }),
);

const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || 'lms-assignments';
const FRONTEND_URL      = process.env.FRONTEND_URL || 'https://stepsmart.net';
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

  const { courseId, weekId, fileName, mimeType, fileBase64, assignmentId, assignmentTitle } = body;
  if (!courseId || !weekId || !fileName || !mimeType || !fileBase64)
    return res(400, { message: 'Missing required fields' });

  if (!ALLOWED_MIME_TYPES.has(mimeType))
    return res(400, { message: 'Unsupported file type. Upload PDF, Word, or PowerPoint.' });

  const fileBuffer = Buffer.from(fileBase64, 'base64');
  if (fileBuffer.length > MAX_FILE_BYTES) {
    return res(400, { message: 'File exceeds the 7 MB size limit.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    return res(500, { message: 'Upload service not configured.' });
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectPath = `assignments/${courseId}/${weekId}/${userId}/${Date.now()}-${safeFileName}`;

  try {
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': mimeType,
          'x-upsert': 'false',
        },
        body: fileBuffer,
      },
    );

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Supabase upload error:', errorText);
      return res(500, { message: 'Upload failed. Please try again.' });
    }

    const uploadedAt = new Date().toISOString();
    const signedUrlRes = await fetch(
      `${supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 60 * 60 * 24 }),
      },
    );

    const signedUrlBody = await signedUrlRes.json();
    const signedUrl = signedUrlBody.signedUrl ?? signedUrlBody.signedURL;

    if (!signedUrlRes.ok || !signedUrl) {
      console.error('Supabase signed URL error:', signedUrlBody);
      return res(500, { message: 'Upload completed, but file link generation failed.' });
    }

    await ddb.send(new PutCommand({
      TableName: ASSIGNMENTS_TABLE,
      Item: {
        pk: `COURSE#${courseId}#WEEK#${weekId}`,
        sk: `USER#${userId}#${uploadedAt}`,
        userId,
        courseId,
        weekId,
        assignmentId: assignmentId || null,
        assignmentTitle: assignmentTitle || null,
        fileName,
        mimeType,
        storageProvider: 'supabase',
        storageBucket: bucket,
        storagePath: objectPath,
        driveFileId: objectPath,
        driveUrl: signedUrl,
        uploadedAt,
      },
    }));

    return res(200, {
      driveUrl: signedUrl,
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
