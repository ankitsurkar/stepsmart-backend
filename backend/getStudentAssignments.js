// Lambda: lms-getStudentAssignments
// Trigger: GET /courses/{courseId}/weeks/{weekId}/assignments
// Auth:    Cognito Authorizer (JWT required)
//
// Returns the authenticated student's assignment submissions for a specific week,
// ordered newest first.

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION }),
);

const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || 'lms-assignments';
const FRONTEND_URL      = process.env.FRONTEND_URL      || 'https://stepsmart.net';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  };
}

function res(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

async function createSupabaseSignedUrl(item) {
  if (!item.storagePath || item.storageProvider !== 'supabase') {
    return item.driveUrl || null;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = item.storageBucket || process.env.SUPABASE_STORAGE_BUCKET;
  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    console.error('Supabase signing is not configured for assignment:', item.storagePath);
    return item.driveUrl || null;
  }

  const signedUrlRes = await fetch(
    `${supabaseUrl}/storage/v1/object/sign/${bucket}/${item.storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': 'application/json',
      },
      // 10 years — effectively no expiry; students can always revisit old submissions.
      body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 365 * 10 }),
    },
  );

  const signedUrlBody = await signedUrlRes.json();
  const signedUrl = signedUrlBody.signedUrl ?? signedUrlBody.signedURL;
  if (!signedUrlRes.ok || !signedUrl) {
    console.error('Supabase signed URL error:', signedUrlBody);
    return item.driveUrl || null;
  }

  return signedUrl;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  const courseId = event.pathParameters?.courseId || event.pathParameters?.courseID;
  const weekId   = event.pathParameters?.weekId   || event.pathParameters?.weekID;
  if (!courseId || !weekId) return res(400, { message: 'Missing courseId or weekId' });

  try {
    const result = await ddb.send(new QueryCommand({
      TableName:                 ASSIGNMENTS_TABLE,
      KeyConditionExpression:    'pk = :pk AND begins_with(sk, :userPrefix)',
      ExpressionAttributeValues: {
        ':pk':         `COURSE#${courseId}#WEEK#${weekId}`,
        ':userPrefix': `USER#${userId}#`,
      },
      ScanIndexForward: false, // newest first
    }));

    const assignments = await Promise.all((result.Items || []).map(async (item) => ({
      assignmentId: item.assignmentId || null,
      assignmentTitle: item.assignmentTitle || null,
      fileName: item.fileName,
      driveUrl: await createSupabaseSignedUrl(item),
      driveFileId: item.driveFileId,
      storageProvider: item.storageProvider || null,
      storageBucket: item.storageBucket || null,
      storagePath: item.storagePath || null,
      uploadedAt: item.uploadedAt,
    })));

    return res(200, { assignments });
  } catch (err) {
    console.error('getStudentAssignments error:', err);
    return res(500, { message: 'Failed to load assignments.' });
  }
};
