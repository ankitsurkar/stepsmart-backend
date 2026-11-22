/**
 * Session Spec Data: The AI PM, Part 1 — “The Making”
 * All screen copy uses curly quotes and apostrophes, avoids AI jargon before each reveal,
 * never names an employer, and always pairs score references with “on our wheel”.
 */

// Open item 8.1: add the programme sign-up URL here when ready (e.g. "https://...")
export const PROGRAMME_SIGNUP_URL = '';

export const SESSION_TITLE = 'The AI PM, Part 1';
export const SESSION_SUBTITLE = '“The Making”';

// Palette for wheel slices (high contrast text-safe hues)
export const SLICE_COLORS = {
  stay: '#334155',        // Slate / incumbent
  dataEng: '#334155',     // Sanket's incumbent
  dataAnalyst: '#475569', // Adjacent data
  techPm: '#2563eb',      // Cobalt
  dataPm: '#0d9488',      // Teal
  productOwner: '#7c3aed',// Violet
  productManager: '#d95f2b', // Signature warm coral/terracotta — unmistakable thin dream slice
  growthPm: '#15803d',    // Forest emerald
  aiPm: '#6d28d9',        // Deep purple
  aiBuilder: '#0284c7',   // Sky blue
  longShot1: '#b45309',   // Amber
  longShot2: '#be185d',   // Rose
  longShot3: '#4f46e5',   // Indigo
  statement: ['#334155', '#3b4a62', '#2c3d55', '#42526b', '#36455c', '#2f3f58', '#3e4f68', '#314259', '#465872'],
};

export const ROLE_DESCRIPTIONS = {
  stay: 'Your current track — the safe bet the wheel sees first.',
  'Technical PM': 'Bridges engineering trade-offs, system constraints, and product goals.',
  'Data PM': 'Owns data platforms, metrics pipelines, and analytics products.',
  'Product Manager': 'Decides what to build, for whom, and how success is measured.',
  'Growth PM': 'Runs experiments across acquisition, activation, and retention.',
  'AI PM': 'Shapes products built around AI systems and how they behave.',
  'Data Engineer': 'Builds and maintains pipelines, transformations, and data infrastructure.',
  'Data Analyst': 'Turns raw data into dashboards, reports, and business answers.',
  'Product Owner': 'Manages the backlog, user stories, and sprint execution.',
  'AI Product Manager': 'Guides AI-powered features from problem framing to quality bars.',
  'AI Builder': 'Prototypes and ships practical AI tools and workflows.',
  'UX Researcher': 'Studies user behaviour to uncover needs and test product ideas.',
  'Sales Engineer': 'Translates technical products into solutions for prospective buyers.',
  'Founder’s Office': 'Works across strategy, operations, and special projects with leadership.',
};

// 4.1 Setup options
export const BACKGROUNDS = [
  { id: 'software', label: 'Software or tech lead', shortStay: 'Stay: Software' },
  { id: 'qa', label: 'QA or testing', shortStay: 'Stay: QA' },
  { id: 'analyst', label: 'Business or data analyst', shortStay: 'Stay: Analyst' },
  { id: 'po', label: 'Product owner, program or scrum', shortStay: 'Stay: PO / Program' },
  { id: 'risk', label: 'Risk, audit or finance', shortStay: 'Stay: Risk / Audit' },
  { id: 'ops', label: 'Operations or consulting', shortStay: 'Stay: Ops / Consulting' },
  { id: 'sales', label: 'Sales or marketing', shortStay: 'Stay: Sales / Marketing' },
  { id: 'writing', label: 'Writing, research or design', shortStay: 'Stay: Writing / Research' },
];

export const EXPERIENCE_BANDS = [
  { id: 'under4', label: 'Under 4', isEightPlus: false },
  { id: '4to7', label: '4 to 7', isEightPlus: false },
  { id: '8to12', label: '8 to 12', isEightPlus: true },
  { id: '13plus', label: '13 or more', isEightPlus: true },
];

