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
const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || process.env.ASSIGNMENT_TABLE || 'lms-assignments';
const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://stepsmart.net';
const PASSING_PCT = 70;
const HEARTBEAT_INTERVAL = 10;
const COMPLETION_THRESHOLD = 0.8;
const SUPPLEMENTAL_SK = 'SUPPLEMENTAL#GLOBAL';

let currentOrigin = FRONTEND_URL;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': currentOrigin,
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

const COURSE_NAME_OVERRIDES = {
  'course-001': 'PM -X Accelerator',
};

async function checkEnrollment(userId, courseId, event) {
  // 1. Admins bypass enrollment checks
  const groupsClaim = event?.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  if (groups.includes('admins')) return true;

  if (!courseId) return false;

  // 2. Fetch user's enrollment
  try {
    const result = await ddb.send(new GetCommand({
      TableName: ENROLLMENTS_TABLE,
      Key: { enrollmentId: userId },
    }));
    return result.Item && result.Item.courseId === courseId;
  } catch (err) {
    console.error('checkEnrollment error:', err);
    return false;
  }
}

async function listMyCourses(userId, event) {
  const groupsClaim = event?.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  const isAdmin = groups.includes('admins');

  if (isAdmin) {
    const result = await ddb.send(new ScanCommand({
      TableName: COURSES_TABLE,
      FilterExpression: 'sk = :meta',
      ExpressionAttributeValues: { ':meta': 'METADATA' },
    }));
    const courses = (result.Items || []).map((item) => ({
      courseId: item.courseId,
      name: item.name || COURSE_NAME_OVERRIDES[item.courseId] || item.courseId,
      description: item.description || '',
    }));
    return res(200, { courses });
  }

  // Regular students only see their enrolled course
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
    courseId: courseMeta.courseId,
    name: courseMeta.name || COURSE_NAME_OVERRIDES[courseMeta.courseId] || courseMeta.courseId,
    description: courseMeta.description || '',
  }];

  return res(200, { courses });
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
  try {
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
    };
  } catch (err) {
    console.error('DynamoDB GetCommand supplemental content error:', err);
    return {
      assignments: [],
      liveRecordedSessions: [],
      calendarEvents: [],
      reminders: [],
    };
  }
}

async function listCourseWeeks(courseId, event) {
  if (!courseId) return res(400, { message: 'Missing courseId path parameter' });

  const groupsClaim = event.requestContext?.authorizer?.claims?.['cognito:groups'];
  const groups = Array.isArray(groupsClaim)
    ? groupsClaim
    : typeof groupsClaim === 'string' ? groupsClaim.split(',') : [];
  const isAdmin = groups.includes('admins');

  let items;
  const supplementalContentPromise = getSupplementalContent(courseId);
  try {
    const result = await ddb.send(new QueryCommand({
      TableName: COURSES_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `COURSE#${courseId}`,
        ':prefix': 'WEEK#',
      },
    }));
    items = (result.Items || []).filter((item) => item.weekId !== '__supplemental__');
  } catch (err) {
    console.error('DynamoDB QueryCommand error:', err);
    return res(500, { message: 'Failed to load course weeks' });
  }

  const supplementalContent = await supplementalContentPromise;

  function hasSupplementalStudentContent(week) {
    return (week.assignments?.length || 0) > 0
      || (week.liveRecordedSessions?.length || 0) > 0
      || (week.calendarEvents?.length || 0) > 0;
  }

  const filtered = items
    .filter((w) => isAdmin || w.visible === true || hasSupplementalStudentContent(w))
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
    transcript: w.transcript || null,
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
        ...(isAdmin ? { correctIndex: q.correctIndex } : {}),
      })),
    },
  }));

  const modules = weeks.filter((w) => (w.category || 'module') === 'module');
  const liveWeeks = weeks.filter((w) => w.category === 'live');

  const supplementalWeek = {
    weekId: '__supplemental__',
    courseId: courseId,
    weekNumber: 'Supplemental',
    title: 'Supplemental Content',
    description: 'Course-wide supplemental assignments, recorded sessions, and calendar events.',
    visible: true,
    assignments: supplementalContent?.assignments || [],
    liveRecordedSessions: supplementalContent?.liveRecordedSessions || [],
    calendarEvents: supplementalContent?.calendarEvents || [],
    resources: [],
    docs: [],
    quiz: { questions: [] },
  };

  const allWeeks = [...weeks, supplementalWeek];

  return res(200, { weeks: allWeeks, modules, liveWeeks, supplementalContent });
}

