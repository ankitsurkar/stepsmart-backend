import {
  STAGES,
  SANKET_BEFORE_LINES,
  SANKET_AFTER_LINES,
  SANKET_ALL_NINE_LINES,
  SANKET_ROLE_KEYS,
  SANKET_BEFORE_PCTS,
  SANKET_AFTER_PCTS,
  SANKET_R4_STATEMENTS,
  SLICE_COLORS,
  ROUND_TAKEAWAYS,
  SPOT_IT_QUESTIONS,
  YOUR_MAP_ITEMS,
  PROGRAMME_SIGNUP_URL,
} from './data.js';
import {
  computeSanketR2Slices,
  computeSanketR3Slices,
  getDialSettingName,
  computeHostR5Data,
} from './scoring.js';
import { WheelRenderer } from './wheel.js';
import { initSchemeSync, toggleTwoStateScheme, getResolvedScheme } from './theme.js';
import { subscribeSession } from './firebaseSync.js';

const mainEl = document.getElementById('hostMain');
const stageTagEl = document.getElementById('hostStageTag');
const timeTagEl = document.getElementById('hostTimeTag');
const phonesBadgeEl = document.getElementById('hostPhonesBadge');
const prevBtn = document.getElementById('prevStageBtn');
const nextBtn = document.getElementById('nextStageBtn');
const jumpBtn = document.getElementById('jumpStageBtn');
const progressEl = document.getElementById('hostProgressText');
const stageDialog = document.getElementById('stageDialog');
const stageJumpList = document.getElementById('stageJumpList');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const themeBtn = document.getElementById('hostThemeBtn');

let currentIndex = 0;
let activeWheel = null;
let roomTally = {};
let connectedPhones = 0;

// Per-stage ephemeral interactive states for Sanket's live demos
const demoState = {
  r1Spins: [],
  r1SimCounts: null,
  r2Lines: new Set(),
  r2LastResult: null,
  r3Dial: 50,
  r3Spins: [],
  r4Current: null,
  r4Revealed: false,
  r4SeenIds: new Set(),
  r5Switchers: false,
  r5Today: false,
  r5LastResult: null,
  r6WithResume: false,
  r6Current: null,
  e1Revealed: new Set(),
};

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

// Host key for protecting stage-advance API calls.
// Supplied via /live/host?key=YOUR_HOST_KEY (immediately stripped from URL bar for G Meet privacy)
// or entered via the status pill prompt. Kept only in sessionStorage for the current tab.
const HOST_KEY_SESSION_STORAGE = 'aipm_live_host_key';
const _hostParams = new URLSearchParams(window.location.search);
let HOST_KEY = _hostParams.get('key') || '';
if (HOST_KEY) {
  try {
    sessionStorage.setItem(HOST_KEY_SESSION_STORAGE, HOST_KEY);
  } catch {}
  _hostParams.delete('key');
  const nextSearch = _hostParams.toString();
  const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', cleanUrl);
} else {
  try {
    HOST_KEY = sessionStorage.getItem(HOST_KEY_SESSION_STORAGE) || '';
  } catch {}
}

let hostAuthStatus = HOST_KEY ? 'connecting' : 'missing_key'; // 'connecting' | 'live' | 'missing_key' | 'invalid_key' | 'error'
let hostHeartbeatTimer = null;

function updateSyncBadge() {
  if (!phonesBadgeEl) return;
  phonesBadgeEl.style.cursor = 'pointer';
  phonesBadgeEl.title = 'Click to enter or change Host PIN';
  if (hostAuthStatus === 'live') {
    phonesBadgeEl.className = 'pill pill-good tabular';
    phonesBadgeEl.textContent = 'Live · Synced';
  } else if (hostAuthStatus === 'invalid_key') {
    phonesBadgeEl.className = 'pill pill-dream tabular';
    phonesBadgeEl.textContent = 'Invalid PIN · Click to unlock';
  } else if (hostAuthStatus === 'missing_key') {
    phonesBadgeEl.className = 'pill pill-dream tabular';
    phonesBadgeEl.textContent = 'Locked · Click to enter PIN';
  } else if (hostAuthStatus === 'error') {
    phonesBadgeEl.className = 'pill pill-dream tabular';
    phonesBadgeEl.textContent = 'Sync error · Check Vercel env';
  } else {
    phonesBadgeEl.className = 'pill tabular';
    phonesBadgeEl.textContent = 'Connecting…';
  }
}

async function callHostApi(path, body) {
  if (!HOST_KEY) {
    hostAuthStatus = 'missing_key';
    updateSyncBadge();
    return { ok: false, status: 401 };
  }
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Host-Key': HOST_KEY,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      hostAuthStatus = 'live';
      updateSyncBadge();
      return { ok: true, status: res.status };
    }
    if (res.status === 403) {
      hostAuthStatus = 'invalid_key';
      updateSyncBadge();
      return { ok: false, status: 403 };
    }
    hostAuthStatus = 'error';
    updateSyncBadge();
    return { ok: false, status: res.status };
  } catch {
    hostAuthStatus = 'error';
    updateSyncBadge();
    return { ok: false, status: 0 };
  }
}

async function pushStageToServer(index, resetTally = false) {
  const stage = STAGES[index];
  await callHostApi('/api/live/stage', {
    stageIndex: index,
    stageId: stage.id,
    resetTally,
  });
}

function startHostHeartbeat() {
  if (hostHeartbeatTimer) clearInterval(hostHeartbeatTimer);
  hostHeartbeatTimer = setInterval(() => {
    if (!HOST_KEY) return;
    const stage = STAGES[currentIndex];
    callHostApi('/api/live/stage', {
      action: 'heartbeat',
      stageIndex: currentIndex,
      stageId: stage.id,
    });
  }, 25_000);
}

function sendHostEnd() {
  if (!HOST_KEY) return;
  try {
    fetch('/api/live/stage', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Host-Key': HOST_KEY,
      },
      body: JSON.stringify({ action: 'end' }),
    }).catch(() => {});
  } catch {}
}

window.addEventListener('pagehide', sendHostEnd);

phonesBadgeEl?.addEventListener('click', async () => {
  const entered = window.prompt('Enter Host PIN (LIVE_HOST_KEY):', '');
  if (entered === null) return;
  HOST_KEY = entered.trim();
  try {
    if (HOST_KEY) sessionStorage.setItem(HOST_KEY_SESSION_STORAGE, HOST_KEY);
    else sessionStorage.removeItem(HOST_KEY_SESSION_STORAGE);
  } catch {}
  await pushStageToServer(currentIndex, false);
  startHostHeartbeat();
});

function goToStage(index, broadcast = true) {
  const clamped = Math.max(0, Math.min(STAGES.length - 1, index));
  currentIndex = clamped;
  const stage = STAGES[currentIndex];
  document.title = `${stage.title || stage.roundName || stage.section} | Host Screen`;
  renderStage();
  if (broadcast) {
    pushStageToServer(currentIndex, stage.id === 'opening_1');
  }
}

