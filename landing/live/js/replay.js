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
  SANKET_ROLE_KEYS,
  SANKET_BEFORE_PCTS,
  SANKET_AFTER_PCTS,
} from './data.js';
import {
  computePersonalSlices,
  computePhoneR3Slices,
  computeSanketR3Slices,
  getDialSettingName,
  buildPhoneStatements,
  buildPhoneSourcedStatements,
} from './scoring.js';
import { WheelRenderer } from './wheel.js';
import { initSchemeSync } from './theme.js';

const REPLAY_STAGES = STAGES.filter((s) => s.type !== 'hold' && s.type !== 'qa');
const PROFILE_KEY = 'aipm_part1_replay_profile_v1';
const EXTRAS_KEY = 'aipm_part1_replay_extras_v1';

const mainEl = document.getElementById('replayMain');
const pillEl = document.getElementById('replayStagePill');
const prevBtn = document.getElementById('replayPrevBtn');
const nextBtn = document.getElementById('replayNextBtn');
const progressEl = document.getElementById('replayProgress');

let stageIdx = 0;
let activeWheel = null;
let isBuilding = false;

let profile = loadJson(PROFILE_KEY, null);
let extras = loadJson(EXTRAS_KEY, {
  r2ProofIds: [],
  r2TypedLine: '',
  e3MapSelected: null,
});

const draft = { backgroundId: null, experienceId: null, things: [] };
const state = {
  r1Spins: [],
  r2Last: null,
  r3Dial: 50,
  r3Spins: [],
  r4Current: null,
  r4Voted: null,
  r4Caught: 0,
  r4Total: 0,
  r5Switchers: false,
  r5Last: null,
  r6WithResume: false,
  r6Current: null,
  e1Answers: {},
};

function loadJson(k, fb) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fb;
  } catch {
    return fb;
  }
}

function saveJson(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  return Math.min(300, Math.max(244, window.innerWidth - 56));
}

function cleanupWheel() {
  if (activeWheel) {
    activeWheel.destroy();
    activeWheel = null;
  }
}

