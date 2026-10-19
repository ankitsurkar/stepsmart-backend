import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Book,
  Briefcase,
  ClipboardList,
  HelpCircle,
  Folder,
  Clock,
  Users,
  Flame,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  X,
  Menu,
  ChevronRight,
  Zap,
  Check,
  Video,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  RefreshCw,
  Trash2,
  UserCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

export const WHATSAPP_BUSINESS_URL = "https://wa.me/message/GH5C7YLAYIEHN1";
const PUBLIC_API_URL = "https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll";

// ─── Sidebar Navigation (Cohort & Profile removed as requested) ───
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: 'home', isLocked: false },
  { id: 'courses', label: 'Courses', icon: 'book', isLocked: true },
  { id: 'scheduling', label: '1:1 Sessions', icon: 'clock', isLocked: false },
  { id: 'resources', label: 'Resources', icon: 'folder', isLocked: false },
  { id: 'assignments', label: 'Assignments', icon: 'clipboard', isLocked: true },
  { id: 'jobs', label: 'PM Jobs', icon: 'jobs', isLocked: true },
  { id: 'interview', label: 'Interview Prep', icon: 'interview', isLocked: true },
];

export interface GymQuestion {
  date: string;
  type: 'quiz' | 'text';
  text: string;
  options?: string[] | null;
  correctIndex?: number | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  category?: string;
}

const FALLBACK_QUESTION: GymQuestion = {
  date: new Date().toISOString().split('T')[0],
  type: "quiz",
  text: "\"Users would love the feature, but engineering cannot build it in the allotted sprint timeline.\" Which risk is this?",
  options: [
    "Value risk",
    "Usability risk",
    "Feasibility risk",
    "Business risk"
  ],
  correctIndex: 2,
  correctAnswer: null,
  explanation: "Feasibility risk is whether engineering can build the solution with the available time, skills, and technology. Value = will they buy/use it; Usability = can they figure out how to use it; Business viability = does it work for our business model.",
  category: "Product Discovery & Risks"
};

interface CourseModule {
  week: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  lessons: { title: string; duration: string }[];
}

const ACCELERATOR_MODULES: CourseModule[] = [
  {
    week: "Week 0",
    title: "Profile Repositioning & PM Mindset Transition",
    duration: "3 hrs",
    description: "Translate engineering, consulting, or analytics backgrounds into a compelling Product Management story.",
    topics: ["Resume rewriting for PM roles", "LinkedIn positioning", "Framing past achievements as product impact"],
    lessons: [
      { title: "Repositioning Your Background into Product Language", duration: "45 mins" },
      { title: "High-Signal PM Resume Deep Dive & Live Edits", duration: "60 mins" },
      { title: "LinkedIn Storytelling & Cold Outreach Strategy", duration: "45 mins" }
    ]
  },
  {
    week: "Week 1",
    title: "Product Fundamentals & Problem vs. Solution Space",
    duration: "4 hrs",
    description: "Learn how senior PMs distinguish user pain points from superficial feature requests and map customer journeys.",
    topics: ["Problem space discovery", "Jobs to be Done (JTBD) framework", "User personas & journey mapping"],
    lessons: [
      { title: "Problem Definition: Why 80% of Features Fail", duration: "50 mins" },
      { title: "Applying JTBD to Real Consumer Apps (Swiggy / Spotify)", duration: "60 mins" },
      { title: "Mapping Customer Pain Points to Value Propositions", duration: "45 mins" }
    ]
  },
  {
    week: "Week 2",
    title: "User Research, Discovery & Market Validation",
    duration: "4 hrs",
    description: "Conduct high-signal user interviews without leading questions. Synthesize customer insights into actionable roadmaps.",
    topics: ["Mom Test principles", "Competitor matrix breakdown", "TAM / SAM / SOM market sizing"],
    lessons: [
      { title: "Unbiased User Discovery: The Mom Test in Practice", duration: "55 mins" },
      { title: "Competitive Moats & Positioning Analysis", duration: "50 mins" },
      { title: "Market Sizing & Opportunity Trees", duration: "40 mins" }
    ]
  },
  {
    week: "Week 3",
    title: "Product Strategy, Moats & Growth Loops",
    duration: "4.5 hrs",
    description: "Build sustainable competitive moats, examine network effects, and model product-led growth (PLG) loops.",
    topics: ["Hamilton Helmer's 7 Powers", "Retention curves & cohort decay", "Monetization & unit economics"],
    lessons: [
      { title: "7 Powers: Building Sustainable Competitive Moats", duration: "65 mins" },
      { title: "Cohort Analysis & Healthy Retention Curves", duration: "55 mins" },
      { title: "Growth Loops vs Traditional Funnels", duration: "45 mins" }
    ]
  },
  {
    week: "Week 4",
    title: "Metrics, North Star & Root Cause Analysis (RCA)",
    duration: "5 hrs",
    description: "Master the metrics that drive product decisions. Structure end-to-end RCAs for drops in conversion or revenue.",
    topics: ["North Star vs Guardrail metrics", "AARRR pirate metrics", "Live 7-step RCA diagnostic framework"],
    lessons: [
      { title: "Choosing the Right North Star & Guardrail Metrics", duration: "60 mins" },
      { title: "7-Step Root Cause Analysis Framework (Live Case)", duration: "75 mins" },
      { title: "A/B Testing, Experimentation & Statistical Significance", duration: "50 mins" }
    ]
  },
  {
    week: "Week 5",
    title: "PRD Writing & Technical Architecture for PMs",
    duration: "5 hrs",
    description: "Draft production-grade PRDs ready for engineering handoff. Understand APIs, system design, and database relationships.",
    topics: ["Industry-standard PRD templates", "User stories & acceptance criteria", "System architecture & APIs for non-engineers"],
    lessons: [
      { title: "Writing a Production-Grade PRD (Line-by-Line Review)", duration: "70 mins" },
      { title: "APIs, Webhooks & Microservices Explained for PMs", duration: "60 mins" },
      { title: "Sprint Planning & Engineering Trade-Off Discussions", duration: "45 mins" }
    ]
  },
  {
    week: "Week 6",
    title: "Mock Interview Loops, Referrals & Offer Negotiation",
    duration: "6 hrs",
    description: "Crack tough PM interview rounds: Product Sense, Analytical RCA, Behavioral, and System Architecture.",
    topics: ["1:1 mock interviews with Senior PMs", "Curated referral introductions", "Compensation benchmarking & negotiation"],
    lessons: [
      { title: "Cracking Product Sense Interviews (Live Demo)", duration: "75 mins" },
      { title: "Behavioral & Leadership Stories (SAR Framework)", duration: "60 mins" },
      { title: "Offer Evaluation & Salary Negotiation Tactics", duration: "45 mins" }
    ]
  }
];

