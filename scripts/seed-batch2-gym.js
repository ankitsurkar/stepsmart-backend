/**
 * PM-X Accelerator Batch 2 — DynamoDB PM Gym Seeder
 * Writes the 7-day Product Design Case Study into DynamoDB for course-002 (Batch 2)
 */

const { BATCH_2_PRODUCT_DESIGN_CASE_STUDY } = require('../backend/batch2GymQuestions');

async function seedDynamoDB() {
  let DynamoDBClient, DynamoDBDocumentClient, PutCommand;
  try {
    const ddbSdk = require('@aws-sdk/client-dynamodb');
    const docSdk = require('@aws-sdk/lib-dynamodb');
    DynamoDBClient = ddbSdk.DynamoDBClient;
    DynamoDBDocumentClient = docSdk.DynamoDBDocumentClient;
    PutCommand = docSdk.PutCommand;
  } catch (e) {
    console.log('Note: @aws-sdk not found in root. Using mock/json output.');
  }

  const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
  const REGION = process.env.AWS_REGION || 'eu-north-1';
  const targetCourses = ['course-002', 'course-001'];

  console.log(`\n======================================================`);
  console.log(`Seeding 7-Day Product Design Case Study for PM-X Accelerator`);
  console.log(`Table: ${COURSES_TABLE} | Region: ${REGION}`);
  console.log(`======================================================\n`);

  if (!DynamoDBClient) {
    console.log('Questions prepared for DynamoDB:');
    BATCH_2_PRODUCT_DESIGN_CASE_STUDY.forEach((q, idx) => {
      console.log(`Day ${idx + 1} (${q.date}) [${q.type.toUpperCase()}]: ${q.text.split('\n')[0]}`);
    });
    return;
  }

  const ddbClient = new DynamoDBClient({ region: REGION });
  const ddb = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: { convertEmptyValues: true },
  });

  for (const courseId of targetCourses) {
    console.log(`\n--- Seeding course: ${courseId} ---`);
    for (const q of BATCH_2_PRODUCT_DESIGN_CASE_STUDY) {
      const item = {
        pk: `COURSE#${courseId}`,
        sk: `GYM#${q.date}`,
        date: q.date,
        type: q.type,
        text: q.text,
        category: q.category,
        options: Array.isArray(q.options) ? q.options : null,
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : null,
        correctAnswer: q.correctAnswer || null,
        explanation: q.explanation || '',
        cohortBatch: 'PM-X Accelerator Batch 2',
        updatedAt: new Date().toISOString(),
      };

      try {
        await ddb.send(new PutCommand({
          TableName: COURSES_TABLE,
          Item: item,
        }));
        console.log(`✓ Seeded ${courseId} -> GYM#${q.date} (${q.type})`);
      } catch (err) {
        console.error(`✗ Error seeding ${courseId} -> GYM#${q.date}:`, err.message);
      }
    }
  }

  console.log('\n✓ Seeding script completed.');
}

seedDynamoDB().catch(console.error);
