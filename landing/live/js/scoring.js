import {
  BACKGROUNDS,
  EXPERIENCE_BANDS,
  WORK_THINGS,
  PHONE_PROOF_CHIPS,
  SLICE_COLORS,
  ROLE_DESCRIPTIONS,
  SANKET_ROLE_KEYS,
  SANKET_BEFORE_PCTS,
  SANKET_AFTER_PCTS,
  LONG_SHOT_ROLES,
  PHONE_INVENTED_POOL,
  R5_BASE_COUNTS,
  R5_SWITCHER_ADDS,
  R5_TODAY_ROLES,
} from './data.js';

/**
 * Calibrated starting scores per Section 4.2:
 * Preserves relative profile strengths while ensuring “Stay” is the biggest slice (~43–56%)
 * and “Product Manager” is a visible thin slice (~5–16% depending on profile).
 */
const BASE_SCORES = {
  software: { stay: 16, techPm: 6, dataPm: 3, pm: 1, growthPm: 2, aiPm: 4 },
  qa: { stay: 15, techPm: 5, dataPm: 3, pm: 1, growthPm: 2, aiPm: 4 },
  analyst: { stay: 16, techPm: 3, dataPm: 6, pm: 1.5, growthPm: 4, aiPm: 3 },
  po: { stay: 15, techPm: 4.5, dataPm: 3, pm: 3, growthPm: 3, aiPm: 3 },
  risk: { stay: 14, techPm: 2.5, dataPm: 4.5, pm: 1, growthPm: 3, aiPm: 3 },
  ops: { stay: 15, techPm: 3.5, dataPm: 3, pm: 1.5, growthPm: 5, aiPm: 2 },
  sales: { stay: 15, techPm: 2.5, dataPm: 2.5, pm: 1, growthPm: 6, aiPm: 2 },
  writing: { stay: 14, techPm: 2.5, dataPm: 2.5, pm: 1.5, growthPm: 4.5, aiPm: 2.5 },
};

const PERSONAL_SLICE_META = [
  { key: 'stay', tallyBucket: 'Stay', color: SLICE_COLORS.stay, isProduct: false },
  { key: 'techPm', label: 'Technical PM', tallyBucket: 'Technical PM', color: SLICE_COLORS.techPm, isProduct: true },
  { key: 'dataPm', label: 'Data PM', tallyBucket: 'Data PM', color: SLICE_COLORS.dataPm, isProduct: true },
  { key: 'pm', label: 'Product Manager', tallyBucket: 'Product Manager', color: SLICE_COLORS.productManager, isProduct: true, isDream: true },
  { key: 'growthPm', label: 'Growth PM', tallyBucket: 'Growth PM', color: SLICE_COLORS.growthPm, isProduct: true },
  { key: 'aiPm', label: 'AI PM', tallyBucket: 'AI PM', color: SLICE_COLORS.aiPm, isProduct: true },
];

/**
 * Raise (score + 1) ^ 1.8 and convert to integer percentages summing to 100, with no slice below minPct (default 5).
 */
export function scoresToPercentages(values, minPct = 5) {
  const raw = values.map((v) => Math.pow(Math.max(0, v) + 1, 1.8));
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  const pcts = raw.map((r) => Math.max(minPct, Math.round((r / sum) * 100)));

  // Adjust largest slice(s) so percentages sum cleanly to 100 while preserving minPct
  let diff = 100 - pcts.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (diff !== 0 && guard < 100) {
    guard++;
    if (diff > 0) {
      const maxIdx = pcts.indexOf(Math.max(...pcts));
      pcts[maxIdx] += 1;
      diff -= 1;
    } else {
      // Subtract from largest slice above minPct
      let bestIdx = -1;
      let bestVal = -1;
      for (let i = 0; i < pcts.length; i++) {
        if (pcts[i] > minPct && pcts[i] > bestVal) {
          bestVal = pcts[i];
          bestIdx = i;
        }
      }
      if (bestIdx === -1) break;
      pcts[bestIdx] -= 1;
      diff += 1;
    }
  }
  return pcts;
}