export const WORK_THINGS = [
  {
    id: 'A',
    label: 'I test things and look for what breaks.',
    shortLabel: 'A. Test',
    statement: 'You spend your days finding what breaks before users do.',
    sourceLabel: '“I test things and look for what breaks.”',
    adds: { techPm: 1, aiPm: 2 },
    mapKey: 'A',
  },
  {
    id: 'B',
    label: 'I write briefs, specs or documentation.',
    shortLabel: 'B. Briefs and specs',
    statement: 'You write the briefs and specs other people build from.',
    sourceLabel: '“I write briefs, specs or documentation.”',
    adds: { pm: 2, techPm: 1, aiPm: 1 },
    mapKey: 'B',
  },
  {
    id: 'C',
    label: 'I balance what teams want against rules.',
    shortLabel: 'C. Balance teams and rules',
    statement: 'You balance what teams want against the rules.',
    sourceLabel: '“I balance what teams want against rules.”',
    adds: { pm: 2, growthPm: 1 },
    mapKey: 'C',
  },
  {
    id: 'D',
    label: 'I check claims against evidence.',
    shortLabel: 'D. Check claims',
    statement: 'You check claims against evidence.',
    sourceLabel: '“I check claims against evidence.”',
    adds: { dataPm: 1, pm: 1, aiPm: 1 },
    mapKey: 'D',
  },
  {
    id: 'E',
    label: 'I work with data: cleaning, analysis, pipelines.',
    shortLabel: 'E. Data',
    statement: 'You work with data: cleaning it, analysing it, moving it.',
    sourceLabel: '“I work with data: cleaning, analysis, pipelines.”',
    adds: { dataPm: 2, aiPm: 1 },
    mapKey: 'E',
  },
  {
    id: 'F',
    label: 'I’ve built or run search, systems or tools.',
    shortLabel: 'F. Systems and search',
    statement: 'You have built or run search, systems or tools.',
    sourceLabel: '“I’ve built or run search, systems or tools.”',
    adds: { techPm: 2, aiPm: 1 },
    mapKey: 'F',
  },
  {
    id: 'G',
    label: 'I’ve talked directly to customers or users.',
    shortLabel: 'G. Customers',
    statement: 'You have talked directly to customers or users.',
    sourceLabel: '“I’ve talked directly to customers or users.”',
    adds: { growthPm: 2, pm: 1 },
    mapKey: null,
  },
  {
    id: 'H',
    label: 'I’ve led people or a project.',
    shortLabel: 'H. Led people',
    statement: 'You have led people or a project.',
    sourceLabel: '“I’ve led people or a project.”',
    adds: { pm: 2, techPm: 1 },
    mapKey: null,
  },
];

// Round 2 Phone proof chips
export const PHONE_PROOF_CHIPS = [
  {
    id: 'metric',
    label: 'I improved something by a number',
    adds: { dataPm: 2, techPm: 1, pm: 1 },
    statement: 'You improved a process or outcome by a measurable number.',
  },
  {
    id: 'mentor',
    label: 'I led or mentored people',
    adds: { pm: 3, techPm: 1 },
    statement: 'You led or mentored people on your team.',
  },
  {
    id: 'dashboard',
    label: 'I built a dashboard or report others used',
    adds: { dataPm: 3, pm: 1 },
    statement: 'You built a dashboard or report that other people used.',
  },
  {
    id: 'customers',
    label: 'I worked directly with customers or users',
    adds: { growthPm: 2, pm: 2 },
    statement: 'You worked directly with customers or users.',
  },
];

// Sanket's Resume Lines (Lines 1–5 before, Lines 6–9 verbatim after)
// Note: Replace Lines 1–5 with exact verbatim lines from the final handover document if desired.
export const SANKET_BEFORE_LINES = [
  'Built and automated ETL pipelines for airline and financial clients.',
  'Designed and maintained batch data workflows across source systems.',
  'Wrote SQL transformations and queries to prepare reporting tables.',
  'Monitored daily pipeline runs and resolved data quality issues.',
  'Documented database schemas and data mappings for downstream teams.',
];

export const SANKET_AFTER_LINES = [
  'Raised project capacity 20% and sped up delivery 10% by optimizing data workflows.',
  'Found a 10% gap between estimated and actual hours and built an interactive KPI dashboard.',
  'Acted as backup lead and mentored two interns, both considered for PPOs.',
  'Raised team efficiency 15% and JIRA adoption with dashboards and best-practice blogs.',
];

export const SANKET_ALL_NINE_LINES = [...SANKET_BEFORE_LINES, ...SANKET_AFTER_LINES];

// Sanket's Round 1–3 Role Wheel slices
export const SANKET_ROLE_KEYS = [
  { key: 'dataEng', label: 'Data Engineer', color: SLICE_COLORS.dataEng, isProduct: false },
  { key: 'dataAnalyst', label: 'Data Analyst', color: SLICE_COLORS.dataAnalyst, isProduct: false },
  { key: 'techPm', label: 'Technical PM', color: SLICE_COLORS.techPm, isProduct: true },
  { key: 'dataPm', label: 'Data PM', color: SLICE_COLORS.dataPm, isProduct: true },
  { key: 'productOwner', label: 'Product Owner', color: SLICE_COLORS.productOwner, isProduct: true },
  { key: 'productManager', label: 'Product Manager', color: SLICE_COLORS.productManager, isProduct: true, isDream: true },
];