function deriveUserPoolId(event) {
  if (process.env.USER_POOL_ID) return process.env.USER_POOL_ID;
  const issuer = event.requestContext?.authorizer?.claims?.iss;
  return issuer ? issuer.split('/').pop() : '';
}

function toIso(value) {
  if (!value) return null;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function laterDate(a, b) {
  if (!a) return b || null;
  if (!b) return a || null;
  return a > b ? a : b;
}

function makeDisplayName(profile, userId) {
  if (profile?.name) return profile.name;
  if (profile?.email) return profile.email;
  return `Student ${String(userId || '').slice(-6) || 'Unknown'}`;
}

function makeLeaderboardEntry(userId, profile, currentUserId) {
  return {
    userId,
    displayName: makeDisplayName(profile, userId),
    email: profile?.email || '',
    lecturePoints: 0,
    assignmentPoints: 0,
    completedLectures: 0,
    completedQuizzes: 0,
    assignmentsSubmitted: 0,
    score: 0,
    totalPoints: 0,
    lastActivity: null,
    isCurrentUser: userId === currentUserId,
  };
}

async function listUsersBySub(userPoolId) {
  if (!userPoolId) return new Map();

  const usersBySub = new Map();
  let paginationToken;

  do {
    const result = await cognito.send(new ListUsersCommand({
      UserPoolId: userPoolId,
      PaginationToken: paginationToken,
    }));

    for (const user of (result.Users || [])) {
      const attrs = {};
      for (const attr of (user.Attributes || [])) attrs[attr.Name] = attr.Value;
      if (!attrs.sub) continue;
      usersBySub.set(attrs.sub, {
        name: attrs.name || '',
        email: attrs.email || '',
      });
    }

    paginationToken = result.PaginationToken;
  } while (paginationToken);

  return usersBySub;
}

function getOrCreateEntry(entries, userId, profiles, currentUserId) {
  if (!entries.has(userId)) {
    entries.set(userId, makeLeaderboardEntry(userId, profiles.get(userId), currentUserId));
  }
  return entries.get(userId);
}

async function buildLeaderboard(courseId, currentUserId, event) {
  const userPoolId = deriveUserPoolId(event);
  const [weeksResult, progressResult, assignmentsResult, userProfiles, enrollmentsResult] = await Promise.all([
    ddb.send(new QueryCommand({
      TableName: COURSES_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `COURSE#${courseId}`,
        ':prefix': 'WEEK#',
      },
    })).catch((err) => {
      console.error('Course weeks query failed while building leaderboard:', err);
      return { Items: [] };
    }),
    ddb.send(new ScanCommand({
      TableName: PROGRESS_TABLE,
      FilterExpression: 'begins_with(sk, :prefix)',
      ExpressionAttributeValues: { ':prefix': `PROGRESS#${courseId}#` },
    })).catch((err) => {
      console.error('Progress scan failed while building leaderboard:', err);
      return { Items: [] };
    }),
    ddb.send(new ScanCommand({
      TableName: ASSIGNMENTS_TABLE,
      FilterExpression: 'begins_with(pk, :prefix)',
      ExpressionAttributeValues: { ':prefix': `COURSE#${courseId}#` },
    })).catch((err) => {
      console.error('Assignments scan failed while building leaderboard:', err);
      return { Items: [] };
    }),
    listUsersBySub(userPoolId).catch((err) => {
      console.error('Cognito user lookup failed while building leaderboard:', err);
      return new Map();
    }),
    ddb.send(new ScanCommand({
      TableName: ENROLLMENTS_TABLE,
      FilterExpression: 'courseId = :cid',
      ExpressionAttributeValues: { ':cid': courseId }
    })).catch((err) => {
      console.error('Enrollments scan failed while building leaderboard:', err);
      return { Items: [] };
    }),
  ]);

  const enrolledUserIds = new Set((enrollmentsResult.Items || []).map(item => item.enrollmentId));

  const weekQuizMap = new Map(
    (weeksResult.Items || []).map((week) => [week.weekId, (week.quiz?.questions || []).length > 0]),
  );

  const leaderboardEntries = new Map();

  for (const item of (progressResult.Items || [])) {
    const itemUserId = item.userId || (item.pk ? item.pk.replace('USER#', '') : null);
    const itemWeekId = item.weekId || (item.sk ? item.sk.split('#')[2] : null);
    if (!itemUserId || !itemWeekId) continue;
    if (!enrolledUserIds.has(itemUserId)) continue;

    const hasQuiz = weekQuizMap.has(itemWeekId)
      ? weekQuizMap.get(itemWeekId)
      : item.quizTotal !== null && item.quizTotal !== undefined;
    const entry = getOrCreateEntry(leaderboardEntries, itemUserId, userProfiles, currentUserId);
    if (item.videoComplete) {
      entry.completedLectures += 1;
      entry.score += 1;
      entry.totalPoints += 1;
    }
    if (item.quizPassed) {
      entry.completedQuizzes += 1;
      entry.score += 2;
      entry.totalPoints += 2;
    }
    entry.lastActivity = laterDate(entry.lastActivity, toIso(item.videoCompletedAt || item.lastSeen));
  }

  const awardedAssignments = new Set();
  for (const item of (assignmentsResult.Items || [])) {
    const itemUserId = item.userId || (item.sk ? item.sk.split('#')[1] : null);
    const itemWeekId = item.weekId || (item.pk ? item.pk.split('#')[3] : null);
    if (!itemUserId || !itemWeekId) continue;
    if (!enrolledUserIds.has(itemUserId)) continue;

    const uniqueAssignmentId = item.assignmentId || itemWeekId;
    const assignmentKey = `${itemUserId}#${uniqueAssignmentId}`;
    if (awardedAssignments.has(assignmentKey)) continue;
    awardedAssignments.add(assignmentKey);

    const entry = getOrCreateEntry(leaderboardEntries, itemUserId, userProfiles, currentUserId);
    entry.assignmentPoints += 5;
    entry.assignmentsSubmitted += 1;
    entry.score += 5;
    entry.totalPoints += 5;
    entry.lastActivity = laterDate(entry.lastActivity, toIso(item.uploadedAt));
  }

  if (enrolledUserIds.has(currentUserId) && !leaderboardEntries.has(currentUserId)) {
    leaderboardEntries.set(
      currentUserId,
      makeLeaderboardEntry(currentUserId, userProfiles.get(currentUserId), currentUserId),
    );
  }

  return [...leaderboardEntries.values()]
    .sort((a, b) =>
      b.score - a.score ||
      b.completedLectures - a.completedLectures ||
      b.assignmentsSubmitted - a.assignmentsSubmitted ||
      (b.lastActivity || '').localeCompare(a.lastActivity || '') ||
      a.displayName.localeCompare(b.displayName)
    )
    .map((entry, index) => ({
      ...entry,
      totalPoints: entry.score,
      score: entry.score,
      rank: index + 1,
    }));
}

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

  try {
    const cacheKey = { pk: `COURSE#${courseId}`, sk: 'LEADERBOARD' };
    const cachedItemRes = await ddb.send(new GetCommand({
      TableName: COURSES_TABLE,
      Key: cacheKey,
    })).catch((err) => {
      console.error('Failed to get cached leaderboard:', err);
      return { Item: null };
    });

    const cachedItem = cachedItemRes.Item;
    const now = Date.now();
    const cacheDurationMs = 5 * 60 * 1000; // 5 minutes cache

    if (cachedItem && cachedItem.updatedAt && (now - cachedItem.updatedAt < cacheDurationMs) && Array.isArray(cachedItem.leaderboardData)) {
      // Personalize the cached leaderboard for the requesting user
      const personalizedLeaderboard = cachedItem.leaderboardData.map((entry) => ({
        ...entry,
        isCurrentUser: entry.userId === userId,
      }));
      return res(200, { progress, leaderboard: personalizedLeaderboard });
    }

    // Cache miss or expired: build fresh leaderboard
    const leaderboard = await buildLeaderboard(courseId, userId, event);

    // Save to cache asynchronously (don't block the response)
    const cacheData = leaderboard.map(entry => ({
      ...entry,
      isCurrentUser: false,
    }));

    ddb.send(new UpdateCommand({
      TableName: COURSES_TABLE,
      Key: cacheKey,
      UpdateExpression: 'SET leaderboardData = :data, updatedAt = :now',
      ExpressionAttributeValues: {
        ':data': cacheData,
        ':now': now,
      },
    })).catch((err) => {
      console.error('Failed to update leaderboard cache:', err);
    });

    return res(200, { progress, leaderboard });
  } catch (err) {
    console.error('Leaderboard build error:', err);
    return res(200, { progress, leaderboard: [] });
  }
}