export function getBackgroundObj(bgId) {
  return BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[1]; // default QA
}

export function getExperienceObj(expId) {
  return EXPERIENCE_BANDS.find((e) => e.id === expId) || EXPERIENCE_BANDS[1];
}

/**
 * Compute participant's 6 personal slices given setup + optional Round 2 proof additions + optional Round 5 switchers boost.
 */
export function computePersonalSlices(profile, options = {}) {
  const { proofIds = [], typedLine = '', addSwitchers = false } = options;
  const bgObj = getBackgroundObj(profile.backgroundId);
  const expObj = getExperienceObj(profile.experienceId);
  const base = { ...(BASE_SCORES[bgObj.id] || BASE_SCORES.qa) };

  // Add selected 3 work things (Section 4.2)
  for (const thingId of profile.things || []) {
    const thing = WORK_THINGS.find((t) => t.id === thingId);
    if (thing) {
      for (const [k, delta] of Object.entries(thing.adds)) {
        base[k] = (base[k] || 0) + delta;
      }
    }
  }

  // Years of experience: 8 or more adds +1 to Technical PM and Product Manager
  if (expObj.isEightPlus) {
    base.techPm += 1;
    base.pm += 1;
  }

  // Round 2 proof chips
  for (const pid of proofIds) {
    const chip = PHONE_PROOF_CHIPS.find((c) => c.id === pid);
    if (chip) {
      for (const [k, delta] of Object.entries(chip.adds)) {
        base[k] = (base[k] || 0) + delta;
      }
    }
  }

  // Round 2 optional typed line (Product Manager +2, stays strictly on phone)
  if (typedLine && typedLine.trim().length > 0) {
    base.pm += 2;
  }

  // Round 5 switchers toggle: boosts Product Manager slice noticeably
  if (addSwitchers) {
    base.pm += 7;
    base.techPm += 1.5;
    base.dataPm += 1.5;
    base.stay = Math.max(8, base.stay - 2.5);
  }

  const orderedScores = PERSONAL_SLICE_META.map((m) => base[m.key]);
  const pcts = scoresToPercentages(orderedScores, 5);

  return PERSONAL_SLICE_META.map((meta, idx) => ({
    key: meta.key,
    label: meta.key === 'stay' ? bgObj.shortStay : meta.label,
    tallyBucket: meta.tallyBucket,
    weight: pcts[idx],
    pct: pcts[idx],
    color: meta.color,
    isProduct: meta.isProduct,
    isDream: Boolean(meta.isDream),
    description: meta.key === 'stay' ? ROLE_DESCRIPTIONS.stay : ROLE_DESCRIPTIONS[meta.label],
  }));
}

/**
 * Sanket's wheel slices for Round 1 & Round 2.
 * activeLineIndices: Set or Array of indices 0..3 of Sanket's 4 added lines.
 */
export function computeSanketR2Slices(activeLineIndices = []) {
  const count = Array.isArray(activeLineIndices) ? activeLineIndices.length : activeLineIndices.size;
  const t = Math.max(0, Math.min(1, count / 4));

  // Exact spec before/after numbers at endpoints, smooth interpolation in between
  const pcts = SANKET_ROLE_KEYS.map((_, i) => {
    const val = SANKET_BEFORE_PCTS[i] + (SANKET_AFTER_PCTS[i] - SANKET_BEFORE_PCTS[i]) * t;
    return Math.round(val);
  });

  return SANKET_ROLE_KEYS.map((meta, i) => ({
    key: meta.key,
    label: meta.label,
    weight: pcts[i],
    pct: pcts[i],
    color: meta.color,
    isProduct: meta.isProduct,
    isDream: Boolean(meta.isDream),
    description: ROLE_DESCRIPTIONS[meta.label],
  }));
}