function renderRoleBox(roundNum) {
  const t = ROUND_TAKEAWAYS[roundNum];
  return `
    <div class="host-role-box">
      <div>${esc(t.roleLine)}</div>
      <div><span class="host-pm-move">The PM move:</span> ${esc(t.pmMove)}</div>
    </div>
  `;
}

function renderRoomTallyStrip() {
  const total = Object.values(roomTally).reduce((a, b) => a + b, 0);
  if (total === 0) return '';
  const entries = Object.entries(roomTally)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const summary = entries.map(([k, v]) => `${v} landed on ${k}`).join(' · ');
  return `
    <div class="card-subtle" id="hostRoomTallyCard" style="font-size: 19px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
      <div><strong>Room spins (${total}):</strong> ${esc(summary)}</div>
      <button type="button" class="btn" id="resetTallyBtn" style="min-block-size: 38px; padding: 6px 12px; font-size: 14px;">Clear</button>
    </div>
  `;
}

function cleanupWheel() {
  if (activeWheel) {
    activeWheel.destroy();
    activeWheel = null;
  }
}

function renderStage() {
  cleanupWheel();
  const stage = STAGES[currentIndex];

  stageTagEl.textContent = stage.roundName || stage.section;
  timeTagEl.textContent = stage.minutes;
  progressEl.textContent = `${currentIndex + 1} / ${STAGES.length}`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === STAGES.length - 1;

  // Render by stage type
  if (stage.type === 'opening_scene') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">Opening · ${esc(stage.title)}</div>
        <h1 class="host-title">${stage.highlight ? 'Can you spot when AI is wrong?' : esc(stage.title)}</h1>
        <p class="host-copy">${esc(stage.hostBody)}</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'opening_setup') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">Opening · 60-second setup</div>
        <h1 class="host-title">${esc(stage.title)}</h1>
        <div class="host-callout host-callout-accent">${esc(stage.hostBody)}</div>
        <p class="host-copy-muted">Once you tap Continue on your phone, wait for the host to start Round 1.</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'story') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(stage.roundName)} · Scene ${stage.sceneNum} of ${stage.sceneTotal}</div>
        <h1 class="host-title">${esc(stage.title)}</h1>
        <p class="host-copy">${esc(stage.hostBody)}</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'context') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(stage.roundName)}</div>
        <div class="host-callout host-callout-accent">${esc(stage.contextLine)}</div>
      </div>
    `;
    return;
  }

  if (stage.type === 'hold') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(stage.roundName)} · Complete</div>
        <h1 class="host-title">Ready to move on</h1>
        <p class="host-copy-muted">Up next: ${esc(stage.nextLabel)}</p>
      </div>
    `;
    return;
  }

  // PLAY STAGES (Rounds 1–6)
  if (stage.type === 'play') {
    if (stage.round === 1) renderR1Play();
    else if (stage.round === 2) renderR2Play();
    else if (stage.round === 3) renderR3Play();
    else if (stage.round === 4) renderR4Play();
    else if (stage.round === 5) renderR5Play();
    else if (stage.round === 6) renderR6Play();
    return;
  }

  // REVEAL STAGES (Rounds 1–6)
  if (stage.type === 'reveal') {
    renderReveal(stage);
    return;
  }

  // ENDING STAGES
  if (stage.type === 'e1_spot') {
    renderE1Spot(stage.questionIndex);
    return;
  }

  if (stage.type === 'e2_story') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">Sanket’s story</div>
        <h1 class="host-title">The 9% slice</h1>
        <p class="host-copy">Even after he rewrote his resume, Product Manager was only about a 9% slice on our wheel. Sanket sent 300+ applications and sat through about 10 interviews before one became an offer.</p>
        <div class="host-callout">
          <div style="font-size: 18px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); margin-bottom: 10px;">What he worked out</div>
          He kept asking ‘what am I missing?’ He wasn’t missing anything. In most interviews, another candidate simply had more relevant experience. So the move wasn’t to knock harder on the same doors. It was to find the right door: where his experience already counted.
        </div>
        <p class="host-copy" style="font-weight: 800; color: var(--dream);">Bold finds the door. Context opens it. Probability isn’t destiny, and where you knock changes the odds.</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'e3_map') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div>
          <div class="host-kicker">Your map</div>
          <h1 class="host-title" style="margin-top: 6px;">Skills you already bring</h1>
        </div>
        <div class="host-map-grid">
          ${YOUR_MAP_ITEMS.map((m) => `
            <div class="host-map-card">
              <div class="host-map-item">${esc(m.item)}</div>
              <div class="host-map-move">The PM move: ${esc(m.pmMove)}</div>
            </div>
          `).join('')}
        </div>
        <div class="host-callout host-callout-accent" style="font-size: 24px;">
          Not on this list yet: the PM foundations. Writing a PRD, choosing a success metric, deciding what to build first. Those come next.
        </div>
      </div>
    `;
    return;
  }

  if (stage.type === 'e4_next') {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">What’s next</div>
        <h1 class="host-title">The programme</h1>
        <p class="host-copy">The programme. AI product skills plus the PM foundations, built on the work you already do.</p>
        <div class="host-callout host-callout-dream">
          ${PROGRAMME_SIGNUP_URL
            ? `Curriculum and sign-up: <a href="${esc(PROGRAMME_SIGNUP_URL)}" target="_blank" rel="noopener">${esc(PROGRAMME_SIGNUP_URL)}</a>`
            : 'Your hosts will share the curriculum and the sign-up link now.'}
        </div>
      </div>
    `;
    return;
  }

  if (stage.type === 'qa') {
    mainEl.innerHTML = `
      <div class="host-slide" style="align-items: center; text-align: center;">
        <h1 class="host-title" style="font-size: clamp(56px, 6vw, 84px);">Questions</h1>
      </div>
    `;
  }
}