async function recordHeartbeat(userId, body) {
  const { courseId, weekId, currentTime, duration, prevTime } = body;
  if (!courseId || !weekId || currentTime === undefined || !duration) {
    return res(400, { message: 'Missing required fields: courseId, weekId, currentTime, duration' });
  }

  const startTime = typeof prevTime === 'number' ? prevTime : currentTime;
  const startSeg = Math.floor(startTime / HEARTBEAT_INTERVAL);
  const endSeg = Math.floor(currentTime / HEARTBEAT_INTERVAL);
  
  const segments = new Set();
  const minSeg = Math.min(startSeg, endSeg);
  const maxSeg = Math.max(startSeg, endSeg);
  for (let seg = minSeg; seg <= maxSeg; seg++) {
    segments.add(seg);
  }

  const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);

  const pk = `USER#${userId}`;
  const sk = `PROGRESS#${courseId}#${weekId}`;

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
      ExpressionAttributeNames: { '#dur': 'duration' },
      ExpressionAttributeValues: {
        ':seg': segments,
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
}

async function submitQuizAttempt(userId, body) {
  const { courseId, weekId, answers } = body;
  if (!courseId || !weekId || !answers || typeof answers !== 'object') {
    return res(400, { message: 'Missing required fields: courseId, weekId, answers' });
  }

  let weekItem;
  try {
    const r = await ddb.send(new GetCommand({
      TableName: COURSES_TABLE,
      Key: { pk: `COURSE#${courseId}`, sk: `WEEK#${weekId}` },
    }));
    weekItem = r.Item;
  } catch (err) {
    console.error('getCourseWeek error:', err);
    return res(500, { message: 'Failed to load quiz' });
  }

  if (!weekItem) return res(404, { message: 'Week not found' });

  const questions = weekItem.quiz?.questions || [];
  if (questions.length === 0) {
    return res(400, { message: 'This week has no quiz questions.' });
  }

  let correct = 0;
  const correctAnswers = {};
  for (const q of questions) {
    correctAnswers[q.id] = q.correctIndex;
    if (answers[q.id] === q.correctIndex) correct++;
  }

  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= PASSING_PCT;

  const progressPk = `USER#${userId}`;
  const progressSk = `PROGRESS#${courseId}#${weekId}`;

  try {
    await ddb.send(new UpdateCommand({
      TableName: PROGRESS_TABLE,
      Key: { pk: progressPk, sk: progressSk },
      UpdateExpression: `
        SET quizPassed    = :passed,
            quizScore     = :score,
            quizTotal     = :total,
            lastSeen      = :now
        ADD quizAttempts  :one
      `,
      ExpressionAttributeValues: {
        ':passed': passed,
        ':score': correct,
        ':total': total,
        ':now': new Date().toISOString(),
        ':one': 1,
      },
      ReturnValues: 'UPDATED_NEW',
    }));
  } catch (err) {
    console.error('saveQuizResult error:', err);
  }

  return res(200, { passed, score: correct, total, pct, correctAnswers });
}