/**
 * Round 3 Dial shaping for Sanket's wheel (dial: 0 = Careful, 50 = Balanced, 100 = Bold).
 * Spec targets:
 *   Careful (0): Data Engineer ~87%, Data Analyst ~12%, rest minimal
 *   Balanced (50): After-wheel (35, 23, 11, 11, 11, 9)
 *   Bold (100): Six core roles 12–17% (17, 15, 14, 13, 13, 13) + three long-shots at 5% each
 */
export function computeSanketR3Slices(dialValue = 50) {
  const careful = [87, 12, 1, 0, 0, 0, 0, 0, 0];
  const balanced = [35, 23, 11, 11, 11, 9, 0, 0, 0];
  const bold = [17, 15, 14, 13, 13, 13, 5, 5, 5];

  const allMeta = [
    ...SANKET_ROLE_KEYS,
    ...LONG_SHOT_ROLES.map((r) => ({ ...r, isProduct: false, isLongShot: true })),
  ];

  let raw;
  if (dialValue <= 50) {
    const t = dialValue / 50;
    raw = careful.map((c, i) => c + (balanced[i] - c) * t);
  } else {
    const t = (dialValue - 50) / 50;
    raw = balanced.map((b, i) => b + (bold[i] - b) * t);
  }

  // Round while keeping sum ~100 and hiding 0-weight slices
  const slices = allMeta
    .map((meta, i) => ({
      key: meta.key,
      label: meta.label,
      weight: Math.round(raw[i] * 10) / 10,
      pct: Math.round(raw[i]),
      color: meta.color,
      isDream: Boolean(meta.isDream),
      isLongShot: Boolean(meta.isLongShot),
      description: ROLE_DESCRIPTIONS[meta.label] || '',
    }))
    .filter((s) => s.weight >= 0.4);

  return slices;
}

/**
 * Round 3 Dial shaping for participant's personal wheel (dial: 0 = Careful, 50 = Balanced, 100 = Bold).
 */
export function computePhoneR3Slices(baseSixSlices, dialValue = 50) {
  // Build Careful (sharpened toward top 2), Balanced (baseSixSlices), Bold (flattened 12–17% + three 5% long-shots)
  const sortedIndices = baseSixSlices
    .map((s, i) => ({ pct: s.pct, i }))
    .sort((a, b) => b.pct - a.pct);

  const careful = new Array(9).fill(0);
  careful[sortedIndices[0].i] = 86;
  careful[sortedIndices[1].i] = 12;
  careful[sortedIndices[2].i] = 2;

  const balanced = [...baseSixSlices.map((s) => s.pct), 0, 0, 0];

  // Bold target: rank-ordered between 17% and 12% summing to 85%, plus 5% each for 3 long-shots
  const boldRanks = [17, 15, 14, 13, 13, 13];
  const bold = new Array(9).fill(0);
  sortedIndices.forEach((entry, rank) => {
    bold[entry.i] = boldRanks[rank];
  });
  bold[6] = 5;
  bold[7] = 5;
  bold[8] = 5;

  const allMeta = [
    ...baseSixSlices,
    ...LONG_SHOT_ROLES.map((r) => ({
      key: r.key,
      label: r.label,
      color: r.color,
      isLongShot: true,
      description: ROLE_DESCRIPTIONS[r.label],
    })),
  ];

  let raw;
  if (dialValue <= 50) {
    const t = dialValue / 50;
    raw = careful.map((c, i) => c + (balanced[i] - c) * t);
  } else {
    const t = (dialValue - 50) / 50;
    raw = balanced.map((b, i) => b + (bold[i] - b) * t);
  }

  return allMeta
    .map((meta, i) => ({
      ...meta,
      weight: Math.round(raw[i] * 10) / 10,
      pct: Math.round(raw[i]),
    }))
    .filter((s) => s.weight >= 0.4);
}

export function getDialSettingName(dialValue) {
  if (dialValue <= 20) return 'Careful';
  if (dialValue >= 80) return 'Bold';
  return 'Balanced';
}

/**
 * Round 4 Phone personalized 6-statement wheel (3 true from setup + 3 non-contradicting invented).
 */
