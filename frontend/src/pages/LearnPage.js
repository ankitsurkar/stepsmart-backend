import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getCourseWeeks, getProgress, getQAQuestions, postQAQuestion } from '../utils/api';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';

const s = {
  page: { minHeight: '100vh', background: 'var(--background)' },
  shell: {
    minHeight: '100vh',
    display: 'grid',
    gap: '0',
  },
  sidebar: {
    background: 'linear-gradient(180deg, var(--primary-dark) 0%, var(--primary) 100%)',
    color: '#fff',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 18px 42px rgba(15, 40, 80, 0.18)',
    position: 'relative',
    overflow: 'hidden',
  },
  sidebarGlow: {
    position: 'absolute',
    inset: '-10% auto auto -20%',
    width: '220px',
    height: '220px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 68%)',
    pointerEvents: 'none',
  },
  brand: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '2rem',
    color: '#fff',
    textDecoration: 'none',
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
  },
  navStack: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    marginBottom: '1.25rem',
  },
  navButton: {
    position: 'relative',
    border: 'none',
    textAlign: 'left',
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
    textDecoration: 'none',
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
    position: 'absolute',
    left: '-1rem',
    top: '10px',
    bottom: '10px',
    width: '4px',
    borderRadius: '0 6px 6px 0',
    background: '#fff',
  },

  // ── Nav ──────────────────────────────────────────────────────────────────
  nav: {
    background: 'var(--primary)', padding: '0 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '56px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  navBrand: { fontWeight: 800, color: '#fff', fontSize: '1.05rem', letterSpacing: '-0.01em' },
  backLink: {
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    fontSize: '0.875rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  weekBadge: {
    fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)',
    background: 'rgba(255,255,255,0.18)', borderRadius: '99px',
    padding: '0.25rem 0.65rem',
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  layout: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: 'calc(100vh - 56px)',
  },

  // ── Main / video area ─────────────────────────────────────────────────────
  main: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  weekTitle: {
    fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.2rem',
  },
  weekDesc: {
    color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1.25rem',
    lineHeight: 1.6,
  },
  qaSection: { marginTop: '0.5rem' },
  docLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.75rem',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--foreground)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
    transition: 'border-color 0.15s',
  },
  qaLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.6rem 1.25rem',
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
  },

  // ── Tab Bar Interface ──────────────────────────────────────────────────────
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
  },
  tabBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: '1px solid transparent',
    background: 'transparent',
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    background: 'var(--card)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  tabContentCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    marginTop: '0.5rem',
  },

  // ── Resources ────────────────────────────────────────────────────────────
  resourceList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  resourceLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.75rem 1rem', background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--foreground)', textDecoration: 'none',
    fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.15s, border-color 0.15s',
  },

  // ── Questions & Answers Card ──────────────────────────────────────────────
  qaCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
  },
  qaInputContainer: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.75rem',
    marginBottom: '1rem',
  },
  qaInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    outline: 'none',
  },
  qaPostBtn: {
    padding: '0.6rem 1.25rem',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  commentItem: {
    borderTop: '1px solid var(--border)',
    paddingTop: '0.75rem',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--muted-foreground)',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  commentText: {
    fontSize: '0.875rem',
    color: 'var(--foreground)',
    lineHeight: 1.5,
  },

  // ── Next Lesson Button ───────────────────────────────────────────────────
  nextBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    marginBottom: '2rem',
  },
  nextBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    background: 'var(--primary)',
    color: '#FFFFFF',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
    transition: 'background 0.15s',
  },

  sidebarHeading: {
    fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem',
  },

  // ── States ────────────────────────────────────────────────────────────────
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', color: 'var(--muted-foreground)', fontSize: '0.9rem',
  },
  error: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', color: 'var(--destructive)', fontSize: '0.9rem',
  },
  noVideo: {
    background: 'var(--muted)', borderRadius: '12px', padding: '2rem',
    color: 'var(--muted-foreground)', fontSize: '0.875rem', textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    width: '90%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  modalIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 111, 143, 0.1)',
    marginBottom: '1.25rem',
  },
  modalTitle: {
    fontSize: '1.55rem',
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 1.75rem',
  },
  modalPrimaryBtn: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '0.9rem',
    fontSize: '1rem',
    fontWeight: 600,
    width: '100%',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 111, 143, 0.25)',
  },
  modalSecondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.9rem',
    fontSize: '1rem',
    fontWeight: 600,
    width: '100%',
    marginTop: '0.75rem',
    cursor: 'pointer',
  },
  modalTextBtn: {
    backgroundColor: 'transparent',
    color: '#64748b',
    border: 'none',
    padding: '0.9rem 0 0',
    fontSize: '0.95rem',
    fontWeight: 600,
    width: '100%',
    marginTop: '0.75rem',
    cursor: 'pointer',
  },
  playlist: {
    background: 'var(--card)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
    position: 'sticky',
    top: 0,
  },
  mobilePlaylistOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  mobilePlaylistContent: {
    width: '280px',
    background: 'var(--card)',
    height: '100%',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
};

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/);
  return match ? match[1] : null;
}

