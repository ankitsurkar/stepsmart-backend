const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-north-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const ses = new SESClient({ region: process.env.AWS_REGION || 'eu-north-1' });

const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'lms-enrollments';
const ANALYTICS_TABLE = process.env.ANALYTICS_TABLE || 'lms-analytics';
const COURSES_TABLE = process.env.COURSES_TABLE || 'lms-courses';
const PEER_SESSIONS_TABLE = process.env.PEER_SESSIONS_TABLE || 'lms-peer-sessions';
const FROM_EMAIL = process.env.FROM_EMAIL || 'admin@stepsmart.net';

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

      if (page === 'get_pm_gym') {
        const targetCourseId = data.courseId || 'course-003';
        const clientDate = data.clientDate || new Date().toISOString().split('T')[0];

        const gymQuestionsResult = await docClient.send(new QueryCommand({
          TableName: COURSES_TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: {
            ':pk': `COURSE#${targetCourseId}`,
            ':prefix': 'GYM#',
          },
        }));

        // Mask future questions so future answers are not revealed
        const gymQuestions = (gymQuestionsResult.Items || []).map((q) => {
          if (q.date > clientDate) {
            const { correctIndex, correctAnswer, explanation, ...stripped } = q;
            return stripped;
          }
          return q;
        }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        return response(200, { success: true, gymQuestions, clientDate });
      }

      if (page === 'submit_pm_gym') {
        const { date, answer, email, name, courseId = 'course-003' } = data;
        if (!date || answer === undefined) {
          return response(400, { error: 'Date and answer are required' });
        }

        if (email) {
          await docClient.send(new PutCommand({
            TableName: ENROLLMENTS_TABLE,
            Item: {
              enrollmentId: `gym#${date}#${email}`,
              email,
              name: name || 'Visitor',
              source: 'pm_gym',
              gymDate: date,
              answer: String(answer),
              timestamp: new Date().toISOString(),
              masterclassId: `pm-gym-${date}`,
            },
          })).catch(err => console.error('Gym lead save error:', err));
        }

        return response(200, { success: true, message: 'Gym challenge submitted successfully' });
      }

      if (page === 'get_peer_sessions') {
        const scanRes = await docClient.send(new ScanCommand({
          TableName: PEER_SESSIONS_TABLE,
          FilterExpression: '#status = :open',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: {
            ':open': 'OPEN',
          },
        })).catch((err) => {
          console.error('Scan peer sessions error:', err);
          return { Items: [] };
        });

        const sessions = (scanRes.Items || [])
          .map((item) => ({
            sessionId: item.sessionId,
            courseId: item.courseId,
            courseName: item.courseName || item.batchName || 'PM Cohort',
            hostUserId: item.hostUserId,
            hostName: item.hostName || 'Classmate',
            hostEmail: item.hostEmail,
            scheduledStartTime: item.scheduledStartTime,
            scheduledEndTime: item.scheduledEndTime,
            topic: item.topic || 'General Discussion',
            notes: item.notes || '',
            meetingUrl: item.meetingUrl,
            status: item.status,
            createdAt: item.createdAt,
          }))
          .sort((a, b) => (b.scheduledStartTime || '').localeCompare(a.scheduledStartTime || ''));

        return response(200, { success: true, sessions });
      }

      if (page === 'get_my_peer_sessions') {
        const userEmail = (data.email || '').toLowerCase().trim();
        if (!userEmail) {
          return response(200, { success: true, sessions: [] });
        }

        const scanRes = await docClient.send(new ScanCommand({
          TableName: PEER_SESSIONS_TABLE,
          FilterExpression: 'hostEmail = :email OR peerEmail = :email',
          ExpressionAttributeValues: {
            ':email': userEmail,
          },
        })).catch((err) => {
          console.error('Scan my sessions error:', err);
          return { Items: [] };
        });

        const sessions = (scanRes.Items || [])
          .map((item) => ({
            sessionId: item.sessionId,
            courseId: item.courseId,
            courseName: item.courseName || item.batchName || 'PM Cohort',
            hostName: item.hostName || 'Classmate',
            hostEmail: item.hostEmail,
            peerName: item.peerName,
            peerEmail: item.peerEmail,
            scheduledStartTime: item.scheduledStartTime,
            scheduledEndTime: item.scheduledEndTime,
            topic: item.topic || 'General Discussion',
            notes: item.notes || '',
            meetingUrl: item.meetingUrl,
            status: item.status,
            createdAt: item.createdAt,
            isHost: (item.hostEmail || '').toLowerCase() === userEmail,
          }))
          .sort((a, b) => (b.scheduledStartTime || '').localeCompare(a.scheduledStartTime || ''));

        return response(200, { success: true, sessions });
      }

      if (page === 'book_peer_session') {
        const { sessionId, name, email } = data;
        if (!sessionId || !email) {
          return response(400, { error: 'Session ID and email are required.' });
        }

        const getRes = await docClient.send(new GetCommand({
          TableName: PEER_SESSIONS_TABLE,
          Key: { sessionId },
        })).catch((err) => {
          console.error('Get peer session error:', err);
          return { Item: null };
        });

        const session = getRes.Item;
        if (!session) {
          return response(404, { error: 'Study slot not found.' });
        }

        if (session.status !== 'OPEN') {
          return response(409, { error: 'This study slot has already been booked by another student.' });
        }

        const nowIso = new Date().toISOString();
        const updateRes = await docClient.send(new UpdateCommand({
          TableName: PEER_SESSIONS_TABLE,
          Key: { sessionId },
          UpdateExpression: 'SET #status = :booked, peerUserId = :pUid, peerName = :pName, peerEmail = :pEmail, bookedAt = :now',
          ConditionExpression: 'attribute_exists(sessionId) AND #status = :open',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: {
            ':booked': 'BOOKED',
            ':pUid': `visitor_${email}`,
            ':pName': name || 'StepSmart Member',
            ':pEmail': email,
            ':now': nowIso,
          },
          ReturnValues: 'ALL_NEW',
        }));

        const updated = updateRes.Attributes || session;
        const hostName = updated.hostName || 'Classmate';
        const hostEmail = updated.hostEmail;
        const peerName = updated.peerName || name || 'Student';
        const peerEmail = updated.peerEmail || email;
        const courseName = updated.courseName || updated.batchName || 'StepSmart Cohort';
        const topic = updated.topic || 'General Discussion';
        const meetingUrl = updated.meetingUrl || 'https://meet.jit.si';

        // Format date
        let formattedStart = updated.scheduledStartTime;
        try {
          formattedStart = new Date(updated.scheduledStartTime).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
        } catch (_) {}

        // Send confirmation emails via SES
        const tasks = [];
        if (hostEmail) {
          tasks.push(
            ses.send(new SendEmailCommand({
              Source: FROM_EMAIL,
              Destination: { ToAddresses: [hostEmail] },
              Message: {
                Subject: { Data: `Peer Study Session Confirmed: ${peerName} joined your slot! 🚀` },
                Body: {
                  Html: {
                    Data: `
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
                        <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #111;">Peer Study Session Confirmed! 🚀</h2>
                        <p style="font-size: 15px; color: #333; line-height: 1.5;">Hi <strong>${hostName}</strong>,</p>
                        <p style="font-size: 15px; color: #333; line-height: 1.5;"><strong>${peerName}</strong> (${peerEmail}) has joined your study slot for <strong>${courseName}</strong>.</p>
                        <div style="background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 16px; margin: 20px 0;">
                          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Topic:</strong> ${topic}</p>
                          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Date & Time:</strong> ${formattedStart}</p>
                          <p style="margin: 0; font-size: 14px;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" target="_blank" style="color: #027A9B; font-weight: 600;">${meetingUrl}</a></p>
                        </div>
                        <p style="font-size: 14px; color: #666; line-height: 1.5;">See you on the call!</p>
                        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #888; margin: 0;">StepSmart LMS — Peer-to-Peer Learning Network</p>
                      </div>
                    `
                  }
                }
              }
            })).catch(err => console.error('Host mail error:', err))
          );
        }

        if (peerEmail) {
          tasks.push(
            ses.send(new SendEmailCommand({
              Source: FROM_EMAIL,
              Destination: { ToAddresses: [peerEmail] },
              Message: {
                Subject: { Data: `You're Booked for a Peer Session with ${hostName}! 🚀` },
                Body: {
                  Html: {
                    Data: `
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
                        <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #111;">You're Booked for a Peer Session 🚀</h2>
                        <p style="font-size: 15px; color: #333; line-height: 1.5;">Hi <strong>${peerName}</strong>,</p>
                        <p style="font-size: 15px; color: #333; line-height: 1.5;">You have successfully connected with <strong>${hostName}</strong>${hostEmail ? ` (${hostEmail})` : ''} for <strong>${courseName}</strong>.</p>
                        <div style="background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 16px; margin: 20px 0;">
                          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Topic:</strong> ${topic}</p>
                          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Date & Time:</strong> ${formattedStart}</p>
                          <p style="margin: 0; font-size: 14px;"><strong>Meeting Link:</strong> <a href="${meetingUrl}" target="_blank" style="color: #027A9B; font-weight: 600;">${meetingUrl}</a></p>
                        </div>
                        <p style="font-size: 14px; color: #666; line-height: 1.5;">Reach out if you need to coordinate anything prior to the call.</p>
                        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #888; margin: 0;">StepSmart LMS — Peer-to-Peer Learning Network</p>
                      </div>
                    `
                  }
                }
              }
            })).catch(err => console.error('Peer mail error:', err))
          );
        }

        // Admin alert
        tasks.push(
          ses.send(new SendEmailCommand({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [FROM_EMAIL] },
            Message: {
              Subject: { Data: `[Booking Alert] ${peerName} booked study session with ${hostName}` },
              Body: {
                Html: {
                  Data: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
                      <h2>New Peer Study Session Booked!</h2>
                      <p><strong>Host:</strong> ${hostName} (${hostEmail || 'N/A'})</p>
                      <p><strong>Peer:</strong> ${peerName} (${peerEmail || 'N/A'})</p>
                      <p><strong>Course:</strong> ${courseName}</p>
                      <p><strong>Topic:</strong> ${topic}</p>
                      <p><strong>Scheduled Time:</strong> ${formattedStart}</p>
                      <p><strong>Meeting Room:</strong> <a href="${meetingUrl}">${meetingUrl}</a></p>
                    </div>
                  `
                }
              }
            }
          })).catch(err => console.error('Admin mail error:', err))
        );

        await Promise.allSettled(tasks);

        return response(200, {
          success: true,
          session: updated,
          message: 'Connected successfully! Confirmation emails sent to both participants.',
        });
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

      const { name, email, phone, masterclassId = 'default', currentRole, role, source, cohortTrack } = data;
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
          currentRole: currentRole || role || 'N/A',
          source: source || (masterclassId.includes('brochure') ? 'brochure_download' : 'enrollment_form'),
          cohortTrack: cohortTrack || 'PM-X Accelerator',
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
