import {
  ALLOWED_BUCKETS,
  FieldValue,
  getLiveSessionRef,
  parseJsonBody,
} from './_firebaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = parseJsonBody(req);
    const bucket = typeof body.bucket === 'string' ? body.bucket : '';
    if (!ALLOWED_BUCKETS.has(bucket)) {
      return res.status(400).json({ error: 'Invalid bucket' });
    }

    await getLiveSessionRef().set(
      {
        round1Tally: {
          [bucket]: FieldValue.increment(1),
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/live/tally] error:', err);
    return res.status(500).json({ error: 'Failed to record tally' });
  }
}