export const SANKET_BEFORE_PCTS = [54, 20, 9, 6, 6, 5];
export const SANKET_AFTER_PCTS = [35, 23, 11, 11, 11, 9];

// Round 3 Long-shot slices
export const LONG_SHOT_ROLES = [
  { key: 'uxResearcher', label: 'UX Researcher', color: SLICE_COLORS.longShot1 },
  { key: 'salesEngineer', label: 'Sales Engineer', color: SLICE_COLORS.longShot2 },
  { key: 'foundersOffice', label: 'Founder’s Office', color: SLICE_COLORS.longShot3 },
];

// Round 4 Sanket Statements (3 true, 3 invented — no confidence percentages anywhere)
export const SANKET_R4_STATEMENTS = [
  {
    id: 's1',
    text: 'Sanket built and automated ETL pipelines for airline and financial clients.',
    isReal: true,
    lineNumber: 1,
  },
  {
    id: 's2',
    text: 'Sanket led a 30-person engineering team.',
    isReal: false,
    lineNumber: null,
  },
  {
    id: 's3',
    text: 'Sanket mentored two interns, both considered for pre-placement offers.',
    isReal: true,
    lineNumber: 8,
  },
  {
    id: 's4',
    text: 'Sanket owned a 40 crore rupee product budget.',
    isReal: false,
    lineNumber: null,
  },
  {
    id: 's5',
    text: 'Sanket built an interactive KPI dashboard that exposed a 10% gap in project hours.',
    isReal: true,
    lineNumber: 7,
  },
  {
    id: 's6',
    text: 'Sanket shipped a mobile app used by one million people.',
    isReal: false,
    lineNumber: null,
  },
];

// Round 4 Phone invented statement pool
export const PHONE_INVENTED_POOL = [
  {
    id: 'inv1',
    text: 'You led a 30-person engineering team.',
    conflictsWithThings: ['H'],
    conflictsWithBg: [],
  },
  {
    id: 'inv2',
    text: 'You owned a 40 crore rupee product budget.',
    conflictsWithThings: [],
    conflictsWithBg: [],
  },
  {
    id: 'inv3',
    text: 'You shipped an app used by a million people.',
    conflictsWithThings: [],
    conflictsWithBg: [],
  },
  {
    id: 'inv4',
    text: 'You have a PhD in machine learning.',
    conflictsWithThings: [],
    conflictsWithBg: [],
  },
  {
    id: 'inv5',
    text: 'You managed a team across five countries.',
    conflictsWithThings: ['H'],
    conflictsWithBg: [],
  },
  {
    id: 'inv6',
    text: 'You were promoted three times in two years.',
    conflictsWithThings: [],
    conflictsWithBg: [],
  },
];

// Round 5 Host illustrative career dots (100 base + 30 switchers + 13 today update)
export const R5_BASE_COUNTS = [
  { key: 'dataEng', label: 'Data Engineer', count: 55, color: SLICE_COLORS.dataEng },
  { key: 'dataAnalyst', label: 'Data Analyst', count: 20, color: SLICE_COLORS.dataAnalyst },
  { key: 'techPm', label: 'Technical PM', count: 9, color: SLICE_COLORS.techPm },
  { key: 'dataPm', label: 'Data PM', count: 7, color: SLICE_COLORS.dataPm },
  { key: 'productOwner', label: 'Product Owner', count: 5, color: SLICE_COLORS.productOwner },
  { key: 'productManager', label: 'Product Manager', count: 4, color: SLICE_COLORS.productManager, isDream: true },
];

export const R5_SWITCHER_ADDS = {
  techPm: 5,
  dataPm: 5,
  productOwner: 6,
  productManager: 14,
};

export const R5_TODAY_ROLES = [
  { key: 'aiPm', label: 'AI Product Manager', count: 6, color: SLICE_COLORS.aiPm },
  { key: 'aiBuilder', label: 'AI Builder', count: 7, color: SLICE_COLORS.aiBuilder },
];

