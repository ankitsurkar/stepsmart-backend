const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE || 'lms-analytics';
const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const { httpMethod, path, body } = event;
  if (httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  const data = body ? JSON.parse(body) : {};

  try {
    // ─── POST /public/enroll ────────────────────────────────────────────────
    if (httpMethod === 'POST' && path === '/public/enroll') {
      const { page } = data;

      if (page === 'get_blogs') {
        const blogsResult = await docClient.send(new QueryCommand({
          TableName: COURSES_TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: {
            ':pk': 'BLOG#GLOBAL',
            ':prefix': 'POST#',
          },
        }));

        const blogs = (blogsResult.Items || [])
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

        return response(200, { success: true, blogs });
      }

      if (page === 'get_events') {
        const eventsResult = await docClient.send(new QueryCommand({
          TableName: COURSES_TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: {
            ':pk': 'EVENT#GLOBAL',
            ':prefix': 'EVENT#',
          },
        }));

        const events = (eventsResult.Items || [])
          .sort((a, b) => (b.dateStr || '').localeCompare(a.dateStr || ''));

        return response(200, { success: true, events });
      }

      if (page === 'save_event' && data.event && data.event.id) {
        const { event: ev } = data;
        const sk = `EVENT#${ev.id}`;
        const item = {
          pk: 'EVENT#GLOBAL',
          sk,
          id: ev.id,
          title: ev.title || '',
          dateStr: ev.dateStr || '',
          dateDisplay: ev.dateDisplay || '',
          time: ev.time || '',
          format: ev.format || '',
          description: ev.description || '',
          aboutText: ev.aboutText || '',
          registerUrl: ev.registerUrl || '',
          attendeeCount: Number(ev.attendeeCount) || 0,
          moments: Array.isArray(ev.moments) ? ev.moments : [],
          hosts: Array.isArray(ev.hosts) ? ev.hosts : [],
          tags: Array.isArray(ev.tags) ? ev.tags : [],
          bannerBg: ev.bannerBg || 'linear-gradient(135deg, #188ab2 0%, #1e40af 100%)',
          createdAt: ev.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await docClient.send(new PutCommand({
          TableName: COURSES_TABLE,
          Item: item,
        }));
        return response(200, { success: true, event: item });
      }

      if (page === 'delete_event' && data.id) {
        await docClient.send(new DeleteCommand({
          TableName: COURSES_TABLE,
          Key: { pk: 'EVENT#GLOBAL', sk: `EVENT#${data.id}` },
        }));
        return response(200, { success: true, id: data.id });
      }

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

      if (page === 'get_blogs') {
        const blogsResult = await docClient.send(new QueryCommand({
          TableName: COURSES_TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: {
            ':pk': 'BLOG#GLOBAL',
            ':prefix': 'POST#',
          },
        }));

        const blogs = (blogsResult.Items || [])
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

        return response(200, { success: true, blogs });
      }

      if (page === 'get_events') {
        const eventsResult = await docClient.send(new QueryCommand({
          TableName: COURSES_TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: {
            ':pk': 'EVENT#GLOBAL',
            ':prefix': 'EVENT#',
          },
        }));

        const events = (eventsResult.Items || [])
          .sort((a, b) => (b.dateStr || '').localeCompare(a.dateStr || ''));

        return response(200, { success: true, events });
      }

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