/* =========================== ROUND 1 PLAY =========================== */
function renderR1Play() {
  const slices = computeSanketR2Slices([]);
  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div class="host-play-grid">
        <div class="host-wheel-col">
          <div class="wheel-wrap">
            ${pointerSvg()}
            <canvas id="hostWheel" class="wheel-canvas" aria-label="Sanket’s role wheel"></canvas>
          </div>
          <div class="meter-box" style="width: 100%; font-size: 22px;">
            <span>His dream slice (on our wheel)</span>
            <span class="meter-value" style="font-size: 26px;">Product Manager 5%</span>
          </div>
          <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 22px; min-block-size: 58px;">Spin Sanket’s wheel</button>
        </div>

        <div class="host-panel-col">
          <div class="host-kicker">Sanket’s five lines (before)</div>
          <ol class="host-resume-list">
            ${SANKET_BEFORE_LINES.map((line, i) => `
              <li class="host-resume-item"><span class="host-line-num">${i + 1}.</span><span>${esc(line)}</span></li>
            `).join('')}
          </ol>

          <div class="card" id="r1ResultCard" aria-live="polite" style="min-height: 92px; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
            ${demoState.r1Spins.length === 0
              ? '<div style="font-size: 22px; color: var(--ink-muted);">Spin the wheel two or three times.</div>'
              : `<div style="font-size: 18px; color: var(--ink-muted); font-weight: 700;">Spin ${demoState.r1Spins.length} landed on</div>
                 <div style="font-size: 32px; font-weight: 800;">${esc(demoState.r1Spins[demoState.r1Spins.length - 1])}</div>`}
          </div>

          <div class="chip-row" id="r1SpinChips">
            ${demoState.r1Spins.map((r, i) => `<span class="result-chip ${r === 'Product Manager' ? 'dream' : ''}">#${i + 1} ${esc(r)}</span>`).join('')}
          </div>
        </div>
      </div>
      <div id="hostRoomTallySlot">${renderRoomTallyStrip()}</div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 420, isHost: true });
  activeWheel.setSlices(slices, false);

  bindTallyReset();

  const spinBtn = document.getElementById('hostSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    demoState.r1Spins.push(res.slice.label);
    const card = document.getElementById('r1ResultCard');
    const chips = document.getElementById('r1SpinChips');
    if (card) {
      card.innerHTML = `
        <div style="font-size: 18px; color: var(--ink-muted); font-weight: 700;">Spin ${demoState.r1Spins.length} landed on</div>
        <div style="font-size: 32px; font-weight: 800; color: ${res.slice.isDream ? 'var(--dream)' : 'var(--ink)'};">${esc(res.slice.label)} <span style="font-size: 20px; color: var(--ink-muted);">(${res.slice.pct}% on our wheel)</span></div>
      `;
    }
    if (chips) {
      chips.innerHTML = demoState.r1Spins.map((r, i) => `<span class="result-chip ${r === 'Product Manager' ? 'dream' : ''}">#${i + 1} ${esc(r)}</span>`).join('');
    }
  });
}

function bindTallyReset() {
  const btn = document.getElementById('resetTallyBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      callHostApi('/api/live/reset-tally', {});
    });
  }
}

/* =========================== ROUND 2 PLAY =========================== */
function renderR2Play() {
  const getSlices = () => computeSanketR2Slices(demoState.r2Lines);
  const slices = getSlices();
  const productTotal = slices.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0);
  const pmPct = slices.find((s) => s.key === 'productManager')?.pct || 5;

  mainEl.innerHTML = `
    <div class="host-play-grid">
      <div class="host-wheel-col">
        <div class="wheel-wrap">
          ${pointerSvg()}
          <canvas id="hostWheel" class="wheel-canvas" aria-label="Sanket’s updated role wheel"></canvas>
        </div>
        <div class="meter-box" style="width: 100%; font-size: 22px;">
          <span>Product roles (on our wheel)</span>
          <span class="meter-value" id="r2ProductMeter" style="font-size: 28px;">${productTotal}%</span>
        </div>
        <div class="meter-box" style="width: 100%; font-size: 19px;">
          <span>Product Manager slice</span>
          <span class="tabular" id="r2PmMeter" style="font-weight: 800;">${pmPct}%</span>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 21px; min-block-size: 54px;">Spin wheel</button>
      </div>

      <div class="host-panel-col">
        <div class="host-kicker">Tap Sanket’s four added lines one at a time</div>
        <div style="display: flex; flex-direction: column; gap: 12px;" id="r2LinesList">
          ${SANKET_AFTER_LINES.map((line, idx) => {
            const on = demoState.r2Lines.has(idx);
            return `
              <button type="button" class="host-toggle-line" data-line-idx="${idx}" aria-pressed="${on}">
                <span class="host-toggle-check" aria-hidden="true">${on ? '✓' : '+'}</span>
                <span>${esc(line)}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="card-subtle" id="r2SpinOut" aria-live="polite" style="font-size: 21px;">
          ${demoState.r2LastResult ? `Landed on: <strong>${esc(demoState.r2LastResult)}</strong>` : 'Tap lines above to watch the slices slide, then spin.'}
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 410, isHost: true });
  activeWheel.setSlices(slices, false);

  document.querySelectorAll('#r2LinesList button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.lineIdx);
      if (demoState.r2Lines.has(idx)) demoState.r2Lines.delete(idx);
      else demoState.r2Lines.add(idx);

      const isOn = demoState.r2Lines.has(idx);
      btn.setAttribute('aria-pressed', String(isOn));
      btn.querySelector('.host-toggle-check').textContent = isOn ? '✓' : '+';

      const nextSlices = getSlices();
      activeWheel.setSlices(nextSlices, true, 900);
      const nextProd = nextSlices.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0);
      const nextPm = nextSlices.find((s) => s.key === 'productManager')?.pct || 5;
      document.getElementById('r2ProductMeter').textContent = `${nextProd}%`;
      document.getElementById('r2PmMeter').textContent = `${nextPm}%`;
    });
  });

  const spinBtn = document.getElementById('hostSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    demoState.r2LastResult = `${res.slice.label} (${res.slice.pct}% on our wheel)`;
    document.getElementById('r2SpinOut').innerHTML = `Landed on: <strong>${esc(demoState.r2LastResult)}</strong>`;
  });
}

