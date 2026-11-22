import {
  STAGES,
  BACKGROUNDS,
  EXPERIENCE_BANDS,
  WORK_THINGS,
  PHONE_PROOF_CHIPS,
  SLICE_COLORS,
  ROUND_TAKEAWAYS,
  SPOT_IT_QUESTIONS,
  YOUR_MAP_ITEMS,
  PROGRAMME_SIGNUP_URL,
  WHATSAPP_1ON1_URL,
  AI_PM_BROCHURE_MODULES,
} from './data.js';
import {
  computePersonalSlices,
  computePhoneR3Slices,
  getDialSettingName,
  buildPhoneStatements,
  buildPhoneSourcedStatements,
} from './scoring.js';
import { WheelRenderer } from './wheel.js';
import { initSchemeSync } from './theme.js';
import { subscribeSession, isHostLive, recordTallyDirect } from './firebaseSync.js';

const PROFILE_STORAGE_KEY = 'aipm_part1_phone_profile_v1';
const EXTRAS_STORAGE_KEY = 'aipm_part1_phone_extras_v1';

const mainEl = document.getElementById('phoneMain');
const statusPillEl = document.getElementById('phoneStagePill');
const reconnectSlot = document.getElementById('phoneReconnectSlot');
const resetProfileBtn = document.getElementById('phoneResetProfileBtn');

let hostStageIndex = 0;
let lastSessionData = null;
let hostLiveNow = false;
let connectionStatus = 'connecting'; // 'connecting' | 'connected' | 'reconnecting' | 'timeout'
let unsubscribeSession = null;
let heartbeatWatchTimer = null;
let timeoutTimer = null;
let simulatedOffline = false;

let isBuildingWheel = false;
let activeWheel = null;

// Private local phone state (never sent to server)
let profile = loadJson(PROFILE_STORAGE_KEY, null);
// { backgroundId, experienceId, things: ['A','B','E'] }

let extras = loadJson(EXTRAS_STORAGE_KEY, {
  r2ProofIds: [],
  r2TypedLine: '',
  e3MapSelected: null, // initialized from profile.things A–F
});

// Ephemeral per-round phone play state
const playState = {
  r1Spins: [],
  r2LastResult: null,
  r3Dial: 50,
  r3Spins: [],
  r4Current: null,
  r4Voted: null,
  r4Caught: 0,
  r4Total: 0,
  r4SeenIds: new Set(),
  r5Switchers: false,
  r5LastResult: null,
  r6WithResume: false,
  r6Current: null,
  e1Answers: {}, // { 0: boolean (userPickedMatches), 1: ..., 2: ... }
};

// Setup draft (before Continue)
const setupDraft = {
  backgroundId: null,
  experienceId: null,
  things: [],
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Keep working in-memory if private browsing restricts storage
  }
}

function resetProfileToEdit() {
  if (profile) {
    setupDraft.backgroundId = profile.backgroundId;
    setupDraft.experienceId = profile.experienceId;
    setupDraft.things = Array.isArray(profile.things) ? [...profile.things] : [];
  }
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(EXTRAS_STORAGE_KEY);
  } catch {}
  profile = null;
  extras = { r2ProofIds: [], r2TypedLine: '', e3MapSelected: null };
  render();
}

resetProfileBtn?.addEventListener('click', () => {
  if (confirm('Change your background and experience answers? Your wheel will recalculate.')) {
    resetProfileToEdit();
  }
});