// Round Takeaways & Role Lines (used on both Host Reveal final panel and Phone Reveal card)
export const ROUND_TAKEAWAYS = {
  1: {
    phoneOneLiner: 'Same resume, different answers. The wheel doesn’t look up an answer. It draws one, and slice size means how likely.',
    roleLine: 'If you’re a QA or tester, you know a test can pass at 10:00 and fail at 10:05 (timing, shared data), so you never trust one green run. AI needs the same habit: run it many times and look at the pass rate.',
    extraRoleLine: 'If you’re a product owner or scrum lead, you write acceptance criteria: ‘done means these pass.’ With AI, the criterion becomes ‘right 9 times in 10’, and you decide what happens the other time.',
    pmMove: 'you set the quality bar for an AI feature, such as ‘right 9 times in 10’, and decide what happens the other time.',
  },
  2: {
    phoneOneLiner: 'What you hand the AI is its context. Change the context and the answer changes.',
    roleLine: 'If you’re a BA or technical writer, you turn ‘make it better’ into a precise brief: who, what, limits, an example. Writing context for AI is the same job.',
    pmMove: 'you write the spec for how the AI should behave: its role, its limits, and an example answer.',
  },
  3: {
    phoneOneLiner: 'The dial reshapes the slices. Careful is repeatable. Bold explores.',
    roleLine: 'If you’re a product owner, program or scrum lead, you trade scope, time and risk every sprint. The dial is the same trade: repeatable and safe, or fresh and riskier.',
    pmMove: 'you choose the setting for each feature, and that is a prioritisation call.',
  },
  4: {
    phoneOneLiner: 'Sounding sure is not being right. The wheel has no ‘I don’t know’ slice.',
    roleLine: 'If you’re in risk or audit, you check claims against evidence and sample for errors. That is exactly how you test whether an AI is telling the truth.',
    pmMove: 'you define what a wrong answer costs and who checks it before a user sees it.',
  },
  5: {
    phoneOneLiner: 'The wheel repeats its past. Whoever is thin in its data is thin on the wheel.',
    roleLine: 'If you’re a data engineer or analyst, you already ask where data came from, who is missing, and whether it is clean. Bad data in, bad wheel out.',
    pmMove: 'you set the data requirements: where it comes from, who is missing, and whether people agreed.',
  },
  6: {
    phoneOneLiner: 'Look it up, then answer. Sources let you check.',
    roleLine: 'If you’re a tech lead, you’ve built search: index the documents, find the right ones, rank them. RAG is that search feeding an answer.',
    pmMove: 'you decide how the product finds its sources and shows them to the user.',
  },
};

export const SPOT_IT_QUESTIONS = [
  {
    index: 1,
    source: 'Returns are accepted within 14 days. A 10% restocking fee applies.',
    aiSays: 'Returns are accepted within 30 days with no restocking fee.',
    matches: false,
    explanation: 'Doesn’t match. The source says 14 days and a 10% restocking fee.',
  },
  {
    index: 2,
    source: 'Managed and mentored two interns… both being considered for Pre-Placement Offers.',
    aiSays: 'Sanket mentored two interns, both considered for pre-placement offers.',
    matches: true,
    explanation: 'Matches. Every claim is grounded in the source line.',
  },
  {
    index: 3,
    source: 'Improved team efficiency by 15%…',
    aiSays: 'Sanket raised team efficiency by 50%.',
    matches: false,
    explanation: 'Doesn’t match. The source says 15%, not 50%.',
  },
];

// E3. Your map (6 items verbatim)
export const YOUR_MAP_ITEMS = [
  {
    id: 'A',
    item: 'I test things and look for what breaks',
    pmMove: 'you set the quality bar for an AI feature.',
  },
  {
    id: 'B',
    item: 'I write briefs, specs or documentation',
    pmMove: 'you write how the AI should behave.',
  },
  {
    id: 'C',
    item: 'I balance what teams want against rules',
    pmMove: 'you choose the setting for each feature.',
  },
  {
    id: 'D',
    item: 'I check claims against evidence',
    pmMove: 'you define what wrong costs and who checks.',
  },
  {
    id: 'E',
    item: 'I work with data: cleaning, analysis, pipelines',
    pmMove: 'you set data requirements: source, gaps, consent.',
  },
  {
    id: 'F',
    item: 'I’ve built or run search, systems or tools',
    pmMove: 'you decide how the product finds and shows sources.',
  },
];