const FIRST_STEP_MODULES: CourseModule[] = [
  {
    week: "Week 0",
    title: "Introduction to Tech Products & APM Career Paths",
    duration: "2.5 hrs",
    description: "Understand the roles of PMs, designers, and software engineers in tech companies. Set up your learning roadmap.",
    topics: ["What an Associate PM does", "Startup PM vs Big Tech APM", "The college student advantage"],
    lessons: [
      { title: "Decoding the APM Role: What Tech Giants Expect", duration: "45 mins" },
      { title: "Building a Standout Student Tech Profile", duration: "50 mins" }
    ]
  },
  {
    week: "Week 1",
    title: "Breaking Down Everyday Apps (Product Teardowns)",
    duration: "3.5 hrs",
    description: "Analyze products like WhatsApp, Zepto, and Instagram like a PM. Identify UI friction and missed opportunities.",
    topics: ["Product teardown frameworks", "UI/UX heuristics (Nielsen Norman)", "User flow diagramming"],
    lessons: [
      { title: "How to Build a High-Signal Product Teardown", duration: "60 mins" },
      { title: "Heuristic Evaluations of Popular Consumer Apps", duration: "45 mins" }
    ]
  },
  {
    week: "Week 2",
    title: "User Empathy & Problem Validation for Freshers",
    duration: "3.5 hrs",
    description: "Learn how to talk to real customers, synthesize insights, and build user persona archetypes.",
    topics: ["Student user research methods", "Drafting interview scripts", "Customer empathy maps"],
    lessons: [
      { title: "Running Real Customer Interviews on Campus", duration: "50 mins" },
      { title: "Synthesizing Insights into Problem Statements", duration: "45 mins" }
    ]
  },
  {
    week: "Week 3",
    title: "Writing Your First PRD & Feature Prototype",
    duration: "4 hrs",
    description: "Write a complete Product Requirement Document for a feature idea and build an interactive prototype.",
    topics: ["PRD templates for APMs", "Feature scoping & MVP definition", "No-code wireframing & prototyping"],
    lessons: [
      { title: "Writing Your First Mini-PRD", duration: "60 mins" },
      { title: "Wireframing & Prototyping Essentials for Non-Designers", duration: "55 mins" }
    ]
  },
  {
    week: "Week 4",
    title: "Basic Product Metrics & Data Analysis with SQL/Sheets",
    duration: "4 hrs",
    description: "Understand churn, retention, conversion rates, and run basic queries to answer product health questions.",
    topics: ["Core product KPIs", "Cohort tables in Google Sheets", "Basic SQL queries for PMs"],
    lessons: [
      { title: "Product Analytics 101: DAU, MAU, Churn & CAC", duration: "60 mins" },
      { title: "Hands-on SQL for Answering Product Questions", duration: "60 mins" }
    ]
  },
  {
    week: "Week 5",
    title: "APM Placement Preparation & Case Competitions",
    duration: "5 hrs",
    description: "Win campus product case competitions and clear campus placement APM hiring tests and panel interviews.",
    topics: ["Winning product case challenges", "Guesstimates & market sizing", "Campus APM interview loops"],
    lessons: [
      { title: "Frameworks for Campus Product Competitions", duration: "65 mins" },
      { title: "Guesstimates & Market Sizing Drills", duration: "55 mins" }
    ]
  }
];

// ─── Real Peer Session Item Interface ───
export interface PeerSessionSlot {
  sessionId: string;
  courseId?: string;
  courseName?: string;
  batchName?: string;
  hostName: string;
  hostEmail?: string;
  topic: string;
  notes?: string;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  meetingUrl: string;
  status: 'OPEN' | 'BOOKED';
  peerName?: string;
  peerEmail?: string;
  isMySlot?: boolean;
  isHost?: boolean;
}

// ─── Curated Resource Vault Items ───
interface ResourceDoc {
  id: string;
  title: string;
  category: string;
  fileCount: number;
  description: string;
  docs: { label: string; url: string; type: string }[];
}