/* =========================== ROUND 3 PLAY =========================== */
function renderR3Play() {
  const slices = computeSanketR3Slices(demoState.r3Dial);
  const biggest = slices.reduce((max, s) => (s.pct > max.pct ? s : max), slices[0]);
  const settingName = getDialSettingName(demoState.r3Dial);

  mainEl.innerHTML = `
    <div class="host-play-grid">
      <div class="host-wheel-col">
        <div class="wheel-wrap">
          ${pointerSvg()}
          <canvas id="hostWheel" class="wheel-canvas" aria-label="Sanket’s wheel with Careful to Bold dial"></canvas>
        </div>
        <div class="meter-box" style="width: 100%; font-size: 22px;">
          <span>Biggest slice</span>
          <span class="meter-value" id="r3BiggestMeter" style="font-size: 26px;">${esc(biggest.label)} ${biggest.pct}%</span>
        </div>
      </div>

      <div class="host-panel-col">
        <div class="host-kicker">Turn the dial</div>
        <div class="card dial-control">
          <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 800;">
            <span>Careful</span>
            <span id="r3SettingLabel" style="color: var(--accent);">${settingName}</span>
            <span>Bold</span>
          </div>
          <label for="hostDialRange" class="visually-hidden">Dial from Careful to Bold</label>
          <input type="range" id="hostDialRange" class="dial-range" min="0" max="100" value="${demoState.r3Dial}">
          <div class="dial-presets">
            <button type="button" class="dial-preset" data-dial="0" aria-pressed="${demoState.r3Dial <= 15}" style="font-size: 19px;">Careful</button>
            <button type="button" class="dial-preset" data-dial="50" aria-pressed="${demoState.r3Dial > 15 && demoState.r3Dial < 85}" style="font-size: 19px;">Balanced</button>
            <button type="button" class="dial-preset" data-dial="100" aria-pressed="${demoState.r3Dial >= 85}" style="font-size: 19px;">Bold</button>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 22px; min-block-size: 56px;">Spin on ${settingName}</button>

        <div class="card-subtle" id="r3SpinResult" aria-live="polite" style="font-size: 22px;">
          ${demoState.r3Spins.length === 0
            ? 'Try Careful, then turn it to Bold.'
            : `Landed on: <strong>${esc(demoState.r3Spins[demoState.r3Spins.length - 1].label)}</strong> (${esc(demoState.r3Spins[demoState.r3Spins.length - 1].setting)})`}
        </div>

        <div class="chip-row" id="r3Chips">
          ${demoState.r3Spins.map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 420, isHost: true });
  activeWheel.setSlices(slices, false);

  const rangeEl = document.getElementById('hostDialRange');
  const settingLabelEl = document.getElementById('r3SettingLabel');
  const biggestEl = document.getElementById('r3BiggestMeter');
  const spinBtn = document.getElementById('hostSpinBtn');

  function updateDial(val, animate) {
    demoState.r3Dial = val;
    rangeEl.value = String(val);
    rangeEl.style.setProperty('--progress', `${val}%`);
    const name = getDialSettingName(val);
    settingLabelEl.textContent = name;
    spinBtn.textContent = `Spin on ${name}`;
    document.querySelectorAll('.dial-preset').forEach((b) => {
      const target = Number(b.dataset.dial);
      const isActive = (target === 0 && val <= 15) || (target === 50 && val > 15 && val < 85) || (target === 100 && val >= 85);
      b.setAttribute('aria-pressed', String(isActive));
    });
    const nextSlices = computeSanketR3Slices(val);
    const top = nextSlices.reduce((m, s) => (s.pct > m.pct ? s : m), nextSlices[0]);
    biggestEl.textContent = `${top.label} ${top.pct}%`;
    activeWheel.setSlices(nextSlices, animate, 700);
  }

  rangeEl.addEventListener('input', (e) => updateDial(Number(e.target.value), false));
  document.querySelectorAll('.dial-preset').forEach((btn) => {
    btn.addEventListener('click', () => updateDial(Number(btn.dataset.dial), true));
  });

  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    const setting = getDialSettingName(demoState.r3Dial);
    demoState.r3Spins.push({ label: res.slice.label, setting });
    document.getElementById('r3SpinResult').innerHTML = `Landed on: <strong>${esc(res.slice.label)}</strong> <span class="pill pill-accent">${esc(setting)}</span>`;
    document.getElementById('r3Chips').innerHTML = demoState.r3Spins
      .map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`)
      .join('');
  });
}

