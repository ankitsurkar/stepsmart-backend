// Lambda: lms-admin
// Trigger: ALL /admin/*
// Auth:    Cognito Authorizer (JWT required) + admin group check (Layer 2 security)
//
// One Lambda handles all admin routes. This keeps admin logic co-located and minimises
// cold-start surface area.
//
// Admin group check is performed in the Lambda (not only in the React UI).
// A non-admin JWT cannot contain 'admins' in cognito:groups because Cognito signs the token.
// Even if someone bypasses the React AdminRoute guard, this Lambda returns 403.
//
// Routes handled:
//   GET    /admin/students                               → list all Cognito users
//   POST   /admin/students                               → create student in Cognito
//   GET    /admin/courses/{courseId}/weeks               → all weeks (including hidden)
//   POST   /admin/courses/{courseId}/weeks               → create week
//   PATCH  /admin/courses/{courseId}/weeks/{weekId}      → update week (visibility, content)
//   DELETE /admin/courses/{courseId}/weeks/{weekId}      → delete week
//   GET    /admin/courses/{courseId}/progress            → all student progress for a course

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');

const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const { randomUUID } = require('crypto');

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const USER_POOL_ID = process.env.USER_POOL_ID || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stepsmart.net';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  };
}

function res(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

// ── Auth guard ────────────────────────────────────────────────────────────────

function isAdminUser(event) {
  const groupsClaim = event.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  return groups.includes('admins');
}

// ── Route handlers ────────────────────────────────────────────────────────────

// GET /admin/students
// Lists all Cognito users and flattens their attributes for easy consumption.
async function listStudents() {
  const result = await cognito.send(new ListUsersCommand({ UserPoolId: USER_POOL_ID }));
  const students = (result.Users || []).map((u) => {
    const attrs = {};
    for (const a of u.Attributes || []) attrs[a.Name] = a.Value;
    return {
      Username: u.Username,
      UserStatus: u.UserStatus,
      UserCreateDate: u.UserCreateDate,
      email: attrs.email || '',
      name: attrs.name || '',
    };
  });
  return res(200, { students });
}

// POST /admin/students
// Creates a student in Cognito with a temporary password (FORCE_CHANGE_PASSWORD).
// The student must reset their password on first login.
async function createStudent(body) {
  const { email, name, tempPassword } = body;
  if (!email || !name || !tempPassword) {
    return res(400, { message: 'email, name, and tempPassword are required' });
  }

  await cognito.send(new AdminCreateUserCommand({
    UserPoolId: USER_POOL_ID,
    Username: email,
    TemporaryPassword: tempPassword,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'name', Value: name },
    ],
    MessageAction: 'SUPPRESS',  // Do not send Cognito's default email; use your own onboarding flow
  }));

  return res(201, { message: `Student ${email} created successfully` });
}

// GET /admin/courses/{courseId}/weeks
// Returns all weeks (including hidden ones) with full quiz data including correctIndex.
async function listWeeks(courseId) {
  const result = await ddb.send(new QueryCommand({
    TableName: COURSES_TABLE,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: {
      ':pk': `COURSE#${courseId}`,
      ':prefix': 'WEEK#',
    },
  }));
  const weeks = (result.Items || []).sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
  return res(200, { weeks });
}

// POST /admin/courses/{courseId}/weeks
// Creates a new week. Generates a weekId if one is not provided.
async function createWeek(courseId, body) {
  const weekId = `week-${randomUUID().slice(0, 8)}`;
  const item = {
    pk: `COURSE#${courseId}`,
    sk: `WEEK#${weekId}`,
    weekId,
    courseId,
    weekNumber: body.weekNumber || 1,
    title: body.title || 'Untitled Week',
    description: body.description || '',
    youtubeUrl: body.youtubeUrl || null,
    qaLink: body.qaLink || null,
    visible: false,  // always starts hidden — admin must explicitly release
    quiz: body.quiz || { questions: [] },
    resources: body.resources || [],
    docs: body.docs || [],
    createdAt: new Date().toISOString(),
  };

  await ddb.send(new PutCommand({ TableName: COURSES_TABLE, Item: item }));
  return res(201, { week: item });
}

