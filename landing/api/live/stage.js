import {
  DEFAULT_TALLY,
  getLiveSessionRef,
  parseJsonBody,
  verifyHostKey,
} from './_firebaseAdmin.js';

const MAX_STAGE_INDEX = 60;

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
    const body = parseJsonBody(req);
    const ref = getLiveSessionRef();
    const now = Date.now();

    if (body.action === 'end') {
      await ref.set(
        {
          hostActive: false,
          updatedAt: now,
        },
        { merge: true }
      );
      return res.status(200).json({ ok: true, hostActive: false, updatedAt: now });
    }

    if (body.action === 'heartbeat') {
      const update = {
        hostActive: true,
        hostHeartbeatAt: now,
      };
      if (
        Number.isInteger(body.stageIndex) &&
        body.stageIndex >= 0 &&
        body.stageIndex <= MAX_STAGE_INDEX &&
        typeof body.stageId === 'string' &&
        body.stageId.length > 0 &&
        body.stageId.length <= 64
      ) {
        update.stageIndex = body.stageIndex;
        update.stageId = body.stageId;
      }
      await ref.set(update, { merge: true });
      return res.status(200).json({ ok: true, ...update });
    }

    const { stageIndex, stageId, resetTally } = body;
    if (
      !Number.isInteger(stageIndex) ||
      stageIndex < 0 ||
      stageIndex > MAX_STAGE_INDEX ||
      typeof stageId !== 'string' ||
      stageId.length === 0 ||
      stageId.length > 64
    ) {
      return res.status(400).json({ error: 'Invalid stage payload' });
    }

    const payload = {
      stageIndex,
      stageId,
      hostActive: true,
      hostHeartbeatAt: now,
      updatedAt: now,
    };

    if (resetTally) {
      payload.round1Tally = { ...DEFAULT_TALLY };
    }

    await ref.set(payload, { merge: true });
    return res.status(200).json({ ok: true, ...payload });
  } catch (err) {
    console.error('[api/live/stage] error:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to update stage',
    });
  }
}