async function getQAQuestions(courseId, weekId) {
  if (!courseId || !weekId) {
    return res(400, { message: 'Missing courseId or weekId' });
  }

  try {
    const result = await ddb.send(new QueryCommand({
      TableName: COURSES_TABLE,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `COURSE#${courseId}`,
        ':prefix': `QA#${weekId}#`,
      },
    }));

    const questions = (result.Items || []).map((item) => ({
      id: item.id,
      author: item.author,
      text: item.text,
      date: item.date || 'Just now',
      createdAt: item.createdAt,
    })).sort((a, b) => b.id - a.id); // Latest first

    return res(200, { questions });
  } catch (err) {
    console.error('getQAQuestions error:', err);
    return res(500, { message: 'Failed to fetch questions' });
  }
}

async function postQAQuestion(courseId, weekId, userId, body, event) {
  if (!courseId || !weekId) {
    return res(400, { message: 'Missing courseId or weekId' });
  }
  if (!body.text || !body.text.trim()) {
    return res(400, { message: 'Question text is required' });
  }

  const claimsName = event.requestContext?.authorizer?.claims?.name;
  const claimsEmail = event.requestContext?.authorizer?.claims?.email;
  const authorName = claimsName || claimsEmail || `Student ${String(userId || '').slice(-6) || 'Unknown'}`;

  const questionId = Date.now();
  const nowStr = new Date().toISOString();
  const dateStr = 'Just now';

  const item = {
    pk: `COURSE#${courseId}`,
    sk: `QA#${weekId}#${questionId}`,
    id: questionId,
    courseId,
    weekId,
    userId,
    author: authorName,
    text: body.text.trim(),
    date: dateStr,
    createdAt: nowStr,
    type: 'qa',
  };

  try {
    await ddb.send(new UpdateCommand({
      TableName: COURSES_TABLE,
      Key: { pk: item.pk, sk: item.sk },
      UpdateExpression: 'SET id = :id, courseId = :courseId, weekId = :weekId, userId = :userId, author = :author, #txt = :text, #dt = :date, createdAt = :createdAt, #tp = :type',
      ExpressionAttributeNames: {
        '#txt': 'text',
        '#dt': 'date',
        '#tp': 'type',
      },
      ExpressionAttributeValues: {
        ':id': item.id,
        ':courseId': item.courseId,
        ':weekId': item.weekId,
        ':userId': item.userId,
        ':author': item.author,
        ':text': item.text,
        ':date': item.date,
        ':createdAt': item.createdAt,
        ':type': item.type,
      },
    }));

    return res(200, {
      question: {
        id: item.id,
        author: item.author,
        text: item.text,
        date: item.date,
        createdAt: item.createdAt,
      },
    });
  } catch (err) {
    console.error('postQAQuestion error:', err);
    return res(500, { message: 'Failed to post question' });
  }
}