/* =========================== ROUND 4 PLAY =========================== */
function renderR4Play() {
  const wheelSlices = SANKET_R4_STATEMENTS.map((st, idx) => ({
    key: st.id,
    label: `Statement ${idx + 1}`,
    weight: 1,
    pct: 17,
    color: SLICE_COLORS.statement[idx % SLICE_COLORS.statement.length],
    statement: st,
  }));

  mainEl.innerHTML = `
    <div class="host-play-grid">
      <div class="host-wheel-col">
        <div class="wheel-wrap">
          ${pointerSvg()}
          <canvas id="hostWheel" class="wheel-canvas" aria-label="Wheel of six statements about Sanket"></canvas>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 22px; min-block-size: 56px;">Spin for a statement</button>
      </div>

      <div class="host-panel-col">
        <div class="host-kicker">Real or fake?</div>
        <div class="card" id="r4StatementCard" aria-live="polite" style="min-height: 220px; display: flex; flex-direction: column; justify-content: center; gap: 16px;">
          ${renderR4CardBody()}
        </div>
        <div id="r4ActionSlot">
          ${demoState.r4Current && !demoState.r4Revealed
            ? '<button type="button" class="btn btn-dream btn-block" id="r4RevealBtn" style="font-size: 22px; min-block-size: 56px;">Reveal: real or fake?</button>'
            : ''}
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 420, isHost: true, mode: 'statement' });
  activeWheel.setSlices(wheelSlices, false);

  function bindRevealBtn() {
    const btn = document.getElementById('r4RevealBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        demoState.r4Revealed = true;
        document.getElementById('r4StatementCard').innerHTML = renderR4CardBody();
        document.getElementById('r4ActionSlot').innerHTML = '';
      });
    }
  }
  bindRevealBtn();

  const spinBtn = document.getElementById('hostSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    // Prefer unseen statements first so Sanket covers both true & fake live
    const unseen = wheelSlices
      .map((s, idx) => ({ idx, id: s.statement.id }))
      .filter((x) => !demoState.r4SeenIds.has(x.id));
    const pool = unseen.length > 0 ? unseen : wheelSlices.map((s, idx) => ({ idx, id: s.statement.id }));
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const res = await activeWheel.spin(pick.idx);
    spinBtn.disabled = false;
    if (!res) return;

    demoState.r4Current = res.slice.statement;
    demoState.r4Revealed = false;
    demoState.r4SeenIds.add(res.slice.statement.id);
    if (demoState.r4SeenIds.size >= wheelSlices.length) demoState.r4SeenIds.clear();

    document.getElementById('r4StatementCard').innerHTML = renderR4CardBody();
    document.getElementById('r4ActionSlot').innerHTML =
      '<button type="button" class="btn btn-dream btn-block" id="r4RevealBtn" style="font-size: 22px; min-block-size: 56px;">Reveal: real or fake?</button>';
    bindRevealBtn();
  });
}

function renderR4CardBody() {
  if (!demoState.r4Current) {
    return '<div style="font-size: 24px; color: var(--ink-muted);">Spin the wheel, read the line aloud, and let the room vote: real or fake.</div>';
  }
  const st = demoState.r4Current;
  const verdict = demoState.r4Revealed
    ? st.isReal
      ? '<div class="pill pill-good" style="font-size: 22px; padding: 10px 18px; align-self: flex-start;">Real — on Sanket’s resume.</div>'
      : '<div class="pill pill-warn" style="font-size: 22px; padding: 10px 18px; align-self: flex-start;">Fake — invented. Never on his resume.</div>'
    : '<div style="font-size: 19px; color: var(--ink-muted);">Ask the room: real or fake?</div>';

  return `
    <div style="font-size: 19px; font-weight: 700; color: var(--ink-muted);">The wheel says, in a perfectly confident tone:</div>
    <div style="font-size: 32px; font-weight: 800; line-height: 1.28;">“${esc(st.text)}”</div>
    ${verdict}
  `;
}

/* =========================== ROUND 5 PLAY =========================== */
function renderR5Play() {
  const data = computeHostR5Data(demoState.r5Switchers, demoState.r5Today);
  const pmSlice = data.slices.find((s) => s.key === 'productManager');

  mainEl.innerHTML = `
    <div class="host-play-grid">
      <div class="host-wheel-col">
        <div class="wheel-wrap">
          ${pointerSvg()}
          <canvas id="hostWheel" class="wheel-canvas" aria-label="Sanket’s wheel built from career dots"></canvas>
        </div>
        <div class="meter-box" style="width: 100%; font-size: 22px;">
          <span>Product Manager slice</span>
          <span class="meter-value" id="r5PmMeter" style="font-size: 28px;">${pmSlice.pct}%</span>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 21px; min-block-size: 54px;">Spin wheel</button>
        <div id="r5SpinOut" style="font-size: 20px; font-weight: 700; color: var(--ink-muted);" aria-live="polite">
          ${demoState.r5LastResult ? `Landed on: ${esc(demoState.r5LastResult)}` : ''}
        </div>
      </div>

      <div class="host-panel-col">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
          <div class="host-kicker" id="r5DotsHeading">${data.totalDots} careers the wheel learned from</div>
          <span class="pill">Illustrative sample, not real data</span>
        </div>

        <div class="dot-grid" id="r5DotGrid" aria-label="Grid of coloured dots representing careers"></div>
        <div class="dot-legend" id="r5DotLegend"></div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button type="button" class="host-toggle-line" id="r5ToggleSwitchers" aria-pressed="${demoState.r5Switchers}">
            <span class="host-toggle-check" aria-hidden="true">${demoState.r5Switchers ? '✓' : '+'}</span>
            <span>Add 30 career switchers who made it</span>
          </button>
          <button type="button" class="host-toggle-line" id="r5ToggleToday" aria-pressed="${demoState.r5Today}">
            <span class="host-toggle-check" aria-hidden="true">${demoState.r5Today ? '✓' : '+'}</span>
            <span>Update the wheel for today</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 400, isHost: true });
  activeWheel.setSlices(data.slices, false);

  function paintDots(d) {
    document.getElementById('r5DotsHeading').textContent = `${d.totalDots} careers the wheel learned from`;
    const pm = d.slices.find((s) => s.key === 'productManager');
    document.getElementById('r5PmMeter').textContent = `${pm.pct}%`;

    document.getElementById('r5DotGrid').innerHTML = d.dots
      .map((dot) => `<span class="career-dot ${dot.isAdded ? 'added' : ''}" style="background:${dot.color};" title="${esc(dot.label)}"></span>`)
      .join('');

    document.getElementById('r5DotLegend').innerHTML = d.slices
      .map((s) => `<span class="dot-legend-item"><span class="dot-swatch" style="background:${s.color};"></span>${esc(s.label)} <strong>${s.count}</strong> (${s.pct}%)</span>`)
      .join('');
  }
  paintDots(data);

  function refreshR5() {
    const next = computeHostR5Data(demoState.r5Switchers, demoState.r5Today);
    paintDots(next);
    activeWheel.setSlices(next.slices, true, 850);
  }

  const swBtn = document.getElementById('r5ToggleSwitchers');
  swBtn.addEventListener('click', () => {
    demoState.r5Switchers = !demoState.r5Switchers;
    swBtn.setAttribute('aria-pressed', String(demoState.r5Switchers));
    swBtn.querySelector('.host-toggle-check').textContent = demoState.r5Switchers ? '✓' : '+';
    refreshR5();
  });

  const tdBtn = document.getElementById('r5ToggleToday');
  tdBtn.addEventListener('click', () => {
    demoState.r5Today = !demoState.r5Today;
    tdBtn.setAttribute('aria-pressed', String(demoState.r5Today));
    tdBtn.querySelector('.host-toggle-check').textContent = demoState.r5Today ? '✓' : '+';
    refreshR5();
  });

  const spinBtn = document.getElementById('hostSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    demoState.r5LastResult = `${res.slice.label} (${res.slice.pct}%)`;
    document.getElementById('r5SpinOut').textContent = `Landed on: ${demoState.r5LastResult}`;
  });
}