function getWhatsAppBtnHtml(label = 'Book 1:1 on WhatsApp with Sanket', extraStyle = '') {
  return `
    <a href="${esc(WHATSAPP_1ON1_URL)}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="${extraStyle}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.073-2.027-.478-1.7-1.045-2.784-2.812-2.868-2.925-.084-.112-.686-.913-.686-1.742 0-.828.434-1.236.589-1.395.155-.158.337-.198.45-.198.113 0 .225.001.325.006.107.005.25-.041.391.298.144.347.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.188-.173.289l-.26.304c-.087.098-.178.204-.077.377.101.173.45.742.966 1.202.665.592 1.226.776 1.399.863.173.086.274.072.376-.044.102-.115.434-.505.549-.679.115-.173.231-.144.39-.086.158.058 1.011.477 1.184.564.173.086.289.13.332.202.043.072.043.419-.101.824z"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.981-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 100 17 8.46 8.46 0 004.743-1.442l.338-.204 3.09.812-.826-3.016.223-.356A8.463 8.463 0 0020.5 12 8.51 8.51 0 0012 3.5z"/>
      </svg>
      <span>${esc(label)}</span>
    </a>
  `;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pointerSvg() {
  return `<div class="wheel-pointer" aria-hidden="true">
    <svg viewBox="0 0 24 32" fill="none">
      <path d="M12 32L2 10C-1 5 1 0 6 0H18C23 0 25 5 22 10L12 32Z" fill="#d95f2b"/>
      <path d="M12 27L5 10C3 6 4 2.5 7.5 2.5H16.5C20 2.5 21 6 19 10L12 27Z" fill="#f58b57"/>
    </svg>
  </div>`;
}

function wheelSize() {
  return Math.min(310, Math.max(248, window.innerWidth - 56));
}

function cleanupWheel() {
  if (activeWheel) {
    activeWheel.destroy();
    activeWheel = null;
  }
}

/* =========================== CONNECTION & 10s TIMEOUT =========================== */
function startDisconnectTimeout() {
  if (timeoutTimer) return;
  timeoutTimer = setTimeout(() => {
    timeoutTimer = null;
    if (connectionStatus !== 'connected') {
      connectionStatus = 'timeout';
      render();
    }
  }, 10_000);
}

function clearDisconnectTimeout() {
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
}

let lastObservedUpdatedAt = 0;

function connectToSession() {
  if (unsubscribeSession) {
    unsubscribeSession();
    unsubscribeSession = null;
  }
  if (heartbeatWatchTimer) {
    clearInterval(heartbeatWatchTimer);
    heartbeatWatchTimer = null;
  }

  if (simulatedOffline) {
    connectionStatus = 'reconnecting';
    startDisconnectTimeout();
    render();
    return;
  }

  connectionStatus = connectionStatus === 'timeout' ? 'reconnecting' : 'connecting';
  startDisconnectTimeout();
  render();

  unsubscribeSession = subscribeSession(
    (data) => {
      if (simulatedOffline) return;
      clearDisconnectTimeout();
      const wasDisconnected = connectionStatus !== 'connected';
      connectionStatus = 'connected';
      lastSessionData = data;

      const nextHostLive = isHostLive(data);
      const liveChanged = nextHostLive !== hostLiveNow;
      hostLiveNow = nextHostLive;

      const remoteUpdatedAt = typeof data.updatedAt === 'number' ? data.updatedAt : 0;
      const nextIdx = typeof data.stageIndex === 'number' ? data.stageIndex : 0;
      const clampedIdx = Math.max(0, Math.min(STAGES.length - 1, nextIdx));

      // Guard: Only adopt stage index if it's the initial connection or if updatedAt is >= lastObservedUpdatedAt
      const isInitial = lastObservedUpdatedAt === 0;
      const isFresh = remoteUpdatedAt >= lastObservedUpdatedAt;

      let changed = false;
      if (isInitial || isFresh) {
        if (remoteUpdatedAt > 0) lastObservedUpdatedAt = remoteUpdatedAt;
        changed = clampedIdx !== hostStageIndex;
        hostStageIndex = clampedIdx;
      }

      if (wasDisconnected || liveChanged || changed || !mainEl.innerHTML.trim() || reconnectSlot.innerHTML.trim()) {
        render();
      }
    },
    () => {
      if (simulatedOffline) return;
      if (connectionStatus !== 'timeout') {
        connectionStatus = 'reconnecting';
        startDisconnectTimeout();
        render();
      }
    }
  );

  // Re-check host heartbeat freshness every 15s so phones lock if host drops off
  heartbeatWatchTimer = setInterval(() => {
    if (simulatedOffline || connectionStatus !== 'connected' || !lastSessionData) return;
    const nextLive = isHostLive(lastSessionData);
    if (nextLive !== hostLiveNow) {
      hostLiveNow = nextLive;
      render();
    }
  }, 15_000);
}

/* =========================== RENDER ROUTER =========================== */
function render() {
  cleanupWheel();

  // Handle connection failure (10-second timeout -> Waiting for your host + Retry, NEVER self-paced)
  if (connectionStatus === 'timeout') {
    reconnectSlot.innerHTML = '';
    statusPillEl.textContent = 'Offline';
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <h1 class="phone-h1">Waiting for your host</h1>
        <p class="phone-muted">We couldn’t reach the live session. Look at the main screen, or tap retry.</p>
        <button type="button" class="btn btn-primary" id="retryConnectBtn" style="min-width: 180px;">Retry</button>
      </div>
    `;
    document.getElementById('retryConnectBtn').addEventListener('click', () => {
      connectionStatus = 'reconnecting';
      connectToSession();
    });
    return;
  }

  // Handle initial connecting or reconnecting
  if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
    reconnectSlot.innerHTML = '';
    statusPillEl.textContent = 'Reconnecting';
    mainEl.innerHTML = `
      <div class="phone-center-screen" role="status" aria-live="polite">
        <div class="calm-spinner" aria-hidden="true"></div>
        <h1 class="phone-h1">Reconnecting. Look at the main screen.</h1>
      </div>
    `;
    return;
  }

  reconnectSlot.innerHTML = '';

  if (resetProfileBtn) {
    resetProfileBtn.style.display = profile && hostLiveNow ? 'inline-flex' : 'none';
  }

  // If no host screen is live right now, lock phone to waiting screen
  if (!hostLiveNow) {
    statusPillEl.textContent = 'Waiting';
    document.title = 'Waiting for host | The AI PM';
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">Live Session</span>
        <h1 class="phone-h1">Waiting for your host</h1>
        <p class="phone-muted">No live host screen is active right now. Stay on this page — your screen will wake up as soon as your host starts.</p>
      </div>
    `;
    return;
  }

  // 3-second “Building your wheel…” interstitial after setup Continue
  if (isBuildingWheel) {
    statusPillEl.textContent = 'Setup';
    mainEl.innerHTML = `
      <div class="phone-center-screen" role="status" aria-live="polite">
        <div class="calm-spinner" aria-hidden="true"></div>
        <h1 class="phone-h1">Building your wheel…</h1>
        <p class="phone-muted">Nothing you chose leaves your phone.</p>
      </div>
    `;
    return;
  }

  const stage = STAGES[hostStageIndex] || STAGES[0];
  statusPillEl.textContent = stage.section;
  document.title = `${stage.roundName || stage.section} | The AI PM`;

  // Opening Scenes 1 & 2 -> Watch the host
  if (stage.type === 'opening_scene') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">Opening</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen</p>
      </div>
    `;
    return;
  }

  // If participant has not completed setup yet (during Opening Setup OR as a late joiner)
  if (!profile) {
    renderSetupForm();
    return;
  }

  // Opening Setup completed -> Watch the host
  if (stage.type === 'opening_setup') {
    const slices = computePersonalSlices(profile);
    const pm = slices.find((s) => s.key === 'pm');
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-good">Your wheel is ready</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Your Product Manager slice starts at <strong>${pm.pct}%</strong> on our wheel. Look at the main screen for Round 1.</p>
        <button type="button" class="btn" id="phoneChangeAnswersBtn" style="margin-top: 14px; padding: 8px 16px; font-size: 14px;">Change answers</button>
      </div>
    `;
    document.getElementById('phoneChangeAnswersBtn')?.addEventListener('click', () => {
      resetProfileToEdit();
    });
    return;
  }

  // Stage 1: Story -> Watch the host
  if (stage.type === 'story') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">${esc(stage.roundName || 'Round ' + stage.round)}</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen</p>
      </div>
    `;
    return;
  }

  // Stage 2: Context card -> Watch the host
  if (stage.type === 'context') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">${esc(stage.roundName)}</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen as your host sets up the wheel</p>
      </div>
    `;
    return;
  }

  // Stage 3: Play (ONLY stage where phones can spin!)
  if (stage.type === 'play') {
    if (stage.round === 1) renderPhoneR1Play();
    else if (stage.round === 2) renderPhoneR2Play();
    else if (stage.round === 3) renderPhoneR3Play();
    else if (stage.round === 4) renderPhoneR4Play();
    else if (stage.round === 5) renderPhoneR5Play();
    else if (stage.round === 6) renderPhoneR6Play();
    return;
  }

  // Stage 4: Reveal -> Watch the host (Takeaway page removed so users focus on host)
  if (stage.type === 'reveal') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">${esc(stage.roundName)}</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen as your host explains what happened</p>
      </div>
    `;
    return;
  }

  // Stage 5: Hold -> Watch the host
  if (stage.type === 'hold') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill">${esc(stage.roundName)}</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen</p>
      </div>
    `;
    return;
  }

  // Ending E1: Spot it
  if (stage.type === 'e1_spot') {
    renderPhoneE1Spot(stage.questionIndex);
    return;
  }

  // Ending E2: Stage 58 AI PM Analogy -> Watch the host
  if (stage.type === 'e2_story') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">The AI PM Analogy</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Look at the main screen for the Classic PM vs AI PM breakdown</p>
      </div>
    `;
    return;
  }

  // Ending E3: Your map -> Watch the host
  if (stage.type === 'e3_map') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <span class="pill pill-accent">Your map</span>
        <h1 class="phone-h1">Watch the host.</h1>
        <p class="phone-muted">Skills you already bring — look at the main screen</p>
      </div>
    `;
    return;
  }

  // Ending E4: Stage 60 The AI interview game
  if (stage.type === 'e4_next') {
    mainEl.innerHTML = `
      <div class="phone-center-screen" style="text-align: left; align-items: stretch;">
        <span class="pill pill-accent" style="align-self: flex-start;">The AI interview game</span>
        <h1 class="phone-h1" style="margin-top: 6px; font-size: 24px;">The 3 Pillars</h1>
        <div class="card" style="display: flex; flex-direction: column; gap: 10px; padding: 14px 16px;">
          <div>
            <div style="font-weight: 800; color: var(--ink); font-size: 15px;">1. The Application process</div>
            <div style="font-size: 13px; color: var(--ink-muted); margin-top: 2px;">Targeting the right doors where your context counts and turning a 9% wheel into interviews.</div>
          </div>
          <div>
            <div style="font-weight: 800; color: var(--ink); font-size: 15px;">2. The interview practice</div>
            <div style="font-size: 13px; color: var(--ink-muted); margin-top: 2px;">Probabilistic PRDs, system design trade-offs, and statistical eval rubrics under pressure.</div>
          </div>
          <div>
            <div style="font-weight: 800; color: var(--ink); font-size: 15px;">3. The toolkit</div>
            <div style="font-size: 13px; color: var(--ink-muted); margin-top: 2px;">Working RAG architectures, prompt evals, data flywheel moats, and production case teardowns.</div>
          </div>
        </div>
        ${getWhatsAppBtnHtml('Chat 1:1 on WhatsApp with Sanket', 'width: 100%; margin-top: 12px; padding: 14px; font-size: 15px;')}
      </div>
    `;
    return;
  }


  // Ending E5: AI PM Course Curriculum
  if (stage.type === 'e5_brochure') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; padding-top: 4px;">
        <span class="pill pill-good" style="align-self: flex-start;">Curriculum & Cohort</span>
        <h1 class="phone-h1" style="font-size: 22px; margin: 0;">AI Product Management</h1>
        <p class="phone-muted" style="margin: 0; font-size: 13px;">The complete course curriculum by Sanket</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${AI_PM_BROCHURE_MODULES.map((m) => `
            <div class="card" style="padding: 12px 14px; display: flex; flex-direction: column; gap: 5px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; font-weight: 800; color: var(--accent);">Module ${esc(m.number)}</span>
                <span class="pill pill-accent" style="font-size: 10px; padding: 1px 6px;">${esc(m.badge)}</span>
              </div>
              <div style="font-weight: 800; font-size: 15px; color: var(--ink);">${esc(m.title)}</div>
              <p style="font-size: 12.5px; color: var(--ink-muted); margin: 0; line-height: 1.4;">${esc(m.desc)}</p>
            </div>
          `).join('')}
        </div>

        <div class="card-accent" style="padding: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 800; font-size: 14px; color: var(--ink);">Ready to transition to AI PM?</div>
          <p style="font-size: 12.5px; color: var(--ink-muted); margin: 0;">
            Connect 1:1 with Sanket to discuss your background, portfolio fit, and next cohort details.
          </p>
          ${getWhatsAppBtnHtml('Chat 1:1 on WhatsApp with Sanket', 'width: 100%; padding: 13px; font-size: 14.5px;')}
        </div>
      </div>
    `;
    return;
  }

  // Q&A
  if (stage.type === 'qa') {
    mainEl.innerHTML = `
      <div class="phone-center-screen">
        <h1 class="phone-h1">Questions</h1>
        <p class="phone-muted">Ask your hosts anything.</p>
      </div>
    `;
  }
}

/* =========================== 4.1 PHONE SETUP =========================== */
function renderSetupForm() {
  const canContinue = Boolean(setupDraft.backgroundId && setupDraft.experienceId && setupDraft.things.length === 3);

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 22px; padding-bottom: 16px;">
      <div>
        <h1 class="phone-h1">Set up your wheel</h1>
        <p class="phone-muted" style="margin-top: 4px;">Three taps. About 60 seconds. Nothing you choose leaves your phone.</p>
      </div>

      <fieldset class="setup-fieldset">
        <legend class="setup-legend">1. Where have you spent most of your career?</legend>
        <div class="option-grid" id="q1Options">
          ${BACKGROUNDS.map((bg) => `
            <button type="button" class="option-btn" data-bg="${bg.id}" aria-pressed="${setupDraft.backgroundId === bg.id}">
              <span>${esc(bg.label)}</span>
              <span aria-hidden="true">${setupDraft.backgroundId === bg.id ? '●' : '○'}</span>
            </button>
          `).join('')}
        </div>
      </fieldset>

      <fieldset class="setup-fieldset">
        <legend class="setup-legend">2. Years of experience</legend>
        <div class="option-grid-2" id="q2Options">
          ${EXPERIENCE_BANDS.map((exp) => `
            <button type="button" class="option-btn" data-exp="${exp.id}" aria-pressed="${setupDraft.experienceId === exp.id}">
              <span>${esc(exp.label)}</span>
            </button>
          `).join('')}
        </div>
      </fieldset>

      <fieldset class="setup-fieldset">
        <legend class="setup-legend">3. Pick 3 things you’ve done at work</legend>
        <p class="phone-muted" id="q3Counter" aria-live="polite" style="font-weight: 700; color: ${setupDraft.things.length === 3 ? 'var(--good)' : 'var(--ink-muted)'};">
          ${setupDraft.things.length} of 3 selected
        </p>
        <div class="option-grid" id="q3Options">
          ${WORK_THINGS.map((t) => {
            const selected = setupDraft.things.includes(t.id);
            const maxed = setupDraft.things.length >= 3 && !selected;
            return `
              <button type="button" class="option-btn" data-thing="${t.id}" aria-pressed="${selected}" ${maxed ? 'disabled' : ''}>
                <span><strong>${t.id}.</strong> ${esc(t.label)}</span>
                <span aria-hidden="true">${selected ? '✓' : ''}</span>
              </button>
            `;
          }).join('')}
        </div>
      </fieldset>

      <button type="button" class="btn btn-primary btn-block" id="setupContinueBtn" ${canContinue ? '' : 'disabled'}>
        Continue
      </button>
    </div>
  `;

  document.querySelectorAll('#q1Options button').forEach((btn) => {
    btn.addEventListener('click', () => {
      setupDraft.backgroundId = btn.dataset.bg;
      renderSetupForm();
    });
  });

  document.querySelectorAll('#q2Options button').forEach((btn) => {
    btn.addEventListener('click', () => {
      setupDraft.experienceId = btn.dataset.exp;
      renderSetupForm();
    });
  });

  document.querySelectorAll('#q3Options button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.thing;
      const idx = setupDraft.things.indexOf(id);
      if (idx >= 0) {
        setupDraft.things.splice(idx, 1);
      } else if (setupDraft.things.length < 3) {
        setupDraft.things.push(id);
      }
      renderSetupForm();
    });
  });

  document.getElementById('setupContinueBtn').addEventListener('click', () => {
    if (!setupDraft.backgroundId || !setupDraft.experienceId || setupDraft.things.length !== 3) return;
    profile = {
      backgroundId: setupDraft.backgroundId,
      experienceId: setupDraft.experienceId,
      things: [...setupDraft.things],
    };
    saveJson(PROFILE_STORAGE_KEY, profile);
    // Pre-select matching items (A–F) for E3 Your Map
    extras.e3MapSelected = profile.things.filter((id) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(id));
    saveJson(EXTRAS_STORAGE_KEY, extras);

    // 3-second “Building your wheel…” screen per spec Section 4.1
    isBuildingWheel = true;
    render();
    setTimeout(() => {
      isBuildingWheel = false;
      render();
    }, 3000);
  });
}