function render() {
  cleanupWheel();
  const stage = REPLAY_STAGES[stageIdx];
  pillEl.textContent = `Replay · ${stage.section}`;
  progressEl.textContent = `${stageIdx + 1} / ${REPLAY_STAGES.length}`;
  prevBtn.disabled = stageIdx === 0 || isBuilding;
  nextBtn.disabled = stageIdx === REPLAY_STAGES.length - 1 || isBuilding || (stage.type === 'opening_setup' && !profile);

  if (isBuilding) {
    mainEl.innerHTML = `
      <div class="phone-center-screen" role="status" aria-live="polite">
        <div class="calm-spinner" aria-hidden="true"></div>
        <h1 class="phone-h1">Building your wheel…</h1>
        <p class="phone-muted">Nothing you chose leaves your phone.</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'opening_scene') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; padding-top: 12px;">
        <span class="pill pill-accent" style="align-self: flex-start;">Opening · ${esc(stage.title)}</span>
        <h1 class="phone-h1">${stage.highlight ? 'Can you spot when AI is wrong?' : esc(stage.title)}</h1>
        <p class="phone-text">${esc(stage.hostBody)}</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'opening_setup' || !profile) {
    renderSetup();
    return;
  }

  if (stage.type === 'story') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding-top: 10px;">
        <span class="pill pill-accent" style="align-self: flex-start;">${esc(stage.roundName)} · Story ${stage.sceneNum}/${stage.sceneTotal}</span>
        <h1 class="phone-h1">${esc(stage.title)}</h1>
        <p class="phone-text">${esc(stage.hostBody)}</p>
      </div>
    `;
    return;
  }

  if (stage.type === 'context') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding-top: 12px;">
        <span class="pill pill-accent" style="align-self: flex-start;">${esc(stage.roundName)}</span>
        <div class="card-accent"><p class="phone-h2">${esc(stage.contextLine)}</p></div>
      </div>
    `;
    return;
  }

  if (stage.type === 'play') {
    if (stage.round === 1) renderR1();
    else if (stage.round === 2) renderR2();
    else if (stage.round === 3) renderR3();
    else if (stage.round === 4) renderR4();
    else if (stage.round === 5) renderR5();
    else if (stage.round === 6) renderR6();
    return;
  }

  if (stage.type === 'reveal') {
    renderReplayReveal(stage);
    return;
  }

  if (stage.type === 'e1_spot') {
    renderE1(stage.questionIndex);
    return;
  }

  if (stage.type === 'e2_story') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <span class="pill pill-dream" style="align-self: flex-start;">Sanket’s story</span>
        <h1 class="phone-h1">The 9% slice</h1>
        <p class="phone-text">Even after he rewrote his resume, Product Manager was only about a 9% slice on our wheel. Sanket sent 300+ applications and sat through about 10 interviews before one became an offer.</p>
        <div class="card">
          <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--accent); margin-bottom: 6px;">What he worked out</div>
          <p class="phone-text">He kept asking ‘what am I missing?’ He wasn’t missing anything. In most interviews, another candidate simply had more relevant experience. So the move wasn’t to knock harder on the same doors. It was to find the right door: where his experience already counted.</p>
        </div>
        <div class="card-dream"><p class="phone-h2" style="color: var(--dream);">Bold finds the door. Context opens it. Probability isn’t destiny, and where you knock changes the odds.</p></div>
      </div>
    `;
    return;
  }

  if (stage.type === 'e3_map') {
    renderE3();
    return;
  }

  if (stage.type === 'e4_next') {
    mainEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; padding-top: 8px;">
        <span class="pill pill-accent" style="align-self: flex-start;">What’s next</span>
        <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
          <h1 class="phone-h1">The programme</h1>
          <p class="phone-text">The programme. AI product skills plus the PM foundations, built on the work you already do.</p>
          ${PROGRAMME_SIGNUP_URL
            ? `<a href="${esc(PROGRAMME_SIGNUP_URL)}" target="_blank" rel="noopener" class="btn btn-primary btn-block">See the curriculum and register interest</a>`
            : `<div class="card-subtle"><p class="phone-text" style="font-weight: 600;">Your hosts will share the curriculum and the sign-up link now.</p></div>`}
        </div>
      </div>
    `;
  }
}

function renderSetup() {
  const canGo = Boolean(draft.backgroundId && draft.experienceId && draft.things.length === 3);
  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div>
        <h1 class="phone-h1">Set up your wheel</h1>
        <p class="phone-muted">Three taps. About 60 seconds. Nothing you choose leaves your phone.</p>
      </div>
      <fieldset class="setup-fieldset">
        <legend class="setup-legend">1. Where have you spent most of your career?</legend>
        <div class="option-grid" id="rq1">
          ${BACKGROUNDS.map((b) => `<button type="button" class="option-btn" data-bg="${b.id}" aria-pressed="${draft.backgroundId === b.id}"><span>${esc(b.label)}</span></button>`).join('')}
        </div>
      </fieldset>
      <fieldset class="setup-fieldset">
        <legend class="setup-legend">2. Years of experience</legend>
        <div class="option-grid-2" id="rq2">
          ${EXPERIENCE_BANDS.map((e) => `<button type="button" class="option-btn" data-exp="${e.id}" aria-pressed="${draft.experienceId === e.id}"><span>${esc(e.label)}</span></button>`).join('')}
        </div>
      </fieldset>
      <fieldset class="setup-fieldset">
        <legend class="setup-legend">3. Pick 3 things you’ve done at work (${draft.things.length} of 3)</legend>
        <div class="option-grid" id="rq3">
          ${WORK_THINGS.map((t) => {
            const on = draft.things.includes(t.id);
            const maxed = draft.things.length >= 3 && !on;
            return `<button type="button" class="option-btn" data-thing="${t.id}" aria-pressed="${on}" ${maxed ? 'disabled' : ''}><span><strong>${t.id}.</strong> ${esc(t.label)}</span></button>`;
          }).join('')}
        </div>
      </fieldset>
      <button type="button" class="btn btn-primary btn-block" id="rContinue" ${canGo ? '' : 'disabled'}>Continue</button>
    </div>
  `;
  document.querySelectorAll('#rq1 button').forEach((b) => b.addEventListener('click', () => { draft.backgroundId = b.dataset.bg; render(); }));
  document.querySelectorAll('#rq2 button').forEach((b) => b.addEventListener('click', () => { draft.experienceId = b.dataset.exp; render(); }));
  document.querySelectorAll('#rq3 button').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.thing;
    const i = draft.things.indexOf(id);
    if (i >= 0) draft.things.splice(i, 1);
    else if (draft.things.length < 3) draft.things.push(id);
    render();
  }));
  document.getElementById('rContinue').addEventListener('click', () => {
    profile = { backgroundId: draft.backgroundId, experienceId: draft.experienceId, things: [...draft.things] };
    saveJson(PROFILE_KEY, profile);
    extras.e3MapSelected = profile.things.filter((id) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(id));
    saveJson(EXTRAS_KEY, extras);
    isBuilding = true;
    render();
    setTimeout(() => {
      isBuilding = false;
      if (REPLAY_STAGES[stageIdx].type === 'opening_setup') stageIdx += 1;
      render();
    }, 3000);
  });
}