const RESOURCE_VAULT: ResourceDoc[] = [
  {
    id: 'res_1',
    title: 'Industry-Standard Product Requirement Document (PRD) Template',
    category: 'PRD & Specs',
    fileCount: 3,
    description: 'Comprehensive, engineer-approved PRD template including user stories, API contracts, acceptance criteria, metrics, and rollout stages.',
    docs: [
      { label: 'Master PRD Template (Notion & Google Docs)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Master+PRD+Template+resource', type: 'Doc' },
      { label: 'Uber Fleet Dynamic Pricing PRD (Real Sample)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Uber+Dynamic+Pricing+PRD', type: 'PDF' },
      { label: 'Engineering Handoff & Edge Cases Checklist', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Engineering+Handoff+Checklist', type: 'Checklist' },
    ]
  },
  {
    id: 'res_2',
    title: 'Product Teardown & UI Friction Decks (Quick Commerce & Fintech)',
    category: 'Product Teardowns',
    fileCount: 2,
    description: 'Line-by-line UX audits analyzing onboarding funnels, drop-off heuristics, and retention hooks for Zepto, Swiggy, and Cred.',
    docs: [
      { label: 'Zepto 10-Minute Grocery Retention Teardown (28 Slides)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Zepto+Teardown+deck', type: 'Slide Deck' },
      { label: 'Cred Pay P2P Payments User Flow Analysis', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Cred+Pay+Analysis', type: 'PDF' },
    ]
  },
  {
    id: 'res_3',
    title: 'CIRCLES & 7-Step RCA Product Interview Frameworks',
    category: 'Interview Frameworks',
    fileCount: 3,
    description: 'Printable cheat sheets detailing step-by-step interview structures for Product Sense, Analytical RCA, and Guesstimates.',
    docs: [
      { label: 'CIRCLES Method Interview Cheat Sheet', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+CIRCLES+Cheat+Sheet', type: 'Framework' },
      { label: '7-Step Root Cause Analysis (RCA) Diagnostic Tree', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+7-Step+RCA+Tree', type: 'Framework' },
      { label: 'Guesstimate Formulas & Market Sizing Benchmarks (India & US)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Guesstimate+Formulas', type: 'Sheet' },
    ]
  },
  {
    id: 'res_4',
    title: 'North Star Metric Trees & Retention Calculator Models',
    category: 'Metrics & Analytics',
    fileCount: 2,
    description: 'Financial and behavioral metric hierarchy trees for SaaS, Marketplace, and Consumer apps with interactive cohort decay tables.',
    docs: [
      { label: 'North Star Metric Tree Template (Google Sheets)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+North+Star+Metric+Tree+Spreadsheet', type: 'Google Sheets' },
      { label: 'AARRR Pirate Funnel & Cohort Retention Calculator', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+AARRR+Funnel+Calculator', type: 'Google Sheets' },
    ]
  },
  {
    id: 'res_5',
    title: 'Harvard & Tech Recruiter Approved PM Resume Templates',
    category: 'Resume & Portfolio',
    fileCount: 2,
    description: 'ATS-optimized resume formats featuring high-impact XYZ bullet formulas and portfolio presentation decks for hiring managers.',
    docs: [
      { label: 'Senior PM & APM Resume Template (Docx / Overleaf LaTeX)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+PM+Resume+Template', type: 'Template' },
      { label: 'Figma PM Portfolio Deck Template (16:9)', url: 'https://wa.me/message/GH5C7YLAYIEHN1?text=Hi!+Please+send+the+Figma+PM+Portfolio+Deck', type: 'Figma' },
    ]
  }
];

// ─── 7 Flagship Assignments ───
const COHORT_ASSIGNMENTS = [
  {
    id: 1,
    title: "Zepto: Quick Commerce Cart Abandonment & Retention Loop",
    tag: "Product Sense & Retention",
    difficulty: "Intermediate",
    prompt: "Diagnose why users add items to their 10-minute grocery cart but drop off before checkout. Propose a targeted incentive and notification cadence without cannibalizing margin."
  },
  {
    id: 2,
    title: "Swiggy Dineout: Enhancing Table Reservation & Bill-Pay Discovery",
    tag: "Growth & UI/UX",
    difficulty: "Advanced",
    prompt: "Redesign the in-app Dineout discovery experience to increase weekend booking conversions by 25% while managing restaurant seating capacity."
  },
  {
    id: 3,
    title: "Cred Pay: Designing P2P UPI Payments with Gamified Rewards",
    tag: "Fintech & Engagement",
    difficulty: "Intermediate",
    prompt: "Draft a comprehensive PRD specifying user onboarding, UPI PIN authorization flows, and an engaging reward mechanic that protects transaction margin."
  },
  {
    id: 4,
    title: "Uber Rides: 15% Sudden Drop in Driver Acceptance Rates (RCA)",
    tag: "Analytical RCA",
    difficulty: "Advanced",
    prompt: "Apply the 7-step diagnostic RCA tree to isolate why driver ride cancellations surged in Tier-1 metros between 5 PM and 9 PM."
  },
  {
    id: 5,
    title: "Spotify AI DJ: Context-Aware Recommendation Journey",
    tag: "AI & Personalization",
    difficulty: "Intermediate",
    prompt: "Map the end-to-end customer journey for an AI-generated voice host that curates song transitions based on time of day, location, and listening habits."
  },
  {
    id: 6,
    title: "Blinkit: 10-Minute Fresh Produce Category Expansion PRD",
    tag: "PRD & Operations",
    difficulty: "Advanced",
    prompt: "Author a production-grade PRD addressing inventory perishability, SKU availability, weight variations, and customer refund policies."
  },
  {
    id: 7,
    title: "Capstone Project: End-to-End Product Launch & Pitch Deck",
    tag: "Full Cohort Capstone",
    difficulty: "Capstone",
    prompt: "Build an investor-grade product teardown, prototype, and PRD for an original product opportunity. Present live to hiring managers."
  }
];

// ─── Curated PM Referral Jobs ───
const CURATED_JOBS = [
  {
    role: "Associate Product Manager (APM)",
    company: "Razorpay",
    location: "Bengaluru (Hybrid)",
    salary: "₹18L - ₹24L CTC",
    experience: "0-2 Years",
    badge: "Direct Referral Available"
  },
  {
    role: "Product Manager 1 — Growth",
    company: "Swiggy",
    location: "Bengaluru (Onsite)",
    salary: "₹24L - ₹32L CTC",
    experience: "1-3 Years",
    badge: "Alumni Hiring Manager"
  },
  {
    role: "Product Manager — User Retention",
    company: "Meesho",
    location: "Bengaluru (Hybrid)",
    salary: "₹26L - ₹35L CTC",
    experience: "2-4 Years",
    badge: "Priority Referral"
  },
  {
    role: "Associate Product Manager",
    company: "Zepto",
    location: "Mumbai (Onsite)",
    salary: "₹16L - ₹22L CTC",
    experience: "0-2 Years",
    badge: "Campus / Fresher Friendly"
  },
  {
    role: "Product Manager — Payments & Merchant UPI",
    company: "PhonePe",
    location: "Bengaluru (Hybrid)",
    salary: "₹28L - ₹38L CTC",
    experience: "2-5 Years",
    badge: "Senior Mentor Referral"
  }
];

function SidebarIcon({ kind }: { kind: string }) {
  if (kind === 'home') return <Home size={20} strokeWidth={2} />;
  if (kind === 'book') return <Book size={20} strokeWidth={2} />;
  if (kind === 'jobs') return <Briefcase size={20} strokeWidth={2} />;
  if (kind === 'clock') return <Clock size={20} strokeWidth={2} />;
  if (kind === 'clipboard') return <ClipboardList size={20} strokeWidth={2} />;
  if (kind === 'interview') return <HelpCircle size={20} strokeWidth={2} />;
  if (kind === 'folder') return <Folder size={20} strokeWidth={2} />;
  return <Home size={20} strokeWidth={2} />;
}

// ─── Exact LMS Stylesheet & Tokens (matches LMS primary colors) ───
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, hsl(214, 100%, 98%) 0%, hsl(205, 78%, 97%) 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0f172a',
  },
  // STICKY SIDEBAR: Stays fixed while main body scrolls
  sidebar: {
    background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
    color: '#fff',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 18px 42px rgba(15, 40, 80, 0.18)',
    position: 'sticky' as const,
    top: 0,
    height: '100vh',
    overflowY: 'auto' as const,
    width: '260px',
    flexShrink: 0,
    zIndex: 40,
  },
  sidebarGlow: {
    position: 'absolute' as const,
    inset: '-10% auto auto -20%',
    width: '220px',
    height: '220px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 68%)',
    pointerEvents: 'none' as const,
  },
  brand: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '2rem',
  },
  brandMark: {
    width: '34px',
    height: '34px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.16)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    fontWeight: 700,
    color: '#fff',
  },
  navStack: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.45rem',
    marginBottom: '1.25rem',
  },
  navButton: {
    position: 'relative' as const,
    border: 'none',
    textAlign: 'left' as const,
    borderRadius: '14px',
    padding: '0.84rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.78)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    outline: 'none',
  },
  navButtonActive: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  navButtonIcon: {
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'currentColor',
    opacity: 0.95,
    flexShrink: 0,
  },
  navActiveRail: {
    position: 'absolute' as const,
    left: '-1rem',
    top: '10px',
    bottom: '10px',
    width: '4px',
    borderRadius: '0 6px 6px 0',
    background: '#fff',
  },
  sidebarSection: {
    position: 'relative' as const,
    marginTop: 'auto',
  },
  sidebarDivider: {
    borderTop: '1px solid rgba(255,255,255,0.22)',
    marginTop: '0.9rem',
    marginBottom: '1.1rem',
  },
  adminLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.16)',
    color: '#fff',
    fontWeight: 700,
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    width: '100%',
    cursor: 'pointer',
  },
  signOutBtn: {
    width: '100%',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 700,
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: '1.75rem 2.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.75rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(20, 49, 86, 0.08)',
  },
  headerEyebrow: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#64748b',
    letterSpacing: '0.08em',
    marginBottom: '0.2rem',
  },
  headerTitle: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  courseCard: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 8px 30px rgba(15, 40, 80, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
  },
  courseBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.875rem',
    padding: '0.85rem 1.4rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(13, 108, 140, 0.28)',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  outlineBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    background: '#ffffff',
    color: '#027A9B',
    border: '1px solid #bae6fd',
    fontWeight: 700,
    fontSize: '0.875rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  // In-Page Locked Feature Card (No pop-up!)
  inPageLockCard: {
    background: 'linear-gradient(135deg, rgba(2, 122, 155, 0.05) 0%, rgba(255, 255, 255, 0.98) 100%)',
    border: '1.5px solid rgba(2, 122, 155, 0.22)',
    borderRadius: '20px',
    padding: '1.75rem',
    boxShadow: '0 8px 28px rgba(15, 40, 80, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  }
};

