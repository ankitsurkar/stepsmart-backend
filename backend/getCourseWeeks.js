// Lambda: lms-getCourseWeeks
// Trigger: GET /courses/{courseId}/weeks
// Auth:    Cognito Authorizer (JWT required)
//
// Returns visible weeks for a course.
// Critical security transform: correctIndex is stripped from quiz questions before the
// response leaves this function. Students never receive the answer key.
// Admins (cognito:groups includes 'admins') receive correctIndex for review purposes.
//
// Path parameter: courseId
// Returns: { weeks: [ { weekId, weekNumber, title, description, youtubeUrl, qaLink, assignments, liveRecordedSessions, calendarEvents, quiz: { questions } } ] }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stepsmart.net';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FRONTEND_URL,
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

  // Determine if the caller is an admin so we can conditionally include correctIndex.
  const groupsClaim = event.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  const isAdmin = groups.includes('admins');

  // Query all WEEK# items for this course in one request.
  let items;
  try {
    const result = await ddb.send(new QueryCommand({
      TableName: COURSES_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `COURSE#${courseId}`,
        ':prefix': 'WEEK#',
      },
    }));
    items = result.Items || [];
  } catch (err) {
    console.error('DynamoDB QueryCommand error:', err);
    return res(500, { message: 'Failed to load course weeks' });
  }

  // Filter to visible weeks only (unless admin), sort by weekNumber.
  const filtered = items
    .filter((w) => isAdmin || w.visible === true)
    .sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));

  const weeks = filtered.map((w) => ({
    weekId: w.weekId,
    courseId: w.courseId || courseId,
    weekNumber: w.weekNumber,
    title: w.title,
    description: w.description,
    youtubeUrl: w.youtubeUrl || null,
    qaLink: w.qaLink || null,
    visible: w.visible || false,
    resources: w.resources || [],
    docs: w.docs || [],
    assignments: w.assignments || [],
    liveRecordedSessions: w.liveRecordedSessions || [],
    calendarEvents: w.calendarEvents || [],
    createdAt: w.createdAt || null,
    quiz: {
      questions: (w.quiz?.questions || []).map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        explanation: q.explanation,
        // SECURITY: correctIndex is only included for admins.
        // For students this field is absent — it cannot be reverse-engineered from the response.
        ...(isAdmin ? { correctIndex: q.correctIndex } : {}),
      })),
    },
  }));

  return res(200, { weeks });
};