/* =========================== ROUND 6 PLAY =========================== */
function renderR6Play() {
  function buildR6Slices() {
    if (!demoState.r6WithResume) {
      return SANKET_R4_STATEMENTS.map((st, idx) => ({
        key: st.id,
        label: `Guess ${idx + 1}`,
        weight: 1,
        pct: 17,
        color: SLICE_COLORS.statement[idx % SLICE_COLORS.statement.length],
        item: {
          text: st.text,
          isReal: st.isReal,
          sourceLine: null,
          sourceNote: st.isReal
            ? 'It happens to be true, but nothing shows where it came from.'
            : 'Source: none. It is invented, and nothing flags it.',
        },
      }));
    }
    return SANKET_ALL_NINE_LINES.map((line, idx) => ({
      key: `line_${idx + 1}`,
      label: `Line ${idx + 1}`,
      weight: 1,
      pct: 11,
      color: idx < 5 ? '#2563eb' : '#0d9488',
      item: {
        text: line,
        isReal: true,
        sourceLine: idx + 1,
        sourceNote: `Source: Line ${idx + 1} of his resume.`,
      },
    }));
  }

  mainEl.innerHTML = `
    <div class="host-play-grid">
      <div class="host-wheel-col">
        <div class="mode-switch-row" style="width: 100%;">
          <button type="button" class="dial-preset" id="r6ModeWithout" aria-pressed="${!demoState.r6WithResume}" style="font-size: 18px;">Without his resume</button>
          <button type="button" class="dial-preset" id="r6ModeWith" aria-pressed="${demoState.r6WithResume}" style="font-size: 18px;">Hand over his resume</button>
        </div>
        <div class="wheel-wrap">
          ${pointerSvg()}
          <canvas id="hostWheel" class="wheel-canvas" aria-label="Sanket’s statement wheel"></canvas>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="hostSpinBtn" style="font-size: 22px; min-block-size: 56px;">Spin wheel</button>
      </div>

      <div class="host-panel-col">
        <div class="card" id="r6ResultCard" aria-live="polite" style="display: flex; flex-direction: column; gap: 12px;">
          ${renderR6Result()}
        </div>

        <div id="r6ResumePanel">
          ${renderR6ResumeList()}
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('hostWheel');
  activeWheel = new WheelRenderer(canvas, { size: 400, isHost: true, mode: 'statement' });
  activeWheel.setSlices(buildR6Slices(), false);

  function setMode(withResume) {
    demoState.r6WithResume = withResume;
    demoState.r6Current = null;
    document.getElementById('r6ModeWithout').setAttribute('aria-pressed', String(!withResume));
    document.getElementById('r6ModeWith').setAttribute('aria-pressed', String(withResume));
    activeWheel.setSlices(buildR6Slices(), false);
    document.getElementById('r6ResultCard').innerHTML = renderR6Result();
    document.getElementById('r6ResumePanel').innerHTML = renderR6ResumeList();
  }

  document.getElementById('r6ModeWithout').addEventListener('click', () => setMode(false));
  document.getElementById('r6ModeWith').addEventListener('click', () => setMode(true));

  const spinBtn = document.getElementById('hostSpinBtn');
  spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    const res = await activeWheel.spin();
    spinBtn.disabled = false;
    if (!res) return;
    demoState.r6Current = res.slice.item;
    document.getElementById('r6ResultCard').innerHTML = renderR6Result();
    document.getElementById('r6ResumePanel').innerHTML = renderR6ResumeList();
  });
}

function renderR6Result() {
  if (!demoState.r6Current) {
    return `<div style="font-size: 22px; color: var(--ink-muted);">
      ${demoState.r6WithResume
        ? 'His resume is on the table. Only his nine real lines are on the wheel. Spin to see the source.'
        : 'Spin without his resume first, then hand it over and spin again.'}
    </div>`;
  }
  const cur = demoState.r6Current;
  const badgeClass = demoState.r6WithResume ? 'pill-good' : (cur.isReal ? 'pill' : 'pill-warn');
  return `
    <div style="font-size: 28px; font-weight: 800; line-height: 1.3;">“${esc(cur.text)}”</div>
    <div class="pill ${badgeClass}" style="font-size: 20px; padding: 8px 14px; align-self: flex-start;">${esc(cur.sourceNote)}</div>
  `;
}

function renderR6ResumeList() {
  if (!demoState.r6WithResume) {
    return `<div class="card-subtle" style="font-size: 19px; color: var(--ink-muted);">Resume not provided. The wheel is guessing from memory of people like him.</div>`;
  }
  const activeLine = demoState.r6Current?.sourceLine;
  return `
    <div class="host-kicker" style="font-size: 17px; margin-bottom: 8px;">Sanket’s nine resume lines</div>
    <ol class="host-resume-list" style="gap: 6px;">
      ${SANKET_ALL_NINE_LINES.map((line, i) => `
        <li class="host-resume-item ${activeLine === i + 1 ? 'highlighted' : ''}" style="font-size: 16px; padding: 9px 12px;">
          <span class="host-line-num">Line ${i + 1}.</span>
          <span>${esc(line)}</span>
        </li>
      `).join('')}
    </ol>
  `;
}

/* =========================== REVEAL PANELS =========================== */
function renderReveal(stage) {
  const kicker = `${stage.roundName} · Reveal ${stage.panel} of ${stage.panelTotal}`;

  // ROUND 1 REVEALS (4 panels)
  if (stage.round === 1 && stage.panel === 1) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What just happened</h1>
        <p class="host-copy">Same resume, several spins, different answers. Nothing about the person changed between spins. The wheel didn’t look up an answer. It drew one, from slices sized by how likely each outcome is for someone with this resume.</p>
        <div class="host-callout host-callout-dream">So which spin was right? Maybe all of them. Maybe none.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 1 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1120px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Two kinds of wheels</h1>
        <div class="host-two-col">
          <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
            <span class="pill" style="align-self: flex-start; font-size: 17px;">A rule</span>
            <div style="font-size: 26px; font-weight: 800; line-height: 1.3;">“If the resume says ETL pipelines, the role is Data Engineer.”</div>
            <p style="font-size: 22px; margin: 0; color: var(--ink-muted);">A thousand asks, a thousand identical answers. Predictable, but it can never say maybe.</p>
          </div>
          <div class="card" style="display: flex; flex-direction: column; gap: 14px; border-color: var(--accent);">
            <span class="pill pill-accent" style="align-self: flex-start; font-size: 17px;">A wheel (on our wheel)</span>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 24px; font-weight: 800;">
              <div>Data Engineer · 54%</div>
              <div>Data Analyst · 20%</div>
              <div>Technical PM · 9%</div>
            </div>
            <p style="font-size: 22px; margin: 0; color: var(--ink-muted);">A thousand asks, a spread. Flexible, but nobody can promise one answer.</p>
          </div>
        </div>
        <div class="host-callout host-callout-accent">
          Engineers call the first <strong>deterministic</strong> and the second <strong>probabilistic</strong>. Different outputs for the same input is called <strong>non-determinism</strong>.
        </div>
      </div>
    `;
    return;
  }

  if (stage.round === 1 && stage.panel === 3) {
    const slices = computeSanketR2Slices([]);
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1060px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <h1 class="host-title">Under the hood</h1>
          <button type="button" class="btn btn-primary" id="spin100Btn" style="font-size: 22px; padding: 14px 26px;">Spin 100 times</button>
        </div>
        <div class="card bar-list" id="r1SimBars"></div>
        <div class="host-callout" id="r1SimSummary" style="font-size: 24px;">
          Click “Spin 100 times” to watch how often Product Manager comes up on our wheel.
        </div>
      </div>
    `;

    function drawBars(counts) {
      document.getElementById('r1SimBars').innerHTML = slices.map((s, idx) => {
        const val = counts ? counts[idx] : s.pct;
        const labelRight = counts ? `${val} of 100` : `${s.pct}% on our wheel`;
        return `
          <div class="bar-row">
            <div class="bar-meta" style="font-size: 22px;">
              <span>${esc(s.label)}</span>
              <span class="tabular" style="color: ${s.isDream ? 'var(--dream)' : 'var(--ink)'};">${labelRight}</span>
            </div>
            <div class="bar-track" style="height: 20px;">
              <div class="bar-fill" style="width: ${Math.min(100, val)}%; background: ${s.color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    drawBars(demoState.r1SimCounts);
    if (demoState.r1SimCounts) {
      const pmCount = demoState.r1SimCounts[5];
      document.getElementById('r1SimSummary').textContent = `Product Manager came up ${pmCount} of 100 times (about 5 of 100 on our wheel). Spin again — no two runs match.`;
    }

    document.getElementById('spin100Btn').addEventListener('click', () => {
      const totalW = slices.reduce((a, b) => a + b.weight, 0);
      const counts = slices.map(() => 0);
      for (let i = 0; i < 100; i++) {
        let r = Math.random() * totalW;
        for (let j = 0; j < slices.length; j++) {
          if (r < slices[j].weight) {
            counts[j] += 1;
            break;
          }
          r -= slices[j].weight;
        }
      }
      demoState.r1SimCounts = counts;
      drawBars(counts);
      document.getElementById('r1SimSummary').textContent = `Product Manager came up ${counts[5]} of 100 times (about 5 of 100 on our wheel). Spin again — no two runs match.`;
    });
    return;
  }

  if (stage.round === 1 && stage.panel === 4) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Why this matters</h1>
        <p class="host-copy" style="font-size: clamp(24px, 2vw, 30px);">Normal software is predictable: the same input always gives the same output, so you can test it once and trust it. An AI product isn’t. Ask it the same thing twice and you may get two different answers, as you just saw. That changes a PM’s job. You can’t check one result and call it done. You have to decide how much variety is acceptable, and test many times, not once.</p>
        <div class="host-callout host-callout-dream">A normal product ships a button. An AI product ships a wheel. Someone decides what is on it and how big each slice is.</div>
        ${renderRoleBox(1)}
      </div>
    `;
    return;
  }

  // ROUND 2 REVEALS (3 panels)
  if (stage.round === 2 && stage.panel === 1) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What moved</h1>
        <div class="card bar-list">
          ${SANKET_ROLE_KEYS.map((role, idx) => `
            <div class="bar-row">
              <div class="bar-meta" style="font-size: 21px;">
                <span>${esc(role.label)}</span>
                <span class="tabular">Before ${SANKET_BEFORE_PCTS[idx]}% → After <strong>${SANKET_AFTER_PCTS[idx]}%</strong></span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div class="bar-track" style="height: 12px;">
                  <div class="bar-fill" style="width: ${SANKET_BEFORE_PCTS[idx]}%; background: #94a3b8;"></div>
                </div>
                <div class="bar-track" style="height: 16px;">
                  <div class="bar-fill" style="width: ${SANKET_AFTER_PCTS[idx]}%; background: ${role.color};"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="host-callout" style="font-size: 24px;">Product roles went from about 20% to about 40% of the wheel. Data Engineer stayed biggest, because nothing here is a promise.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 2 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Why the slices moved</h1>
        <p class="host-copy">Look at what the four new lines have in common. Numbers: 20%, 10%, 15%. People: a team to cover for, two interns to mentor. The old lines said what he did. The new ones say what happened because he did it.</p>
        <div class="host-callout host-callout-accent">The wheel doesn’t know Sanket. It only reads the page. What you hand an AI like this is called its <strong>context</strong> (or <strong>prompt</strong>), and changing it changes the answer.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 2 && stage.panel === 3) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Why this matters</h1>
        <p class="host-copy">Context is the cheapest lever a product manager has. No new model, no new code. Change what goes in, and the same system answers differently. It also moves for anyone who writes the right words, true or not.</p>
        ${renderRoleBox(2)}
      </div>
    `;
    return;
  }

  // ROUND 3 REVEALS (3 panels)
  if (stage.round === 3 && stage.panel === 1) {
    const sets = [
      { label: 'Careful', slices: computeSanketR3Slices(0) },
      { label: 'Balanced', slices: computeSanketR3Slices(50) },
      { label: 'Bold', slices: computeSanketR3Slices(100) },
    ];
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1120px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What you saw</h1>
        <div class="card" style="display: flex; flex-direction: column; gap: 22px;">
          ${sets.map((row) => `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 22px; font-weight: 800;">${row.label}</div>
              <div class="stacked-bar">
                ${row.slices.map((s) => `
                  <div class="stacked-seg" style="width: ${s.weight}%; background: ${s.color};" title="${esc(s.label)} ${s.pct}%">
                    ${s.pct >= 10 ? `${esc(s.label.split(' ')[0])} ${s.pct}%` : (s.pct >= 5 ? `${s.pct}%` : '')}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="host-callout" style="font-size: 26px;">Same nine roles every time.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 3 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What the dial does</h1>
        <p class="host-copy">It doesn’t add or remove a role. It only reshapes the slices. Careful makes the biggest slice bigger. Bold flattens everything toward equal, so rare roles get a real chance.</p>
        <div class="host-callout host-callout-accent">In AI this dial is called <strong>temperature</strong>. Low gives predictable, repeatable answers. High gives varied, surprising ones, and more of them are wrong.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 3 && stage.panel === 3) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1120px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Which setting is right?</h1>
        <div class="host-two-col">
          <div class="card" style="font-size: 22px; line-height: 1.42;">
            <strong style="color: var(--accent);">Careful:</strong> when the answer must be repeatable. A recruiter screens 4,312 applications against one Data PM job description. The same resume must get the same verdict on Monday and Friday, or it isn’t fair and can’t be audited.
          </div>
          <div class="card" style="font-size: 22px; line-height: 1.42;">
            <strong style="color: var(--dream);">Bold:</strong> when you’re exploring. Sanket asks which roles to target. Bold shows roles he hadn’t thought of, like Technical PM.
          </div>
        </div>
        <div class="host-callout host-callout-dream" style="font-size: 24px;">
          Then he rewrites his resume with that job description’s own words (true ones). That is Round 2: context moves the slice. Bold finds the door. Context opens it.
        </div>
        ${renderRoleBox(3)}
      </div>
    `;
    return;
  }

  // ROUND 4 REVEALS (3 panels)
  if (stage.round === 4 && stage.panel === 1) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What happened</h1>
        <p class="host-copy">The wheel gave statements about Sanket (and about you) in the same confident tone, true or not. The invented ones weren’t random noise. They were plausible: the kind of thing a person with your background might have done.</p>
      </div>
    `;
    return;
  }

  if (stage.round === 4 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Why it lies so smoothly</h1>
        <p class="host-copy">The wheel only has real words, and it picks what usually comes next. It has no ‘I don’t know’ slice, so it always lands somewhere, and it lands in the same confident voice.</p>
        <div class="host-callout host-callout-accent">This is called <strong>hallucination</strong>: fluent output that isn’t grounded in anything true.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 4 && stage.panel === 3) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Confidence is not correctness</h1>
        <p class="host-copy">How sure an answer sounds tells you nothing about whether it is right. For a product, that means three decisions: make ‘I don’t know’ possible, show sources, and decide who checks the wheel before a user trusts it. The next rounds take those one by one.</p>
        ${renderRoleBox(4)}
      </div>
    `;
    return;
  }

  // ROUND 5 REVEALS (3 panels)
  if (stage.round === 5 && stage.panel === 1) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What the wheel learned from</h1>
        <p class="host-copy">In these 100 careers, only 4 became product managers, and almost none were switchers like Sanket. So his Product Manager slice was 4% on our wheel. Add 30 switchers who made it, and the same slice becomes about 14%.</p>
        <div class="host-callout">Same wheel, same resume, different history. The counts are an illustration. The real wheel learned from millions of careers, and the effect is the same.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 5 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Who is in the data</h1>
        <p class="host-copy" style="font-size: clamp(25px, 2.2vw, 32px);">The wheel doesn’t judge Sanket. It repeats the past. Whoever is thin in its data is thin on the wheel. That is <strong>bias</strong>, and the data it learned from is called <strong>training data</strong>.</p>
        <div class="host-callout host-callout-accent" style="font-size: clamp(23px, 2vw, 29px);">Data also ages, and it freezes the menu too. A wheel painted in 2019 has no AI Product Manager slice, so it can never land there. Update the wheel for today and two slices appear. Repainting a wheel costs time and money, which Part 2 is about.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 5 && stage.panel === 3) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">One more question</h1>
        <p class="host-copy">Those 100 dots were real people’s career histories. Did they know they would be used to teach a wheel? Can one dot ask to be removed? The people who build the data pipelines usually know whether names are stripped and consent is recorded, which is why these are product decisions, not only legal ones.</p>
        ${renderRoleBox(5)}
      </div>
    `;
    return;
  }

  // ROUND 6 REVEALS (3 panels)
  if (stage.round === 6 && stage.panel === 1) {
    mainEl.innerHTML = `
      <div class="host-slide">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">What changed</h1>
        <p class="host-copy">Without the resume, the wheel had six statements, three of them invented, and nothing to tell them apart. With it, the invented ones disappeared. Every answer pointed to a line that could be checked.</p>
      </div>
    `;
    return;
  }

  if (stage.round === 6 && stage.panel === 2) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">Look it up, then answer</h1>
        <p class="host-copy" style="font-size: clamp(24px, 2.1vw, 31px);">The wheel first fetches the lines that matter, then answers using only those. That is <strong>RAG</strong> (retrieval-augmented generation). Pointing at the line is a <strong>citation</strong>.</p>
        <div class="host-callout host-callout-accent" style="font-size: clamp(22px, 1.9vw, 28px);">Why not paste everything in? The wheel has limited desk space, called the <strong>context window</strong>. Nine lines fit. Ten thousand documents don’t, so a search step picks the few pages that go on the desk. It searches by meaning, not exact words, using <strong>embeddings</strong>: ‘raised team efficiency’ matches ‘productivity gain’.</div>
      </div>
    `;
    return;
  }

  if (stage.round === 6 && stage.panel === 3) {
    mainEl.innerHTML = `
      <div class="host-slide" style="max-width: 1080px;">
        <div class="host-kicker">${esc(kicker)}</div>
        <h1 class="host-title">How it works, in one line</h1>
        <div class="host-callout host-callout-dream">Underneath, the model predicts the next piece of text from patterns it learned. Everything so far is that, plus tricks: context, a dial, and sources.</div>
        ${renderRoleBox(6)}
      </div>
    `;
  }
}