function renderR1() {
  const slices = computePersonalSlices(profile);
  const last = state.r1Spins[state.r1Spins.length - 1];
  const msg = state.r1Spins.length === 0 ? 'Spin your wheel.' : state.r1Spins.length === 1 ? 'Now spin again.' : 'Same resume. Same wheel. Different answer?';
  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">Spin</button>
      <div class="card" id="rRes" style="width:100%;">
        ${last ? `<div class="phone-h2">${esc(last.label)}</div><p class="phone-muted">${esc(last.description)}</p>` : ''}
        <p class="phone-text" style="font-weight:700; color:var(--accent);">${msg}</p>
      </div>
      <div class="chip-row" style="width:100%;">${state.r1Spins.map((s, i) => `<span class="result-chip ${s.isDream ? 'dream' : ''}">#${i + 1} ${esc(s.label)}</span>`).join('')}</div>
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: wheelSize() });
  activeWheel.setSlices(slices, false);
  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (!res) return;
    state.r1Spins.push(res.slice);
    render();
  });
}

function renderR2() {
  const getSlices = () => computePersonalSlices(profile, { proofIds: extras.r2ProofIds, typedLine: extras.r2TypedLine });
  const slices = getSlices();
  const prod = slices.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0);
  mainEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <div class="meter-box" style="width:100%;"><span class="phone-muted">Product roles</span><span class="meter-value" id="r2m">${prod}%</span></div>
      <div style="width:100%; display:flex; flex-direction:column; gap:8px;">
        <h2 class="phone-h2">Add a proof line. Tap what’s true for you.</h2>
        ${PHONE_PROOF_CHIPS.map((c) => `<button type="button" class="chip-toggle" data-p="${c.id}" aria-pressed="${extras.r2ProofIds.includes(c.id)}"><span>${extras.r2ProofIds.includes(c.id) ? '✓' : '+'}</span><span>${esc(c.label)}</span></button>`).join('')}
        <label for="r2Input" class="phone-muted">Or type one real line from your resume.</label>
        <input id="r2Input" type="text" class="text-input" value="${esc(extras.r2TypedLine)}" placeholder="Stays on your phone">
      </div>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">Spin</button>
      <div id="r2Out" class="phone-text" style="font-weight:700;">${state.r2Last ? `Landed on: ${esc(state.r2Last)}` : ''}</div>
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: wheelSize() });
  activeWheel.setSlices(slices, false);
  const update = () => {
    saveJson(EXTRAS_KEY, extras);
    const next = getSlices();
    activeWheel.setSlices(next, true, 900);
    document.getElementById('r2m').textContent = `${next.filter((s) => s.isProduct).reduce((a, b) => a + b.pct, 0)}%`;
  };
  document.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.p;
    const i = extras.r2ProofIds.indexOf(id);
    if (i >= 0) extras.r2ProofIds.splice(i, 1); else extras.r2ProofIds.push(id);
    b.setAttribute('aria-pressed', String(extras.r2ProofIds.includes(id)));
    b.querySelector('span').textContent = extras.r2ProofIds.includes(id) ? '✓' : '+';
    update();
  }));
  let had = Boolean(extras.r2TypedLine.trim());
  document.getElementById('r2Input').addEventListener('input', (e) => {
    extras.r2TypedLine = e.target.value;
    saveJson(EXTRAS_KEY, extras);
    if (Boolean(extras.r2TypedLine.trim()) !== had) { had = !had; update(); }
  });
  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (res) { state.r2Last = res.slice.label; document.getElementById('r2Out').textContent = `Landed on: ${res.slice.label}`; }
  });
}

