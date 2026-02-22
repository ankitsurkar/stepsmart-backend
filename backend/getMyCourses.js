// Lambda: lms-getMyCourses
// Trigger: GET /courses/my
// Auth:    Cognito Authorizer (JWT required)
//
// Returns the list of courses the authenticated student is enrolled in.
// For this implementation, all users see all courses (no per-user enrollment table).
// Extend this Lambda if you add enrollment logic.
//
// Returns: { courses: [ { courseId, name, description } ] }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const FRONTEND_URL  = process.env.FRONTEND_URL  || 'https://stepsmart.net';

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

  // Fetch all METADATA items (one per course) from the courses table.
  // For a small number of courses a Scan with a filter is fine.
  // With many courses you'd add a GSI on 'type = METADATA'.
  let items;
  try {
    const result = await ddb.send(new ScanCommand({
      TableName: COURSES_TABLE,
      FilterExpression: 'sk = :meta',
      ExpressionAttributeValues: { ':meta': 'METADATA' },
    }));
    items = result.Items || [];
  } catch (err) {
    console.error('DynamoDB ScanCommand error:', err);
    return res(500, { message: 'Failed to load courses' });
  }

  const courses = items.map((item) => ({
    courseId:    item.courseId,
    name:        item.name,
    description: item.description || '',
  }));

  return res(200, { courses });
};