/* =========================== ROUND 1 PHONE PLAY =========================== */
function renderPhoneR1Play() {
  const slices = computePersonalSlices(profile);
  const pmSlice = slices.find((s) => s.key === 'pm');
  const lastSpin = playState.r1Spins[playState.r1Spins.length - 1] || null;
  const promptMsg = playState.r1Spins.length === 0
    ? 'Spin your wheel.'
    : playState.r1Spins.length === 1
      ? 'Now spin again.'
      : 'Same resume. Same wheel. Different answer?';

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Your personal career wheel"></canvas>
      </div>

      <div class="meter-box" style="width: 100%;">
        <span class="phone-muted" style="font-weight: 700;">Product Manager (on our wheel)</span>
        <span class="meter-value" style="font-size: 20px;">${pmSlice.pct}%</span>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">Spin</button>

      <div class="card" id="phoneR1Result" aria-live="polite" style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
        ${lastSpin
          ? `<div style="font-size: 20px; font-weight: 800; color: ${lastSpin.isDream ? 'var(--dream)' : 'var(--ink)'};">${esc(lastSpin.label)}</div>
             <p class="phone-muted">${esc(lastSpin.description)}</p>`
          : `<p class="phone-muted">Tap Spin to see where your wheel lands.</p>`}
        <p class="phone-text" style="font-weight: 700; color: var(--accent); margin-top: 4px;">${promptMsg}</p>
      </div>

      <div class="chip-row" id="phoneR1Chips" style="width: 100%;">
        ${playState.r1Spins.map((s, i) => `<span class="result-chip ${s.isDream ? 'dream' : ''}">#${i + 1} ${esc(s.label)}</span>`).join('')}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: wheelSize(), isHost: false });
  activeWheel.setSlices(slices, false);

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;

    playState.r1Spins.push(res.slice);

    // Optional anonymous tally of landing bucket (zero setup info or personal data sent)
    if (res.slice.tallyBucket) {
      fetch('/api/live/tally', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: res.slice.tallyBucket }),
      }).catch(() => {
        recordTallyDirect(res.slice.tallyBucket).catch(() => {});
      });
    }

    const msg = playState.r1Spins.length === 1 ? 'Now spin again.' : 'Same resume. Same wheel. Different answer?';
    document.getElementById('phoneR1Result').innerHTML = `
      <div style="font-size: 20px; font-weight: 800; color: ${res.slice.isDream ? 'var(--dream)' : 'var(--ink)'};">${esc(res.slice.label)}</div>
      <p class="phone-muted">${esc(res.slice.description)}</p>
      <p class="phone-text" style="font-weight: 700; color: var(--accent); margin-top: 4px;">${msg}</p>
    `;
    document.getElementById('phoneR1Chips').innerHTML = playState.r1Spins
      .map((s, i) => `<span class="result-chip ${s.isDream ? 'dream' : ''}">#${i + 1} ${esc(s.label)}</span>`)
      .join('');
  });
}