function renderR3() {
  const baseSix = computePersonalSlices(profile, { proofIds: extras.r2ProofIds, typedLine: extras.r2TypedLine });
  const slices = computePhoneR3Slices(baseSix, state.r3Dial);
  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <div class="card dial-control" style="width:100%;">
        <div style="display:flex; justify-content:space-between; font-weight:800;"><span>Careful</span><span id="r3Lab">${getDialSettingName(state.r3Dial)}</span><span>Bold</span></div>
        <label for="r3Range" class="visually-hidden">Dial</label>
        <input id="r3Range" type="range" class="dial-range" min="0" max="100" value="${state.r3Dial}">
        <div class="dial-presets">
          <button type="button" class="dial-preset" data-d="0" aria-pressed="${state.r3Dial <= 15}">Careful</button>
          <button type="button" class="dial-preset" data-d="50" aria-pressed="${state.r3Dial > 15 && state.r3Dial < 85}">Balanced</button>
          <button type="button" class="dial-preset" data-d="100" aria-pressed="${state.r3Dial >= 85}">Bold</button>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">Spin</button>
      <div class="chip-row" id="r3Ch" style="width:100%;">${state.r3Spins.map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`).join('')}</div>
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: wheelSize() });
  activeWheel.setSlices(slices, false);
  const setDial = (v, anim) => {
    state.r3Dial = v;
    document.getElementById('r3Range').value = String(v);
    document.getElementById('r3Lab').textContent = getDialSettingName(v);
    activeWheel.setSlices(computePhoneR3Slices(baseSix, v), anim, 650);
  };
  document.getElementById('r3Range').addEventListener('input', (e) => setDial(Number(e.target.value), false));
  document.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => setDial(Number(b.dataset.d), true)));
  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (res) {
      state.r3Spins.push({ label: res.slice.label, setting: getDialSettingName(state.r3Dial) });
      document.getElementById('r3Ch').innerHTML = state.r3Spins.map((s) => `<span class="result-chip">${esc(s.label)} · ${esc(s.setting)}</span>`).join('');
    }
  });
}

function renderR4() {
  const stmts = buildPhoneStatements(profile);
  const slices = stmts.map((st, i) => ({ key: st.id, label: `Line ${i + 1}`, weight: 1, pct: 17, color: SLICE_COLORS.statement[i], statement: st }));

  function renderCard() {
    if (!state.r4Current) return '';
    return `
      <div class="card" style="width:100%; display:flex; flex-direction:column; gap:10px;">
        <div class="phone-muted" style="font-weight:700;">The wheel says, in a perfectly confident tone:</div>
        <div class="phone-h2">“${esc(state.r4Current.text)}”</div>
        ${state.r4Voted === null
          ? `<div class="binary-row"><button type="button" class="btn btn-good" data-v="real">Real</button><button type="button" class="btn btn-warn" data-v="fake">Fake</button></div>`
          : `<div class="pill ${(state.r4Voted === 'real') === state.r4Current.isReal ? 'pill-good' : 'pill-warn'}" style="align-self:flex-start;">${(state.r4Voted === 'real') === state.r4Current.isReal ? 'You caught it' : 'It fooled you'}</div>
             <p class="phone-text">${state.r4Current.isReal ? 'You told us that.' : 'You never told us that. It sounded just as sure.'}</p>`}
      </div>
    `;
  }

  function bindVotes() {
    const cardSlot = document.getElementById('r4CardSlot');
    if (!cardSlot) return;
    cardSlot.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => {
      state.r4Voted = b.dataset.v;
      state.r4Total += 1;
      if ((state.r4Voted === 'real') === state.r4Current.isReal) state.r4Caught += 1;
      const pillSlot = document.getElementById('r4PillSlot');
      if (pillSlot) {
        pillSlot.innerHTML = `<div class="pill pill-accent">You caught ${state.r4Caught} of ${state.r4Total}</div>`;
      }
      cardSlot.innerHTML = renderCard();
      bindVotes();
    }));
  }

  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <div id="r4PillSlot">${state.r4Total > 0 ? `<div class="pill pill-accent">You caught ${state.r4Caught} of ${state.r4Total}</div>` : ''}</div>
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">${state.r4Current ? 'Spin for another line' : 'Spin'}</button>
      <div id="r4CardSlot" style="width:100%;">${renderCard()}</div>
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: 256, mode: 'statement' });
  activeWheel.setSlices(slices, false);
  bindVotes();

  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (res) {
      state.r4Current = res.slice.statement;
      state.r4Voted = null;
      document.getElementById('rSpin').textContent = 'Spin for another line';
      document.getElementById('r4CardSlot').innerHTML = renderCard();
      bindVotes();
    }
  });
}

function renderR5() {
  const getSlices = () => computePersonalSlices(profile, { proofIds: extras.r2ProofIds, typedLine: extras.r2TypedLine, addSwitchers: state.r5Switchers });
  const slices = getSlices();
  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <button type="button" class="chip-toggle" id="r5Sw" aria-pressed="${state.r5Switchers}"><span id="r5SwIcon">${state.r5Switchers ? '✓' : '+'}</span><span>Add 30 career switchers who made it</span></button>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">Spin</button>
      <div id="r5Out" class="phone-text" style="font-weight:700;">${state.r5Last ? `Landed on: ${esc(state.r5Last)}` : ''}</div>
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: wheelSize() });
  activeWheel.setSlices(slices, false);
  document.getElementById('r5Sw').addEventListener('click', () => {
    state.r5Switchers = !state.r5Switchers;
    const btn = document.getElementById('r5Sw');
    if (btn) btn.setAttribute('aria-pressed', String(state.r5Switchers));
    const icon = document.getElementById('r5SwIcon');
    if (icon) icon.textContent = state.r5Switchers ? '✓' : '+';
    activeWheel.setSlices(getSlices(), true, 850);
  });
  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (res) { state.r5Last = res.slice.label; document.getElementById('r5Out').textContent = `Landed on: ${res.slice.label}`; }
  });
}

function renderR6() {
  const slices = !state.r6WithResume
    ? buildPhoneStatements(profile).map((st, i) => ({
        key: st.id, label: `Guess ${i + 1}`, weight: 1, pct: 17, color: SLICE_COLORS.statement[i],
        item: { text: st.text, source: st.isReal ? 'It happens to be true, but nothing shows where it came from.' : 'Source: none. It is invented, and nothing flags it.', grounded: false },
      }))
    : buildPhoneSourcedStatements(profile, extras.r2ProofIds, extras.r2TypedLine).map((st, i) => ({
        key: st.id, label: `Source ${i + 1}`, weight: 1, pct: 20, color: i < 3 ? '#2563eb' : '#0d9488',
        item: { text: st.text, source: st.source, grounded: true },
      }));

  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <p class="phone-text" style="font-weight:700; text-align:center;">Spin without the resume first, then hand it over and spin again.</p>
      <div class="mode-switch-row" style="width:100%;">
        <button type="button" class="dial-preset" id="r6No" aria-pressed="${!state.r6WithResume}">Without resume</button>
        <button type="button" class="dial-preset" id="r6Yes" aria-pressed="${state.r6WithResume}">Hand it over</button>
      </div>
      <div class="wheel-wrap">${pointerSvg()}<canvas id="rw" class="wheel-canvas"></canvas></div>
      <button type="button" class="btn btn-primary btn-block" id="rSpin">Spin</button>
      ${state.r6Current ? `<div class="card" style="width:100%; display:flex; flex-direction:column; gap:8px;">
        <div class="phone-h2">“${esc(state.r6Current.text)}”</div>
        <div class="pill ${state.r6Current.grounded ? 'pill-good' : 'pill-warn'}" style="align-self:flex-start;">${esc(state.r6Current.source)}</div>
      </div>` : ''}
    </div>
  `;
  activeWheel = new WheelRenderer(document.getElementById('rw'), { size: 256, mode: 'statement' });
  activeWheel.setSlices(slices, false);
  document.getElementById('r6No').addEventListener('click', () => { state.r6WithResume = false; state.r6Current = null; render(); });
  document.getElementById('r6Yes').addEventListener('click', () => { state.r6WithResume = true; state.r6Current = null; render(); });
  document.getElementById('rSpin').addEventListener('click', async (e) => {
    e.currentTarget.disabled = true;
    const res = await activeWheel.spin();
    e.currentTarget.disabled = false;
    if (res) { state.r6Current = res.slice.item; render(); }
  });
}

function renderReplayReveal(stage) {
  const t = ROUND_TAKEAWAYS[stage.round];
  const isLastPanel = stage.panel === stage.panelTotal;
  const copyMap = {
    '1_1': 'Same resume, several spins, different answers. Nothing about the person changed between spins. The wheel didn’t look up an answer. It drew one, from slices sized by how likely each outcome is for someone with this resume. So which spin was right? Maybe all of them. Maybe none.',
    '1_2': 'Rule: “If the resume says ETL pipelines, the role is Data Engineer.” A thousand asks, a thousand identical answers. Wheel: a thousand asks, a spread. Engineers call the first deterministic and the second probabilistic. Different outputs for the same input is called non-determinism.',
    '1_3': 'On our wheel, Sanket’s Product Manager slice was 5%. Spin 100 times and it comes up about 5 of 100 times — and no two runs match.',
    '1_4': 'Normal software is predictable: the same input always gives the same output, so you can test it once and trust it. An AI product isn’t. A normal product ships a button. An AI product ships a wheel. Someone decides what is on it and how big each slice is.',
    '2_1': 'Product roles went from about 20% to about 40% of the wheel. Data Engineer stayed biggest, because nothing here is a promise.',
    '2_2': 'The old lines said what he did. The new ones say what happened because he did it. The wheel doesn’t know Sanket. It only reads the page. What you hand an AI like this is called its context (or prompt), and changing it changes the answer.',
    '2_3': 'Context is the cheapest lever a product manager has. No new model, no new code. Change what goes in, and the same system answers differently. It also moves for anyone who writes the right words, true or not.',
    '3_1': 'Careful, Balanced, and Bold — same nine roles every time.',
    '3_2': 'It doesn’t add or remove a role. It only reshapes the slices. Careful makes the biggest slice bigger. Bold flattens everything toward equal, so rare roles get a real chance. In AI this dial is called temperature.',
    '3_3': 'Careful is for repeatable answers (like screening 4,312 applications fairly). Bold is for exploring. Bold finds the door. Context opens it.',
    '4_1': 'The wheel gave statements about Sanket (and about you) in the same confident tone, true or not. The invented ones were plausible: the kind of thing a person with your background might have done.',
    '4_2': 'The wheel has no ‘I don’t know’ slice, so it always lands somewhere, and it lands in the same confident voice. This is called hallucination: fluent output that isn’t grounded in anything true.',
    '4_3': 'How sure an answer sounds tells you nothing about whether it is right. For a product: make ‘I don’t know’ possible, show sources, and decide who checks the wheel before a user trusts it.',
    '5_1': 'In an illustrative sample of 100 careers, only 4 became product managers. Add 30 switchers who made it, and the same slice becomes about 14%. Same wheel, same resume, different history.',
    '5_2': 'The wheel doesn’t judge Sanket. It repeats the past. Whoever is thin in its data is thin on the wheel. That is bias, and the data it learned from is called training data. Data also ages and freezes the menu.',
    '5_3': 'Those 100 dots were real people’s career histories. Did they know they would be used to teach a wheel? Can one dot ask to be removed? That makes data governance a product decision, not only a legal one.',
    '6_1': 'Without the resume, the wheel had six statements, three invented, and nothing to tell them apart. With it, the invented ones disappeared. Every answer pointed to a line that could be checked.',
    '6_2': 'The wheel first fetches the lines that matter, then answers using only those. That is RAG (retrieval-augmented generation). Pointing at the line is a citation. Limited desk space is the context window, and searching by meaning uses embeddings.',
    '6_3': 'Underneath, the model predicts the next piece of text from patterns it learned. Everything so far is that, plus tricks: context, a dial, and sources.',
  };

  let visual = '';
  if (stage.round === 2 && stage.panel === 1) {
    visual = `<div class="card bar-list">${SANKET_ROLE_KEYS.map((r, i) => `
      <div class="bar-row"><div class="bar-meta" style="font-size:15px;"><span>${esc(r.label)}</span><span>${SANKET_BEFORE_PCTS[i]}% → ${SANKET_AFTER_PCTS[i]}%</span></div>
      <div class="bar-track" style="height:10px;"><div class="bar-fill" style="width:${SANKET_AFTER_PCTS[i]}%; background:${r.color};"></div></div></div>`).join('')}</div>`;
  } else if (stage.round === 3 && stage.panel === 1) {
    visual = `<div class="card" style="display:flex; flex-direction:column; gap:10px;">
      ${[{ l: 'Careful', v: 0 }, { l: 'Balanced', v: 50 }, { l: 'Bold', v: 100 }].map((x) => `
        <div><div style="font-size:15px; font-weight:700; margin-bottom:4px;">${x.l}</div>
        <div class="stacked-bar" style="height:28px;">${computeSanketR3Slices(x.v).map((s) => `<div class="stacked-seg" style="width:${s.weight}%; background:${s.color}; font-size:12px;">${s.pct >= 12 ? s.pct + '%' : ''}</div>`).join('')}</div></div>`).join('')}
    </div>`;
  }

  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      <span class="pill pill-accent" style="align-self:flex-start;">${esc(stage.roundName)} · Reveal ${stage.panel}/${stage.panelTotal}</span>
      <h1 class="phone-h1">${esc(stage.title)}</h1>
      ${visual}
      <p class="phone-text">${esc(copyMap[`${stage.round}_${stage.panel}`] || '')}</p>
      ${isLastPanel ? `<div class="card-subtle" style="display:flex; flex-direction:column; gap:8px;">
        <p class="phone-text">${esc(t.roleLine)}</p>
        <p class="phone-text" style="font-weight:700; color:var(--dream);">The PM move: ${esc(t.pmMove)}</p>
      </div>` : ''}
    </div>
  `;
}

function renderE1(qIdx) {
  const q = SPOT_IT_QUESTIONS[qIdx];
  const answered = Object.prototype.hasOwnProperty.call(state.e1Answers, qIdx);
  const right = answered && state.e1Answers[qIdx] === q.matches;
  const totalRight = SPOT_IT_QUESTIONS.reduce((a, it, i) => a + (state.e1Answers[i] === it.matches ? 1 : 0), 0);
  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <span class="pill pill-accent" style="align-self:flex-start;">Spot it · ${q.index} of 3</span>
      <h1 class="phone-h1">Does the AI match its source?</h1>
      <div class="card-subtle"><div style="font-size:13px; font-weight:800;">SOURCE</div><p class="phone-text">“${esc(q.source)}”</p></div>
      <div class="card" style="border-color:var(--accent);"><div style="font-size:13px; font-weight:800; color:var(--accent);">AI SAYS</div><p class="phone-text" style="font-weight:700;">“${esc(q.aiSays)}”</p></div>
      ${!answered
        ? `<div class="binary-row"><button type="button" class="btn btn-good" id="e1M">Matches</button><button type="button" class="btn btn-warn" id="e1N">Doesn’t match</button></div>`
        : `<div class="card"><div class="pill ${right ? 'pill-good' : 'pill-warn'}">${right ? 'Right.' : 'Not quite.'}</div><p class="phone-text" style="margin-top:8px;">${esc(q.explanation)}</p></div>`}
      ${qIdx === 2 && answered ? `<div class="card-dream"><div class="phone-h2" style="color:var(--dream);">You spotted ${totalRight} of 3.</div><p class="phone-text">You could only catch them because the source was on the table. That is the whole job: wrong answers sound exactly like right ones.</p></div>` : ''}
    </div>
  `;
  document.getElementById('e1M')?.addEventListener('click', () => { state.e1Answers[qIdx] = true; render(); });
  document.getElementById('e1N')?.addEventListener('click', () => { state.e1Answers[qIdx] = false; render(); });
}

function renderE3() {
  if (!Array.isArray(extras.e3MapSelected)) {
    extras.e3MapSelected = (profile.things || []).filter((id) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(id));
  }
  const sel = new Set(extras.e3MapSelected);
  mainEl.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <h1 class="phone-h1">Your map</h1>
      <p class="phone-text">What do you already do at work? Tap everything that’s true.</p>
      <div class="pill pill-accent" style="align-self:flex-start;">You already do ${sel.size} of 6.</div>
      ${YOUR_MAP_ITEMS.map((m) => `
        <button type="button" class="map-toggle-card" data-m="${m.id}" aria-pressed="${sel.has(m.id)}">
          <div class="map-toggle-head"><span>${esc(m.item)}</span><span>${sel.has(m.id) ? '✓' : '+'}</span></div>
          ${sel.has(m.id) ? `<div class="map-toggle-move">The PM move: ${esc(m.pmMove)}</div>` : ''}
        </button>`).join('')}
      <div class="card-subtle"><p class="phone-text" style="font-weight:700;">Not on this list yet: the PM foundations.</p><p class="phone-muted">Writing a PRD, choosing a success metric, deciding what to build first. Those come next.</p></div>
    </div>
  `;
  document.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.m;
    if (sel.has(id)) sel.delete(id); else sel.add(id);
    extras.e3MapSelected = Array.from(sel);
    saveJson(EXTRAS_KEY, extras);
    render();
  }));
}

let replayResizeTimer = null;
window.addEventListener('resize', () => {
  if (replayResizeTimer) clearTimeout(replayResizeTimer);
  replayResizeTimer = setTimeout(() => {
    if (activeWheel) {
      const targetSize = activeWheel.mode === 'statement' ? Math.min(265, wheelSize()) : wheelSize();
      activeWheel.resize(targetSize);
    }
  }, 100);
});

prevBtn.addEventListener('click', () => { if (stageIdx > 0) { stageIdx -= 1; render(); window.scrollTo(0, 0); } });
nextBtn.addEventListener('click', () => { if (stageIdx < REPLAY_STAGES.length - 1) { stageIdx += 1; render(); window.scrollTo(0, 0); } });

initSchemeSync(() => activeWheel?.draw());
render();
