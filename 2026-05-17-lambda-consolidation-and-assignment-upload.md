# Lambda Consolidation And Assignment Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the five student-facing Lambdas into one `lms-student` handler and replace the Apps Script -> Google Drive assignment upload path with direct private Supabase Storage uploads while keeping the existing frontend request contract intact.

**Architecture:** Add [`backend/studentHandler.js`](/Users/juhi/Desktop/stepsmart-backend/backend/studentHandler.js), modeled on [`backend/adminHandler.js`](/Users/juhi/Desktop/stepsmart-backend/backend/adminHandler.js), and move the logic from [`backend/getMyCourses.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getMyCourses.js), [`backend/getCourseWeeks.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getCourseWeeks.js), [`backend/getProgress.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getProgress.js), [`backend/heartbeat.js`](/Users/juhi/Desktop/stepsmart-backend/backend/heartbeat.js), and [`backend/submitQuiz.js`](/Users/juhi/Desktop/stepsmart-backend/backend/submitQuiz.js) behind one route switch. Keep [`backend/uploadAssignment.js`](/Users/juhi/Desktop/stepsmart-backend/backend/uploadAssignment.js) separate, but replace Apps Script with Supabase Storage and keep DynamoDB as the assignment metadata store.

**Tech Stack:** AWS Lambda Node 18, API Gateway proxy integration, Cognito authorizer claims, DynamoDB DocumentClient, native `fetch`, Supabase Storage REST, React, Axios

---

## Scope Notes

- `lms-admin` stays unchanged.
- Consolidate only the five named student handlers: `getMyCourses`, `getCourseWeeks`, `getProgress`, `heartbeat`, and `submitQuiz`.
- [`backend/getStudentAssignments.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getStudentAssignments.js) remains separate for now because the React app does not currently call it.
- Preserve `correctAnswers` in quiz responses during this migration because [`frontend/src/components/QuizComponent.js`](/Users/juhi/Desktop/stepsmart-backend/frontend/src/components/QuizComponent.js) currently reads it.
- There is no backend package manifest or infrastructure-as-code file in this repo, so Lambda creation, route rewiring, env vars, and Supabase bucket setup are external deployment steps.

## Required Review Fixes Included

- `weekId === "__supplemental__"` is valid for assignment uploads and Supabase object paths.
- `studentHandler.js` uses explicit `401` auth handling instead of throwing.
- [`frontend/src/components/AssignmentUpload.js`](/Users/juhi/Desktop/stepsmart-backend/frontend/src/components/AssignmentUpload.js) changes `Upload to Drive` to `Submit Assignment`.
- Supabase bucket is private; `storagePath` is canonical; signed URLs are temporary.
- Signed URL response handling uses `signedUrl`, with optional fallback to legacy `signedURL`, and does not prepend the Supabase base URL.
- Progress response matches real [`backend/getProgress.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getProgress.js): `duration: item.duration || 0` and `videoCompletedAt: item.videoCompletedAt || null`.
- Legacy student handler files must be deleted or clearly deprecated after smoke tests pass, so future edits land in `studentHandler.js`.
- Future `getStudentAssignments` route registration and fresh signed URL generation are tracked as known debt.

## File Map

**Create**
- [`backend/studentHandler.js`](/Users/juhi/Desktop/stepsmart-backend/backend/studentHandler.js) - unified student Lambda with shared CORS, auth, route normalization, JSON parsing, and route handlers

**Modify**
- [`backend/uploadAssignment.js`](/Users/juhi/Desktop/stepsmart-backend/backend/uploadAssignment.js) - remove Apps Script upload, upload to private Supabase Storage, store stable metadata in DynamoDB
- [`frontend/src/components/AssignmentUpload.js`](/Users/juhi/Desktop/stepsmart-backend/frontend/src/components/AssignmentUpload.js) - change upload button label to `Submit Assignment`
- [`TECHNICAL_DEEP_DIVE.md`](/Users/juhi/Desktop/stepsmart-backend/TECHNICAL_DEEP_DIVE.md) - update Lambda inventory, route table, and assignment upload architecture

**Repoint in AWS**
- `GET /courses/my`
- `GET /courses/{courseId}/weeks`
- `GET /progress/{courseId}`
- `POST /progress/heartbeat`
- `POST /quiz/submit`

---

### Task 1: Build The `lms-student` Router

**Files:**
- Create: [`backend/studentHandler.js`](/Users/juhi/Desktop/stepsmart-backend/backend/studentHandler.js)
- Read for parity: the five existing student handler files
- Test: deployed API Gateway routes after cutover

- [ ] **Step 1: Create the shared Lambda shell**

Use the same explicit style as `adminHandler.js`.

```js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});
const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'eu-north-1' });

