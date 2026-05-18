const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE || 'lms-analytics';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const { httpMethod, path, body } = event;
  const data = body ? JSON.parse(body) : {};

  try {
    // ─── POST /public/enroll ────────────────────────────────────────────────
    if (httpMethod === 'POST' && path === '/public/enroll') {
      const { name, email, phone, masterclassId = 'default' } = data;
      if (!name || !email) {
        return response(400, { error: 'Name and email are required.' });
      }

      await docClient.send(new PutCommand({
        TableName: ENROLLMENTS_TABLE,
        Item: {
          enrollmentId: `${masterclassId}#${email}`,
          email,
          name,
          phone: phone || 'N/A',
          timestamp: new Date().toISOString(),
          masterclassId,
        },
      }));

      return response(200, { success: true, message: 'Enrollment saved.' });
    }

    // ─── POST /public/track ─────────────────────────────────────────────────
    if (httpMethod === 'POST' && path === '/public/track') {
      const { page, visitorId } = data;
      const today = new Date().toISOString().split('T')[0];

      await docClient.send(new UpdateCommand({
        TableName: ANALYTICS_TABLE,
        Key: { pageId: page || 'home' },
        UpdateExpression: 'SET visits = if_not_exists(visits, :zero) + :one, lastVisit = :now',
        ExpressionAttributeValues: {
          ':one': 1,
          ':zero': 0,
          ':now': new Date().toISOString(),
        },
      }));

      return response(200, { success: true });
    }

    return response(404, { error: 'Not Found' });
  } catch (err) {
    console.error(err);
    return response(500, { error: err.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify(body),
  };
}