export function LandingPortalDashboard() {
  const navigate = useNavigate();

  // Navigation State
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourseTab, setSelectedCourseTab] = useState<'accelerator' | 'first-step'>('accelerator');

  // User Session
  const [userEmail, setUserEmail] = useState<string>('visitor@stepsmart.net');
  const [displayName, setDisplayName] = useState<string>('Student');

  // PM Gym state
  const [todayQuestion, setTodayQuestion] = useState<GymQuestion>(FALLBACK_QUESTION);
  const [hasSolvedToday, setHasSolvedToday] = useState(false);
  const [showGymModal, setShowGymModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [gymSubmitted, setGymSubmitted] = useState(false);
  const [gymIsCorrect, setGymIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  // 1:1 Sessions state (Real LMS Integration)
  const [sessionSubTab, setSessionSubTab] = useState<'peer' | 'mentor'>('peer');
  const [openSlots, setOpenSlots] = useState<PeerSessionSlot[]>([]);
  const [myBooked, setMyBooked] = useState<PeerSessionSlot[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [refreshingSessions, setRefreshingSessions] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Resources view state
  const [expandedResource, setExpandedResource] = useState<string | null>('res_1');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState<string>('All');

  const todayStr = new Date().toISOString().split('T')[0];

  // Load User Session & Local Storage
  useEffect(() => {
    try {
      const email = localStorage.getItem('pmx_demo_auth_session') || localStorage.getItem('stepsmart_portal_session');
      if (email) {
        setUserEmail(email);
        const demoUsers = JSON.parse(localStorage.getItem('pmx_demo_users') || '[]');
        const matched = demoUsers.find((u: any) => u.email === email);
        if (matched && matched.fullName) {
          setDisplayName(matched.fullName);
        } else {
          const prefix = email.split('@')[0];
          setDisplayName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
        }
      }

      // Check previously booked sessions
      const savedBookings = JSON.parse(localStorage.getItem('stepsmart_portal_booked_sessions') || '[]');
      if (Array.isArray(savedBookings) && savedBookings.length > 0) {
        setMyBooked(savedBookings);
      }
    } catch (e) {
      // Ignored
    }

    if (localStorage.getItem(`pm_gym_landing_completed_${todayStr}`) === 'true') {
      setHasSolvedToday(true);
      setStreak(1);
    }
  }, [todayStr]);

  // Fetch live PM Gym question
  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await fetch(PUBLIC_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'get_pm_gym',
            clientDate: todayStr
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.gymQuestions && Array.isArray(data.gymQuestions) && data.gymQuestions.length > 0) {
            const currentQ = data.gymQuestions.find((q: any) => q.date === todayStr) || data.gymQuestions[0];
            setTodayQuestion(currentQ);
          }
        }
      } catch (err) {
        // Fallback used
      }
    };
    fetchGym();
  }, [todayStr]);

  // Fetch Live Real Peer Sessions from DynamoDB (Exact LMS Data, zero fake slots)
  const fetchPeerSessions = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoadingSessions(true);
    else setRefreshingSessions(true);

    try {
      const email = localStorage.getItem('pmx_demo_auth_session') || localStorage.getItem('stepsmart_portal_session') || '';
      const [openRes, myRes] = await Promise.all([
        fetch(PUBLIC_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 'get_peer_sessions' })
        }),
        email ? fetch(PUBLIC_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 'get_my_peer_sessions', email })
        }) : Promise.resolve(null)
      ]);

      if (openRes.ok) {
        const data = await openRes.json();
        setOpenSlots(Array.isArray(data?.sessions) ? data.sessions : []);
      } else {
        setOpenSlots([]);
      }

      if (myRes && myRes.ok) {
        const myData = await myRes.json();
        if (Array.isArray(myData?.sessions) && myData.sessions.length > 0) {
          setMyBooked(myData.sessions);
        }
      }
    } catch (err) {
      console.error('Failed to load peer sessions:', err);
      setOpenSlots([]);
    } finally {
      setLoadingSessions(false);
      setRefreshingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'scheduling') {
      fetchPeerSessions();
    }
  }, [activeView, fetchPeerSessions]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('pmx_demo_auth_session');
      localStorage.removeItem('stepsmart_portal_session');
    } catch (e) {
      // Ignored
    }
    navigate('/');
  };

  // Switch tabs directly without any pop-up!
  const handleTabClick = (id: string) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  // PM Gym submit logic
  const handleGymSubmit = async () => {
    let isCorrect = false;
    if (todayQuestion.type === 'quiz') {
      if (selectedOption === null) return;
      isCorrect = selectedOption === todayQuestion.correctIndex;
    } else {
      if (!textAnswer.trim()) return;
      isCorrect = true;
    }

    setGymSubmitted(true);
    setGymIsCorrect(isCorrect);
    setHasSolvedToday(true);
    setStreak((prev) => prev + 1);

    try {
      localStorage.setItem(`pm_gym_landing_completed_${todayStr}`, 'true');
      await fetch(PUBLIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'submit_pm_gym',
          date: todayQuestion.date || todayStr,
          answer: todayQuestion.type === 'quiz' ? selectedOption : textAnswer,
          email: userEmail,
          name: displayName
        })
      });
    } catch (e) {
      // Ignored
    }
  };

  // Connect & Join Peer Session slot (calls book_peer_session & sends email)
  const handleJoinSlot = async (slot: PeerSessionSlot) => {
    setBookingId(slot.sessionId);
    setActionSuccessMsg(null);

    try {
      const res = await fetch(PUBLIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'book_peer_session',
          sessionId: slot.sessionId,
          name: displayName,
          email: userEmail,
        })
      });

      const data = await res.json();
      const bookedItem: PeerSessionSlot = {
        ...slot,
        status: 'BOOKED',
        isMySlot: true,
      };

      // Update state
      const updatedBooked = [bookedItem, ...myBooked.filter(b => b.sessionId !== slot.sessionId)];
      setMyBooked(updatedBooked);
      setOpenSlots(prev => prev.filter(s => s.sessionId !== slot.sessionId));

      try {
        localStorage.setItem('stepsmart_portal_booked_sessions', JSON.stringify(updatedBooked));
      } catch (_) {}

      setActionSuccessMsg(`Connected successfully with ${slot.hostName}! A confirmation email with the meeting room was sent to your inbox.`);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    } catch (err) {
      // Fallback local connect
      const bookedItem: PeerSessionSlot = { ...slot, status: 'BOOKED', isMySlot: true };
      const updatedBooked = [bookedItem, ...myBooked.filter(b => b.sessionId !== slot.sessionId)];
      setMyBooked(updatedBooked);
      setOpenSlots(prev => prev.filter(s => s.sessionId !== slot.sessionId));
      setActionSuccessMsg(`Connected with ${slot.hostName}! See details below in My Scheduled Sessions.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } finally {
      setBookingId(null);
    }
  };

  const handleLeaveSession = (sessionId: string) => {
    const updated = myBooked.filter(s => s.sessionId !== sessionId);
    setMyBooked(updated);
    try {
      localStorage.setItem('stepsmart_portal_booked_sessions', JSON.stringify(updated));
    } catch (_) {}
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const weeklyDays = [
    { label: 'M', active: hasSolvedToday },
    { label: 'T', active: false },
    { label: 'W', active: false },
    { label: 'Th', active: false },
    { label: 'F', active: false },
    { label: 'Sa', active: false },
    { label: 'Su', active: false }
  ];

  return (
    <div style={s.page}>
      
      {/* ─── DESKTOP & TABLET SHELL ─── */}
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        
        {/* ─── STICKY SIDEBAR: Exact LMS deep cyan-to-teal gradient ─── */}
        <aside
          style={s.sidebar}
          className={`${isMobileMenuOpen ? 'fixed inset-0 z-50 flex' : 'hidden lg:flex'}`}
        >
          <div style={s.sidebarGlow} />

          {/* Brand Mark: S + StepSmart */}
          <div style={s.brand}>
            <div style={s.brandMark}>S</div>
            <span style={{ color: '#ffffff', fontSize: '1.15rem' }}>StepSmart</span>
            {isMobileMenuOpen && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Stack */}
          <div style={s.navStack}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  style={{
                    ...s.navButton,
                    ...(isActive ? s.navButtonActive : {}),
                  }}
                  onClick={() => handleTabClick(item.id)}
                >
                  {isActive && <span style={s.navActiveRail} />}
                  <span style={s.navButtonIcon}>
                    <SidebarIcon kind={item.icon} />
                  </span>
                  <span>{item.label}</span>
                  {item.isLocked && (
                    <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.55 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom: Open Admin & Sign Out */}
          <div style={s.sidebarSection}>
            <div style={s.sidebarDivider} />
            <a
              href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to speak with admissions regarding cohort enrollment.")}`}
              target="_blank"
              rel="noreferrer"
              style={s.adminLink}
            >
              <span>Enroll on WhatsApp</span>
              <ExternalLink size={13} style={{ marginLeft: '0.4rem' }} />
            </a>
            <button
              type="button"
              style={s.signOutBtn}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT CANVAS ─── */}
        <main style={s.main}>
          
          {/* Header Bar matching LMS design */}
          <div style={s.header}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-700 bg-white border border-slate-200"
              >
                <Menu size={20} />
              </button>
              <div>
                <div style={s.headerEyebrow}>STUDENT DASHBOARD</div>
                <div style={s.headerTitle}>Welcome back, {displayName}</div>
              </div>
            </div>

            {/* Clean Right Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I am on the student portal and want to speak with admissions regarding PM-X cohorts.")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '999px',
                  background: '#25D366',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                }}
              >
                <MessageSquare size={14} fill="#ffffff" />
                <span>Chat Admissions</span>
              </a>

              <a
                href="/learn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Enrolled LMS</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 1: HOME (PM GYM + 2 FLAGSHIP COURSES)                */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
              
              {/* ─── PM GYM BANNER (1:1 with LMS) ─── */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #027A9B 0%, #015D77 100%)',
                  borderRadius: '24px',
                  padding: '1.5rem 2rem',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 10px 30px rgba(2, 122, 155, 0.15)',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  boxSizing: 'border-box',
                }}
              >
                {/* Mascot & Question */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '280px' }}>
                  <img
                    src="/pm_gym_brain.png"
                    alt="PM Gym Brain mascot"
                    style={{ width: '84px', height: '84px', objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                        PM Gym
                      </h3>
                      <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                        DAILY DRILL
                      </span>
                    </div>
                    <p style={{ fontSize: '0.925rem', color: '#e0f2fe', margin: 0, opacity: 0.95, lineHeight: 1.45, maxWidth: '620px' }}>
                      {todayQuestion?.text || "No daily question scheduled for today. Check back later!"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons & Weekly Goal Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                  {hasSolvedToday ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        background: 'rgba(255, 255, 255, 0.22)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.75rem 1.6rem',
                        fontSize: '0.925rem',
                        fontWeight: 700,
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Completed Today ✓</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowGymModal(true)}
                      style={{
                        background: '#ffffff',
                        color: '#027A9B',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.8rem 1.75rem',
                        fontSize: '0.925rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <Zap size={16} fill="#027A9B" />
                      <span>Solve Today's Challenge</span>
                    </button>
                  )}

                  {/* Weekly Goal Circles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '180px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e0f2fe', opacity: 0.9, textAlign: 'center' }}>
                      Weekly Goal
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.35rem' }}>
                      {weeklyDays.map((d, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: d.active ? '#ffffff' : 'rgba(255, 255, 255, 0.22)',
                            color: d.active ? '#027A9B' : '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {d.active ? '✓' : d.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.25)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#ffffff', width: hasSolvedToday ? '25%' : '0%', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── SECTION TITLE: OUR 2 FLAGSHIP COURSES ─── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={s.headerEyebrow}>FLAGSHIP COHORTS</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  Explore Our StepSmart Programs
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                  Structured cohort curriculum with live masterclasses by PMs from Microsoft & Mastercard, 1:1 portfolio reviews, and guaranteed referrals.
                </p>
              </div>

              {/* ─── 2 COURSES SIDE-BY-SIDE: PM-X ACCELERATOR & PM-X FIRST STEP ─── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                
                {/* ── COURSE 1: PM-X ACCELERATOR ── */}
                <div style={s.courseCard}>
                  <div>
                    {/* Badge */}
                    <div style={{ ...s.courseBadge, background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                      <Briefcase size={13} />
                      <span>Working Professionals • 6 Weeks Live</span>
                    </div>

                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                      PM-X Accelerator
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                      Fast-track your transition from Software Engineering, Analytics, QA, or Consulting to a High-Growth Product Manager role.
                    </p>

                    {/* Program Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '1.25rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#027A9B' }}>6 Wks</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Live Masterclasses</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#027A9B' }}>1:1</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Mentor Reviews</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#027A9B' }}>40+</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Hiring Referrals</div>
                      </div>
                    </div>

                    {/* Key Modules Overview */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                        Curriculum Highlights:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {ACCELERATOR_MODULES.slice(0, 4).map((m) => (
                          <div key={m.week} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, color: '#027A9B', fontSize: '0.75rem', background: '#e0f2fe', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                                {m.week}
                              </span>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{m.title}</span>
                            </div>
                            <Lock size={12} style={{ color: '#94a3b8' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <a
                      href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to enroll in the PM-X Accelerator cohort for working professionals. Please share batch dates and enrollment details.")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={s.primaryBtn}
                    >
                      <MessageSquare size={16} fill="#ffffff" />
                      <span>Apply for PM-X Accelerator</span>
                    </a>
                    <button
                      type="button"
                      style={s.outlineBtn}
                      onClick={() => {
                        setSelectedCourseTab('accelerator');
                        setActiveView('courses');
                      }}
                    >
                      <span>View Full 6-Week Syllabus</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* ── COURSE 2: PM-X FIRST STEP ── */}
                <div style={s.courseCard}>
                  <div>
                    {/* Badge */}
                    <div style={{ ...s.courseBadge, background: '#fdf4ff', color: '#86198f', border: '1px solid #f5d0fe' }}>
                      <GraduationCap size={14} />
                      <span>College Students & Freshers • 6 Weeks Live</span>
                    </div>

                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                      PM-X First Step
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                      Campus-to-corporate Associate Product Manager (APM) program to crack your dream PM placements and internships.
                    </p>

                    {/* Program Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '1.25rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#86198f' }}>6 Wks</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Campus Roadmaps</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#86198f' }}>10+</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>App Teardowns</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#86198f' }}>1:1</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>APM Placements</div>
                      </div>
                    </div>

                    {/* Key Modules Overview */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                        Curriculum Highlights:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {FIRST_STEP_MODULES.slice(0, 4).map((m) => (
                          <div key={m.week} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, color: '#86198f', fontSize: '0.75rem', background: '#fdf4ff', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                                {m.week}
                              </span>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{m.title}</span>
                            </div>
                            <Lock size={12} style={{ color: '#94a3b8' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <a
                      href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to enroll in the PM-X First Step cohort for college students and APM placement preparation.")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ ...s.primaryBtn, background: 'linear-gradient(180deg, #86198f 0%, #701a75 100%)' }}
                    >
                      <MessageSquare size={16} fill="#ffffff" />
                      <span>Apply for PM-X First Step</span>
                    </a>
                    <button
                      type="button"
                      style={s.outlineBtn}
                      onClick={() => {
                        setSelectedCourseTab('first-step');
                        setActiveView('courses');
                      }}
                    >
                      <span>View Full 6-Week Syllabus</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 2: COURSES TAB (IN-PAGE LOCK BANNER & SYLLABUS)      */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Course Switcher Header */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={s.headerEyebrow}>COURSE SYLLABUS</div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedCourseTab === 'accelerator' ? 'PM-X Accelerator (Working Professionals)' : 'PM-X First Step (College & APM Placements)'}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseTab('accelerator')}
                    style={{
                      border: 'none',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '9px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: selectedCourseTab === 'accelerator' ? '#027A9B' : 'transparent',
                      color: selectedCourseTab === 'accelerator' ? '#ffffff' : '#64748b',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    PM-X Accelerator
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseTab('first-step')}
                    style={{
                      border: 'none',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '9px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: selectedCourseTab === 'first-step' ? '#86198f' : 'transparent',
                      color: selectedCourseTab === 'first-step' ? '#ffffff' : '#64748b',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    PM-X First Step
                  </button>
                </div>
              </div>

              {/* IN-PAGE LOCKED COHORT BANNER (Tells visitor to buy, NO POPUP!) */}
              <div style={s.inPageLockCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#027A9B',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <Lock size={12} />
                    <span>LOCKED COHORT CONTENT</span>
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    Live Classes & Video Archives
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Join the StepSmart Cohort to Unlock All 6 Weeks of Lectures & Materials
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Full video recordings, downloadable PRD templates, 1:1 portfolio reviews, and guaranteed referrals are exclusive to enrolled cohort students.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(2, 122, 155, 0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: '#1e293b', fontWeight: 600 }}>
                    <Check size={14} color="#027A9B" />
                    <span>6 Weeks Live Masterclasses</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: '#1e293b', fontWeight: 600 }}>
                    <Check size={14} color="#027A9B" />
                    <span>1:1 Mentor PRD Grading</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: '#1e293b', fontWeight: 600 }}>
                    <Check size={14} color="#027A9B" />
                    <span>40+ Verified Tech Referrals</span>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <a
                    href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to enroll in the cohort to unlock full access to all lectures, PRD assignments, and mentor feedback.")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...s.primaryBtn, maxWidth: '320px' }}
                  >
                    <MessageSquare size={16} fill="#ffffff" />
                    <span>Enroll on WhatsApp to Unlock ➜</span>
                  </a>
                </div>
              </div>

              {/* Modules List (Week by week preview) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(selectedCourseTab === 'accelerator' ? ACCELERATOR_MODULES : FIRST_STEP_MODULES).map((mod) => (
                  <div
                    key={mod.week}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 12px rgba(15, 40, 80, 0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#027A9B', background: '#e0f2fe', padding: '0.2rem 0.65rem', borderRadius: '8px' }}>
                          {mod.week}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                          • {mod.duration}
                        </span>
                      </div>

                      <a
                        href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(`Hi StepSmart! I would like to unlock ${mod.week}: ${mod.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#027A9B',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textDecoration: 'none',
                        }}
                      >
                        <Lock size={12} />
                        <span>Unlock Module</span>
                      </a>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                      {mod.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {mod.description}
                    </p>

                    {/* Topics Checklist */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
                      {mod.topics.map((t) => (
                        <span key={t} style={{ fontSize: '0.78rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '0.25rem 0.65rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Check size={12} color="#059669" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>

                    {/* Lessons list */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      {mod.lessons.map((lesson, idx) => (
                        <a
                          key={idx}
                          href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(`Hi StepSmart Team! I want to enroll to watch the lecture: ${lesson.title}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textDecoration: 'none',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                            <Video size={14} color="#027A9B" style={{ flexShrink: 0 }} />
                            <span style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lesson.title}
                            </span>
                          </div>
                          <Lock size={12} color="#94a3b8" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 3: 1:1 SESSIONS TAB (OPEN FULLY 1:1 LIKE LMS!)       */}
          {/* (NO option to create a slot, just to join!)               */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'scheduling' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              
              {/* Top Tabs Switcher (Native LMS Style) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setSessionSubTab('peer')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      border: sessionSubTab === 'peer' ? '1px solid #027A9B' : '1px solid rgba(15, 40, 80, 0.12)',
                      background: sessionSubTab === 'peer' ? '#027A9B' : 'rgba(255, 255, 255, 0.8)',
                      color: sessionSubTab === 'peer' ? '#ffffff' : '#64748b',
                      boxShadow: sessionSubTab === 'peer' ? '0 4px 14px rgba(2, 122, 155, 0.28)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Users size={16} />
                    <span>Peer-to-Peer Study</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionSubTab('mentor')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      border: sessionSubTab === 'mentor' ? '1px solid #027A9B' : '1px solid rgba(15, 40, 80, 0.12)',
                      background: sessionSubTab === 'mentor' ? '#027A9B' : 'rgba(255, 255, 255, 0.8)',
                      color: sessionSubTab === 'mentor' ? '#ffffff' : '#64748b',
                      boxShadow: sessionSubTab === 'mentor' ? '0 4px 14px rgba(2, 122, 155, 0.28)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Clock size={16} />
                    <span>1:1 Mentor Office Hours</span>
                  </button>
                </div>

                {sessionSubTab === 'peer' && (
                  <button
                    type="button"
                    onClick={() => fetchPeerSessions(true)}
                    disabled={refreshingSessions}
                    title="Refresh slots"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#ffffff',
                      border: '1px solid rgba(15, 40, 80, 0.12)',
                      borderRadius: '12px',
                      padding: '0.55rem 0.95rem',
                      cursor: 'pointer',
                      color: '#475569',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(15, 40, 80, 0.04)',
                    }}
                  >
                    <RefreshCw size={14} style={{ animation: refreshingSessions ? 'spin 1s linear infinite' : 'none' }} />
                    <span>Refresh Slots</span>
                  </button>
                )}
              </div>

              {/* Action Success Alert Banner */}
              {actionSuccessMsg && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  color: '#166534',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
                }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* ── TAB 1: PEER-TO-PEER STUDY ── */}
              {sessionSubTab === 'peer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Header Banner Card (Soft Gradient LMS Style) */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(2, 122, 155, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)',
                    border: '1px solid rgba(2, 122, 155, 0.18)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 28px rgba(15, 40, 80, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          background: 'rgba(2, 122, 155, 0.12)',
                          color: '#027A9B',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em'
                        }}>
                          PEER LEARNING
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                          Practice & Learn with Classmates Across All Batches
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', maxWidth: '720px', lineHeight: 1.5 }}>
                        Connect 1-on-1 for mock product interviews, assignment brainstorms, or topic revisions. Browse available open slots created by cohort peers below and connect instantly with a single click.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.45rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                      <Sparkles size={14} color="#027A9B" />
                      <span>Slots sync across cohorts</span>
                    </div>
                  </div>

                  {/* Section: My Booked Sessions */}
                  {myBooked.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={18} color="#027A9B" />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                          My Scheduled Sessions ({myBooked.length})
                        </h3>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                        {myBooked.map((session) => (
                          <div key={session.sessionId} style={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid rgba(2, 122, 155, 0.2)',
                            borderRadius: '18px',
                            padding: '1.25rem',
                            boxShadow: '0 8px 24px rgba(15, 40, 80, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1rem'
                          }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <span style={{
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  color: '#059669',
                                  padding: '3px 9px',
                                  borderRadius: '999px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  Matched with {session.hostName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleLeaveSession(session.sessionId)}
                                  title="Leave session"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  <Trash2 size={13} /> Leave
                                </button>
                              </div>

                              <div style={{ fontWeight: 700, fontSize: '0.975rem', color: '#0f172a', marginBottom: '6px' }}>
                                {session.topic}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#64748b', marginBottom: '6px' }}>
                                <Calendar size={14} color="#027A9B" />
                                <span>{formatDateTime(session.scheduledStartTime)}</span>
                              </div>

                              {(session.courseName || session.batchName) && (
                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  Cohort: <span style={{ fontWeight: 600, color: '#027A9B' }}>{session.courseName || session.batchName}</span>
                                </div>
                              )}
                            </div>

                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '9px 14px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(13, 108, 140, 0.22)',
                              }}
                            >
                              <Video size={16} />
                              <span>Join Video Room</span>
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Available Open Slots from Classmates */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#027A9B" />
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        Available Study Slots ({openSlots.length})
                      </h3>
                    </div>

                    {loadingSessions ? (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid rgba(15, 40, 80, 0.08)',
                        borderRadius: '18px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        color: '#64748b'
                      }}>
                        Loading open slots from StepSmart cohorts...
                      </div>
                    ) : openSlots.length === 0 ? (
                      <div style={{
                        background: '#ffffff',
                        border: '1px dashed rgba(15, 40, 80, 0.16)',
                        borderRadius: '18px',
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '14px',
                          background: '#e0f2fe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Users size={24} color="#027A9B" />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                          No open study slots right now
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
                          Enrolled cohort students post new study slots throughout the day. Check back soon or participate in mentor office hours!
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {openSlots.map((slot) => (
                          <div
                            key={slot.sessionId}
                            style={{
                              background: '#ffffff',
                              border: '1px solid rgba(15, 40, 80, 0.08)',
                              borderRadius: '18px',
                              padding: '1.25rem',
                              boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '1rem',
                            }}
                          >
                            <div>
                              {/* Host Info */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '10px',
                                  background: 'linear-gradient(135deg, #0d6c8c 0%, #1089b1 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.95rem',
                                  color: '#ffffff'
                                }}>
                                  {slot.hostName ? slot.hostName.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>
                                    {slot.hostName || 'Classmate'}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#027A9B', fontWeight: 600 }}>
                                    {slot.courseName || 'PM Cohort Peer'}
                                  </div>
                                </div>
                              </div>

                              {/* Topic */}
                              <div style={{
                                fontWeight: 700,
                                fontSize: '0.975rem',
                                color: '#0f172a',
                                marginBottom: '8px',
                                lineHeight: 1.35
                              }}>
                                {slot.topic}
                              </div>

                              {/* Date & Time */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                fontSize: '0.825rem',
                                fontWeight: 500,
                                color: '#334155',
                                marginBottom: '8px'
                              }}>
                                <Calendar size={14} color="#027A9B" />
                                <span>{formatDateTime(slot.scheduledStartTime)}</span>
                              </div>

                              {/* Notes */}
                              {slot.notes && (
                                <p style={{
                                  fontSize: '0.8125rem',
                                  color: '#64748b',
                                  margin: 0,
                                  lineHeight: 1.45,
                                  background: '#f8fafc',
                                  borderLeft: '3px solid #027A9B',
                                  padding: '6px 10px',
                                  borderRadius: '0 6px 6px 0'
                                }}>
                                  "{slot.notes}"
                                </p>
                              )}
                            </div>

                            {/* Connect & Join Button (NO CREATE BUTTON, JUST JOIN!) */}
                            <button
                              type="button"
                              onClick={() => handleJoinSlot(slot)}
                              disabled={bookingId === slot.sessionId}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '9px 14px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(13, 108, 140, 0.22)',
                                transition: 'all 0.15s ease',
                                width: '100%',
                              }}
                            >
                              <UserCheck size={16} />
                              <span>{bookingId === slot.sessionId ? 'Connecting...' : 'Connect & Join Slot'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ── TAB 2: MENTOR OFFICE HOURS ── */}
              {sessionSubTab === 'mentor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Card 1: Senior PM Doubt Clearing */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid rgba(15, 40, 80, 0.08)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#027A9B',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        WEEKLY LIVE MENTOR HOURS
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                        1:1 Doubt Clearing & Capstone Mentorship
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, maxWidth: '700px' }}>
                      Every weekend, Senior PMs from Microsoft & Mastercard host live 1:1 office hours to review product briefs, debug telemetry metrics, and conduct live mock rounds.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                      <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px' }}>
                          Saturday Session (7:00 PM IST)
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>
                          Topic: Product Sense, CIRCLES Teardowns & PRD Feedback
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#027A9B', fontWeight: 700, background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                          Mentor: Lead PM @ Microsoft
                        </span>
                      </div>

                      <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px' }}>
                          Sunday Session (11:00 AM IST)
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>
                          Topic: Metrics RCA, Guesstimates & Mock Placement Loops
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#86198f', fontWeight: 700, background: '#fdf4ff', padding: '2px 8px', borderRadius: '6px' }}>
                          Mentor: Senior PM @ Mastercard
                        </span>
                      </div>
                    </div>

                    <div style={{ paddingTop: '0.5rem' }}>
                      <a
                        href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I would like to book a slot for the 1:1 Mentor Office Hours.")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...s.primaryBtn, maxWidth: '280px' }}
                      >
                        <Calendar size={16} />
                        <span>Book Mentor Slot on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 4: RESOURCES TAB (OPEN FULLY 1:1 LIKE LMS!)          */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Header */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={s.headerEyebrow}>RESOURCE VAULT</div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                    Curated Product Management Toolkits & Frameworks
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    High-signal PRD templates, product teardowns, metrics cheat sheets, and interview frameworks used across StepSmart cohorts.
                  </p>
                </div>

                <a
                  href="/resources"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 1.15rem',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    color: '#027A9B',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Browse IIT Question Bank ➜</span>
                </a>
              </div>

              {/* Resource Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {RESOURCE_VAULT.map((res) => {
                  const isExpanded = expandedResource === res.id;
                  return (
                    <div
                      key={res.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(20, 49, 86, 0.08)',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 14px rgba(15, 40, 80, 0.03)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedResource(isExpanded ? null : res.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '1.25rem 1.5rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#027A9B',
                              background: '#e0f2fe',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '6px',
                            }}>
                              {res.category}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                              • {res.fileCount} reference document{res.fileCount === 1 ? '' : 's'}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {res.title}
                          </h3>
                        </div>

                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                          flexShrink: 0,
                        }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                            {res.description}
                          </p>

                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                              Available Documents & Templates:
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                              {res.docs.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    color: '#0f172a',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                    <FileText size={16} color="#027A9B" style={{ flexShrink: 0 }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {doc.label}
                                    </span>
                                  </div>
                                  <ExternalLink size={14} color="#64748b" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 5: ASSIGNMENTS TAB (IN-PAGE LOCK BANNER & PREVIEW)   */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'assignments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Header */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
                <div style={s.headerEyebrow}>COHORT ASSIGNMENTS</div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  7 Hands-On Product Teardowns & PRD Challenges
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Real-world business problems designed to simulate day-to-day decisions at top tech startups.
                </p>
              </div>

              {/* In-page Lock Banner (NO POPUP!) */}
              <div style={s.inPageLockCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#027A9B',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <Lock size={12} />
                    <span>LOCKED FEATURE</span>
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    1:1 Mentor Grading & Video Reviews
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Enroll to Submit Weekly Assignments & Build Your Portfolio
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Cohort students submit weekly assignments and receive personalized line-by-line rubric scoring and recorded video feedback from Senior PMs.
                  </p>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <a
                    href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to enroll to submit cohort assignments and receive 1:1 mentor grading.")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...s.primaryBtn, maxWidth: '320px' }}
                  >
                    <MessageSquare size={16} fill="#ffffff" />
                    <span>Unlock Assignments on WhatsApp ➜</span>
                  </a>
                </div>
              </div>

              {/* 7 Assignments Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {COHORT_ASSIGNMENTS.map((asg) => (
                  <div
                    key={asg.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '18px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      boxShadow: '0 4px 12px rgba(15, 40, 80, 0.03)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#027A9B', background: '#e0f2fe', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>
                          Assignment {asg.id}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>
                          {asg.tag}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                        {asg.title}
                      </h3>

                      <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                        {asg.prompt}
                      </p>
                    </div>

                    <a
                      href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(`Hi StepSmart! I would like to get access to Assignment ${asg.id}: ${asg.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.65rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#027A9B',
                        textDecoration: 'none',
                      }}
                    >
                      <Lock size={12} />
                      <span>Unlock Rubric & Submission</span>
                    </a>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 6: JOBS TAB (IN-PAGE LOCK BANNER & REFERRAL BOARD)   */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'jobs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Header */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
                <div style={s.headerEyebrow}>CAREER BOARD</div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  StepSmart PM Referral & Opportunity Pipeline
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Curated APM, PM 1, and Senior PM openings with warm introductions directly to hiring managers.
                </p>
              </div>

              {/* In-page Lock Banner (NO POPUP!) */}
              <div style={s.inPageLockCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#027A9B',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <Lock size={12} />
                    <span>REFERRAL NETWORK</span>
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    Alumni & Mentor Intros
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Unlock Fast-Track Referrals to 40+ Tech Companies
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    StepSmart cohort graduates bypass standard resume filters with direct Slack referral pipelines and recruiter introductions.
                  </p>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <a
                    href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to join the cohort and get referral introductions for PM roles.")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...s.primaryBtn, maxWidth: '320px' }}
                  >
                    <MessageSquare size={16} fill="#ffffff" />
                    <span>Get Referral Access on WhatsApp ➜</span>
                  </a>
                </div>
              </div>

              {/* Job Listings Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {CURATED_JOBS.map((job, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '18px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      boxShadow: '0 4px 12px rgba(15, 40, 80, 0.03)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>
                          {job.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          {job.experience}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                        {job.role}
                      </h3>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#027A9B', marginBottom: '0.75rem' }}>
                        {job.company} • {job.location}
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: '#334155', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                        Compensation: <span style={{ color: '#0f172a', fontWeight: 700 }}>{job.salary}</span>
                      </div>
                    </div>

                    <a
                      href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(`Hi StepSmart! I am interested in referral for the ${job.role} position at ${job.company}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.65rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#027A9B',
                        textDecoration: 'none',
                      }}
                    >
                      <Lock size={12} />
                      <span>Request Cohort Referral</span>
                    </a>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 7: INTERVIEW PREP TAB (IN-PAGE LOCK BANNER & PYQS)  */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              
              {/* Header */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
                <div style={s.headerEyebrow}>INTERVIEW SIMULATOR</div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  PM Interview Prep & Mock Interview Loops
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Master Product Sense, Analytical RCA, Guesstimates, and Behavioral rounds before facing hiring panels.
                </p>
              </div>

              {/* In-page Lock Banner (NO POPUP!) */}
              <div style={s.inPageLockCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#027A9B',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <Lock size={12} />
                    <span>LOCKED FEATURE</span>
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    1:1 Mock Interviews with Senior PMs
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Practice Live 1:1 Mock Interviews with Microsoft & Swiggy Mentors
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Get detailed scorecard feedback across structured communication, business empathy, metrics thinking, and edge cases.
                  </p>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <a
                    href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to join the cohort and schedule 1:1 mock interviews with Senior PM mentors.")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...s.primaryBtn, maxWidth: '320px' }}
                  >
                    <MessageSquare size={16} fill="#ffffff" />
                    <span>Book Mock Loop on WhatsApp ➜</span>
                  </a>
                </div>
              </div>

              {/* Interview Category Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🎯</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Product Sense & Design
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                    "Design an ATM for the blind", "Improve Uber driver retention", "Build an alarm clock for Google Home".
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>📊</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Analytical & RCA Trees
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                    "Instagram Story views dropped 12% overnight", "Netflix churn increased in Tier-2 cities".
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🔢</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    Guesstimates & Sizing
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                    "Estimate daily pizzas delivered in Bengaluru", "Market size of electric scooters in India by 2030".
                  </p>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ─── PM GYM QUIZ MODAL (Native LMS Style) ─── */}
      {showGymModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(15, 40, 80, 0.25)',
            border: '1px solid rgba(20, 49, 86, 0.1)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #027A9B 0%, #015D77 100%)',
              padding: '1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="/pm_gym_brain.png"
                  alt="Mascot"
                  style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b' }}>
                    DAILY CHALLENGE
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    StepSmart PM Gym
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGymModal(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#027A9B', background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {todayQuestion?.category || "Product Management"}
                </span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0.75rem 0 0 0', lineHeight: 1.5 }}>
                  {todayQuestion?.text}
                </p>
              </div>

              {/* Options */}
              {todayQuestion?.type === 'quiz' && todayQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {todayQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOpt = gymSubmitted && idx === todayQuestion.correctIndex;
                    const isWrongOpt = gymSubmitted && isSelected && !gymIsCorrect;

                    let bg = '#ffffff';
                    let border = '1px solid #cbd5e1';
                    let color = '#1e293b';

                    if (isCorrectOpt) {
                      bg = '#dcfce7';
                      border = '2px solid #16a34a';
                      color = '#166534';
                    } else if (isWrongOpt) {
                      bg = '#fee2e2';
                      border = '2px solid #dc2626';
                      color = '#991b1b';
                    } else if (isSelected) {
                      bg = '#e0f2fe';
                      border = '2px solid #027A9B';
                      color = '#027A9B';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={gymSubmitted}
                        onClick={() => setSelectedOption(idx)}
                        style={{
                          textAlign: 'left',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          background: bg,
                          border: border,
                          color: color,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          cursor: gymSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? '#027A9B' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation after submit */}
              {gymSubmitted && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: gymIsCorrect ? '#f0fdf4' : '#fffbeb',
                  border: gymIsCorrect ? '1px solid #bbf7d0' : '1px solid #fef3c7',
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: gymIsCorrect ? '#166534' : '#92400e', marginBottom: '0.25rem' }}>
                    {gymIsCorrect ? "🎉 Correct! +1 Gym Point" : "💡 Mentor Explanation"}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45 }}>
                    {todayQuestion?.explanation || "Great attempt! Keep practicing your product intuition daily."}
                  </p>
                </div>
              )}

              {/* Submit CTA */}
              {!gymSubmitted ? (
                <button
                  type="button"
                  onClick={handleGymSubmit}
                  disabled={selectedOption === null && !textAnswer.trim()}
                  style={{
                    background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    cursor: (selectedOption === null && !textAnswer.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (selectedOption === null && !textAnswer.trim()) ? 0.6 : 1,
                  }}
                >
                  Submit Daily Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGymModal(false)}
                  style={{
                    background: '#027A9B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    cursor: 'pointer',
                  }}
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
