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
  GetCommand,
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

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});
const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'eu-north-1' });

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const USER_POOL_ID = process.env.USER_POOL_ID || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stepsmart.net';
const SUPPLEMENTAL_SK = 'SUPPLEMENTAL#GLOBAL';

function deriveUserPoolId(event) {
  if (process.env.USER_POOL_ID) return process.env.USER_POOL_ID;
  const issuer = event?.requestContext?.authorizer?.claims?.iss;
  return issuer ? issuer.split('/').pop() : '';
}

let currentOrigin = FRONTEND_URL;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': currentOrigin,
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

async function signRecordedSessions(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return sessions;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    console.warn('Supabase storage credentials not fully configured for signing.');
    return sessions;
  }

  const signedSessions = [];
  for (const session of sessions) {
    if (session.storageProvider === 'supabase' && session.storagePath) {
      try {
        const signedUrlRes = await fetch(
          `${supabaseUrl}/storage/v1/object/sign/${bucket}/${session.storagePath}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${serviceRoleKey}`,
              apikey: serviceRoleKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expiresIn: 60 * 60 * 8 }),
          }
        );
        if (signedUrlRes.ok) {
          const resBody = await signedUrlRes.json();
          const rawSigned = resBody.signedUrl || resBody.signedURL || '';
          const fullSignedUrl = rawSigned.startsWith('http')
            ? rawSigned
            : `${supabaseUrl}/storage/v1${rawSigned}`;
          signedSessions.push({
            ...session,
            url: fullSignedUrl,
          });
          continue;
        } else {
          console.error(`Supabase returned status ${signedUrlRes.status} for signing path ${session.storagePath}`);
        }
      } catch (err) {
        console.error('Error generating signed URL for session path:', session.storagePath, err);
      }
    }
    signedSessions.push(session);
  }
  return signedSessions;
}

async function getSupplementalContent(courseId) {
  const result = await ddb.send(new GetCommand({
    TableName: COURSES_TABLE,
    Key: { pk: `COURSE#${courseId}`, sk: SUPPLEMENTAL_SK },
  }));

  const item = result.Item || {};
  const rawSessions = Array.isArray(item.liveRecordedSessions) ? item.liveRecordedSessions : [];
  const signedSessions = await signRecordedSessions(rawSessions);

  return {
    assignments: Array.isArray(item.assignments) ? item.assignments : [],
    liveRecordedSessions: signedSessions,
    calendarEvents: Array.isArray(item.calendarEvents) ? item.calendarEvents : [],
    reminders: Array.isArray(item.reminders) ? item.reminders : [],
    updatedAt: item.updatedAt || null,
    createdAt: item.createdAt || null,
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
// Lists all Cognito users enrolled in the given courseId and flattens their attributes.
async function listStudents(courseId, event) {
  if (!courseId) {
    return res(400, { message: 'courseId query parameter is required' });
  }

  // 1. Get all enrollments for this course
  let enrollmentsResult;
  try {
    enrollmentsResult = await ddb.send(new ScanCommand({
      TableName: ENROLLMENTS_TABLE,
      FilterExpression: 'courseId = :cid',
      ExpressionAttributeValues: { ':cid': courseId }
    }));
  } catch (err) {
    console.error('Failed to fetch enrollments:', err);
    return res(500, { message: 'Failed to load enrolled roster' });
  }
  const enrolledUserIds = new Set((enrollmentsResult.Items || []).map(item => item.enrollmentId));

  // 2. Get all Cognito users
  const userPoolId = deriveUserPoolId(event);
  let result;
  try {
    result = await cognito.send(new ListUsersCommand({ UserPoolId: userPoolId }));
  } catch (err) {
    console.error('Failed to list Cognito users:', err);
    return res(500, { message: 'Failed to fetch Cognito users' });
  }

  // 3. Filter users to only enrolled ones
  const students = (result.Users || [])
    .filter(u => {
      const attrs = {};
      for (const a of u.Attributes || []) attrs[a.Name] = a.Value;
      return enrolledUserIds.has(u.Username) || enrolledUserIds.has(attrs.sub);
    })
    .map((u) => {
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
// The student must reset their password on first login. Also enrolls them in the specified courseId.
async function createStudent(body, event) {
  const { email, name, tempPassword, courseId } = body;
  if (!email || !name || !tempPassword || !courseId) {
    return res(400, { message: 'email, name, tempPassword, and courseId are required' });
  }

  const userPoolId = deriveUserPoolId(event);
  let createRes;
  try {
    createRes = await cognito.send(new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      TemporaryPassword: tempPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: name },
      ],
      MessageAction: 'SUPPRESS',
    }));
  } catch (err) {
    console.error('Failed to create student in Cognito:', err);
    return res(500, { message: err.message || 'Failed to create student.' });
  }

  const userId = createRes.User.Attributes.find(a => a.Name === 'sub')?.Value || createRes.User.Username;

  try {
    await ddb.send(new PutCommand({
      TableName: ENROLLMENTS_TABLE,
      Item: {
        enrollmentId: userId,
        userId,
        courseId,
        enrolledAt: new Date().toISOString()
      }
    }));
  } catch (err) {
    console.error('Failed to write student enrollment row:', err);
    return res(500, { message: 'Student created but enrollment mapping failed.' });
  }

  return res(201, { message: `Student ${email} created successfully and enrolled in ${courseId}` });
}

// GET /admin/courses/{courseId}/weeks
// Returns all weeks (including hidden ones) with full quiz data including correctIndex.
async function listWeeks(courseId) {
  const [result, supplementalContent] = await Promise.all([
    ddb.send(new QueryCommand({
      TableName: COURSES_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `COURSE#${courseId}`,
        ':prefix': 'WEEK#',
      },
    })),
    getSupplementalContent(courseId),
  ]);

  const weeks = (result.Items || [])
    .filter((item) => item.weekId !== '__supplemental__')
    .sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
  return res(200, { weeks, supplementalContent });
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
    category: body.category || 'module',
    weekNumber: body.weekNumber || 1,
    title: body.title || 'Untitled Week',
    description: body.description || '',
    youtubeUrl: body.youtubeUrl || null,
    qaLink: body.qaLink || null,
    visible: false,  // always starts hidden — admin must explicitly release
    quiz: body.quiz || { questions: [] },
    resources: body.resources || [],
    docs: body.docs || [],
    liveRecordedSessions: body.liveRecordedSessions || [],
    calendarEvents: body.calendarEvents || [],
    assignments: body.assignments || [],
    transcript: body.transcript || null,
    createdAt: new Date().toISOString(),
  };

  await ddb.send(new PutCommand({ TableName: COURSES_TABLE, Item: item }));
  return res(201, { week: item });
}

