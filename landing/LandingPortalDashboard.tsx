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
  Check
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

const TOP_PEERS = [
  { id: 1, name: "Deepak Sankhala", initials: "DS", points: 91, gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", rank: 1 },
  { id: 2, name: "Nishant Sinha", initials: "NS", points: 48, gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", rank: 2 },
  { id: 3, name: "Shivanee", initials: "SH", points: 43, gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", rank: 3 },
  { id: 4, name: "Bhavya Bhargav", initials: "BB", points: 41, gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", rank: 4 },
  { id: 5, name: "Kalpak Agrawal", initials: "KA", points: 35, gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", rank: 5 },
  { id: 6, name: "Sanket Bansal", initials: "SB", points: 32, gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", rank: 6 }
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

// ─── Style Dictionary extracted directly from LMS DashboardPage.js ───
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, hsl(214, 100%, 98%) 0%, hsl(205, 78%, 97%) 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0f172a',
  },
  sidebar: {
    background: 'linear-gradient(180deg, #094866 0%, #027A9B 100%)',
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
    fontWeight: 600,
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
  courseTabs: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.6rem',
    alignItems: 'center',
  },
  courseTab: {
    border: '1px solid #cbd5e1',
    background: 'rgba(255,255,255,0.76)',
    color: '#64748b',
    borderRadius: '999px',
    padding: '0.55rem 1.15rem',
    fontWeight: 600,
    fontSize: '0.825rem',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
  },
  courseTabActive: {
    background: '#027A9B',
    borderColor: '#027A9B',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(2, 122, 155, 0.25)',
  },
  dashboardHero: {
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'minmax(0, 1fr) 320px',
    alignItems: 'start',
  },
  dashboardLeft: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  dashboardRight: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '22px',
    padding: '1.25rem',
    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
    boxSizing: 'border-box' as const,
  },
  metricCards: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
  continueCard: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '20px',
    padding: '1.35rem 1.5rem',
    boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '230px',
  },
  activeCourse: {
    color: '#0f172a',
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    marginBottom: '0.85rem',
  },
  continueTitle: {
    color: '#0f172a',
    fontSize: '1.15rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '0.9rem',
  },
  segmentedTrack: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: '0.35rem',
    marginBottom: '1.1rem',
  },
  segmentedBar: {
    height: '8px',
    borderRadius: '999px',
    background: '#d3e2ea',
    overflow: 'hidden',
  },
  segmentedFill: {
    height: '100%',
    borderRadius: '999px',
    background: '#1786ad',
  },
  resumeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.55rem',
    border: 'none',
    borderRadius: '12px',
    padding: '0.8rem 1.3rem',
    background: 'linear-gradient(180deg, #1388b0 0%, #0f789e 100%)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    letterSpacing: '0.01em',
    width: 'fit-content',
    boxShadow: '0 2px 6px rgba(19, 136, 176, 0.25)',
  },
  upNext: {
    marginTop: '0.85rem',
    color: '#475569',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  railHeaderTitle: {
    color: '#111827',
    fontSize: '1.05rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    marginBottom: '0.35rem',
  },
  railHeaderSub: {
    color: '#64748b',
    fontSize: '0.8rem',
    lineHeight: 1.4,
    marginBottom: '0.9rem',
  },
  railRow: {
    display: 'grid',
    gridTemplateColumns: '44px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(20, 49, 86, 0.07)',
  },
  railAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#e7edf1',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  railName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '0.1rem',
    lineHeight: 1.2,
  },
  railMeta: {
    fontSize: '0.8125rem',
    color: '#64748b',
    fontWeight: 500,
  },
};

export function LandingPortalDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-002');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Student info from session
  const [displayName, setDisplayName] = useState<string>('Parth');
  const [userEmail, setUserEmail] = useState<string>('parth@stepsmart.net');

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
  const [lockedFeatureName, setLockedFeatureName] = useState<string>('PM-X Full Course');

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

  const handleOpenLock = (feature: string) => {
    setLockedFeatureName(feature);
    setShowLockModal(true);
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'dashboard') {
      setActiveView('dashboard');
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

  // Calendar cells generation for current month
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const currentDay = todayDate.getDate();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(todayDate);
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    calendarCells.push(d);
  }

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
        
        {/* ─── SIDEBAR: Exactly matches LMS screenshot ─── */}
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
              onClick={() => handleOpenLock("Admin Portal")}
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

        {/* ─── MAIN CONTENT AREA ─── */}
        <main style={s.main}>
          
          {/* Header Bar matching LMS screenshot */}
          <div style={s.header}>
            <div>
              <div style={s.headerEyebrow}>STUDENT DASHBOARD</div>
              <div style={s.headerTitle}>Welcome back, {displayName}</div>
            </div>

            {/* Course Switcher Pills on the right */}
            <div style={s.courseTabs}>
              <button
                type="button"
                style={{
                  ...s.courseTab,
                  ...(selectedCourseId === 'course-001' ? s.courseTabActive : {})
                }}
                onClick={() => setSelectedCourseId('course-001')}
              >
                PM -X Accelerator Batch 2
              </button>
              <button
                type="button"
                style={{
                  ...s.courseTab,
                  ...(selectedCourseId === 'course-002' ? s.courseTabActive : {})
                }}
                onClick={() => setSelectedCourseId('course-002')}
              >
                PM -X First Step (Cohort 1)
              </button>
              <button
                type="button"
                style={{
                  ...s.courseTab,
                  ...(selectedCourseId === 'course-pm' ? s.courseTabActive : {})
                }}
                onClick={() => handleOpenLock("Product Management Track")}
              >
                Product Management
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════ */}
          {/* HOME VIEW: PM GYM + METRIC CARDS + TOP PEERS             */}
          {/* ═════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            
            {/* ─── PM GYM BANNER (1:1 with LMS Screenshot) ─── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #015D77 0%, #027A9B 100%)',
                borderRadius: '24px',
                padding: '1.25rem 2rem',
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
                  style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                    PM Gym
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#e0f2fe', margin: 0, opacity: 0.95, lineHeight: 1.4 }}>
                    {todayQuestion?.text || "No daily question scheduled for today. Check back later!"}
                  </p>
                </div>
              </div>

              {/* Action Button & Weekly Goal Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                {hasSolvedToday ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.925rem',
                      fontWeight: 700,
                      cursor: 'default',
                    }}
                  >
                    Completed ✓
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowGymModal(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.28)',
                      borderRadius: '999px',
                      padding: '0.75rem 1.6rem',
                      fontSize: '0.925rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    Solve Today's Gym
                  </button>
                )}

                {/* Weekly Goal circles */}
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

            {/* ─── MAIN HERO SPLIT: Metric Cards + Continue Learning + Top Peers ─── */}
            <div style={s.dashboardHero}>
              
              {/* Left Column */}
              <div style={s.dashboardLeft}>
                
                {/* 4 Metric Cards */}
                <div style={s.metricCards}>
                  
                  {/* Card 1: Lessons */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '1.25rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '170px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Lessons
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'baseline' }}>
                        <span>0</span>
                        <span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: 500 }}>/36</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ height: '6px', borderRadius: '999px', width: '100%', background: '#e2e8f0', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{ height: '100%', borderRadius: '999px', background: '#027A9B', width: '0%' }} />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} style={{ opacity: 0.7 }} />
                        <span>1 lesson from 1.2</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Assignments */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '1.25rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '170px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Assignments
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'baseline' }}>
                        <span>0</span>
                        <span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: 500 }}>/7</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ height: '6px', borderRadius: '999px', width: '100%', background: '#e2e8f0', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{ height: '100%', borderRadius: '999px', background: '#027A9B', width: '0%' }} />
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} style={{ opacity: 0.7 }} />
                        <span>Submit soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Streak */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '1.25rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '170px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Streak
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                        {streak} {streak === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                        Total Streaks: 1 day
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Daily Calendar */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '0.65rem 0.75rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '170px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline', marginBottom: '0.25rem', paddingLeft: '0.1rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                          {monthName}
                        </span>
                        <span style={{ color: '#027A9B', fontSize: '0.75rem', fontWeight: 700 }}>
                          Daily Calendar
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, color: '#94a3b8', fontSize: '0.625rem', marginBottom: '0.2rem' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
                          <div key={i}>{w}</div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', rowGap: '2px' }}>
                        {calendarCells.map((d, idx) => {
                          if (d === null) return <div key={idx} style={{ height: '16px' }} />;
                          const isToday = d === currentDay;
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '16px',
                                  width: '16px',
                                  borderRadius: '50%',
                                  fontSize: '0.6rem',
                                  fontWeight: isToday ? 700 : 500,
                                  background: isToday ? '#027A9B' : 'transparent',
                                  color: isToday ? '#ffffff' : '#334155',
                                  boxShadow: isToday ? '0 2px 6px rgba(2, 122, 155, 0.3)' : 'none',
                                }}
                              >
                                {d}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Row 2: Continue Learning & Weekly Reminder */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', alignItems: 'stretch' }}>
                  
                  {/* Continue Learning Card */}
                  <div style={s.continueCard}>
                    <div>
                      <div style={s.activeCourse}>ACTIVE COURSE: PM -X First Step (Cohort 1) (Week 1)</div>
                      <div style={s.headerEyebrow}>CONTINUE LEARNING</div>
                      <div style={s.continueTitle}>1.2 • Introduction to Product Management</div>

                      {/* 5 Segmented Dashes */}
                      <div style={s.segmentedTrack}>
                        <div style={s.segmentedBar}>
                          <div style={{ ...s.segmentedFill, width: '100%' }} />
                        </div>
                        <div style={s.segmentedBar}>
                          <div style={{ ...s.segmentedFill, width: '0%' }} />
                        </div>
                        <div style={s.segmentedBar}>
                          <div style={{ ...s.segmentedFill, width: '0%' }} />
                        </div>
                        <div style={s.segmentedBar}>
                          <div style={{ ...s.segmentedFill, width: '0%' }} />
                        </div>
                        <div style={s.segmentedBar}>
                          <div style={{ ...s.segmentedFill, width: '0%' }} />
                        </div>
                      </div>

                      <button
                        type="button"
                        style={s.resumeButton}
                        onClick={() => handleOpenLock("1.2 Introduction to Product Management Lesson")}
                      >
                        <span>▶</span>
                        <span>Resume Lesson</span>
                      </button>
                    </div>

                    <div style={s.upNext}>
                      Up next: 1.1 • Synthesizing your Research
                    </div>
                  </div>

                  {/* Weekly Reminder Card */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(20, 49, 86, 0.08)',
                      borderRadius: '20px',
                      padding: '1.35rem 1.5rem',
                      boxShadow: '0 8px 24px rgba(15, 40, 80, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '230px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                          Weekly Reminder
                        </span>
                        <span style={{ fontSize: '1rem' }}>⏰</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenLock("Problem Selection & Assignment Discussion")}
                        >
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                            • Problem Selection & Assignment Discussion
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#027A9B', fontWeight: 600, paddingLeft: '0.65rem' }}>
                            29/08/2026
                          </span>
                        </div>

                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenLock("Solution Space Module")}
                        >
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                            • Solution Space
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#027A9B', fontWeight: 600, paddingLeft: '0.65rem' }}>
                            27/08/2026
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Top Peers Leaderboard (Exact match with screenshot) */}
              <div style={s.dashboardRight}>
                <div style={s.railHeaderTitle}>Top Peers</div>
                <div style={s.railHeaderSub}>Track your performance against the cohort.</div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {TOP_PEERS.map((peer) => (
                    <div key={peer.id} style={s.railRow}>
                      <div style={{ ...s.railAvatar, background: peer.gradient }}>
                        {peer.initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={s.railName}>{peer.name}</div>
                        <div style={s.railMeta}>{peer.points} pts</div>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', minWidth: '24px', textAlign: 'right' }}>
                        {peer.rank}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

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
                <span>Locked Cohort Content</span>
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.65rem 0 0.35rem 0' }}>
                Unlock {lockedFeatureName}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                This module is exclusively available for enrolled StepSmart cohort students with live sessions, mentor reviews, and verified referrals.
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