/* =========================== ROUND 2 PHONE PLAY =========================== */
function renderPhoneR2Play() {
  const getSlices = () =>
    computePersonalSlices(profile, {
      proofIds: extras.r2ProofIds,
      typedLine: extras.r2TypedLine,
    });

  const slices = getSlices();
  const productTotal = slices.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0);
  const pmPct = slices.find((s) => s.key === 'pm')?.pct || 5;

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Your wheel with proof lines"></canvas>
      </div>

      <div class="meter-box" style="width: 100%;">
        <span class="phone-muted" style="font-weight: 700;">Product roles (on our wheel)</span>
        <span class="meter-value" id="phoneR2Meter" style="font-size: 20px;">${productTotal}% <span style="font-size: 14px; color: var(--ink-muted);">(PM ${pmPct}%)</span></span>
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
        <h2 class="phone-h2">Add a proof line. Tap what’s true for you.</h2>
        <div style="display: flex; flex-direction: column; gap: 8px;" id="phoneProofChips">
          ${PHONE_PROOF_CHIPS.map((c) => {
            const on = extras.r2ProofIds.includes(c.id);
            return `
              <button type="button" class="chip-toggle" data-proof="${c.id}" aria-pressed="${on}">
                <span aria-hidden="true" style="font-weight: 800; color: var(--accent);">${on ? '✓' : '+'}</span>
                <span>${esc(c.label)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 6px;">
          <label for="typedProofLine" class="phone-muted" style="font-weight: 700;">Or type one real line from your resume.</label>
          <input type="text" id="typedProofLine" class="text-input" value="${esc(extras.r2TypedLine)}" placeholder="Stays only on your phone" autocomplete="off">
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">Spin</button>
      <div id="phoneR2Out" class="phone-text" aria-live="polite" style="font-weight: 700; text-align: center;">
        ${playState.r2LastResult ? `Landed on: ${esc(playState.r2LastResult)}` : ''}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: wheelSize(), isHost: false });
  activeWheel.setSlices(slices, false);

  function refreshSlices(animate = true) {
    saveJson(EXTRAS_STORAGE_KEY, extras);
    const next = getSlices();
    activeWheel.setSlices(next, animate, 950);
    const nextProd = next.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0);
    const nextPm = next.find((s) => s.key === 'pm')?.pct || 5;
    document.getElementById('phoneR2Meter').innerHTML = `${nextProd}% <span style="font-size: 14px; color: var(--ink-muted);">(PM ${nextPm}%)</span>`;
  }

  document.querySelectorAll('#phoneProofChips button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.proof;
      const idx = extras.r2ProofIds.indexOf(id);
      if (idx >= 0) extras.r2ProofIds.splice(idx, 1);
      else extras.r2ProofIds.push(id);

      const on = extras.r2ProofIds.includes(id);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('span').textContent = on ? '✓' : '+';
      refreshSlices(true);
    });
  });

  const typedInput = document.getElementById('typedProofLine');
  let hadTyped = Boolean(extras.r2TypedLine.trim());
  typedInput.addEventListener('input', (e) => {
    extras.r2TypedLine = e.target.value;
    const hasNow = Boolean(extras.r2TypedLine.trim());
    saveJson(EXTRAS_STORAGE_KEY, extras);
    if (hasNow !== hadTyped) {
      hadTyped = hasNow;
      refreshSlices(true);
    }
  });

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    playState.r2LastResult = `${res.slice.label} (${res.slice.pct}% on our wheel)`;
    document.getElementById('phoneR2Out').textContent = `Landed on: ${playState.r2LastResult}`;
  });
}

/* =========================== ROUND 3 PHONE PLAY =========================== */
function renderPhoneR3Play() {
  const baseSix = computePersonalSlices(profile, {
    proofIds: extras.r2ProofIds,
    typedLine: extras.r2TypedLine,
  });
  const slices = computePhoneR3Slices(baseSix, playState.r3Dial);
  const top = slices.reduce((m, s) => (s.pct > m.pct ? s : m), slices[0]);
  const settingName = getDialSettingName(playState.r3Dial);

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Your wheel with Careful to Bold dial"></canvas>
      </div>

      <div class="meter-box" style="width: 100%;">
        <span class="phone-muted" style="font-weight: 700;">Biggest slice</span>
        <span class="meter-value" id="phoneR3Biggest" style="font-size: 18px;">${esc(top.label)} ${top.pct}%</span>
      </div>

      <div class="card dial-control" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800;">
          <span>Careful</span>
          <span id="phoneDialLabel" style="color: var(--accent);">${settingName}</span>
          <span>Bold</span>
        </div>
        <label for="phoneDialRange" class="visually-hidden">Dial from Careful to Bold</label>
        <input type="range" id="phoneDialRange" class="dial-range" min="0" max="100" value="${playState.r3Dial}">
        <div class="dial-presets">
          <button type="button" class="dial-preset" data-dial="0" aria-pressed="${playState.r3Dial <= 15}">Careful</button>
          <button type="button" class="dial-preset" data-dial="50" aria-pressed="${playState.r3Dial > 15 && playState.r3Dial < 85}">Balanced</button>
          <button type="button" class="dial-preset" data-dial="100" aria-pressed="${playState.r3Dial >= 85}">Bold</button>
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">Spin</button>

      <div class="chip-row" id="phoneR3Chips" style="width: 100%;">
        ${playState.r3Spins.map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`).join('')}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: wheelSize(), isHost: false });
  activeWheel.setSlices(slices, false);

  const rangeEl = document.getElementById('phoneDialRange');

  function updateDial(val, animate) {
    playState.r3Dial = val;
    rangeEl.value = String(val);
    rangeEl.style.setProperty('--progress', `${val}%`);
    document.getElementById('phoneDialLabel').textContent = getDialSettingName(val);
    document.querySelectorAll('.dial-preset').forEach((b) => {
      const target = Number(b.dataset.dial);
      const on = (target === 0 && val <= 15) || (target === 50 && val > 15 && val < 85) || (target === 100 && val >= 85);
      b.setAttribute('aria-pressed', String(on));
    });
    const nextSlices = computePhoneR3Slices(baseSix, val);
    const biggest = nextSlices.reduce((m, s) => (s.pct > m.pct ? s : m), nextSlices[0]);
    document.getElementById('phoneR3Biggest').textContent = `${biggest.label} ${biggest.pct}%`;
    activeWheel.setSlices(nextSlices, animate, 650);
  }

  rangeEl.addEventListener('input', (e) => updateDial(Number(e.target.value), false));
  document.querySelectorAll('.dial-preset').forEach((b) => {
    b.addEventListener('click', () => updateDial(Number(b.dataset.dial), true));
  });

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    const setting = getDialSettingName(playState.r3Dial);
    playState.r3Spins.push({ label: res.slice.label, setting });
    document.getElementById('phoneR3Chips').innerHTML = playState.r3Spins
      .map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`)
      .join('');
  });
}

/* =========================== ROUND 4 PHONE PLAY =========================== */
function renderPhoneR4Play() {
  const statements = buildPhoneStatements(profile);
  const wheelSlices = statements.map((st, idx) => ({
    key: st.id,
    label: `Line ${idx + 1}`,
    weight: 1,
    pct: 17,
    color: SLICE_COLORS.statement[idx % SLICE_COLORS.statement.length],
    statement: st,
  }));

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <div id="phoneR4ScoreSlot">${playState.r4Total > 0 ? `<div class="pill pill-accent tabular">You caught ${playState.r4Caught} of ${playState.r4Total}</div>` : ''}</div>

      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Wheel of six statements about you"></canvas>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">
        ${playState.r4Current ? 'Spin for another line' : 'Spin'}
      </button>

      <div id="phoneR4CardSlot" style="width: 100%;" aria-live="polite">
        ${renderPhoneR4Card()}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: Math.min(265, wheelSize()), isHost: false, mode: 'statement' });
  activeWheel.setSlices(wheelSlices, false);

  bindPhoneR4VoteButtons();

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const unseen = wheelSlices
      .map((s, idx) => ({ idx, id: s.statement.id }))
      .filter((x) => !playState.r4SeenIds.has(x.id));
    const pool = unseen.length > 0 ? unseen : wheelSlices.map((s, idx) => ({ idx, id: s.statement.id }));
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const res = await activeWheel.spin(pick.idx);
    spinBtn.disabled = false;
    if (!res) return;

    playState.r4Current = res.slice.statement;
    playState.r4Voted = null;
    playState.r4SeenIds.add(res.slice.statement.id);
    if (playState.r4SeenIds.size >= wheelSlices.length) playState.r4SeenIds.clear();

    spinBtn.textContent = 'Spin for another line';
    document.getElementById('phoneR4CardSlot').innerHTML = renderPhoneR4Card();
    bindPhoneR4VoteButtons();
  });
}

function renderPhoneR4Card() {
  if (!playState.r4Current) {
    return `<div class="card-subtle"><p class="phone-muted">Spin the wheel, then call it: real or fake.</p></div>`;
  }
  const st = playState.r4Current;
  if (playState.r4Voted === null) {
    return `
      <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
        <div class="phone-muted" style="font-weight: 700;">The wheel says, in a perfectly confident tone:</div>
        <div class="phone-h2">“${esc(st.text)}”</div>
        <div class="binary-row">
          <button type="button" class="btn btn-good" data-vote="real">Real</button>
          <button type="button" class="btn btn-warn" data-vote="fake">Fake</button>
        </div>
      </div>
    `;
  }
  const userSaidReal = playState.r4Voted === 'real';
  const caught = userSaidReal === st.isReal;
  const reason = st.isReal
    ? 'You told us that.'
    : 'You never told us that. It sounded just as sure.';
  return `
    <div class="card" style="display: flex; flex-direction: column; gap: 10px; border-color: ${caught ? 'var(--good)' : 'var(--warn)'};">
      <div class="pill ${caught ? 'pill-good' : 'pill-warn'}" style="align-self: flex-start;">${caught ? 'You caught it' : 'It fooled you'}</div>
      <div class="phone-h2">“${esc(st.text)}”</div>
      <p class="phone-text">${reason}</p>
      <p class="phone-muted" style="font-weight: 700;">You caught ${playState.r4Caught} of ${playState.r4Total}</p>
    </div>
  `;
}

function bindPhoneR4VoteButtons() {
  document.querySelectorAll('#phoneR4CardSlot button[data-vote]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vote = btn.dataset.vote;
      playState.r4Voted = vote;
      playState.r4Total += 1;
      if ((vote === 'real') === playState.r4Current.isReal) {
        playState.r4Caught += 1;
      }
      const scoreSlot = document.getElementById('phoneR4ScoreSlot');
      if (scoreSlot) {
        scoreSlot.innerHTML = `<div class="pill pill-accent tabular">You caught ${playState.r4Caught} of ${playState.r4Total}</div>`;
      }
      document.getElementById('phoneR4CardSlot').innerHTML = renderPhoneR4Card();
    });
  });
}

/* =========================== ROUND 5 PHONE PLAY =========================== */
function renderPhoneR5Play() {
  const getSlices = () =>
    computePersonalSlices(profile, {
      proofIds: extras.r2ProofIds,
      typedLine: extras.r2TypedLine,
      addSwitchers: playState.r5Switchers,
    });

  const slices = getSlices();
  const pmSlice = slices.find((s) => s.key === 'pm');

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Your wheel in Round 5"></canvas>
      </div>

      <div class="meter-box" style="width: 100%;">
        <span class="phone-muted" style="font-weight: 700;">Product Manager (on our wheel)</span>
        <span class="meter-value" id="phoneR5Pm" style="font-size: 20px;">${pmSlice.pct}%</span>
      </div>

      <button type="button" class="chip-toggle" id="phoneR5Toggle" aria-pressed="${playState.r5Switchers}" style="width: 100%;">
        <span aria-hidden="true" style="font-weight: 800; color: var(--accent);">${playState.r5Switchers ? '✓' : '+'}</span>
        <span>Add 30 career switchers who made it</span>
      </button>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">Spin</button>

      <div id="phoneR5Out" class="phone-text" aria-live="polite" style="font-weight: 700; text-align: center;">
        ${playState.r5LastResult ? `Landed on: ${esc(playState.r5LastResult)}` : ''}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: wheelSize(), isHost: false });
  activeWheel.setSlices(slices, false);

  const toggleBtn = document.getElementById('phoneR5Toggle');
  toggleBtn.addEventListener('click', () => {
    playState.r5Switchers = !playState.r5Switchers;
    toggleBtn.setAttribute('aria-pressed', String(playState.r5Switchers));
    toggleBtn.querySelector('span').textContent = playState.r5Switchers ? '✓' : '+';
    const next = getSlices();
    activeWheel.setSlices(next, true, 850);
    document.getElementById('phoneR5Pm').textContent = `${next.find((s) => s.key === 'pm').pct}%`;
  });

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    playState.r5LastResult = `${res.slice.label} (${res.slice.pct}% on our wheel)`;
    document.getElementById('phoneR5Out').textContent = `Landed on: ${playState.r5LastResult}`;
  });
}

/* =========================== ROUND 6 PHONE PLAY =========================== */
function renderPhoneR6Play() {
  function buildSlices() {
    if (!playState.r6WithResume) {
      return buildPhoneStatements(profile).map((st, idx) => ({
        key: st.id,
        label: `Guess ${idx + 1}`,
        weight: 1,
        pct: 17,
        color: SLICE_COLORS.statement[idx % SLICE_COLORS.statement.length],
        item: {
          text: st.text,
          source: st.isReal
            ? 'It happens to be true, but nothing shows where it came from.'
            : 'Source: none. It is invented, and nothing flags it.',
          grounded: false,
        },
      }));
    }
    return buildPhoneSourcedStatements(profile, extras.r2ProofIds, extras.r2TypedLine).map((st, idx) => ({
      key: st.id,
      label: `Source ${idx + 1}`,
      weight: 1,
      pct: 20,
      color: idx < 3 ? '#2563eb' : '#0d9488',
      item: {
        text: st.text,
        source: st.source,
        grounded: true,
      },
    }));
  }

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; align-items: center;">
      <p class="phone-text" style="font-weight: 700; text-align: center;">Spin without the resume first, then hand it over and spin again.</p>

      <div class="mode-switch-row" style="width: 100%;">
        <button type="button" class="dial-preset" id="phoneR6Without" aria-pressed="${!playState.r6WithResume}">Without resume</button>
        <button type="button" class="dial-preset" id="phoneR6With" aria-pressed="${playState.r6WithResume}">Hand it over</button>
      </div>

      <div class="wheel-wrap">
        ${pointerSvg()}
        <canvas id="phoneWheel" class="wheel-canvas" aria-label="Your statement wheel with and without sources"></canvas>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="phoneSpinBtn">Spin</button>

      <div class="card" id="phoneR6Result" aria-live="polite" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
        ${renderPhoneR6Result()}
      </div>
    </div>
  `;

  const canvas = document.getElementById('phoneWheel');
  activeWheel = new WheelRenderer(canvas, { size: Math.min(265, wheelSize()), isHost: false, mode: 'statement' });
  activeWheel.setSlices(buildSlices(), false);

  function setMode(withResume) {
    playState.r6WithResume = withResume;
    playState.r6Current = null;
    document.getElementById('phoneR6Without').setAttribute('aria-pressed', String(!withResume));
    document.getElementById('phoneR6With').setAttribute('aria-pressed', String(withResume));
    activeWheel.setSlices(buildSlices(), false);
    document.getElementById('phoneR6Result').innerHTML = renderPhoneR6Result();
  }

  document.getElementById('phoneR6Without').addEventListener('click', () => setMode(false));
  document.getElementById('phoneR6With').addEventListener('click', () => setMode(true));

  const spinBtn = document.getElementById('phoneSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    playState.r6Current = res.slice.item;
    document.getElementById('phoneR6Result').innerHTML = renderPhoneR6Result();
  });
}