// PATCH /admin/courses/{courseId}/weeks/{weekId}
// Updates any subset of week fields. Commonly used to toggle visibility.
async function updateWeek(courseId, weekId, body) {
  console.log('DEPLOY_CHECK_V2: updateWeek called with weekId =', weekId);
  // Guard: if this is actually a supplemental content update, redirect to the correct handler.
  // This ensures data is always saved to SUPPLEMENTAL#GLOBAL (not WEEK#__supplemental__).
  if (weekId === '__supplemental__') {
    console.log('DEPLOY_CHECK_V2: Redirecting to updateSupplementalContent');
    return await updateSupplementalContent(courseId, body);
  }

  // Build a dynamic UpdateExpression from whatever fields were provided.
  const fields = [
    'title', 'description', 'youtubeUrl', 'qaLink', 'visible', 'weekNumber',
    'category', 'quiz', 'resources', 'docs', 'assignments', 'liveRecordedSessions',
    'calendarEvents', 'transcript'
  ];
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

  return res(200, { message: 'Week updated V3', weekId });
}

async function updateSupplementalContent(courseId, body) {
  if (body && body.action === 'getUploadUrl') {
    const { fileName, mimeType } = body;
    if (!fileName) {
      return res(400, { message: 'fileName is required for getUploadUrl action' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;

    if (!supabaseUrl || !serviceRoleKey || !bucket) {
      return res(500, { message: 'Supabase credentials not configured on backend' });
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `global-sessions/${Date.now()}-${safeFileName}`;

    try {
      const uploadSignRes = await fetch(
        `${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${storagePath}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (uploadSignRes.ok) {
        const signBody = await uploadSignRes.json();
        const rawUrl = signBody.url || signBody.signedUrl || signBody.signedURL || '';
        const fullUrl = rawUrl.startsWith('http')
          ? rawUrl
          : `${supabaseUrl}/storage/v1${rawUrl}`;

        return res(200, {
          signedUrl: fullUrl,
          storagePath,
          storageProvider: 'supabase',
        });
      } else {
        const errorText = await uploadSignRes.text();
        console.error('Supabase signed upload URL fetch error:', errorText);
        return res(500, { message: `Supabase upload signing failed: ${errorText}` });
      }
    } catch (err) {
      console.error('Error fetching signed upload URL from Supabase:', err);
      return res(500, { message: err.message || 'Internal server error' });
    }
  }

  const hasSupportedField = ['assignments', 'liveRecordedSessions', 'calendarEvents', 'reminders']
    .some((field) => body[field] !== undefined);
  if (!hasSupportedField) {
    return res(400, { message: 'No supplemental fields provided' });
  }

  const existing = await getSupplementalContent(courseId);
  const now = new Date().toISOString();

  const nextContent = {
    assignments: body.assignments !== undefined ? body.assignments : existing.assignments,
    liveRecordedSessions: body.liveRecordedSessions !== undefined ? body.liveRecordedSessions : existing.liveRecordedSessions,
    calendarEvents: body.calendarEvents !== undefined ? body.calendarEvents : existing.calendarEvents,
    reminders: body.reminders !== undefined ? body.reminders : existing.reminders,
  };

  await ddb.send(new PutCommand({
    TableName: COURSES_TABLE,
    Item: {
      pk: `COURSE#${courseId}`,
      sk: SUPPLEMENTAL_SK,
      courseId,
      ...nextContent,
      createdAt: existing.createdAt || now,
      updatedAt: now,
    },
  }));

  return res(200, { message: 'Supplemental content updated', version: 'V2', supplementalContent: nextContent });
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

// GET /admin/courses/{courseId}/submissions
async function getSubmissions(courseId) {
  const result = await ddb.send(new ScanCommand({
    TableName: process.env.ASSIGNMENTS_TABLE || process.env.ASSIGNMENT_TABLE || 'lms-assignments',
    FilterExpression: 'courseId = :cid',
    ExpressionAttributeValues: { ':cid': courseId },
  }));

  const submissions = result.Items || [];

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (supabaseUrl && serviceRoleKey && bucket) {
    for (const sub of submissions) {
      if (sub.storageProvider === 'supabase' && sub.storagePath) {
        try {
          const signedUrlRes = await fetch(
            `${supabaseUrl}/storage/v1/object/sign/${bucket}/${sub.storagePath}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${serviceRoleKey}`,
                apikey: serviceRoleKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ expiresIn: 60 * 60 * 8 }),
            }
          );
          if (signedUrlRes.ok) {
            const body = await signedUrlRes.json();
            const rawSigned = body.signedUrl || body.signedURL || '';
            sub.driveUrl = rawSigned.startsWith('http') ? rawSigned : `${supabaseUrl}/storage/v1${rawSigned}`;
          }
        } catch (err) {
          console.error('Error generating signed URL for', sub.storagePath, err);
        }
      }
    }
  }

  submissions.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return res(200, { submissions });
}

// GET /admin/leads
// Returns all leads/enrollments from the landing page form.
async function listLeads() {
  const result = await ddb.send(new ScanCommand({
    TableName: ENROLLMENTS_TABLE,
  }));

  const leads = (result.Items || [])
    .filter(item => item.masterclassId) // Exclude student enrollments!
    .sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

  return res(200, { leads });
}

// ── Main handler ──────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  currentOrigin = event?.headers?.origin || event?.headers?.Origin || FRONTEND_URL;
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  // Layer 2 admin check — even if React's AdminRoute is bypassed, this rejects non-admins.
  if (!isAdminUser(event)) {
    return res(403, { message: 'Forbidden: admin access required' });
  }

  const method = event.httpMethod;
  const resource = (event.resource || '')
    .replace('{courseID}', '{courseId}')
    .replace('{weekID}', '{weekId}');
  const params = event.pathParameters || {};
  const courseId = params.courseId || params.courseID || event.queryStringParameters?.courseId;
  const weekId = params.weekId || params.weekID;

  let body = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {
    return res(400, { message: 'Invalid JSON body' });
  }

  try {
    // ── Students ──────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/students') return await listStudents(courseId, event);
    if (method === 'POST' && resource === '/admin/students') return await createStudent(body, event);

    // ── Weeks ─────────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/courses/{courseId}/weeks') return await listWeeks(courseId);
    if (method === 'POST' && resource === '/admin/courses/{courseId}/weeks') return await createWeek(courseId, body);
    if (method === 'PATCH' && resource === '/admin/courses/{courseId}/weeks/{weekId}' && weekId === '__supplemental__') {
      return await updateSupplementalContent(courseId, body);
    }
    if (method === 'PATCH' && resource === '/admin/courses/{courseId}/weeks/{weekId}') return await updateWeek(courseId, weekId, body);
    if (method === 'DELETE' && resource === '/admin/courses/{courseId}/weeks/{weekId}') return await deleteWeek(courseId, weekId);

    // ── Progress ──────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/courses/{courseId}/progress') return await getCourseProgress(courseId);

    // ── Assignments ──────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/courses/{courseId}/submissions') return await getSubmissions(courseId);

    // ── Leads ─────────────────────────────────────────────────────────
    if (method === 'GET' && resource === '/admin/leads') return await listLeads();

    return res(404, { message: `No handler for ${method} ${resource}` });
  } catch (err) {
    console.error(`Admin handler error [${method} ${resource}]:`, err);
    return res(500, { message: err.message || 'Internal server error' });
  }
};