function getDisplayWeekNumber(allWeeks, targetWeek) {
  if (!targetWeek) return '';

  const numericWeek = Number(targetWeek.weekNumber);
  if (!Number.isFinite(numericWeek) || numericWeek <= 0) {
    return String(targetWeek.weekNumber || '');
  }

  const groupNumber = Math.floor(numericWeek);
  const groupWeeks = [...allWeeks]
    .filter((week) => {
      const current = Number(week.weekNumber);
      return Number.isFinite(current) && Math.floor(current) === groupNumber;
    })
    .sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));

  const lessonIndex = groupWeeks.findIndex((week) => week.weekId === targetWeek.weekId);
  if (lessonIndex === -1) return String(targetWeek.weekNumber || '');

  return `${groupNumber}.${lessonIndex + 1}`;
}

function ProgressStep({ label, done, active, locked }) {
  let icon = '○';
  let iconColor = 'var(--border)';
  let labelColor = 'var(--muted-foreground)';

  if (done) { icon = '✓'; iconColor = 'var(--success)'; labelColor = 'var(--success)'; }
  else if (active) { icon = '●'; iconColor = 'var(--primary)'; labelColor = 'var(--foreground)'; }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      marginBottom: '0.7rem', opacity: locked ? 0.4 : 1,
    }}>
      <span style={{
        color: iconColor, fontWeight: 700, fontSize: '1rem',
        width: '18px', textAlign: 'center', flexShrink: 0,
      }}>{icon}</span>
      <span style={{ color: labelColor, fontSize: '0.875rem', fontWeight: done || active ? 600 : 400 }}>
        {label}
      </span>
    </div>
  );
}
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'courses', label: 'Courses', icon: 'book' },
  { id: 'cohort', label: 'Cohort', icon: 'users' },
  { id: 'scheduling', label: 'Sessions', icon: 'clock' },
  { id: 'assignments', label: 'Assignments', icon: 'clipboard' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'settings', label: 'Profile', icon: 'settings' },
];

