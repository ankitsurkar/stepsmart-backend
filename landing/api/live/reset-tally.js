import {
  DEFAULT_TALLY,
  getLiveSessionRef,
  verifyHostKey,
} from './_firebaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!verifyHostKey(req, res)) return;

  try {
    const now = Date.now();
    await getLiveSessionRef().set(
      {
        round1Tally: { ...DEFAULT_TALLY },
        updatedAt: now,
      },
      { merge: true }
    );
    return res.status(200).json({
      ok: true,
      round1Tally: DEFAULT_TALLY,
      updatedAt: now,
    });
  } catch (err) {
    console.error('[api/live/reset-tally] error:', err);
    return res.status(500).json({ error: 'Failed to reset tally' });
  }
}
