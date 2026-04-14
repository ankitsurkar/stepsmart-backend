// Lambda: lms-getProgress
// Trigger: GET /progress/{courseId}
// Auth:    Cognito Authorizer (JWT required)
//
// Returns all week-level progress records for the authenticated student in one course.
// The frontend uses this on dashboard load and on LearnPage mount to hydrate local state.
// Optional query string: ?includeLeaderboard=true
//
// Path parameter: courseId
// Returns:
//   { progress: [ { weekId, videoComplete, watchedSegments, quizPassed, ... } ] }
//   { progress, leaderboard: [ { rank, displayName, totalPoints, ... } ] } when includeLeaderboard=true

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const COURSES_TABLE  = process.env.COURSES_TABLE  || 'lms-courses';
const ASSIGNMENTS_TABLE = process.env.ASSIGNMENTS_TABLE || 'lms-assignments';
const FRONTEND_URL   = process.env.FRONTEND_URL   || 'https://stepsmart.net';

function deriveUserPoolId(event) {
  if (process.env.USER_POOL_ID) return process.env.USER_POOL_ID;
  const issuer = event.requestContext?.authorizer?.claims?.iss;
  return issuer ? issuer.split('/').pop() : '';
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null;
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
    assignmentsSubmitted: 0,
    // Keep `score` as the canonical leaderboard number while retaining
    // `totalPoints` for backward compatibility with existing clients.
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

function isLectureComplete(progressItem, weekHasQuiz) {
  return weekHasQuiz ? !!progressItem.quizPassed : !!progressItem.videoComplete;
}

async function buildLeaderboard(courseId, currentUserId, event) {
  const userPoolId = deriveUserPoolId(event);
  const [weeksResult, progressResult, assignmentsResult, userProfiles] = await Promise.all([
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
      FilterExpression: 'courseId = :cid',
      ExpressionAttributeValues: { ':cid': courseId },
    })).catch((err) => {
      console.error('Progress scan failed while building leaderboard:', err);
      return { Items: [] };
    }),
    ddb.send(new ScanCommand({
      TableName: ASSIGNMENTS_TABLE,
      FilterExpression: 'courseId = :cid',
      ExpressionAttributeValues: { ':cid': courseId },
    })).catch((err) => {
      console.error('Assignments scan failed while building leaderboard:', err);
      return { Items: [] };
    }),
    listUsersBySub(userPoolId).catch((err) => {
      console.error('Cognito user lookup failed while building leaderboard:', err);
      return new Map();
    }),
  ]);

  const weekQuizMap = new Map(
    (weeksResult.Items || []).map((week) => [week.weekId, (week.quiz?.questions || []).length > 0]),
  );

  const leaderboardEntries = new Map();

  for (const item of (progressResult.Items || [])) {
    if (!item.userId || !item.weekId) continue;

    const hasQuiz = weekQuizMap.has(item.weekId)
      ? weekQuizMap.get(item.weekId)
      : item.quizTotal !== null && item.quizTotal !== undefined;
    if (!isLectureComplete(item, hasQuiz)) continue;

    const entry = getOrCreateEntry(leaderboardEntries, item.userId, userProfiles, currentUserId);
    entry.lecturePoints += 1;
    entry.completedLectures += 1;
    entry.score += 1;
    entry.totalPoints += 1;
    entry.lastActivity = laterDate(entry.lastActivity, toIso(item.videoCompletedAt || item.lastSeen));
  }

  const awardedAssignments = new Set();
  for (const item of (assignmentsResult.Items || [])) {
    if (!item.userId || !item.weekId) continue;

    const uniqueAssignmentId = item.assignmentId || item.weekId;
    const assignmentKey = `${item.userId}#${uniqueAssignmentId}`;
    if (awardedAssignments.has(assignmentKey)) continue;
    awardedAssignments.add(assignmentKey);

    const entry = getOrCreateEntry(leaderboardEntries, item.userId, userProfiles, currentUserId);
    entry.assignmentPoints += 5;
    entry.assignmentsSubmitted += 1;
    entry.score += 5;
    entry.totalPoints += 5;
    entry.lastActivity = laterDate(entry.lastActivity, toIso(item.uploadedAt));
  }

  if (!leaderboardEntries.has(currentUserId)) {
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
      // Ensure old and new clients both see the same value.
      totalPoints: entry.score,
      score: entry.score,
      rank: index + 1,
    }));
}

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
  const includeLeaderboard = event.queryStringParameters?.includeLeaderboard === 'true';

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

  if (!includeLeaderboard) {
    return res(200, { progress });
  }

  try {
    const leaderboard = await buildLeaderboard(courseId, userId, event);
    return res(200, { progress, leaderboard });
  } catch (err) {
    console.error('Leaderboard build error:', err);
    return res(200, { progress, leaderboard: [] });
  }
};