function renderPhoneR6Result() {
  if (!playState.r6Current) {
    return `<p class="phone-muted">${playState.r6WithResume ? 'Only what you told us is on the wheel now. Spin to see the source.' : 'Spin without your resume to see ungrounded guesses.'}</p>`;
  }
  const cur = playState.r6Current;
  return `
    <div class="phone-h2">“${esc(cur.text)}”</div>
    <div class="pill ${cur.grounded ? 'pill-good' : 'pill-warn'}" style="align-self: flex-start;">${esc(cur.source)}</div>
  `;
}

/* =========================== ENDING E1: SPOT IT =========================== */
function renderPhoneE1Spot(qIdx) {
  const q = SPOT_IT_QUESTIONS[qIdx];
  const answered = Object.prototype.hasOwnProperty.call(playState.e1Answers, qIdx);
  const userPickedMatches = playState.e1Answers[qIdx];
  const isRight = answered && userPickedMatches === q.matches;

  const totalRight = SPOT_IT_QUESTIONS.reduce((acc, item, idx) => {
    if (Object.prototype.hasOwnProperty.call(playState.e1Answers, idx) && playState.e1Answers[idx] === item.matches) {
      return acc + 1;
    }
    return acc;
  }, 0);

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="pill pill-accent">Spot it · ${q.index} of 3</span>
      </div>
      <h1 class="phone-h1">Does the AI match its source?</h1>

      <div class="card-subtle" style="display: flex; flex-direction: column; gap: 6px;">
        <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--ink-muted);">Source</div>
        <p class="phone-text" style="font-weight: 600;">“${esc(q.source)}”</p>
      </div>

      <div class="card" style="display: flex; flex-direction: column; gap: 6px; border-color: var(--accent);">
        <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--accent);">AI says</div>
        <p class="phone-text" style="font-weight: 700;">“${esc(q.aiSays)}”</p>
      </div>

      ${!answered
        ? `<div class="binary-row">
             <button type="button" class="btn btn-good" id="spotMatchBtn">Matches</button>
             <button type="button" class="btn btn-warn" id="spotNoMatchBtn">Doesn’t match</button>
           </div>`
        : `<div class="card" aria-live="polite" style="border-color: ${isRight ? 'var(--good)' : 'var(--warn)'}; display: flex; flex-direction: column; gap: 8px;">
             <div class="pill ${isRight ? 'pill-good' : 'pill-warn'}" style="align-self: flex-start;">${isRight ? 'Right.' : 'Not quite.'}</div>
             <p class="phone-text">${q.matches ? 'It matches its source.' : 'It doesn’t match its source.'}</p>
           </div>`}

      ${qIdx === 2 && answered
        ? `<div class="card-dream" style="display: flex; flex-direction: column; gap: 8px;">
             <div class="phone-h2" style="color: var(--dream);">You spotted ${totalRight} of 3.</div>
             <p class="phone-text">You could only catch them because the source was on the table. That is the whole job: wrong answers sound exactly like right ones.</p>
           </div>`
        : ''}
    </div>
  `;

  document.getElementById('spotMatchBtn')?.addEventListener('click', () => {
    playState.e1Answers[qIdx] = true;
    renderPhoneE1Spot(qIdx);
  });
  document.getElementById('spotNoMatchBtn')?.addEventListener('click', () => {
    playState.e1Answers[qIdx] = false;
    renderPhoneE1Spot(qIdx);
  });
}

/* =========================== ENDING E3: YOUR MAP =========================== */
function renderPhoneE3Map() {
  if (!Array.isArray(extras.e3MapSelected)) {
    extras.e3MapSelected = (profile.things || []).filter((id) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(id));
    saveJson(EXTRAS_STORAGE_KEY, extras);
  }
  const selected = new Set(extras.e3MapSelected);

  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px; padding-bottom: 16px;">
      <div>
        <h1 class="phone-h1">Your map</h1>
        <p class="phone-text" style="margin-top: 4px;">What do you already do at work? Tap everything that’s true.</p>
      </div>

      <div class="pill pill-accent tabular" id="mapCountPill" style="align-self: flex-start; font-size: 16px; padding: 8px 14px;" aria-live="polite">
        You already do ${selected.size} of 6.
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;" id="mapItemsList">
        ${YOUR_MAP_ITEMS.map((m) => {
          const on = selected.has(m.id);
          return `
            <button type="button" class="map-toggle-card" data-map-id="${m.id}" aria-pressed="${on}">
              <div class="map-toggle-head">
                <span>${esc(m.item)}</span>
                <span aria-hidden="true" style="color: var(--accent);">${on ? '✓' : '+'}</span>
              </div>
              ${on ? `<div class="map-toggle-move">The PM move: ${esc(m.pmMove)}</div>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <div class="card-subtle">
        <p class="phone-text" style="font-weight: 700;">Not on this list yet: the PM foundations.</p>
        <p class="phone-muted" style="margin-top: 4px;">Writing a PRD, choosing a success metric, deciding what to build first. Those come next.</p>
      </div>
    </div>
  `;

  document.querySelectorAll('#mapItemsList button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.mapId;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      extras.e3MapSelected = Array.from(selected);
      saveJson(EXTRAS_STORAGE_KEY, extras);
      renderPhoneE3Map();
    });
  });
}

