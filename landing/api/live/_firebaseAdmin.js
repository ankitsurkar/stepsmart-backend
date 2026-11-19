import crypto from 'node:crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

export const SESSION_COLLECTION = 'live_sessions';
export const SESSION_DOC_ID = 'ai_pm_part1';

export const DEFAULT_TALLY = {
  Stay: 0,
  'Technical PM': 0,
  'Data PM': 0,
  'Product Manager': 0,
  'Growth PM': 0,
  'AI PM': 0,
};

export const ALLOWED_BUCKETS = new Set(Object.keys(DEFAULT_TALLY));

function loadServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson && rawJson.trim()) {
    const trimmed = rawJson.trim();
    const decoded = trimmed.startsWith('{')
      ? trimmed
      : Buffer.from(trimmed, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (parsed.private_key) {
      parsed.private_key = String(parsed.private_key).replace(/\\n/g, '\n');
    }
    return parsed;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  throw new Error(
    'Firebase Admin credentials missing. Set FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) in Vercel.'
  );
}

export function getAdminDb() {
  if (getApps().length === 0) {
    const serviceAccount = loadServiceAccount();
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getFirestore();
}

export function getLiveSessionRef() {
  return getAdminDb().collection(SESSION_COLLECTION).doc(SESSION_DOC_ID);
}

export { FieldValue };

export function verifyHostKey(req, res) {
  const expected = process.env.LIVE_HOST_KEY || process.env.HOST_KEY || '';
  if (!expected) {
    res.status(503).json({
      error: 'LIVE_HOST_KEY is not configured on the server.',
    });
    return false;
  }

  const headerVal = req.headers['x-host-key'];
  const provided = Array.isArray(headerVal) ? headerVal[0] || '' : String(headerVal || '');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const providedBuf = Buffer.from(provided, 'utf8');

  if (
    expectedBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, providedBuf)
  ) {
    res.status(403).json({ error: 'Invalid host PIN' });
    return false;
  }
  return true;
}

export function parseJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}
