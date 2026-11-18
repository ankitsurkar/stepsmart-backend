/**
 * Color-scheme helper following modern-web-guidance (dark-mode & dark-mode-toggle).
 * Updates <meta name="color-scheme"> so CSS :root:has(...) and light-dark() stay in sync.
 */

const STORAGE_KEY = 'aipm-color-scheme';

export function getStoredScheme() {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

export function getResolvedScheme() {
  const stored = getStoredScheme();
  if (stored) return stored;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyScheme(scheme) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = scheme || 'light dark';
  }
}

export function setSchemeOverride(mode) {
  // mode: 'system' | 'light' | 'dark'
  try {
    if (mode === 'light' || mode === 'dark') {
      localStorage.setItem(STORAGE_KEY, mode);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Still apply visually even if storage is blocked
  }
  applyScheme(mode === 'light' || mode === 'dark' ? mode : 'light dark');
}

export function toggleTwoStateScheme() {
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemScheme = systemDark ? 'dark' : 'light';
  const currentRendered = getResolvedScheme();
  const target = currentRendered === 'dark' ? 'light' : 'dark';

  // Only store if target differs from system; otherwise remove stored override to follow system again
  if (target !== systemScheme) {
    setSchemeOverride(target);
  } else {
    setSchemeOverride('system');
  }
  return target;
}

export function initSchemeSync(onChange) {
  applyScheme(getStoredScheme() || 'light dark');
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      applyScheme(getStoredScheme() || 'light dark');
      onChange?.();
    }
  });
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
      onChange?.();
    });
  }
}