/* =========================== PREVIEW TEST HOOKS =========================== */
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'preview-simulate-disconnect') {
    simulatedOffline = Boolean(msg.offline);
    if (simulatedOffline) {
      if (unsubscribeSession) {
        unsubscribeSession();
        unsubscribeSession = null;
      }
      if (heartbeatWatchTimer) {
        clearInterval(heartbeatWatchTimer);
        heartbeatWatchTimer = null;
      }
      connectionStatus = 'reconnecting';
      clearDisconnectTimeout();
      startDisconnectTimeout();
      render();
    } else {
      clearDisconnectTimeout();
      connectToSession();
    }
  } else if (msg.type === 'preview-reset-phone') {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(EXTRAS_STORAGE_KEY);
    } catch {}
    profile = null;
    extras = { r2ProofIds: [], r2TypedLine: '', e3MapSelected: null };
    setupDraft.backgroundId = null;
    setupDraft.experienceId = null;
    setupDraft.things = [];
    render();
  }
});

let phoneResizeTimer = null;
window.addEventListener('resize', () => {
  if (phoneResizeTimer) clearTimeout(phoneResizeTimer);
  phoneResizeTimer = setTimeout(() => {
    if (activeWheel) {
      const targetSize = activeWheel.mode === 'statement' ? Math.min(265, wheelSize()) : wheelSize();
      activeWheel.resize(targetSize);
    }
  }, 100);
});

initSchemeSync(() => activeWheel?.draw());
connectToSession();