const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || 'lms-assignments';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stepsmart.net';
const PASSING_PCT = 70;
const HEARTBEAT_INTERVAL = 10;
const COMPLETION_THRESHOLD = 0.9;
const SUPPLEMENTAL_SK = 'SUPPLEMENTAL#GLOBAL';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  };
}

function res(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

function normalizeResource(resource = '') {
  return resource
    .replace('{courseID}', '{courseId}')
    .replace('{weekID}', '{weekId}');
}
```

- [ ] **Step 2: Add the main route switch with explicit auth**

```js
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) return res(401, { message: 'Unauthorized' });

  const method = event.httpMethod;
  const resource = normalizeResource(event.resource || '');
  const params = event.pathParameters || {};
  const courseId = params.courseId || params.courseID;

  let body = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {
    return res(400, { message: 'Invalid JSON body' });
  }

  try {
    if (method === 'GET' && resource === '/courses/my') return await listMyCourses();
    if (method === 'GET' && resource === '/courses/{courseId}/weeks') return await listCourseWeeks(courseId, event);
    if (method === 'GET' && resource === '/progress/{courseId}') return await getProgressForCourse(courseId, userId, event);
    if (method === 'POST' && resource === '/progress/heartbeat') return await recordHeartbeat(userId, body);
    if (method === 'POST' && resource === '/quiz/submit') return await submitQuizAttempt(userId, body);
    return res(404, { message: `No handler for ${method} ${resource}` });
  } catch (err) {
    console.error(`Student handler error [${method} ${resource}]:`, err);
    return res(500, { message: err.message || 'Internal server error' });
  }
};
```

- [ ] **Step 3: Move `GET /courses/my` unchanged**

Move `COURSE_NAME_OVERRIDES` into `studentHandler.js`. After production smoke tests pass, delete or clearly deprecate `getMyCourses.js` so this constant has one active source of truth.

```js
const COURSE_NAME_OVERRIDES = {
  'course-001': 'PM -X Accelerator',
};