// Complete linear stage map for the 60-minute live session + 10-min Q&A
export const STAGES = [
  // OPENING (0–4 min)
  { id: 'opening_1', section: 'Opening', minutes: '0–4m', round: 0, type: 'opening_scene', title: 'Last time',
    hostBody: 'In the last session you learned to think about your resume like a PM. Today is the other half: how AI products behave, and which of your skills already count.',
    phoneHoldLabel: 'Opening' },
  { id: 'opening_2', section: 'Opening', minutes: '0–4m', round: 0, type: 'opening_scene', title: 'The question',
    hostBody: 'One question will follow us for the next hour: can you spot when AI is wrong?',
    highlight: true,
    phoneHoldLabel: 'Opening' },
  { id: 'opening_3', section: 'Opening', minutes: '0–4m', round: 0, type: 'opening_setup', title: 'Set up your wheel',
    hostBody: 'Three taps on your phone. About 60 seconds. Nothing you choose leaves your phone.',
    phoneHoldLabel: 'Set up your wheel' },

  // ROUND 1: Same resume, different answers (4–11 min)
  { id: 'r1_story_1', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'story', sceneNum: 1, sceneTotal: 3, title: 'Before the PM job',
    hostBody: 'Sanket was a data engineer. He built data pipelines for airlines and banks. He was good at it, and his resume said so in five lines.' },
  { id: 'r1_story_2', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'story', sceneNum: 2, sceneTotal: 3, title: 'The wish',
    hostBody: 'He wanted to become a product manager. So he tried something odd: he put his resume on a wheel and asked what he could become.' },
  { id: 'r1_story_3', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'story', sceneNum: 3, sceneTotal: 3, title: 'Today',
    hostBody: 'Now you spin yours. Same idea, your resume. Watch how rarely it lands on the slice you actually want.' },
  { id: 'r1_context', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'context',
    contextLine: 'The wheel this round. Six roles. The slice sizes come from the lines on the resume.' },
  { id: 'r1_play', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'play' },
  { id: 'r1_reveal_1', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'reveal', panel: 1, panelTotal: 4, title: 'What just happened?' },
  { id: 'r1_reveal_2', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'reveal', panel: 2, panelTotal: 4, title: 'Two kinds of wheels' },
  { id: 'r1_reveal_3', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'reveal', panel: 3, panelTotal: 4, title: 'Under the hood' },
  { id: 'r1_reveal_4', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'reveal', panel: 4, panelTotal: 4, title: 'Why this matters?' },
  { id: 'r1_hold', section: 'Round 1', roundName: 'Round 1: Same resume, different answers', minutes: '4–11m', round: 1, type: 'hold', nextLabel: 'Round 2: Change the context' },

  // ROUND 2: Change the context (11–18 min)
  { id: 'r2_story_1', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'story', sceneNum: 1, sceneTotal: 2, title: 'After the first spin',
    hostBody: 'The wheel mostly said Data Engineer, and Product Manager was a sliver. Sanket couldn’t change what he had done, but he could change what his resume said.' },
  { id: 'r2_story_2', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'story', sceneNum: 2, sceneTotal: 2, title: 'The experiment',
    hostBody: 'One line at a time, he added what he had really done: results, numbers, people.' },
  { id: 'r2_context', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'context',
    contextLine: 'The wheel this round. Same six roles. This time the slice sizes come from the resume plus the lines you add.' },
  { id: 'r2_play', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'play' },
  { id: 'r2_reveal_1', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'reveal', panel: 1, panelTotal: 3, title: 'What moved' },
  { id: 'r2_reveal_2', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'reveal', panel: 2, panelTotal: 3, title: 'Why the slices moved?' },
  { id: 'r2_reveal_3', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'reveal', panel: 3, panelTotal: 3, title: 'Why this matters?' },
  { id: 'r2_hold', section: 'Round 2', roundName: 'Round 2: Change the context', minutes: '11–18m', round: 2, type: 'hold', nextLabel: 'Round 3: The dial' },

  // ROUND 3: The dial (18–25 min)
  { id: 'r3_story_1', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'story', sceneNum: 1, sceneTotal: 2, title: 'The first spin',
    hostBody: 'Sanket asks the wheel which roles to apply to. On Careful it says Data Engineer nearly every time. Safe, repeatable, and exactly what his resume already says.' },
  { id: 'r3_story_2', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'story', sceneNum: 2, sceneTotal: 2, title: 'The dial',
    hostBody: 'He wants to see what else is out there. He turns the dial toward Bold. Try both ends.' },
  { id: 'r3_context', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'context',
    contextLine: 'The wheel this round. Same resume. A dial now changes how the slices are spread, not what is on the resume. Three long-shot roles appear when you go bold.' },
  { id: 'r3_play', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'play' },
  { id: 'r3_reveal_1', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'reveal', panel: 1, panelTotal: 3, title: 'What you saw' },
  { id: 'r3_reveal_2', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'reveal', panel: 2, panelTotal: 3, title: 'What the dial does?' },
  { id: 'r3_reveal_3', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'reveal', panel: 3, panelTotal: 3, title: 'Which setting is right?' },
  { id: 'r3_hold', section: 'Round 3', roundName: 'Round 3: The dial', minutes: '18–25m', round: 3, type: 'hold', nextLabel: 'Round 4: Real or fake?' },

  // ROUND 4: Real or fake? (25–32 min)
  { id: 'r4_story_1', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'story', sceneNum: 1, sceneTotal: 2, title: 'The interview prep',
    hostBody: 'Before sending anything, Sanket asks a different wheel to describe him in one line. It answers instantly, and sounds sure.' },
  { id: 'r4_story_2', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'story', sceneNum: 2, sceneTotal: 2, title: 'The catch',
    hostBody: 'Some of what it says is on his resume. Some isn’t. Spin, then call it: real or fake.' },
  { id: 'r4_context', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'context',
    contextLine: 'The wheel this round. A different wheel. It no longer predicts roles. It writes one line about Sanket, from memory of people like him. It has not seen his resume.' },
  { id: 'r4_play', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'play' },
  { id: 'r4_reveal_1', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'reveal', panel: 1, panelTotal: 3, title: 'What happened?' },
  { id: 'r4_reveal_2', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'reveal', panel: 2, panelTotal: 3, title: 'Why it lies so smoothly?' },
  { id: 'r4_reveal_3', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'reveal', panel: 3, panelTotal: 3, title: 'Confidence is not correctness' },
  { id: 'r4_hold', section: 'Round 4', roundName: 'Round 4: Real or fake?', minutes: '25–32m', round: 4, type: 'hold', nextLabel: 'Round 5: Who painted the wheel?' },

  // ROUND 5: Who painted the wheel? (32–39 min)
  { id: 'r5_story_1', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'story', sceneNum: 1, sceneTotal: 3, title: 'The question',
    hostBody: 'Round 4 left a question: where does the wheel get its ideas about people like Sanket?' },
  { id: 'r5_story_2', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'story', sceneNum: 2, sceneTotal: 3, title: 'The memory',
    hostBody: 'Imagine 100 people who, like Sanket, spent a few years as data engineers or analysts. Each dot is one person, coloured by what they became next. (An illustrative sample, not real data. The real wheel learned from millions.)' },
  { id: 'r5_story_3', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'story', sceneNum: 3, sceneTotal: 3, title: 'The pattern',
    hostBody: 'Most stayed data people. Only 4 became product managers. The wheel copies that history, so his Product Manager slice is thin.' },
  { id: 'r5_context', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'context',
    contextLine: 'The wheel this round. Back to the role wheel. This time we open its memory: the careers its slice sizes were learned from.' },
  { id: 'r5_play', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'play' },
  { id: 'r5_reveal_1', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'reveal', panel: 1, panelTotal: 3, title: 'What the wheel learned from?' },
  { id: 'r5_reveal_2', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'reveal', panel: 2, panelTotal: 3, title: 'Who is in the data?' },
  { id: 'r5_reveal_3', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'reveal', panel: 3, panelTotal: 3, title: 'One more question?' },
  { id: 'r5_hold', section: 'Round 5', roundName: 'Round 5: Who painted the wheel?', minutes: '32–39m', round: 5, type: 'hold', nextLabel: 'Round 6: Show your sources' },

  // ROUND 6: Show your sources (39–46 min)
  { id: 'r6_story_1', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'story', sceneNum: 1, sceneTotal: 2, title: 'The fix',
    hostBody: 'Sanket stops letting the wheel guess about him. He hands it his actual resume to read.' },
  { id: 'r6_story_2', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'story', sceneNum: 2, sceneTotal: 2, title: 'The test',
    hostBody: 'Same question as Round 4: tell me one thing Sanket did. Spin without the resume first, then hand it over and spin again.' },
  { id: 'r6_context', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'context',
    contextLine: 'The wheel this round. The wheel that writes about Sanket, as in Round 4. Without the resume it guesses from people like him. With it, it can only use what the resume says.' },
  { id: 'r6_play', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'play' },
  { id: 'r6_reveal_1', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'reveal', panel: 1, panelTotal: 3, title: 'What changed' },
  { id: 'r6_reveal_2', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'reveal', panel: 2, panelTotal: 3, title: 'Look it up, then answer' },
  { id: 'r6_reveal_3', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'reveal', panel: 3, panelTotal: 3, title: 'How it works, in one line' },
  { id: 'r6_hold', section: 'Round 6', roundName: 'Round 6: Show your sources', minutes: '39–46m', round: 6, type: 'hold', nextLabel: 'Ending: Spot it' },

  // ENDING (46–60 min) + Q&A (60–70 min)
  { id: 'e1_spot_1', section: 'Ending', roundName: 'Spot it', minutes: '46–49m', round: 7, type: 'e1_spot', questionIndex: 0, title: 'Spot it · 1 of 3' },
  { id: 'e1_spot_2', section: 'Ending', roundName: 'Spot it', minutes: '46–49m', round: 7, type: 'e1_spot', questionIndex: 1, title: 'Spot it · 2 of 3' },
  { id: 'e1_spot_3', section: 'Ending', roundName: 'Spot it', minutes: '46–49m', round: 7, type: 'e1_spot', questionIndex: 2, title: 'Spot it · 3 of 3' },
  { id: 'e2_story', section: 'Ending', roundName: 'AI PM Analogy', minutes: '49–52m', round: 8, type: 'e2_story', title: 'The AI PM Analogy' },
  { id: 'e3_map', section: 'Ending', roundName: 'Your map', minutes: '52–55m', round: 9, type: 'e3_map', title: 'Your map' },
  { id: 'e4_next', section: 'What’s next', roundName: 'The AI interview game', minutes: '55–58m', round: 10, type: 'e4_next', title: 'The AI interview game' },
  { id: 'e5_brochure', section: 'Curriculum', roundName: 'AI PM Course Curriculum', minutes: '58–62m', round: 11, type: 'e5_brochure', title: 'AI PM Course Curriculum' },
  { id: 'qa', section: 'Q&A', roundName: 'Questions', minutes: '60–70m', round: 11, type: 'qa', title: 'Questions' },
];