/* =========================== ENDING E1: SPOT IT =========================== */
function renderE1Spot(qIdx) {
  const q = SPOT_IT_QUESTIONS[qIdx];
  const isRevealed = demoState.e1Revealed.has(qIdx);

  mainEl.innerHTML = `
    <div class="host-slide" style="max-width: 1080px;">
      <div class="host-kicker">Spot it · Question ${q.index} of 3</div>
      <h1 class="host-title">Does the AI match its source?</h1>
      <div class="host-two-col">
        <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
          <span class="pill" style="align-self: flex-start; font-size: 18px;">Source</span>
          <div style="font-size: 28px; font-weight: 700; line-height: 1.35;">“${esc(q.source)}”</div>
        </div>
        <div class="card" style="display: flex; flex-direction: column; gap: 12px; border-color: var(--accent);">
          <span class="pill pill-accent" style="align-self: flex-start; font-size: 18px;">AI says</span>
          <div style="font-size: 28px; font-weight: 700; line-height: 1.35;">“${esc(q.aiSays)}”</div>
        </div>
      </div>

      <div id="e1AnswerArea">
        ${isRevealed
          ? `<div class="host-callout ${q.matches ? 'card-accent' : 'host-callout-dream'}">${esc(q.explanation)}</div>`
          : `<button type="button" class="btn btn-dream" id="e1RevealBtn" style="font-size: 22px; padding: 14px 28px;">Reveal answer</button>`}
      </div>
    </div>
  `;

  const btn = document.getElementById('e1RevealBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      demoState.e1Revealed.add(qIdx);
      renderE1Spot(qIdx);
    });
  }
}