async function listMyCourses() {
  const result = await ddb.send(new ScanCommand({
    TableName: COURSES_TABLE,
    FilterExpression: 'sk = :meta',
    ExpressionAttributeValues: { ':meta': 'METADATA' },
  }));

  const courses = (result.Items || []).map((item) => ({
    courseId: item.courseId,
    name: COURSE_NAME_OVERRIDES[item.courseId] || item.name,
    description: item.description || '',
  }));

  return res(200, { courses });
}
```

- [ ] **Step 4: Move `GET /courses/{courseId}/weeks` unchanged**

Preserve supplemental content, admin visibility, the hidden-week supplemental exception, and answer stripping for non-admins.

- [ ] **Step 5: Move `GET /progress/{courseId}` with exact response-field parity**

The mapped progress fields must match `getProgress.js`, including `duration: item.duration || 0` and `videoCompletedAt`.

```js
async function getProgressForCourse(courseId, userId, event) {
  if (!courseId) return res(400, { message: 'Missing courseId path parameter' });

  const includeLeaderboard = event.queryStringParameters?.includeLeaderboard === 'true';
  const result = await ddb.send(new QueryCommand({
    TableName: PROGRESS_TABLE,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':prefix': `PROGRESS#${courseId}#`,
    },
  }));

  const progress = (result.Items || []).map((item) => ({
    weekId: item.weekId,
    courseId: item.courseId,
    videoComplete: item.videoComplete || false,
    videoCompletedAt: item.videoCompletedAt || null,
    watchedSegments: item.watchedSegments ? [...item.watchedSegments] : [],
    duration: item.duration || 0,
    quizPassed: item.quizPassed || false,
    quizScore: item.quizScore ?? null,
    quizTotal: item.quizTotal ?? null,
    quizAttempts: item.quizAttempts || 0,
    lastSeen: item.lastSeen || null,
  }));

  if (!includeLeaderboard) return res(200, { progress });
  return res(200, { progress, leaderboard: await buildLeaderboard(courseId, userId, event) });
}
```

- [ ] **Step 6: Move `POST /progress/heartbeat` unchanged**

Preserve 10-second segment math, atomic `ADD watchedSegments`, and the conditional first-time `videoComplete` update.

- [ ] **Step 7: Move `POST /quiz/submit` unchanged**

Preserve server-side grading, DynamoDB progress update, and the current `{ passed, score, total, pct, correctAnswers }` response shape.

- [ ] **Step 8: Manual parity smoke-test before switching traffic**

Verify:

```text
GET  /courses/my
GET  /courses/{courseId}/weeks
GET  /progress/{courseId}?includeLeaderboard=true
POST /progress/heartbeat
POST /quiz/submit
```

### Task 2: Repoint API Gateway To `lms-student`

**Files:**
- Modify externally: API Gateway route integrations and Lambda env vars
- Document in repo: [`TECHNICAL_DEEP_DIVE.md`](/Users/juhi/Desktop/stepsmart-backend/TECHNICAL_DEEP_DIVE.md)
- Test: deployed routes

- [ ] **Step 1: Configure `lms-student` environment**

```text
AWS_REGION
COURSES_TABLE
PROGRESS_TABLE
ASSIGNMENTS_TABLE
FRONTEND_URL
USER_POOL_ID
```

- [ ] **Step 2: Point the five student routes at `lms-student`**

Do not change paths, methods, or Cognito authorizers. Only change integration target.

- [ ] **Step 3: Keep legacy Lambdas deployed until smoke tests pass**

Keep these available for rollback:

```text
lms-getMyCourses
lms-getCourseWeeks
lms-getProgress
lms-heartbeat
lms-submitQuiz
```

### Task 3: Replace Apps Script Upload With Private Supabase Storage

**Files:**
- Modify: [`backend/uploadAssignment.js`](/Users/juhi/Desktop/stepsmart-backend/backend/uploadAssignment.js)
- Modify: [`frontend/src/components/AssignmentUpload.js`](/Users/juhi/Desktop/stepsmart-backend/frontend/src/components/AssignmentUpload.js)
- Read for parity: [`frontend/src/utils/api.js`](/Users/juhi/Desktop/stepsmart-backend/frontend/src/utils/api.js), [`backend/getStudentAssignments.js`](/Users/juhi/Desktop/stepsmart-backend/backend/getStudentAssignments.js)
- Test: upload endpoint, private Supabase object, DynamoDB record

- [ ] **Step 1: Add Supabase env vars and private bucket setup**

Remove the `GOOGLE_SCRIPT_URL` and `GOOGLE_SCRIPT_SECRET` dependency. Add:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
FRONTEND_URL
ASSIGNMENTS_TABLE
```

Create the Supabase bucket as private. Accept both real week IDs and `__supplemental__`.

```text
assignments/<courseId>/<weekId>/<userId>/<timestamp>-<sanitizedFileName>
assignments/course-001/__supplemental__/<userId>/<timestamp>-submission.pdf
```

- [ ] **Step 2: Keep the current frontend upload payload**

Continue reading:

```js
const { courseId, weekId, fileName, mimeType, fileBase64, assignmentId, assignmentTitle } = body;
```

Decode and validate:

```js
const fileBuffer = Buffer.from(fileBase64, 'base64');
if (fileBuffer.length > MAX_FILE_BYTES) {
  return res(400, { message: 'File exceeds the 7 MB size limit.' });
}
```

- [ ] **Step 3: Upload with Supabase Storage REST**

Use native Node 18 `fetch` unless the external Lambda packaging already includes `@supabase/supabase-js`.

```js
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET;

if (!supabaseUrl || !serviceRoleKey || !bucket) {
  return res(500, { message: 'Upload service not configured.' });
}

const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
const objectPath = `assignments/${courseId}/${weekId}/${userId}/${Date.now()}-${safeFileName}`;

const uploadRes = await fetch(
  `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': mimeType,
      'x-upsert': 'false',
    },
    body: fileBuffer,
  },
);