export function buildPhoneStatements(profile) {
  const picks = profile.things || ['A', 'B', 'E'];
  const trueStatements = picks.map((id) => {
    const t = WORK_THINGS.find((w) => w.id === id);
    return {
      id: `true_${id}`,
      text: t.statement,
      isReal: true,
      sourceName: `Your setup pick: ${t.sourceLabel}`,
    };
  });

  // Filter out invented statements that contradict picks
  const eligibleInvented = PHONE_INVENTED_POOL.filter((item) => {
    return !item.conflictsWithThings.some((c) => picks.includes(c));
  });

  // Deterministic spread per profile so it stays stable during the round
  const seed = picks.join('').charCodeAt(0) + (profile.backgroundId || 'qa').charCodeAt(0);
  const chosenInvented = [];
  const pool = [...eligibleInvented];
  let cursor = seed % pool.length;
  while (chosenInvented.length < 3 && pool.length > 0) {
    const [picked] = pool.splice(cursor % pool.length, 1);
    chosenInvented.push({
      id: picked.id,
      text: picked.text,
      isReal: false,
      sourceName: null,
    });
    cursor += 1;
  }

  // Interleave true and invented cleanly
  const combined = [];
  for (let i = 0; i < 3; i++) {
    if (trueStatements[i]) combined.push(trueStatements[i]);
    if (chosenInvented[i]) combined.push(chosenInvented[i]);
  }
  return combined;
}

/**
 * Round 6 Phone sourced statements (3 setup picks + Round 2 proof chips + optional typed line).
 */
export function buildPhoneSourcedStatements(profile, proofIds = [], typedLine = '') {
  const items = [];
  for (const id of profile.things || ['A', 'B', 'E']) {
    const t = WORK_THINGS.find((w) => w.id === id);
    if (t) {
      items.push({
        id: `setup_${id}`,
        text: t.statement,
        source: `Source: you told us this — ${t.sourceLabel}`,
      });
    }
  }
  for (const pid of proofIds) {
    const chip = PHONE_PROOF_CHIPS.find((c) => c.id === pid);
    if (chip) {
      items.push({
        id: `proof_${pid}`,
        text: chip.statement,
        source: `Source: you told us this — “${chip.label}”`,
      });
    }
  }
  if (typedLine && typedLine.trim().length > 0) {
    const clean = typedLine.trim();
    items.push({
      id: 'typed_line',
      text: clean,
      source: `Source: you told us this — your line from Round 2`,
    });
  }
  return items;
}

/**
 * Round 5 Host dots & role slices from the two toggles.
 */
export function computeHostR5Data(addSwitchers = false, updateForToday = false) {
  const entries = R5_BASE_COUNTS.map((item) => {
    const extra = addSwitchers ? (R5_SWITCHER_ADDS[item.key] || 0) : 0;
    return {
      ...item,
      count: item.count + extra,
      baseCount: item.count,
      addedCount: extra,
    };
  });

  if (updateForToday) {
    for (const r of R5_TODAY_ROLES) {
      entries.push({ ...r, baseCount: 0, addedCount: r.count, isNewToday: true });
    }
  }

  const totalDots = entries.reduce((sum, e) => sum + e.count, 0);
  const slices = entries.map((e) => ({
    key: e.key,
    label: e.label,
    count: e.count,
    weight: e.count,
    pct: Math.round((e.count / totalDots) * 100),
    color: e.color,
    isDream: Boolean(e.isDream),
    isNewToday: Boolean(e.isNewToday),
    description: ROLE_DESCRIPTIONS[e.label] || '',
  }));

  // Build individual dot array grouped by category for crisp visual scanning
  const dots = [];
  for (const e of entries) {
    for (let i = 0; i < e.baseCount; i++) {
      dots.push({ key: e.key, label: e.label, color: e.color, isAdded: false });
    }
    for (let i = 0; i < e.addedCount; i++) {
      dots.push({ key: e.key, label: e.label, color: e.color, isAdded: true });
    }
  }

  return { totalDots, slices, dots };
}
