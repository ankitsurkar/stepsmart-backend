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

    const assignments = (result.Items || []).map((item) => ({
      fileName:    item.fileName,
      driveUrl:    item.driveUrl,
      driveFileId: item.driveFileId,
      uploadedAt:  item.uploadedAt,
    }));

    return res(200, { assignments });
  } catch (err) {
    console.error('getStudentAssignments error:', err);
    return res(500, { message: 'Failed to load assignments.' });
  }
};
