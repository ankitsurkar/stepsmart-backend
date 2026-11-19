import { getApps, initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

export const SESSION_COLLECTION = 'live_sessions';
export const SESSION_DOC_ID = 'ai_pm_part1';
export const HOST_HEARTBEAT_STALE_MS = 90_000;

export const DEFAULT_SESSION_STATE = {
  stageIndex: 0,
  stageId: 'opening_1',
  hostActive: false,
  hostHeartbeatAt: 0,
  updatedAt: 0,
  round1Tally: {
    Stay: 0,
    'Technical PM': 0,
    'Data PM': 0,
    'Product Manager': 0,
    'Growth PM': 0,
    'AI PM': 0,
  },
};

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
}

let cachedDb = null;

export function isFirebaseConfigured() {
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId);
}

export function getLiveDb() {
  if (cachedDb) return cachedDb;
  if (!isFirebaseConfigured()) return null;
  const app = getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseConfig());
  cachedDb = getFirestore(app);
  return cachedDb;
}

export function isHostLive(data) {
  if (!data || !data.hostActive) return false;
  if (typeof data.hostHeartbeatAt === 'number' && data.hostHeartbeatAt > 0) {
    return Date.now() - data.hostHeartbeatAt < HOST_HEARTBEAT_STALE_MS;
  }
  return true;
}

export function subscribeSession(onState, onError) {
  const db = getLiveDb();
  if (!db) {
    onError?.(new Error('Firebase is not configured (missing VITE_FIREBASE_* env vars).'));
    return () => {};
  }

  const ref = doc(db, SESSION_COLLECTION, SESSION_DOC_ID);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onState({ ...DEFAULT_SESSION_STATE });
        return;
      }
      const raw = snap.data() || {};
      onState({
        ...DEFAULT_SESSION_STATE,
        ...raw,
        round1Tally: {
          ...DEFAULT_SESSION_STATE.round1Tally,
          ...(raw.round1Tally || {}),
        },
      });
    },
    (err) => {
      onError?.(err);
    }
  );
}
