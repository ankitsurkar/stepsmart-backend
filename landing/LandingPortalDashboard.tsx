import React, { useState, useEffect } from 'react';
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
  Settings,
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
  GraduationCap
} from 'lucide-react';

export const WHATSAPP_BUSINESS_URL = "https://wa.me/message/GH5C7YLAYIEHN1";

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'courses', label: 'Courses', icon: 'book' },
  { id: 'jobs', label: 'PM Jobs', icon: 'jobs' },
  { id: 'assignments', label: 'Assignments', icon: 'clipboard' },
  { id: 'interview', label: 'Interview', icon: 'interview' },
  { id: 'resources', label: 'Resources', icon: 'folder' },
  { id: 'scheduling', label: 'Sessions', icon: 'clock' },
  { id: 'cohort', label: 'Cohort', icon: 'users' },
  { id: 'settings', label: 'Profile', icon: 'settings' },
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

function SidebarIcon({ kind }: { kind: string }) {
  if (kind === 'home') return <Home size={20} strokeWidth={2} />;
  if (kind === 'book') return <Book size={20} strokeWidth={2} />;
  if (kind === 'jobs') return <Briefcase size={20} strokeWidth={2} />;
  if (kind === 'clock') return <Clock size={20} strokeWidth={2} />;
  if (kind === 'clipboard') return <ClipboardList size={20} strokeWidth={2} />;
  if (kind === 'interview') return <HelpCircle size={20} strokeWidth={2} />;
  if (kind === 'folder') return <Folder size={20} strokeWidth={2} />;
  if (kind === 'users') return <Users size={20} strokeWidth={2} />;
  return <Settings size={20} strokeWidth={2} />;
}

// ─── Exact LMS Stylesheet & Tokens (matches LMS primary colors) ───
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, hsl(214, 100%, 98%) 0%, hsl(205, 78%, 97%) 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0f172a',
  },
  sidebar: {
    background: 'linear-gradient(180deg, #0d6c8c 0%, #1089b1 100%)',
    color: '#fff',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 18px 42px rgba(15, 40, 80, 0.18)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    minHeight: '100vh',
    width: '260px',
    flexShrink: 0,
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
    padding: '0.85rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  main: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  headerEyebrow: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: '#027A9B',
    marginBottom: '0.35rem',
  },
  headerTitle: {
    fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#0f172a',
    marginBottom: '0.35rem',
  },
  courseCard: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '22px',
    padding: '1.75rem',
    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
  },
  courseBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    width: 'fit-content',
    marginBottom: '0.85rem',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(180deg, #1388b0 0%, #0f789e 100%)',
    color: '#ffffff',
    padding: '0.8rem 1.4rem',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(19, 136, 176, 0.25)',
    textDecoration: 'none',
  },
  outlineBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    padding: '0.8rem 1.25rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }
};

