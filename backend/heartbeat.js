// Lambda: lms-heartbeat
// Trigger: POST /progress/heartbeat
// Auth:    Cognito Authorizer (JWT required)
//
// Records one 10-second segment as watched for the authenticated student.
// Uses DynamoDB's ADD operation for atomic set union — safe under concurrent heartbeats
// from multiple devices or rapid retries.
//
// Body: { courseId, weekId, currentTime (int, seconds), duration (int, seconds) }
// Returns: { videoPct, videoComplete, segmentsWatched, totalSegments }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const HEARTBEAT_INTERVAL = 10;  // seconds per segment — must match the frontend constant
const COMPLETION_THRESHOLD = 0.9;  // 90 % of segments must be watched

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});

const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const FRONTEND_URL   = process.env.FRONTEND_URL   || 'https://stepsmart.net';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };
}

function res(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  // 1. Extract authenticated user identity injected by API Gateway after JWT verification.
  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  // 2. Parse request body (API Gateway proxy integration passes it as a raw string).
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return res(400, { message: 'Invalid JSON body' });
  }

  const { courseId, weekId, currentTime, duration } = body;
  if (!courseId || !weekId || currentTime === undefined || !duration) {
    return res(400, { message: 'Missing required fields: courseId, weekId, currentTime, duration' });
  }

  // 3. Compute which 10-second segment the student is currently in.
  //    Math.floor(47 / 10) = 4  → segment 4 covers seconds 40–49.
  const segment = Math.floor(currentTime / HEARTBEAT_INTERVAL);
  const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);

  const pk = `USER#${userId}`;
  const sk = `PROGRESS#${courseId}#${weekId}`;

  // 4. Atomically add the new segment to the DynamoDB Number Set.
  //    ADD on a Set merges rather than overwrites.
  //    ReturnValues: 'ALL_NEW' lets us read the post-write state without a separate GetItem.
  let result;
  try {
    result = await ddb.send(new UpdateCommand({
      TableName: PROGRESS_TABLE,
      Key: { pk, sk },
      UpdateExpression: `
        ADD watchedSegments :seg
        SET lastSeen  = :now,
            #dur      = :dur,
            userId    = :uid,
            courseId  = :cid,
            weekId    = :wid
      `,
      // 'duration' is a DynamoDB reserved word — use an expression attribute name.
      ExpressionAttributeNames: { '#dur': 'duration' },
      ExpressionAttributeValues: {
        ':seg': new Set([segment]),
        ':now': new Date().toISOString(),
        ':dur': duration,
        ':uid': userId,
        ':cid': courseId,
        ':wid': weekId,
      },
      ReturnValues: 'ALL_NEW',
    }));
  } catch (err) {
    console.error('DynamoDB UpdateCommand error:', err);
    return res(500, { message: 'Failed to record progress' });
  }

  const item = result.Attributes;
  const watchedCount = item.watchedSegments ? item.watchedSegments.size : 0;
  const videoPct = Math.min(Math.round((watchedCount / totalSegments) * 100), 100);
  const alreadyComplete = item.videoComplete || false;
  const nowComplete = videoPct >= COMPLETION_THRESHOLD * 100;

  // 5. If crossing the completion threshold for the first time, flip the flag.
  if (nowComplete && !alreadyComplete) {
    try {
      await ddb.send(new UpdateCommand({
        TableName: PROGRESS_TABLE,
        Key: { pk, sk },
        UpdateExpression: 'SET videoComplete = :t, videoCompletedAt = :now',
        ConditionExpression: 'attribute_not_exists(videoComplete) OR videoComplete = :f',
        ExpressionAttributeValues: {
          ':t':   true,
          ':f':   false,
          ':now': new Date().toISOString(),
        },
      }));
    } catch (condErr) {
      // ConditionalCheckFailedException means another concurrent request already flipped it.
      // That is fine — the flag is correct.
      if (condErr.name !== 'ConditionalCheckFailedException') {
        console.error('videoComplete update error:', condErr);
      }
    }
  }

  return res(200, {
    videoPct,
    videoComplete: nowComplete || alreadyComplete,
    segmentsWatched: watchedCount,
    totalSegments,
  });
};