/* =========================== STAGE JUMP DIALOG =========================== */
function openStageDialog() {
  stageJumpList.innerHTML = STAGES.map((st, idx) => `
    <button type="button" class="stage-jump-btn" data-idx="${idx}" ${idx === currentIndex ? 'aria-current="step"' : ''}>
      <span><strong>${idx + 1}.</strong> ${esc(st.roundName || st.section)} — ${esc(st.title || st.type)}</span>
      <span style="color: var(--ink-muted);">${esc(st.minutes)}</span>
    </button>
  `).join('');

  stageJumpList.querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => {
      const idx = Number(b.dataset.idx);
      stageDialog.close();
      goToStage(idx, true);
    });
  });

  stageDialog.showModal();
}

/* =========================== LIVE SYNC & CONTROLS =========================== */
function connectHostEvents() {
  updateSyncBadge();
  let initialSnapshotHandled = false;

  subscribeSession(
    (data) => {
      roomTally = data.round1Tally || {};
      const slot = document.getElementById('hostRoomTallySlot');
      if (slot) {
        slot.innerHTML = renderRoomTallyStrip();
        bindTallyReset();
      }

      if (!initialSnapshotHandled) {
        initialSnapshotHandled = true;
        if (
          data.hostActive &&
          typeof data.stageIndex === 'number' &&
          data.stageIndex >= 0 &&
          data.stageIndex < STAGES.length &&
          data.stageIndex !== currentIndex
        ) {
          currentIndex = data.stageIndex;
          renderStage();
        }
        if (HOST_KEY) {
          pushStageToServer(currentIndex, false);
          startHostHeartbeat();
        }
      }
    },
    (err) => {
      console.error('[host] Firestore listener error:', err);
      hostAuthStatus = 'error';
      updateSyncBadge();
    }
  );
}

prevBtn.addEventListener('click', () => goToStage(currentIndex - 1, true));
nextBtn.addEventListener('click', () => goToStage(currentIndex + 1, true));
jumpBtn.addEventListener('click', openStageDialog);
closeDialogBtn.addEventListener('click', () => stageDialog.close());

// Keyboard shortcuts for smooth live presenting
document.addEventListener('keydown', (e) => {
  if (stageDialog.open) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault();
    goToStage(currentIndex + 1, true);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    goToStage(currentIndex - 1, true);
  }
});

// Theme toggle in host toolbar
function updateThemeBtnLabel() {
  if (!themeBtn) return;
  const current = getResolvedScheme();
  themeBtn.textContent = current === 'dark' ? 'Light mode' : 'Dark mode';
}

initSchemeSync(() => {
  updateThemeBtnLabel();
  activeWheel?.draw();
});
updateThemeBtnLabel();

themeBtn?.addEventListener('click', () => {
  toggleTwoStateScheme();
  updateThemeBtnLabel();
  setTimeout(() => activeWheel?.draw(), 20);
});

// Initial boot
renderStage();
connectHostEvents();
