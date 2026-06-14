const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');

const REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_jnwEn55p2';
const ENROLLMENTS_TABLE = 'lms-enrollments';
const COURSES_TABLE = 'lms-courses';

const ddbClient = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient, { marshallOptions: { convertEmptyValues: true } });
const cognito = new CognitoIdentityProviderClient({ region: REGION });

async function backfill() {
  console.log('Starting backfill script...');

  // 1. Setup metadata for course-002 (Batch 2)
  console.log('Setting up METADATA for course-002...');
  try {
    await ddb.send(new PutCommand({
      TableName: COURSES_TABLE,
      Item: {
        pk: 'COURSE#course-002',
        sk: 'METADATA',
        courseId: 'course-002',
        name: 'PM -X Accelerator (Batch 2)',
        description: 'Product Management Accelerator Cohort 2',
        createdAt: new Date().toISOString()
      }
    }));
    console.log('✓ course-002 METADATA setup complete.');
  } catch (err) {
    console.error('Failed to setup course-002 METADATA:', err);
    process.exit(1);
  }

  // 2. Fetch all Cognito users
  console.log('Fetching Cognito users...');
  let users = [];
  try {
    let paginationToken;
    do {
      const result = await cognito.send(new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        PaginationToken: paginationToken,
      }));
      users.push(...(result.Users || []));
      paginationToken = result.PaginationToken;
    } while (paginationToken);
    console.log(`✓ Fetched ${users.length} Cognito users.`);
  } catch (err) {
    console.error('Failed to fetch Cognito users:', err);
    process.exit(1);
  }

  // 3. Backfill enrollments
  console.log('Enrolling existing users in course-001...');
  let enrolledCount = 0;
  for (const user of users) {
    const attrs = {};
    for (const attr of (user.Attributes || [])) attrs[attr.Name] = attr.Value;
    const userId = attrs.sub || user.Username;

    if (!userId) {
      console.warn(`User ${user.Username} has no sub/userId. Skipping.`);
      continue;
    }

    try {
      await ddb.send(new PutCommand({
        TableName: ENROLLMENTS_TABLE,
        Item: {
          enrollmentId: userId,
          userId,
          courseId: 'course-001',
          enrolledAt: new Date().toISOString()
        }
      }));
      enrolledCount++;
      console.log(`- Enrolled user: ${user.Username} (${userId})`);
    } catch (err) {
      console.error(`Failed to enroll user ${user.Username}:`, err);
    }
  }

  console.log(`Backfill finished. Successfully enrolled ${enrolledCount} users in course-001.`);
}

backfill().catch(console.error);