function SidebarIcon({ kind }) {
  const common = { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

  if (kind === 'home') {
    return (
      <svg {...common}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }
  if (kind === 'book') {
    return (
      <svg {...common}>
        <path d="M3 5.5c0-1.1.9-2 2-2h6v16H5a2 2 0 0 0-2 2z" />
        <path d="M21 5.5c0-1.1-.9-2-2-2h-6v16h6a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (kind === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (kind === 'clipboard') {
    return (
      <svg {...common}>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5h6v3H9z" />
      </svg>
    );
  }
  if (kind === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }
  if (kind === 'users') {
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1.6a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0L4.2 18a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.4a1 1 0 0 1-1-1v-1.6a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1.1-1.1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 0 1 1 1v1.6a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6z" />
    </svg>
  );
}
export default function LearnPage() {
  const { courseId, weekId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const initiallyCompleteRef = useRef(false);

  const [week, setWeek] = useState(null);
  const [allWeeks, setAllWeeks] = useState([]);
  const [displayWeekNumber, setDisplayWeekNumber] = useState('');
  const [progress, setProgress] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [videoComplete, setVideoComplete] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompact, setIsCompact] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 980 : false,
  );
  const [showPlaylistMobile, setShowPlaylistMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    function handleResize() {
      setIsCompact(window.innerWidth < 980);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tabs and Questions state
  const [activeTab, setActiveTab] = useState(queryTab || 'overview');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [questionsList, setQuestionsList] = useState([
    { id: 1, author: 'Student A', text: 'Are we covering advanced metrics in week 3?', date: '2 days ago' },
    { id: 2, author: 'Parth Randive', text: 'Yes, week 3 focuses heavily on key product-led growth metrics!', date: '1 day ago' },
  ]);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => { loadWeek(); }, [courseId, weekId]);

  async function loadWeek() {
    setLoading(true);
    try {
      const [weeksRes, progressRes, qaRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId),
        getQAQuestions(courseId, weekId).catch((err) => {
          console.error('Failed to load QA comments:', err);
          return { data: { questions: [] } };
        }),
      ]);
      
      let found = null;
      const isRecordedSession = String(weekId).startsWith('rec-');

      const modulesList = weeksRes.data.modules || weeksRes.data.weeks || [];
      const liveWeeksList = weeksRes.data.liveWeeks || [];
      const supplementalList = weeksRes.data.supplementalContent?.liveRecordedSessions || [];
      
      const weeksList = [
        ...modulesList,
        ...liveWeeksList,
        ...supplementalList
      ];
      setAllWeeks(weeksList);

      if (isRecordedSession) {
        found = supplementalList.find((s) => s.id === weekId);
      } else {
        found = weeksList.find((w) => w.weekId === weekId);
        if (found) {
          setDisplayWeekNumber(getDisplayWeekNumber(weeksList, found));
        }
      }

      if (!found) { setError('Content not found or not yet released.'); return; }
      setWeek(found);

      // Automatically expand the group containing the active lesson
      let activeGroupKey = '';
      if (isRecordedSession) {
        activeGroupKey = 'recorded';
      } else if (found.category === 'live') {
        activeGroupKey = 'live';
      } else {
        const num = Number(found.weekNumber);
        if (Number.isFinite(num)) {
          activeGroupKey = `module-${Math.floor(num)}`;
        } else {
          activeGroupKey = `module-${found.weekNumber}`;
        }
      }
      setExpandedGroups((prev) => ({ ...prev, [activeGroupKey]: true }));

      const hasQuiz = (found.quiz?.questions || []).length > 0;
      if (!hasQuiz && activeTab === 'quiz') {
        setActiveTab('overview');
      }

      const weekProgress = (progressRes.data.progress || []).find((p) => p.weekId === weekId) || null;
      setProgress(weekProgress);
      setAllProgress(progressRes.data.progress || []);
      const wasAlreadyComplete = weekProgress?.videoComplete || false;
      initiallyCompleteRef.current = wasAlreadyComplete;
      setVideoComplete(wasAlreadyComplete);
      setQuizPassed(weekProgress?.quizPassed || false);
      setQuizUnlocked(weekProgress?.videoComplete || false);

      const fetchedQuestions = qaRes?.data?.questions || [];
      setQuestionsList(fetchedQuestions.length > 0 ? fetchedQuestions : [
        { id: 1, author: 'Student A', text: 'Are we covering advanced metrics in week 3?', date: '2 days ago' },
        { id: 2, author: 'Parth Randive', text: 'Yes, week 3 focuses heavily on key product-led growth metrics!', date: '1 day ago' },
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to load this content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePostQuestion() {
    if (!newQuestionText.trim()) return;
    try {
      const res = await postQAQuestion(courseId, weekId, newQuestionText.trim());
      const newQ = res.data.question;
      setQuestionsList([newQ, ...questionsList]);
      setNewQuestionText('');
    } catch (err) {
      console.error('Failed to post question:', err);
      alert('Failed to post question. Please try again.');
    }
  }

  if (loading) return <div style={s.loading}>Loading week content…</div>;
  if (error) return <div style={s.error}>{error}</div>;
  if (!week) return null;

  const isRecordedSession = String(weekId).startsWith('rec-');
  const videoUrl = week.storageProvider === 'supabase' ? week.url : null;
  const videoId = videoUrl ? null : extractYouTubeId(week.youtubeUrl || week.url);
  const hasQuiz = (week.quiz?.questions || []).length > 0;
  const weekComplete = videoComplete && (!hasQuiz || quizPassed);

  function PlaylistContent({ isMobile }) {
    function getGroupedPlaylist() {
      const groups = [];
      allWeeks.forEach((item, idx) => {
        const itemWId = item.weekId || item.id;
        
        let groupKey = '';
        let groupTitle = '';
        
        if (String(itemWId).startsWith('rec-')) {
          groupKey = 'recorded';
          groupTitle = 'Recorded Lectures';
        } else if (item.category === 'live') {
          groupKey = 'live';
          groupTitle = 'Live Sessions';
        } else {
          const num = Number(item.weekNumber);
          const groupNum = Number.isFinite(num) ? Math.floor(num) : 1;
          groupKey = `module-${groupNum}`;
          groupTitle = `Week ${groupNum}`;
        }

        let group = groups.find(g => g.key === groupKey);
        if (!group) {
          group = { key: groupKey, title: groupTitle, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      });
      return groups;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Playlist Header */}
        <div style={{
          padding: '1.25rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          background: 'var(--card)'
        }}>
          <Link
            to="/dashboard?view=courses"
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ← Back to course
          </Link>
          <div style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: 'var(--foreground)',
            marginTop: '0.25rem'
          }}>
            Course Contents
          </div>
        </div>

        {/* Playlist Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem 0',
          background: 'var(--background)',
        }}>
          {getGroupedPlaylist().map((group) => {
            const isExpanded = !!expandedGroups[group.key];
            
            return (
              <div key={group.key} style={{ marginBottom: '0.25rem' }}>
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => {
                    setExpandedGroups(prev => ({
                      ...prev,
                      [group.key]: !prev[group.key]
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: 'var(--card)',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 750,
                    fontSize: '0.85rem',
                    color: 'var(--foreground)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 111, 143, 0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--card)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.95rem' }}>📁</span>
                    {group.title}
                  </span>
                  <span style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    fontSize: '0.7rem',
                    color: 'var(--muted-foreground)'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Group Items List */}
                <div style={{
                  maxHeight: isExpanded ? '1200px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.25s cubic-bezier(0, 1, 0, 1)',
                  background: 'rgba(0,0,0,0.015)'
                }}>
                  {group.items.map((item, idx) => {
                    const itemWId = item.weekId || item.id;
                    const isActive = itemWId === weekId;
                    
                    // Check completion state
                    const progressItem = allProgress.find(p => p.weekId === itemWId);
                    const isCompleted = progressItem?.videoComplete && 
                      (!(item.quiz?.questions?.length > 0) || progressItem?.quizPassed);

                    let displayNum = item.weekNumber;
                    let displayCat = 'Lecture';
                    if (String(itemWId).startsWith('rec-')) {
                      displayNum = 'R' + (idx + 1);
                      displayCat = 'Live Recording';
                    } else if (item.category === 'live') {
                      displayNum = 'L' + (idx + 1);
                      displayCat = 'Live Session';
                    } else {
                      displayNum = 'W' + item.weekNumber;
                    }

                    return (
                      <Link
                        key={itemWId}
                        to={`/learn/${courseId}/${itemWId}`}
                        onClick={() => isMobile && setShowPlaylistMobile(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.8rem 1.25rem',
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.02)',
                          position: 'relative',
                          background: isActive ? 'var(--card)' : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                        className="lesson-row-hover"
                      >
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            background: 'var(--primary)',
                            borderRadius: '0 4px 4px 0',
                          }} />
                        )}

                        {/* Status Icon */}
                        <div style={{
                          marginTop: '0.15rem',
                          fontSize: '0.95rem',
                          width: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isCompleted ? (
                            <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓</span>
                          ) : isActive ? (
                            <span style={{ color: 'var(--primary)' }}>●</span>
                          ) : (
                            <span style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>○</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: isActive ? 700 : 600,
                            color: isActive ? 'var(--primary)' : 'var(--foreground)',
                            lineHeight: 1.3,
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}>
                            {displayNum}: {item.title}
                          </span>
                          <span style={{
                            fontSize: '0.675rem',
                            color: 'var(--muted-foreground)',
                            fontWeight: 500,
                          }}>
                            {displayCat}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const shellStyle = {
    ...s.shell,
    gridTemplateColumns: isCompact ? '1fr' : '64px 260px minmax(0, 1fr)',
  };

  const sidebarStyle = {
    ...s.sidebar,
    minHeight: isCompact ? 'auto' : '100vh',
    height: isCompact ? 'auto' : '100vh',
    maxHeight: isCompact ? 'none' : '100vh',
    position: isCompact ? 'relative' : 'sticky',
    top: 0,
    alignSelf: isCompact ? 'stretch' : 'start',
    overflowX: 'hidden',
    overflowY: isCompact ? 'visible' : 'auto',
    padding: isCompact ? '1rem' : '1.5rem 0',
    alignItems: isCompact ? 'stretch' : 'center',
  };

  return (
    <div style={s.page}>
      <div style={shellStyle}>
        <aside style={sidebarStyle}>
          <div style={s.sidebarGlow} />

          <Link to="/dashboard" style={{
            ...s.brand,
            justifyContent: 'center',
            marginBottom: isCompact ? '1rem' : '2.5rem',
            gap: 0,
            width: isCompact ? 'auto' : '100%'
          }}>
            <div style={{ ...s.brandMark, margin: 0 }}>S</div>
          </Link>

          <div style={{
            ...s.navStack,
            alignItems: 'center',
            flexDirection: isCompact ? 'row' : 'column',
            justifyContent: isCompact ? 'center' : 'flex-start',
            flexWrap: isCompact ? 'wrap' : 'nowrap',
            gap: isCompact ? '0.75rem' : '0.5rem',
            width: '100%',
          }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={`/dashboard?view=${item.id}`}
                style={{
                  ...s.navButton,
                  justifyContent: 'center',
                  padding: '0.84rem 0',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  margin: '0 auto',
                  ...(item.id === 'courses' ? s.navButtonActive : {}),
                }}
                title={item.label}
              >
                {item.id === 'courses' && (
                  <span style={{
                    ...s.navActiveRail,
                    left: isCompact ? 0 : '-8px',
                    width: '3px',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}
                <span style={{ ...s.navButtonIcon, opacity: 1, margin: 0 }}>
                  <SidebarIcon kind={item.icon} />
                </span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Column 2: Playlist (Desktop only) */}
        {!isCompact && (
          <div style={s.playlist}>
            <PlaylistContent isMobile={false} />
          </div>
        )}

        {/* Column 3: Main content */}
        <div style={{ flex: 1, minWidth: 0, height: isCompact ? 'auto' : '100vh', overflowY: isCompact ? 'visible' : 'auto' }}>
          {/* Mobile Playlist Toggle Header */}
          {isCompact && (
            <div style={{
              background: 'var(--card)',
              borderBottom: '1px solid var(--border)',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Link to="/dashboard?view=courses" style={{ ...s.backLink, color: 'var(--primary)', fontWeight: 700 }}>
                ← Back to course
              </Link>
              <button
                onClick={() => setShowPlaylistMobile(true)}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                📋 Contents ({allWeeks.length})
              </button>
            </div>
          )}

          <div style={s.layout}>
            {/* Main Content Area */}
            <div style={s.main}>
              <div style={s.weekTitle}>{week.title}</div>
              <div style={s.weekDesc}>{week.description}</div>

              {videoId || videoUrl ? (
                <VideoPlayer
                  videoId={videoId}
                  videoUrl={videoUrl}
                  courseId={courseId}
                  weekId={weekId}
                  initialProgress={progress}
                  onVideoComplete={() => {
                    setVideoComplete(true);
                    setAllProgress(prev => {
                      const existing = prev.find(p => p.weekId === weekId);
                      if (existing) {
                        return prev.map(p => p.weekId === weekId ? { ...p, videoComplete: true } : p);
                      } else {
                        return [...prev, { weekId, videoComplete: true }];
                      }
                    });
                  }}
                  onQuizUnlock={() => setQuizUnlocked(true)}
                  onVideoEnded={() => {
                    if (!initiallyCompleteRef.current) {
                      setShowCompletionModal(true);
                    }
                  }}
                />
              ) : (
                <div style={s.noVideo}>No video has been attached yet.</div>
              )}

              {videoComplete && week.qaLink && (
                <div style={s.qaSection}>
                  <a href={week.qaLink} target="_blank" rel="noopener noreferrer" style={s.qaLink}>
                    Book your Q&amp;A session →
                  </a>
                </div>
              )}

              {/* Pill Tabs Bar */}
              <div style={s.tabBar}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{ ...s.tabBtn, ...(activeTab === 'overview' ? s.tabBtnActive : {}) }}
                >
                  Overview
                </button>
                {hasQuiz && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    style={{ ...s.tabBtn, ...(activeTab === 'quiz' ? s.tabBtnActive : {}) }}
                  >
                    Quiz {quizPassed && '✓'}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('transcript')}
                  style={{ ...s.tabBtn, ...(activeTab === 'transcript' ? s.tabBtnActive : {}) }}
                >
                  Transcript
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  style={{ ...s.tabBtn, ...(activeTab === 'qa' ? s.tabBtnActive : {}) }}
                >
                  Q&amp;A
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={s.tabContentCard}>
                    <div style={s.sidebarHeading}>Your progress</div>
                    <ProgressStep label="Watch video" done={videoComplete} active={!videoComplete} />
                    {hasQuiz ? (
                      <ProgressStep label="Pass quiz" done={quizPassed} active={quizUnlocked && !quizPassed} locked={!quizUnlocked} />
                    ) : (
                      <ProgressStep label="Quiz not required" done={videoComplete} locked={!videoComplete} />
                    )}
                    <ProgressStep label="Week complete" done={weekComplete} locked={!weekComplete} />
                  </div>

                  {week.resources && week.resources.length > 0 && (
                    <div style={s.tabContentCard}>
                      <div style={s.sidebarHeading}>Resources</div>
                      <div style={s.resourceList}>
                        {week.resources.map((r, i) => (
                          <a key={r.id || i} href={r.url} target="_blank" rel="noopener noreferrer" style={s.resourceLink}>
                            <span style={{ fontSize: '1.1rem' }}>📄</span>
                            {r.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {week.docs && week.docs.length > 0 && (
                    <div style={s.tabContentCard}>
                      <div style={s.sidebarHeading}>Reference Documents</div>
                      {week.docs.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={s.docLink}
                        >
                          <span style={{ fontSize: '0.9rem' }}>📄</span>
                          {doc.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && hasQuiz && (
                <div style={s.tabContentCard}>
                  <div style={{ ...s.sidebarHeading, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{quizPassed ? '✓' : !quizUnlocked ? '🔒' : '📝'}</span>
                    <span>Quiz</span>
                  </div>
                  {!quizUnlocked ? (
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                      Watch at least 80% of the video to unlock the quiz.
                    </p>
                  ) : (
                    <QuizComponent
                      courseId={courseId}
                      weekId={weekId}
                      questions={week.quiz?.questions || []}
                      initialPassed={quizPassed}
                      onQuizPassed={() => {
                        setQuizPassed(true);
                        setAllProgress(prev => {
                          const existing = prev.find(p => p.weekId === weekId);
                          if (existing) {
                            return prev.map(p => p.weekId === weekId ? { ...p, quizPassed: true, videoComplete: true } : p);
                          } else {
                            return [...prev, { weekId, quizPassed: true, videoComplete: true }];
                          }
                        });
                      }}
                    />
                  )}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div style={s.tabContentCard}>
                  {week.transcript ? (
                    <div style={{ color: 'var(--foreground)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {week.transcript}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                      No transcript for this lesson.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div style={s.qaCard}>
                  <div style={s.sidebarHeading}>Questions &amp; Answers</div>
                  <div style={s.qaInputContainer}>
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      style={s.qaInput}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostQuestion()}
                    />
                    <button style={s.qaPostBtn} onClick={handlePostQuestion}>Post</button>
                  </div>

                  <div style={s.commentList}>
                    {questionsList.length > 0 ? (
                      questionsList.map((q) => (
                        <div key={q.id} style={s.commentItem}>
                          <div style={s.commentHeader}>
                            <span>{q.author}</span>
                            <span>{q.date}</span>
                          </div>
                          <div style={s.commentText}>{q.text}</div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: 0 }}>
                        No questions yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Next Lesson Navigation Button */}
              {(() => {
                const currentIdx = allWeeks.findIndex((w) => (w.weekId || w.id) === weekId);
                const nextWeek = currentIdx !== -1 && currentIdx < allWeeks.length - 1 ? allWeeks[currentIdx + 1] : null;
                if (!nextWeek) return null;
                return (
                  <div style={s.nextBtnContainer}>
                    <Link to={`/learn/${courseId}/${nextWeek.weekId || nextWeek.id}`} style={s.nextBtn}>
                      Next lesson →
                    </Link>
                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Playlist Drawer Overlay */}
      {isCompact && showPlaylistMobile && (
        <div style={s.mobilePlaylistOverlay} onClick={() => setShowPlaylistMobile(false)}>
          <div style={s.mobilePlaylistContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1rem 0 0' }}>
              <button
                onClick={() => setShowPlaylistMobile(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)'
                }}
              >
                ✕
              </button>
            </div>
            <PlaylistContent isMobile={true} />
          </div>
        </div>
      )}

      {showCompletionModal && (
        <div style={s.modalOverlay} className="modal-overlay-animate">
          <div style={s.modalCard} className="modal-card-animate">
            <div style={s.modalIconContainer}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="var(--primary)" strokeWidth="2.5" fill="none" />
                <path d="M8 12L11 15L16 9" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <h3 style={s.modalTitle}>Nice work!</h3>
            
            {hasQuiz && (
              <button
                style={s.modalPrimaryBtn}
                className="modal-btn-primary"
                onClick={() => {
                  setShowCompletionModal(false);
                  setActiveTab('quiz');
                }}
              >
                Take the quiz
              </button>
            )}
            
            {(() => {
              const currentIdx = allWeeks.findIndex((w) => (w.weekId || w.id) === weekId);
              const nextWeek = currentIdx !== -1 && currentIdx < allWeeks.length - 1 ? allWeeks[currentIdx + 1] : null;
              if (!nextWeek) return null;
              return (
                <button
                  style={s.modalSecondaryBtn}
                  className="modal-btn-secondary"
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate(`/learn/${courseId}/${nextWeek.weekId || nextWeek.id}`);
                  }}
                >
                  Next lesson
                </button>
              );
            })()}
            
            <button
              style={s.modalTextBtn}
              className="modal-btn-text"
              onClick={() => {
                setShowCompletionModal(false);
                navigate('/dashboard?view=courses');
              }}
            >
              Back to course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
