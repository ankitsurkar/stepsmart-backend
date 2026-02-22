// Lambda: lms-submitQuiz
// Trigger: POST /quiz/submit
// Auth:    Cognito Authorizer (JWT required)
//
// Security model:
//   - Correct answers NEVER travel to the browser. They live only in DynamoDB.
//   - This Lambda fetches the answer key independently and grades server-side.
//   - The student's JWT cannot contain the 'admins' group claim (it is signed by Cognito),
//     so group-based bypasses are impossible.
//   - Video completion is enforced before allowing a quiz attempt.
//
// Body: { courseId, weekId, answers: { [questionId]: optionIndex } }
// Returns: { passed, score, total, pct, quizAttempts }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const PASSING_PCT = 70;  // minimum percentage to pass

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertEmptyValues: true },
});

const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'lms-progress';
const COURSES_TABLE  = process.env.COURSES_TABLE  || 'lms-courses';
const FRONTEND_URL   = process.env.FRONTEND_URL   || 'https://stepsmart.net';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  FRONTEND_URL,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
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

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return res(400, { message: 'Invalid JSON body' });
  }

  const { courseId, weekId, answers } = body;
  if (!courseId || !weekId || !answers || typeof answers !== 'object') {
    return res(400, { message: 'Missing required fields: courseId, weekId, answers' });
  }

  const progressPk = `USER#${userId}`;
  const progressSk = `PROGRESS#${courseId}#${weekId}`;

  // Step 1: Verify the student has watched at least 90% of the video.
  //         The quiz gate lives on the server — a UI bypass cannot circumvent this.
  let progressItem;
  try {
    const r = await ddb.send(new GetCommand({
      TableName: PROGRESS_TABLE,
      Key: { pk: progressPk, sk: progressSk },
    }));
    progressItem = r.Item;
  } catch (err) {
    console.error('getProgress error:', err);
    return res(500, { message: 'Failed to verify video completion' });
  }

  if (!progressItem?.videoComplete) {
    return res(403, { message: 'You must complete the video before taking the quiz.' });
  }

  // Step 2: Fetch the correct answers from DynamoDB.
  //         These never leave this Lambda — they are not included in the response.
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

  // Step 3: Grade — compare submitted answers against the stored correctIndex.
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }

  const total  = questions.length;
  const pct    = Math.round((correct / total) * 100);
  const passed = pct >= PASSING_PCT;

  // Step 4: Persist the result. Always save, never block retries.
  //         ADD quizAttempts increments atomically — no race condition if two tabs submit.
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
        ':score':  correct,
        ':total':  total,
        ':now':    new Date().toISOString(),
        ':one':    1,
      },
      ReturnValues: 'UPDATED_NEW',
    }));
  } catch (err) {
    console.error('saveQuizResult error:', err);
    // The grade was computed correctly — return it even if the write failed.
    // The student can retry and the write will succeed on the next attempt.
  }

  return res(200, { passed, score: correct, total, pct });
};