// PATCH /admin/courses/{courseId}/weeks/{weekId}
// Updates any subset of week fields. Commonly used to toggle visibility.
async function updateWeek(courseId, weekId, body) {
  // Build a dynamic UpdateExpression from whatever fields were provided.
  const fields = ['title', 'description', 'youtubeUrl', 'qaLink', 'visible', 'weekNumber', 'quiz', 'resources', 'docs'];
  const setClauses = [];
  const exprAttrValues = {};
  const exprAttrNames = {};

  for (const field of fields) {
    if (body[field] !== undefined) {
      // 'visible' and 'quiz' are not reserved words in DynamoDB, but 'description' might be in some contexts.
      // Use attribute name aliasing for safety on all fields.
      const alias = `#f_${field}`;
      const valAlias = `:v_${field}`;
      setClauses.push(`${alias} = ${valAlias}`);
      exprAttrNames[alias] = field;
      exprAttrValues[valAlias] = body[field];
    }
  }

  if (setClauses.length === 0) return res(400, { message: 'No updatable fields provided' });

  exprAttrNames['#updAt'] = 'updatedAt';
  exprAttrValues[':updAt'] = new Date().toISOString();
  setClauses.push('#updAt = :updAt');

  await ddb.send(new UpdateCommand({
    TableName: COURSES_TABLE,
    Key: { pk: `COURSE#${courseId}`, sk: `WEEK#${weekId}` },
    UpdateExpression: `SET ${setClauses.join(', ')}`,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues,
  }));

  return res(200, { message: 'Week updated', weekId });
}

// DELETE /admin/courses/{courseId}/weeks/{weekId}
async function deleteWeek(courseId, weekId) {
  await ddb.send(new DeleteCommand({
    TableName: COURSES_TABLE,
    Key: { pk: `COURSE#${courseId}`, sk: `WEEK#${weekId}` },
  }));
  return res(200, { message: 'Week deleted', weekId });
}

// GET /admin/courses/{courseId}/progress
// Scans all progress records for a course across all students.
// At 20 students × ~10 weeks = 200 items, a Scan is fine.
// At larger scale, add a GSI on (courseId, weekId).
async function getCourseProgress(courseId) {
  const result = await ddb.send(new ScanCommand({
    TableName: PROGRESS_TABLE,
    FilterExpression: 'courseId = :cid',
    ExpressionAttributeValues: { ':cid': courseId },
  }));

  const progress = (result.Items || []).map((item) => ({
    userId: item.userId,
    weekId: item.weekId,
    videoComplete: item.videoComplete || false,
    watchedSegments: item.watchedSegments ? [...item.watchedSegments] : [],
    quizPassed: item.quizPassed || false,
    quizScore: item.quizScore ?? null,
    quizTotal: item.quizTotal ?? null,
    quizAttempts: item.quizAttempts || 0,
    lastSeen: item.lastSeen || null,
  }));

  return res(200, { progress });
}

// ── Main handler ──────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  // Layer 2 admin check — even if React's AdminRoute is bypassed, this rejects non-admins.
  if (!isAdminUser(event)) {
    return res(403, { message: 'Forbidden: admin access required' });
  }

  const method = event.httpMethod;
  const resource = event.resource;  // API Gateway route template, e.g. '/admin/courses/{courseId}/weeks/{weekId}'
  const params = event.pathParameters || {};
  const courseId = params.courseId;
  const weekId = params.weekId;

  let body = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {
    return res(400, { message: 'Invalid JSON body' });
  }

  try {
    // ── Students ──────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/students') return await listStudents();
    if (method === 'POST' && resource === '/admin/students') return await createStudent(body);

    // ── Weeks ─────────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/courses/{courseId}/weeks') return await listWeeks(courseId);
    if (method === 'POST' && resource === '/admin/courses/{courseId}/weeks') return await createWeek(courseId, body);
    if (method === 'PATCH' && resource === '/admin/courses/{courseId}/weeks/{weekId}') return await updateWeek(courseId, weekId, body);
    if (method === 'DELETE' && resource === '/admin/courses/{courseId}/weeks/{weekId}') return await deleteWeek(courseId, weekId);

    // ── Progress ──────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/courses/{courseId}/progress') return await getCourseProgress(courseId);

    return res(404, { message: `No handler for ${method} ${resource}` });
  } catch (err) {
    console.error(`Admin handler error [${method} ${resource}]:`, err);
    return res(500, { message: err.message || 'Internal server error' });
  }
};
