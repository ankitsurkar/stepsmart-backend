// DEPRECATED: This lambda has been consolidated into backend/studentHandler.js.
// Please make any future edits there to avoid modifying dead code.
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
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const FRONTEND_URL  = process.env.FRONTEND_URL  || 'https://stepsmart.net';
const COURSE_NAME_OVERRIDES = {
  'course-001': 'PM -X Accelerator',
};

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

  // 1. Determine if the user is an admin
  const groupsClaim = event?.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  const isAdmin = groups.includes('admins');

  if (isAdmin) {
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
      name:        item.name || COURSE_NAME_OVERRIDES[item.courseId] || item.courseId,
      description: item.description || '',
    }));

    return res(200, { courses });
  }

  // 2. Regular students only see their enrolled course
  let enrollment;
  try {
    const result = await ddb.send(new GetCommand({
      TableName: ENROLLMENTS_TABLE,
      Key: { enrollmentId: userId },
    }));
    enrollment = result.Item;
  } catch (err) {
    console.error('Failed to fetch user enrollment:', err);
    return res(500, { message: 'Failed to load enrollment' });
  }

  if (!enrollment || !enrollment.courseId) {
    return res(200, { courses: [] });
  }

  const enrolledCourseId = enrollment.courseId;
  let courseMeta;
  try {
    const result = await ddb.send(new GetCommand({
      TableName: COURSES_TABLE,
      Key: { pk: `COURSE#${enrolledCourseId}`, sk: 'METADATA' },
    }));
    courseMeta = result.Item;
  } catch (err) {
    console.error('Failed to fetch course metadata:', err);
    return res(500, { message: 'Failed to load course' });
  }

  if (!courseMeta) {
    return res(200, { courses: [] });
  }

  const courses = [{
    courseId:    courseMeta.courseId,
    name:        courseMeta.name || COURSE_NAME_OVERRIDES[courseMeta.courseId] || courseMeta.courseId,
    description: courseMeta.description || '',
  }];

  return res(200, { courses });
};
