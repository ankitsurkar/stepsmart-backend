// Lambda: lms-uploadAssignment
// Trigger: POST /assignments/upload
// Auth:    Cognito Authorizer (JWT required)

const https = require('https');
const { URL } = require('url');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION }),
);

const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || process.env.ASSIGNMENT_TABLE || 'lms-assignments';
const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const FRONTEND_URL      = process.env.FRONTEND_URL || 'https://stepsmart.net';
const MAX_FILE_BYTES    = 7 * 1024 * 1024; // 7 MB original-file limit

let currentOrigin = FRONTEND_URL;

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
    'Access-Control-Allow-Origin':  currentOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };
}

function res(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', ...corsHeaders() }, body: JSON.stringify(body) };
}

function httpsRequest(urlString, options, bodyData) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlString);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf8');
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: async () => responseBody,
          json: async () => {
            try { return JSON.parse(responseBody); } catch { return {}; }
          },
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const ssm = new SSMClient({ region: process.env.AWS_REGION || 'eu-north-1' });

let cachedSupaUrl = null;
let cachedSupaKey = null;

async function getSupabaseCreds() {
  if (cachedSupaUrl && cachedSupaKey) {
    return { url: cachedSupaUrl, key: cachedSupaKey };
  }
  try {
    const [urlRes, keyRes] = await Promise.all([
      ssm.send(new GetParameterCommand({ Name: '/stepsmart/supabase/url' })),
      ssm.send(new GetParameterCommand({ Name: '/stepsmart/supabase/service-role-key', WithDecryption: true })),
    ]);
    cachedSupaUrl = urlRes.Parameter.Value;
    cachedSupaKey = keyRes.Parameter.Value;
    return { url: cachedSupaUrl, key: cachedSupaKey };
  } catch (err) {
    console.error('Error fetching Supabase credentials from SSM Parameter Store:', err);
    return null;
  }
}

exports.handler = async (event) => {
  currentOrigin = event?.headers?.origin || event?.headers?.Origin || FRONTEND_URL;
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return res(400, { message: 'Invalid JSON body' }); }

  const { courseId, weekId, fileName, mimeType, fileBase64, assignmentId, assignmentTitle } = body;
  if (!courseId || !weekId || !fileName || !mimeType || !fileBase64)
    return res(400, { message: 'Missing required fields' });

  // Input Validation
  if (typeof courseId !== 'string' || !/^[a-zA-Z0-9_-]{3,50}$/.test(courseId)) {
    return res(400, { message: 'Invalid courseId format.' });
  }
  if (typeof weekId !== 'string' || !/^[a-zA-Z0-9_-]{3,50}$/.test(weekId)) {
    return res(400, { message: 'Invalid weekId format.' });
  }
  if (typeof fileName !== 'string' || fileName.length > 200 || fileName.includes('/') || fileName.includes('\\')) {
    return res(400, { message: 'Invalid fileName format.' });
  }
  if (typeof mimeType !== 'string' || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return res(400, { message: 'Unsupported or invalid MIME type.' });
  }

  // Verify enrollment (admins bypass this check)
  const groupsClaim = event?.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  const isAdmin = groups.includes('admins');

  if (!isAdmin) {
    try {
      const enrollRes = await ddb.send(new GetCommand({
        TableName: ENROLLMENTS_TABLE,
        Key: { enrollmentId: userId },
      }));
      const enrollment = enrollRes.Item;
      if (!enrollment || enrollment.courseId !== courseId) {
        return res(403, { message: 'Forbidden: you are not enrolled in this course.' });
      }
    } catch (err) {
      console.error('Failed to verify enrollment during assignment upload:', err);
      return res(500, { message: 'Failed to verify enrollment.' });
    }
  }

  const fileBuffer = Buffer.from(fileBase64, 'base64');
  if (fileBuffer.length > MAX_FILE_BYTES) {
    return res(400, { message: 'File exceeds the 7 MB size limit.' });
  }

  const creds = await getSupabaseCreds();
  if (!creds) {
    return res(500, { message: 'Upload service not configured (missing SSM parameters).' });
  }

  const supabaseUrl = creds.url;
  const serviceRoleKey = creds.key;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'PMX';

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectPath = `assignments/${courseId}/${weekId}/${userId}/${Date.now()}-${safeFileName}`;

  try {
    const uploadRes = await httpsRequest(
      `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': mimeType,
          'Content-Length': String(fileBuffer.length),
          'x-upsert': 'true',
        },
      },
      fileBuffer,
    );

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Supabase upload error status:', uploadRes.status, errorText);
      return res(500, { message: `Upload to storage failed (${uploadRes.status}): ${errorText || 'Storage request rejected.'}` });
    }

    const uploadedAt = new Date().toISOString();
    const signedUrlRes = await httpsRequest(
      `${supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': 'application/json',
        },
      },
      Buffer.from(JSON.stringify({ expiresIn: 60 * 60 * 24 * 365 * 10 })), // 10 years — effectively no expiry
    );

    const signedUrlBody = await signedUrlRes.json();
    const rawSigned = signedUrlBody.signedUrl ?? signedUrlBody.signedURL ?? '';
    const signedUrl = rawSigned.startsWith('http')
      ? rawSigned
      : `${supabaseUrl}/storage/v1${rawSigned}`;

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
    const causeMsg = err.cause ? ` (${err.cause.message || err.cause})` : '';
    return res(500, { message: `Upload failed: ${err.message || 'Internal server error'}${causeMsg}` });
  }
};