// AI PM Analogy (Stage 58): Classic PM vs What shifts vs AI PM
export const AI_PM_ANALOGY = [
  {
    id: 'problem_framing',
    classic: { title: 'Problem framing', sub: 'Is this worth building?' },
    shift: 'Add: is AI the right fit?',
    ai: { title: 'AI opportunity brief', sub: 'Data fit · error cost · archetype' },
    detail: 'Classic PM asks if the problem is painful and worth solving. AI PM must first evaluate if AI is actually the right tool, what errors cost, and if training data or prompt architectures can realistically support it.',
  },
  {
    id: 'requirements',
    classic: { title: 'Requirements', sub: 'Deterministic spec' },
    shift: 'Shift: specify constraints, not exact behaviour',
    ai: { title: 'Probabilistic PRD', sub: 'Hallucination rate · pass criteria' },
    detail: 'Classic PRDs dictate deterministic if-then logic. Probabilistic PRDs define acceptable error margins, hallucination thresholds, guardrails, and statistical acceptance criteria.',
  },
  {
    id: 'metrics',
    classic: { title: 'Success metrics', sub: 'DAU · NPS · conversion' },
    shift: 'Add: model quality layer beneath product metrics',
    ai: { title: 'AI metric stack', sub: 'Task rate · override rate · cost' },
    detail: 'Beyond high-level business KPIs, AI PMs measure task completion rate, human override frequency, latency, token spend, and factual accuracy.',
  },
  {
    id: 'qa',
    classic: { title: 'QA and done', sub: 'Test cases pass / fail' },
    shift: 'Replace: binary pass/fail becomes statistical gate',
    ai: { title: 'Eval set design', sub: '50+ cases · rubric · regression' },
    detail: 'QA is no longer a checklist of passes and fails. AI PMs curate golden benchmark datasets (50+ challenging edge cases) with rubric scoring and automated regression evals.',
  },
  {
    id: 'launch',
    classic: { title: 'Launch', sub: 'Feature flag · rollout · GA' },
    shift: 'Add: eval gate before any rollout begins',
    ai: { title: 'Gated AI rollout', sub: 'Eval gate · guardrails · UX trust' },
    detail: 'Rollouts require statistical verification at each step, safety filters, fallback UI states, and trust-building UX that clearly frames AI assistance.',
  },
  {
    id: 'post_launch',
    classic: { title: 'Post-launch', sub: 'Monitor KPIs · bug triage' },
    shift: 'Add: model drift · feedback loop as product design',
    ai: { title: 'Data flywheel', sub: 'Drift watch · override logging' },
    detail: 'Models drift over time as user inputs shift. Continuous logging of user corrections and overrides feeds back into fine-tuning and retrieval context.',
  },
  {
    id: 'stakeholders',
    classic: { title: 'Stakeholder comms', sub: 'Roadmap · status · risk' },
    shift: 'Add: explain probabilistic outcomes in plain language',
    ai: { title: 'Tradeoff memo', sub: 'Latency · cost · quality in plain terms' },
    detail: 'Stakeholders need clear framing around latency vs cost vs accuracy tradeoffs, communicating probabilistic risks in simple business terms.',
  },
  {
    id: 'strategy',
    classic: { title: 'Strategy', sub: 'Differentiation · roadmap' },
    shift: 'Replace: feature moat with data + trust moat',
    ai: { title: 'AI moat strategy', sub: 'Data · trust · fine-tune lock-in' },
    detail: 'Features are easily cloned by foundation models. The real sustainable advantage lies in proprietary data loops, user trust, workflow lock-in, and domain fine-tuning.',
  },
];