export function LandingPortalDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedCourseTab, setSelectedCourseTab] = useState<'accelerator' | 'first-step'>('accelerator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Student info from session
  const [displayName, setDisplayName] = useState<string>('Parth');
  const [userEmail, setUserEmail] = useState<string>('learner@stepsmart.net');

  // PM Gym state
  const [todayQuestion, setTodayQuestion] = useState<GymQuestion>(FALLBACK_QUESTION);
  const [hasSolvedToday, setHasSolvedToday] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showGymModal, setShowGymModal] = useState<boolean>(false);
  const [showYesterdayModal, setShowYesterdayModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submittingGym, setSubmittingGym] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Locked feature upgrade modal
  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [lockedFeatureName, setLockedFeatureName] = useState<string>('PM-X Accelerator Program');
  const [lockedFeatureDesc, setLockedFeatureDesc] = useState<string>('Join the live StepSmart cohort to unlock live mentorship, case reviews, and verified referrals.');

  const todayStr = new Date().toISOString().split('T')[0];

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
    } catch (e) {
      // Ignored
    }

    if (localStorage.getItem(`pm_gym_landing_completed_${todayStr}`) === 'true') {
      setHasSolvedToday(true);
      setStreak(1);
    }
  }, [todayStr]);

  // Fetch live questions from public endpoint
  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'get_pm_gym',
            clientDate: todayStr
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            const currentQ = data.questions.find((q: any) => q.date === todayStr) || data.questions[0];
            setTodayQuestion(currentQ);
            if (typeof data.streak === 'number' && data.streak > 0) {
              setStreak(data.streak);
            }
          }
        }
      } catch (err) {
        // Fallback used
      }
    };
    fetchGym();
  }, [todayStr]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('pmx_demo_auth_session');
      localStorage.removeItem('stepsmart_portal_session');
    } catch (e) {
      // Ignored
    }
    navigate('/');
  };

  const handleOpenLock = (feature: string, desc?: string) => {
    setLockedFeatureName(feature);
    if (desc) setLockedFeatureDesc(desc);
    setShowLockModal(true);
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'dashboard') {
      setActiveView('dashboard');
    } else if (tabId === 'courses') {
      setActiveView('courses');
    } else {
      const item = NAV_ITEMS.find(n => n.id === tabId);
      handleOpenLock(item ? item.label : tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSubmitAnswer = async () => {
    if (!todayQuestion) return;
    if (todayQuestion.type === 'quiz' && selectedOption === null) return;
    if (todayQuestion.type === 'text' && !textAnswer.trim()) return;

    setSubmittingGym(true);
    try {
      const finalAnswer = todayQuestion.type === 'quiz' ? String(selectedOption) : textAnswer.trim();
      await fetch('https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod/public/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'submit_pm_gym',
          clientDate: todayStr,
          email: userEmail,
          answer: finalAnswer,
          questionDate: todayQuestion.date,
          type: todayQuestion.type
        })
      });

      localStorage.setItem(`pm_gym_landing_completed_${todayStr}`, 'true');
      setHasSolvedToday(true);
      setStreak(prev => (prev === 0 ? 1 : prev + 1));
      setFeedbackMsg("Completed! Your answer has been submitted.");
    } catch (e) {
      localStorage.setItem(`pm_gym_landing_completed_${todayStr}`, 'true');
      setHasSolvedToday(true);
      setStreak(prev => (prev === 0 ? 1 : prev + 1));
      setFeedbackMsg("Answer recorded!");
    } finally {
      setSubmittingGym(false);
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
        
        {/* ─── SIDEBAR: Exact LMS deep cyan-to-teal gradient ─── */}
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
                  {item.id !== 'dashboard' && item.id !== 'courses' && (
                    <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom: Open Admin & Sign Out */}
          <div style={s.sidebarSection}>
            <div style={s.sidebarDivider} />
            <button
              type="button"
              style={s.adminLink}
              onClick={() => handleOpenLock("Admin Portal", "Log in to the StepSmart mentor & admin console.")}
            >
              Open Admin
            </button>
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
          
          {/* Header Bar matching LMS design (Batch pills removed as requested) */}
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
                href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I am on the student portal and want to speak with admissions regarding the PM-X cohorts.")}`}
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
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#027A9B' }}>15+</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Real Case Studies</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#027A9B' }}>1:1</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Senior PM Mocks</div>
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
                      href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to enroll in the PM-X Accelerator cohort for working professionals. Please share batch dates and curriculum details.")}`}
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
          {/* VIEW 2: COURSES TAB (FULL SYLLABUS & LESSON BREAKDOWN)    */}
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
                      background: selectedCourseTab === 'first-step' ? '#027A9B' : 'transparent',
                      color: selectedCourseTab === 'first-step' ? '#ffffff' : '#64748b',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    PM-X First Step
                  </button>
                </div>
              </div>

              {/* Modules List */}
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

                      <button
                        type="button"
                        onClick={() => handleOpenLock(`Unlock ${mod.title}`, mod.description)}
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
                        }}
                      >
                        <Lock size={12} />
                        <span>Unlock Module</span>
                      </button>
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
                        <div
                          key={idx}
                          onClick={() => handleOpenLock(`Lecture: ${lesson.title}`, "Join the StepSmart cohort to stream all live & recorded lectures with Q&A.")}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
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
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* VIEW 3: PROFILE / SETTINGS                                */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeView === 'settings' && (
            <div style={{ maxWidth: '640px', background: '#ffffff', border: '1px solid rgba(20, 49, 86, 0.08)', borderRadius: '22px', padding: '2rem', boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)' }}>
              <div style={s.headerEyebrow}>ACCOUNT PREFERENCES</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem 0' }}>
                Student Profile
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Full Name</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{displayName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Email Address</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{userEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Access Tier</span>
                  <span style={{ fontWeight: 700, color: '#027A9B', background: '#e0f2fe', padding: '0.15rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem' }}>
                    Free PM Gym Explorer
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    border: '1px solid #fecaca',
                    background: '#fff',
                    color: '#dc2626',
                    padding: '0.65rem 1.2rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>

                <a
                  href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent("Hi StepSmart Team! I want to upgrade to full cohort membership.")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={s.primaryBtn}
                >
                  <span>Enroll in Cohort ➜</span>
                </a>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* MODAL 1: PM GYM QUIZ / SOLVE MODAL (CONNECTED & LIVE)      */}
      {/* ═════════════════════════════════════════════════════════ */}
      {showGymModal && todayQuestion && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: 'min(90vh, 760px)',
            boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} color="#027A9B" />
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#027A9B' }}>
                  PM Gym Challenge
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGymModal(false)}
                style={{ background: 'rgba(15, 23, 42, 0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#027A9B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Today's Challenge • {todayQuestion.category || "Product Sense"}
                </span>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.35rem 0 0 0', lineHeight: 1.45 }}>
                  {todayQuestion.text}
                </p>
              </div>

              {!hasSolvedToday ? (
                todayQuestion.type === 'quiz' && todayQuestion.options ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {todayQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        style={{
                          textAlign: 'left',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          border: selectedOption === idx ? '2px solid #027A9B' : '1px solid #e2e8f0',
                          background: selectedOption === idx ? 'rgba(2, 122, 155, 0.06)' : '#ffffff',
                          color: selectedOption === idx ? '#027A9B' : '#334155',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: selectedOption === idx ? '#027A9B' : '#f1f5f9',
                          color: selectedOption === idx ? '#ffffff' : '#64748b',
                        }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={4}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Outline your structured response..."
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )
              ) : null}

              {hasSolvedToday && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {feedbackMsg && (
                    <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.875rem', fontWeight: 600 }}>
                      ✓ {feedbackMsg}
                    </div>
                  )}

                  {todayQuestion.explanation && (
                    <div style={{ background: 'rgba(15, 23, 42, 0.03)', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#027A9B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Mentor Solution & Explanation
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {todayQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setShowGymModal(false)}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  borderRadius: '10px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>

              {!hasSolvedToday && (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submittingGym || (todayQuestion.type === 'quiz' ? selectedOption === null : !textAnswer.trim())}
                  style={{
                    border: 'none',
                    background: '#027A9B',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submittingGym ? "Submitting..." : "Submit Answer"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════ */}
      {/* MODAL 2: LOCKED FEATURE COHORT UPGRADE (WHATSAPP CTA)     */}
      {/* ═════════════════════════════════════════════════════════ */}
      {showLockModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '1.75rem 2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box',
            position: 'relative',
          }}>
            <button
              type="button"
              onClick={() => setShowLockModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(15, 23, 42, 0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <Lock size={12} />
                <span>Locked Cohort Feature</span>
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.65rem 0 0.35rem 0' }}>
                Unlock {lockedFeatureName}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {lockedFeatureDesc}
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Included in the StepSmart Cohort:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8125rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Check size={14} color="#059669" strokeWidth={3} />
                  <span>Live weekly classes by Senior PMs from Microsoft & Mastercard</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Check size={14} color="#059669" strokeWidth={3} />
                  <span>Personalized 1:1 resume & portfolio teardown reviews</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Check size={14} color="#059669" strokeWidth={3} />
                  <span>Direct interview referrals to Swiggy, Zepto, CRED & Meesho</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Check size={14} color="#059669" strokeWidth={3} />
                  <span>Unlimited peer study rooms & mock interview practice loops</span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href={`${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(`Hi StepSmart! I am on the student portal and I want to unlock: "${lockedFeatureName}". Please share enrollment details and next batch dates.`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                }}
              >
                <MessageSquare size={16} fill="#ffffff" />
                <span>Chat with Admissions on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.4rem',
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
