// Lambda: lms-getProgress
// Trigger: GET /progress/{courseId}
// Auth:    Cognito Authorizer (JWT required)
//
// Returns all week-level progress records for the authenticated student in one course.
// The frontend uses this on dashboard load and on LearnPage mount to hydrate local state.
//
// Path parameter: courseId
// Returns: { progress: [ { weekId, videoComplete, watchedSegments, quizPassed, ... } ] }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  const courseId = event.pathParameters?.courseId;
  if (!courseId) return res(400, { message: 'Missing courseId path parameter' });

  // Query all progress items for this student in this course.
  // pk = "USER#<userId>"  AND  sk begins_with "PROGRESS#<courseId>#"
  let items;
  try {
    const result = await ddb.send(new QueryCommand({
      TableName: PROGRESS_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk':     `USER#${userId}`,
        ':prefix': `PROGRESS#${courseId}#`,
      },
    }));
    items = result.Items || [];
  } catch (err) {
    console.error('DynamoDB QueryCommand error:', err);
    return res(500, { message: 'Failed to fetch progress' });
  }

  // DynamoDB Number Sets come back as native JS Set objects.
  // Convert to arrays so they serialise cleanly as JSON for the frontend.
  const progress = items.map((item) => ({
    weekId:           item.weekId,
    courseId:         item.courseId,
    videoComplete:    item.videoComplete    || false,
    videoCompletedAt: item.videoCompletedAt || null,
    watchedSegments:  item.watchedSegments  ? [...item.watchedSegments] : [],
    duration:         item.duration         || 0,
    quizPassed:       item.quizPassed       || false,
    quizScore:        item.quizScore        ?? null,
    quizTotal:        item.quizTotal        ?? null,
    quizAttempts:     item.quizAttempts     || 0,
    lastSeen:         item.lastSeen         || null,
  }));

  return res(200, { progress });
};