export const WHATSAPP_1ON1_URL = 'https://wa.me/message/GH5C7YLAYIEHN1';



export const AI_PM_COHORT_DATA = {
  title: 'The AI PM Cohort',
  tagline: '12 weeks. One real AI product. Built from your own domain.',
  badge: 'Stepsmart · Live cohort · Small by design · Joining by conversation',
  story: '300+ applications. About 10 interviews. One PM job. Sanket was a data engineer. On our wheel, Product Manager was a 9% slice. He became a PM anyway. The wheel isn’t your career. What you can show is.',
  mandate: 'You are an experienced professional who works around AI and wants to build with it. Your mandate for 12 weeks: pick one real problem from your own work and ship an AI product that solves it.',

  weeks: [
    { num: '01', title: 'Problem Brief', phase: 'Problem space', desc: 'Pick one real problem from your own work. Write who has it, how often, and the evidence.' },
    { num: '02', title: 'AI Brief', phase: 'Problem space', desc: 'Decide if AI is even the answer. Set one success number and write a one-page brief.' },
    { num: '03', title: 'Behaviour Log', phase: 'How AI behaves', desc: 'Test your problem across prompts and models. Record where answers vary, drift or go confidently wrong.' },
    { num: '04', title: 'Prototype v1', phase: 'How AI behaves', desc: 'Give the AI your own documents. Build a first version that answers them.' },
    { num: '05', title: 'Test Set', phase: 'Make it trustworthy', desc: 'Write 20 known cases with right answers. Score your prototype against them.' },
    { num: '06', title: 'Agent Sketch', phase: 'Make it trustworthy', desc: 'Design an agent on one page: its goal, its tools, and what it must never do.' },
    { num: '07', title: 'Safety Plan', phase: 'Make it trustworthy', desc: 'Add guardrails and approval points. List three ways it fails and how you will catch each.' },
    { num: '08', title: 'AI PRD', phase: 'Design and ship', desc: 'Turn your brief and test results into a PRD an engineering team could build from.' },
    { num: '09', title: 'Build Sprint', phase: 'Design and ship', desc: 'Ship a working version of your product and put it in front of three real users.' },
    { num: '10', title: 'Launch Plan', phase: 'Design and ship', desc: 'Work out the cost per use, what you will monitor, and how the product improves after launch.' },
    { num: '11', title: 'Proof Pack', phase: 'Proof & positioning', desc: 'Turn the build into a portfolio case study and a LinkedIn story.' },
    { num: '12', title: 'Demo Day', phase: 'Proof & positioning', desc: 'Demo your product, then run a full mock interview loop on it.' }
  ],

  forYou: [
    'You are an analyst, QA, BA, product owner, program, data, risk or tech role',
    'You use AI at work and want to explain it with confidence',
    'You want to move toward product or AI product work',
    'You can give about 6 hours a week and build every week'
  ],

  notForYou: [
    'You are a student or fresher',
    'You want to learn to code AI systems from scratch',
    'You want a job guarantee',
    'You would rather watch than build'
  ],

  walkAway: [
    'A working AI product, built on a problem from your own domain',
    'An AI PRD and a 20-case test set that show how you think, not just what you built',
    'A portfolio case study and a LinkedIn story you can use in interviews',
    'A plain way to explain how AI products behave, to engineers, bosses and interviewers',
    'A full mock interview loop, run on your own product'
  ],
  promise: 'We don’t promise a job. We promise proof you can defend.',

  howItRuns: [
    'One live build session a week',
    'Every session opens with something you play on your phone, then you build',
    'Feedback on every deliverable',
    '1:1 checkpoints at weeks 4, 8 and 12',
    'Session recordings to catch up',
    'Tool list shared before week 1'
  ],

  joining: {
    rule: 'You don’t join by paying. You join by talking.',
    ruleDesc: 'We choose who joins. After this session, apply for a 15-minute call. We look at where you are, what you want to build, and whether this cohort is right for you right now.',
    fee: 'INR ₹30,000 for all 12 weeks',
    starts: 'December 1st Week',
    seats: 'Capped at 15'
  },

  mentors: [
    { name: 'Sanket', role: 'Data engineer turned product manager · IIT Kanpur alum · Mastercard' },
    { name: 'Ankit', role: 'Senior Product Manager · IIM Bangalore alum · Microsoft' }
  ]
};