if (!uploadRes.ok) {
  const errorText = await uploadRes.text();
  console.error('Supabase upload error:', errorText);
  return res(500, { message: 'Upload failed. Please try again.' });
}
```

- [ ] **Step 4: Generate a signed URL with the correct Supabase response shape**

Store `storagePath` as canonical metadata. Supabase returns `signedUrl` as a full URL, so do not prepend `${supabaseUrl}/storage/v1`. Include `signedURL` only as a legacy fallback.

```js
const uploadedAt = new Date().toISOString();
const signedUrlRes = await fetch(
  `${supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: 60 * 60 * 24 }),
  },
);

const signedUrlBody = await signedUrlRes.json();
const signedUrl = signedUrlBody.signedUrl ?? signedUrlBody.signedURL;

if (!signedUrlRes.ok || !signedUrl) {
  console.error('Supabase signed URL error:', signedUrlBody);
  return res(500, { message: 'Upload completed, but file link generation failed.' });
}
```

- [ ] **Step 5: Store stable metadata and compatibility aliases**

```js
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
```

When `getStudentAssignments` is wired to the frontend, generate fresh signed URLs from `storagePath`; do not rely on the expired `driveUrl` persisted at upload time.

- [ ] **Step 6: Align CORS with the rest of the backend**

Use `FRONTEND_URL`, not `*`.

- [ ] **Step 7: Update the frontend button label**

```jsx
<button style={uploadButtonStyle} onClick={handleUpload}>
  Submit Assignment
</button>
```

- [ ] **Step 8: Upload smoke-test**

Verify regular week uploads and `weekId: "__supplemental__"` uploads both succeed.

### Task 4: Clean Up Docs And Known Debt

**Files:**
- Modify: [`TECHNICAL_DEEP_DIVE.md`](/Users/juhi/Desktop/stepsmart-backend/TECHNICAL_DEEP_DIVE.md)
- Later cleanup: the five legacy student handler files

- [ ] **Step 1: Update the Lambda inventory and route table**

Document:

```text
lms-admin             -> all /admin/* routes
lms-student           -> GET /courses/my
lms-student           -> GET /courses/{courseId}/weeks
lms-student           -> GET /progress/{courseId}
lms-student           -> POST /progress/heartbeat
lms-student           -> POST /quiz/submit
lms-uploadAssignment  -> POST /assignments/upload
lms-getStudentAssignments -> GET /courses/{courseId}/weeks/{weekId}/assignments, if registered
```

After production smoke tests pass, delete or clearly deprecate:

```text
backend/getMyCourses.js
backend/getCourseWeeks.js
backend/getProgress.js
backend/heartbeat.js
backend/submitQuiz.js
```

If they remain in the repo, add a top-of-file deprecation comment pointing to `backend/studentHandler.js` so future edits do not land in dead Lambda code.

- [ ] **Step 2: Replace Google Apps Script upload docs with Supabase Storage**

Document:

```text
Browser -> API Gateway -> uploadAssignment Lambda -> private Supabase Storage
                                          -> DynamoDB metadata write
```

`storagePath` is canonical. Signed URLs are temporary.

- [ ] **Step 3: Capture follow-up work**

```text
Remove correctAnswers from quiz responses after updating QuizComponent.
Register GET /courses/{courseId}/weeks/{weekId}/assignments in API Gateway when the frontend starts using getStudentAssignments.
Generate fresh signed URLs in getStudentAssignments from storagePath once that route is live.
Decide whether getStudentAssignments should later fold into lms-student for a strict two-Lambda backend.
```

### Task 5: Deployment And Rollback Checklist

**Files:**
- No repo code required
- Test: production smoke checks

- [ ] **Step 1: Deploy `lms-student` without switching traffic**

- [ ] **Step 2: Deploy updated `uploadAssignment`**

- [ ] **Step 3: Switch the five student routes to `lms-student`**

- [ ] **Step 4: Verify all critical paths**

```text
Dashboard courses, weeks, progress, leaderboard
Learn page weeks and progress
Heartbeat persistence
Quiz submit and retry
Regular assignment upload
Supplemental assignment upload
```

- [ ] **Step 5: Retire or deprecate legacy handlers only after smoke tests pass**

Rollback stays simple until this step: point API Gateway integrations back to the legacy Lambdas.

## Self-Review

**Spec coverage**
- Five named student handlers consolidate into one `lms-student`.
- Admin remains unchanged.
- Upload path removes Apps Script and uses private Supabase Storage.
- Frontend upload payload remains unchanged; stale button label changes.

**Review coverage**
- Supabase signed URL response uses `signedUrl` and treats it as a full URL.
- Progress response matches `getProgress.js` for `duration` and `videoCompletedAt`.
- Legacy handler retirement/deprecation is explicit.
- `__supplemental__` assignment uploads and `getStudentAssignments` known debt are covered.