exports.handler = async (event) => {
  currentOrigin = event?.headers?.origin || event?.headers?.Origin || FRONTEND_URL;
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

  // Enrollment Verification Guard
  const targetCourseId = courseId || body.courseId || body.courseID;
  if (targetCourseId && resource !== '/courses/my') {
    const enrolled = await checkEnrollment(userId, targetCourseId, event);
    if (!enrolled) {
      return res(403, { message: 'Forbidden: you are not enrolled in this course.' });
    }
  }

  try {
    if (method === 'GET' && resource === '/courses/my') return await listMyCourses(userId, event);
    if (method === 'GET' && resource === '/courses/{courseId}/weeks') return await listCourseWeeks(courseId, event);
    if (method === 'GET' && resource === '/courses/{courseId}/weeks/{weekId}/qa') return await getQAQuestions(courseId, params.weekId);
    if (method === 'POST' && resource === '/courses/{courseId}/weeks/{weekId}/qa') return await postQAQuestion(courseId, params.weekId, userId, body, event);
    if (method === 'GET' && resource === '/progress/{courseId}') return await getProgressForCourse(courseId, userId, event);
    if (method === 'POST' && resource === '/progress/heartbeat') return await recordHeartbeat(userId, body);
    if (method === 'POST' && resource === '/quiz/submit') return await submitQuizAttempt(userId, body);
    return res(404, { message: `No handler for ${method} ${resource}` });
  } catch (err) {
    console.error(`Student handler error [${method} ${resource}]:`, err);
    return res(500, { message: err.message || 'Internal server error' });
  }
};
