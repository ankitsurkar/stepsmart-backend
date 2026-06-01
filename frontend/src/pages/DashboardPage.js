import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, getCourseWeeks, getProgress } from '../utils/api';
import AssignmentUpload from '../components/AssignmentUpload';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'courses', label: 'Courses', icon: 'book' },
  { id: 'cohort', label: 'Cohort', icon: 'users' },
  { id: 'scheduling', label: 'Sessions', icon: 'clock' },
  { id: 'assignments', label: 'Assignments', icon: 'clipboard' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'settings', label: 'Profile', icon: 'settings' },
];

function getInitialDashboardView(searchParams) {
  const requestedView = searchParams.get('view');
  return NAV_ITEMS.some((item) => item.id === requestedView) ? requestedView : 'dashboard';
}

const BADGE = {
  complete:     { label: 'Complete',    bg: 'var(--success-light)', color: 'var(--success-fg)' },
  'quiz-ready': { label: 'Take Quiz',   bg: 'hsl(38, 92%, 90%)',    color: 'hsl(32, 81%, 29%)' },
  'in-progress':{ label: 'In Progress', bg: 'var(--accent)',        color: 'var(--accent-foreground)' },
  'not-started':{ label: 'Not Started', bg: 'var(--muted)',         color: 'var(--muted-foreground)' },
};

const DEFAULT_CALENDAR_EVENTS = [
  {
    id: 'week-5-recorded-videos',
    weekNumber: 5,
    startDate: '2026-04-13',
    endDate: '2026-04-17',
    kind: 'Recorded Video Upload',
    title: 'Week 5 recordings',
    description: 'Recorded lessons will be uploaded inside Course Videos.',
  },
  {
    id: 'week-5-course-module',
    weekNumber: 5,
    startDate: '2026-04-18',
    kind: 'Course Module',
    title: 'Solution Space, Ideation, Prioritization',
    description: 'Saturday is reserved for the Week 5 course module from the roadmap.',
  },
  {
    id: 'week-5-interview-module',
    weekNumber: 5,
    startDate: '2026-04-19',
    kind: 'Interview Module',
    title: 'Product Strategy',
    description: 'Sunday is reserved for the Week 5 interview module from the roadmap.',
  },
];

const CALENDAR_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, hsl(214, 100%, 98%) 0%, hsl(205, 78%, 97%) 100%)',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--muted-foreground)',
    fontSize: '0.95rem',
  },
  error: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--destructive)',
    fontSize: '0.95rem',
  },
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
  sidebarSection: { position: 'relative', marginTop: 'auto' },
  sidebarDivider: {
    borderTop: '1px solid rgba(255,255,255,0.22)',
    marginTop: '0.9rem',
    marginBottom: '1.1rem',
  },
  sidebarLabel: {
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.62)',
    marginBottom: '0.75rem',
    fontWeight: 600,
  },
  sidebarCard: {
    padding: '1rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.16)',
    color: '#fff',
    marginBottom: '0.9rem',
  },
  sidebarCardTitle: { fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.3rem' },
  sidebarCardMeta: { color: 'rgba(255,255,255,0.72)', fontSize: '0.8125rem', lineHeight: 1.5 },
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
  },
  main: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  headerEyebrow: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: '0.55rem',
  },
  headerTitle: {
    fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--foreground)',
    marginBottom: '0.35rem',
  },
  headerSub: {
    color: 'var(--muted-foreground)',
    fontSize: '1rem',
    lineHeight: 1.5,
    maxWidth: '780px',
  },
  profileWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  profileAvatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '3px solid #2a9abf',
    background: '#e9f6fb',
    color: '#2f4657',
    fontSize: '2rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
  },
  profileName: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.1,
    marginBottom: '0.2rem',
  },
  profileDate: {
    color: '#475569',
    fontSize: '1rem',
    fontWeight: 400,
  },
  bellWrap: {
    marginLeft: '0.35rem',
    width: '28px',
    height: '28px',
    position: 'relative',
    color: '#334155',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    right: '3px',
    top: '3px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#dc2626',
    border: '2px solid #f8fafc',
  },
  courseTabs: { display: 'flex', flexWrap: 'wrap', gap: '0.6rem' },
  courseTab: {
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.76)',
    color: 'var(--muted-foreground)',
    borderRadius: '999px',
    padding: '0.65rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
  },
  courseTabActive: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: '#fff',
    boxShadow: 'var(--shadow-sm)',
  },
  overviewGrid: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  dashboardLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  dashboardMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  dashboardHero: {
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'minmax(0, 1fr) 340px',
    alignItems: 'start',
  },
  dashboardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  dashboardRight: {
    background: '#ffffff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '22px',
    padding: '1.1rem',
    boxShadow: '0 10px 26px rgba(15, 40, 80, 0.09)',
    position: 'sticky',
    top: '1.25rem',
  },
  metricCards: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  ringCard: {
    background: '#fff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '20px',
    padding: '1.2rem',
    minHeight: '172px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 8px 20px rgba(15, 40, 80, 0.06)',
  },
  ringCardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
  },
  ringWrap: {
    width: '112px',
    height: '112px',
    position: 'relative',
    flexShrink: 0,
  },
  ringSvg: {
    width: '112px',
    height: '112px',
    transform: 'rotate(-90deg)',
  },
  ringValue: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#0f172a',
  },
  ringText: {
    fontSize: '1.75rem',
    lineHeight: 1.1,
    fontWeight: 700,
    color: '#0f172a',
  },
  ringLabel: {
    fontSize: '1.75rem',
    lineHeight: 1.1,
    fontWeight: 700,
    color: '#0f172a',
  },
  ringSub: {
    color: '#334155',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  scoreCard: {
    background: '#fff',
    border: '1px solid rgba(20, 49, 86, 0.08)',
    borderRadius: '20px',
    padding: '1.2rem',
    minHeight: '172px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(15, 40, 80, 0.06)',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem',
    marginBottom: '0.3rem',
  },
  scoreValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1,
    color: '#0f172a',
  },
  scoreLabel: {
    textAlign: 'center',
    color: '#111827',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  continueCard: {
    background: 'linear-gradient(180deg, #f4fbff 0%, #f5fbff 100%)',
    border: '1px solid rgba(20, 49, 86, 0.11)',
    borderRadius: '22px',
    padding: '1.5rem',
    boxShadow: '0 10px 26px rgba(15, 40, 80, 0.08)',
  },
  activeCourse: {
    color: '#1f2937',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    marginBottom: '0.9rem',
  },
  continueTitle: {
    color: '#0f172a',
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
  },
  segmentedTrack: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: '0.32rem',
    marginBottom: '1.1rem',
  },
  segmentedBar: {
    height: '10px',
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
    borderRadius: '14px',
    padding: '0.88rem 1.3rem',
    background: 'linear-gradient(180deg, #1388b0 0%, #0f789e 100%)',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },
  upNext: {
    marginTop: '0.9rem',
    color: '#334155',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  railHeaderTitle: {
    color: '#111827',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  railHeaderSub: {
    color: '#334155',
    fontSize: '0.8125rem',
    lineHeight: 1.4,
    marginBottom: '1rem',
  },
  rankCard: {
    background: '#ecf9ff',
    border: '1px solid rgba(20, 49, 86, 0.1)',
    borderRadius: '14px',
    padding: '0.8rem',
    marginBottom: '0.9rem',
  },
  rankLabel: {
    color: '#2f4455',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    marginBottom: '0.35rem',
  },
  rankRow: {
    display: 'grid',
    gridTemplateColumns: '52px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '0.55rem',
  },
  rankAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #d4ecf6',
    background: '#f8fafc',
    color: '#1f2937',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.05rem',
  },
  rankName: {
    color: '#111827',
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.3,
  },
  rankNoLabel: {
    color: '#1f2937',
    fontSize: '0.8125rem',
    fontWeight: 400,
    letterSpacing: '0.02em',
    textAlign: 'right',
  },
  rankNo: {
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1,
    textAlign: 'right',
  },
  railList: {
    display: 'flex',
    flexDirection: 'column',
  },
  railRow: {
    display: 'grid',
    gridTemplateColumns: '52px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '0.55rem',
    padding: '0.8rem 0',
    borderBottom: '1px solid rgba(20, 49, 86, 0.09)',
  },
  railAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#e7edf1',
    border: '3px solid #dbe6ec',
    color: '#335166',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.15rem',
    fontWeight: 800,
  },
  railName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#0f172a',
    marginBottom: '0.08rem',
    lineHeight: 1.2,
  },
  railMeta: {
    fontSize: '0.8125rem',
    color: '#334155',
    fontWeight: 400,
  },
  railScoreValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1,
    color: '#0f172a',
    textAlign: 'right',
  },
  railScoreLabel: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: '#334155',
    textAlign: 'right',
    letterSpacing: '0.04em',
  },
  statsGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  card: {
    background: 'rgba(255,255,255,0.88)',
    border: '1px solid rgba(15, 40, 80, 0.08)',
    borderRadius: '22px',
    padding: '1.25rem',
    boxShadow: '0 10px 28px rgba(15, 40, 80, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  statCard: {
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statTop: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem',
  },
  statLabel: {
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 'normal',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--foreground)',
    marginTop: '0.55rem',
  },
  statFoot: { color: 'var(--muted-foreground)', fontSize: '0.875rem' },
  progressRail: {
    width: '100%',
    height: '4px',
    background: 'var(--muted)',
    borderRadius: '999px',
    overflow: 'hidden',
    marginTop: '1rem',
  },
  sectionGrid: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--foreground)',
    letterSpacing: 'normal',
  },
  sectionMeta: { color: 'var(--muted-foreground)', fontSize: '0.8125rem' },
  panelHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  leaderboardList: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  leaderboardRow: {
    display: 'grid',
    gridTemplateColumns: '52px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.95rem 1rem',
    borderRadius: '18px',
    background: 'var(--background)',
    border: '1px solid rgba(15, 40, 80, 0.06)',
  },
  leaderboardCurrent: {
    background: 'linear-gradient(135deg, rgba(72, 153, 194, 0.12) 0%, rgba(72, 153, 194, 0.04) 100%)',
    borderColor: 'rgba(72, 153, 194, 0.24)',
  },
  leaderboardRank: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    background: 'var(--accent)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
  },
  leaderboardName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--foreground)',
    marginBottom: '0.2rem',
  },
  leaderboardMeta: { color: 'var(--muted-foreground)', fontSize: '0.8125rem' },
  leaderboardPoints: { textAlign: 'right' },
  leaderboardPointsValue: { fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' },
  leaderboardPointsLabel: {
    fontSize: '0.8125rem',
    textTransform: 'none',
    letterSpacing: 'normal',
    color: 'var(--muted-foreground)',
    fontWeight: 400,
  },
  focusList: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  focusItem: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    padding: '1rem',
    borderRadius: '18px',
    background: 'var(--background)',
    border: '1px solid rgba(15, 40, 80, 0.06)',
  },
  focusTitle: { fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.28rem' },
  focusMeta: { color: 'var(--muted-foreground)', fontSize: '0.8125rem', lineHeight: 1.5 },
  focusCta: {
    display: 'inline-flex',
    marginTop: '0.7rem',
    color: 'var(--primary)',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  calendarShell: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  calendarScroller: {
    overflowX: 'auto',
    paddingBottom: '0.35rem',
  },
  calendarBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  calendarToolbar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  calendarControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  calendarNavButton: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    border: '1px solid rgba(15, 40, 80, 0.08)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    fontSize: '1.15rem',
    fontWeight: 800,
    cursor: 'pointer',
  },
  calendarTodayButton: {
    border: '1px solid rgba(15, 40, 80, 0.08)',
    borderRadius: '12px',
    background: 'var(--background)',
    color: 'var(--foreground)',
    padding: '0.75rem 1rem',
    fontSize: '0.84rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  calendarMonthLabel: {
    minWidth: '180px',
    textAlign: 'center',
    fontSize: '1.02rem',
    fontWeight: 800,
    color: 'var(--foreground)',
  },
  calendarWeekdayRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.6rem',
    marginBottom: '0.75rem',
  },
  calendarWeekday: {
    textAlign: 'center',
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--muted-foreground)',
  },
  calendarMonthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.5rem',
  },
  calendarCell: {
    minHeight: '116px',
    borderRadius: '18px',
    border: '1px solid rgba(15, 40, 80, 0.08)',
    background: 'var(--background)',
    padding: '0.65rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.42rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
  },
  calendarCellMuted: {
    opacity: 0.46,
  },
  calendarCellSelected: {
    borderColor: 'rgba(72, 153, 194, 0.32)',
    boxShadow: '0 12px 24px rgba(72, 153, 194, 0.14)',
  },
  calendarCellToday: {
    background: 'linear-gradient(180deg, rgba(72, 153, 194, 0.08) 0%, rgba(255,255,255,0.98) 100%)',
  },
  calendarCellTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  calendarDayNumber: {
    width: '34px',
    height: '34px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--foreground)',
    fontSize: '0.94rem',
    fontWeight: 800,
  },
  calendarDayNumberSelected: {
    background: 'var(--primary)',
    color: '#fff',
  },
  calendarDayNumberToday: {
    background: 'var(--accent)',
    color: 'var(--accent-foreground)',
  },
  calendarCellCount: {
    color: 'var(--muted-foreground)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  calendarCellEvents: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.28rem',
  },
  calendarChip: {
    padding: '0.28rem 0.42rem',
    borderRadius: '10px',
    fontSize: '0.66rem',
    fontWeight: 700,
    lineHeight: 1.25,
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'clip',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  calendarChipMore: {
    color: 'var(--muted-foreground)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  calendarDetailsHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.32rem',
    marginBottom: '1rem',
  },
  calendarDetailsDate: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--foreground)',
    letterSpacing: '-0.02em',
  },
  calendarDetailsMeta: {
    color: 'var(--muted-foreground)',
    fontSize: '0.9rem',
    lineHeight: 1.55,
  },
  calendarAgendaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  calendarAgendaItem: {
    padding: '1rem',
    borderRadius: '18px',
    background: 'var(--background)',
    border: '1px solid rgba(15, 40, 80, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  calendarAgendaTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  calendarAgendaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.34rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.76rem',
    fontWeight: 700,
  },
  calendarAgendaWeek: {
    color: 'var(--muted-foreground)',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  calendarAgendaTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--foreground)',
  },
  calendarAgendaText: {
    color: 'var(--muted-foreground)',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },
  calendarAgendaRange: {
    color: 'var(--muted-foreground)',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  snapshotRows: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  snapshotRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    paddingBottom: '0.85rem',
    borderBottom: '1px solid rgba(15, 40, 80, 0.08)',
  },
  snapshotLabel: { color: 'var(--muted-foreground)', fontSize: '0.86rem', fontWeight: 700 },
  snapshotValue: { color: 'var(--foreground)', fontSize: '0.95rem', fontWeight: 700, textAlign: 'right' },
  primaryAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '12px',
    background: 'var(--primary)',
    color: '#fff',
    padding: '0.85rem 1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    marginTop: '1rem',
  },
  accordionList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  weekGroupCard: {
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(15, 40, 80, 0.08)',
    borderRadius: '22px',
    boxShadow: '0 10px 28px rgba(15, 40, 80, 0.07)',
    overflow: 'hidden',
  },
  weekGroupHeader: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    padding: '1.15rem 1.25rem',
    cursor: 'pointer',
    textAlign: 'left',
  },
  weekGroupTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '0.85rem',
  },
  weekGroupLabel: { fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' },
  weekGroupMeta: { color: 'var(--muted-foreground)', fontSize: '0.87rem' },
  weekGroupRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  weekGroupCount: {
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    background: 'var(--accent)',
    color: 'var(--accent-foreground)',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  weekGroupToggle: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'var(--background)',
    border: '1px solid rgba(15, 40, 80, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
    fontWeight: 800,
  },
  weekGroupBody: {
    padding: '0.5rem 1.25rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  lessonCard: {
    display: 'grid',
    gridTemplateColumns: '24px minmax(0, 1fr) auto',
    gap: '1rem',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    padding: '0.75rem 0.75rem',
    borderRadius: '12px',
    background: 'transparent',
    border: 'none',
  },
  lessonNumber: {
    width: '78px',
    height: '54px',
    borderRadius: '16px',
    background: 'var(--accent)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem',
  },
  lessonInfo: { minWidth: 0 },
  lessonTitle: { fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.2rem' },
  lessonDesc: { fontSize: '0.8125rem', color: 'var(--muted-foreground)', lineHeight: 1.55 },
  lessonProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.8rem',
  },
  lessonProgressValue: { fontSize: '0.8125rem', color: 'var(--muted-foreground)', fontWeight: 400 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: 'normal',
    whiteSpace: 'nowrap',
  },
  empty: {
    color: 'var(--muted-foreground)',
    fontSize: '0.94rem',
    lineHeight: 1.6,
  },
  mutedAction: {
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  settingsField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  settingsLabel: {
    color: 'var(--muted-foreground)',
    fontSize: '0.8125rem',
    fontWeight: 400,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  settingsInput: {
    width: '100%',
    borderRadius: '14px',
    border: '1px solid rgba(15, 40, 80, 0.12)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    padding: '0.9rem 1rem',
    fontSize: '0.98rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  settingsHelp: {
    color: 'var(--muted-foreground)',
    fontSize: '0.86rem',
    lineHeight: 1.55,
  },
  settingsActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  settingsMessage: {
    color: 'var(--muted-foreground)',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
};

function hasQuiz(week) {
  return (week?.quiz?.questions || []).length > 0;
}

function weekStatus(week, progress) {
  if (!progress) return 'not-started';
  if (progress.quizPassed) return 'complete';
  if (progress.videoComplete) return hasQuiz(week) ? 'quiz-ready' : 'complete';
  if (progress.watchedSegments?.length > 0) return 'in-progress';
  return 'not-started';
}

function getLessonProgressPercent(week, progress) {
  if (!progress) return 0;
  if (progress.quizPassed || progress.videoComplete) return 100;
  const watched = progress.watchedSegments?.length || 0;
  const total = progress.duration ? Math.ceil(progress.duration / 10) : 0;
  if (!total) return watched > 0 ? 10 : 0;
  return Math.min(Math.round((watched / total) * 100), 100);
}

function buildWeekGroups(weeks) {
  const groups = new Map();

  weeks
    .filter((week) => week.weekId !== '__supplemental__')
    .forEach((week) => {
      const numericWeek = Number(week.weekNumber);
      const groupNumber = Number.isFinite(numericWeek) && numericWeek > 0
        ? Math.floor(numericWeek)
        : groups.size + 1;

      if (!groups.has(groupNumber)) {
        groups.set(groupNumber, {
          groupNumber,
          lessons: [],
        });
      }

      const group = groups.get(groupNumber);
      const lessonNumber = `${groupNumber}.${group.lessons.length + 1}`;
      group.lessons.push({ ...week, displayWeekNumber: lessonNumber });
    });

  return [...groups.values()].sort((a, b) => a.groupNumber - b.groupNumber);
}

function buildRecordedSessionGroups(weeks) {
  const groups = new Map();
  const sortedWeeks = [...weeks].sort((a, b) => {
    if (a.weekId === '__supplemental__') return 1;
    if (b.weekId === '__supplemental__') return -1;
    return (a.weekNumber || 0) - (b.weekNumber || 0);
  });

  sortedWeeks.forEach((week) => {
    const isSupp = week.weekId === '__supplemental__';
    const groupNumber = isSupp ? 'Supplemental' : (
      Number.isFinite(Number(week.weekNumber)) && Number(week.weekNumber) > 0
        ? Math.floor(Number(week.weekNumber))
        : groups.size + 1
    );

    if (!groups.has(groupNumber)) {
      groups.set(groupNumber, {
        groupNumber,
        sessions: [],
      });
    }

    const group = groups.get(groupNumber);
    (week.liveRecordedSessions || []).forEach((session) => {
      const sessionNumber = isSupp 
        ? `S.${group.sessions.length + 1}` 
        : `${groupNumber}.${group.sessions.length + 1}`;
      group.sessions.push({
        ...session,
        courseId: week.courseId,
        sourceWeekId: week.weekId,
        sourceTitle: week.title,
        displaySessionNumber: sessionNumber,
      });
    });
  });

  return [...groups.values()].filter((g) => g.sessions.length > 0);
}

function buildAssignments(weeks) {
  const sortedWeeks = [...weeks].sort((a, b) => {
    if (a.weekId === '__supplemental__') return 1;
    if (b.weekId === '__supplemental__') return -1;
    return (a.weekNumber || 0) - (b.weekNumber || 0);
  });
  let assignmentNumber = 0;

  return sortedWeeks.flatMap((week) =>
    (week.assignments || []).map((assignment, index) => {
      assignmentNumber += 1;
      return {
        id: assignment.id || `assignment-${week.weekId}-${index + 1}`,
        courseId: week.courseId,
        weekId: week.weekId,
        weekNumber: week.weekNumber,
        weekTitle: week.title,
        assignmentNumber,
        title: (assignment.title || '').trim(),
        description: (assignment.description || '').trim(),
      };
    }),
  );
}

function getDisplayName(user) {
  if (user?.profileName?.trim()) return user.profileName.trim();
  if (user?.name?.trim()) return user.name.trim();
  const loginId = user?.signInDetails?.loginId || '';
  if (loginId.includes('@')) return loginId.split('@')[0];
  if (loginId) return loginId;
  if (user?.username?.includes('@')) return user.username.split('@')[0];
  return user?.username || 'Student';
}

function formatDateLabel() {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(new Date());
  } catch {
    return 'Today';
  }
}

function getInitials(name) {
  const value = (name || '').trim();
  if (!value) return 'S';
  const tokens = value.split(/\s+/).filter(Boolean);
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0] || ''}${tokens[tokens.length - 1][0] || ''}`.toUpperCase();
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addDaysToDate(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDate(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function formatMonthLabel(date) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function formatCalendarLongDate(date) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function formatCalendarShortDate(date) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return '';
  }
}

function formatCalendarRange(startDate, endDate) {
  if (!startDate) return '';
  if (!endDate || isSameDate(startDate, endDate)) return formatCalendarLongDate(startDate);
  return `${formatCalendarShortDate(startDate)} - ${formatCalendarShortDate(endDate)}`;
}

function getCalendarKindPalette(kind) {
  const normalized = (kind || '').toLowerCase();

  if (normalized.includes('interview')) {
    return {
      bg: 'hsl(38, 92%, 90%)',
      color: 'hsl(32, 81%, 29%)',
    };
  }

  if (normalized.includes('course')) {
    return {
      bg: 'hsl(195, 83%, 92%)',
      color: 'var(--primary)',
    };
  }

  return {
    bg: 'var(--accent)',
    color: 'var(--accent-foreground)',
  };
}

function buildCalendarEventDefinitions(weeks) {
  const weekEvents = [...weeks]
    .sort((a, b) => {
      if (a.weekId === '__supplemental__') return 1;
      if (b.weekId === '__supplemental__') return -1;
      return (a.weekNumber || 0) - (b.weekNumber || 0);
    })
    .flatMap((week) => {
      const numericWeek = Number(week.weekNumber);
      const weekLabel = Number.isFinite(numericWeek) && numericWeek > 0
        ? `Week ${Math.floor(numericWeek)}`
        : null;

      return (week.calendarEvents || []).map((event, index) => ({
        ...event,
        id: event.id || `calendar-${week.weekId}-${index + 1}`,
        kind: event.kind || 'Course Event',
        title: event.title || week.title || 'Course Event',
        description: event.description || '',
        startDate: event.startDate || '',
        endDate: event.endDate || event.startDate || '',
        weekLabel,
        sourceWeekId: week.weekId,
      }));
    })
    .filter((event) => event.startDate);

  const events = weekEvents.length > 0
    ? weekEvents
    : DEFAULT_CALENDAR_EVENTS.map((event) => ({
      ...event,
      endDate: event.endDate || event.startDate,
      weekLabel: event.weekNumber ? `Week ${Math.floor(Number(event.weekNumber))}` : null,
      isFallback: true,
    }));

  return events.sort((a, b) => (
    (a.startDate || '').localeCompare(b.startDate || '')
    || (a.endDate || '').localeCompare(b.endDate || '')
    || (a.title || '').localeCompare(b.title || '')
  ));
}

function expandCalendarEntries(eventDefinitions) {
  const entries = [];

  eventDefinitions.forEach((event) => {
    const startDate = parseDateKey(event.startDate);
    if (!startDate) return;

    const requestedEndDate = parseDateKey(event.endDate || event.startDate) || startDate;
    const endDate = requestedEndDate.getTime() >= startDate.getTime()
      ? requestedEndDate
      : startDate;
    const rangeLabel = formatCalendarRange(startDate, endDate);

    for (
      let cursor = startDate;
      cursor.getTime() <= endDate.getTime();
      cursor = addDaysToDate(cursor, 1)
    ) {
      entries.push({
        ...event,
        dateKey: toDateKey(cursor),
        fullDate: formatCalendarLongDate(cursor),
        rangeLabel,
        palette: getCalendarKindPalette(event.kind),
      });
    }
  });

  return entries.sort((a, b) => (
    a.dateKey.localeCompare(b.dateKey)
    || (a.title || '').localeCompare(b.title || '')
  ));
}

function buildCalendarEntriesByDate(entries) {
  return entries.reduce((map, entry) => {
    if (!map[entry.dateKey]) map[entry.dateKey] = [];
    map[entry.dateKey].push(entry);
    return map;
  }, {});
}

function buildCalendarGridDays(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const gridStart = addDaysToDate(monthStart, -monthStart.getDay());
  return Array.from({ length: 42 }, (_, index) => addDaysToDate(gridStart, index));
}

function LessonStatusBadge({ status, percent }) {
  if (status === 'complete') {
    return (
      <span
        style={{
          ...s.badge,
          background: 'var(--success-light)',
          color: 'var(--success-fg)',
          border: '1px solid rgba(25, 135, 84, 0.12)',
        }}
      >
        Complete
      </span>
    );
  }
  if (status === 'quiz-ready') {
    return (
      <span
        style={{
          ...s.badge,
          background: 'hsl(38, 92%, 94%)',
          color: 'hsl(32, 81%, 29%)',
          border: '1px solid rgba(220, 150, 30, 0.12)',
        }}
      >
        Take Quiz
      </span>
    );
  }
  if (status === 'in-progress' || percent > 0) {
    return (
      <span
        style={{
          ...s.badge,
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
          border: '1px solid rgba(0, 111, 143, 0.12)',
        }}
      >
        {percent}% complete
      </span>
    );
  }
  return (
    <span
      style={{
        ...s.badge,
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
        border: '1px solid rgba(15, 40, 80, 0.05)',
      }}
    >
      Not Started
    </span>
  );
}

function LessonIcon({ status }) {
  if (status === 'complete') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" stroke="var(--success)" strokeWidth="2" fill="var(--success-light)" />
        <path
          d="M9 12L11 14L15 10"
          stroke="var(--success)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === 'in-progress' || status === 'quiz-ready') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" stroke="var(--primary)" strokeWidth="2" fill="transparent" />
        <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="var(--primary)" />
      </svg>
    );
  }
  // Not started
  return (
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid rgba(15, 40, 80, 0.25)',
        background: 'transparent',
        flexShrink: 0,
      }}
    />
  );
}

function StatusBadge({ status }) {
  const { label, bg, color } = BADGE[status] || BADGE['not-started'];
  return <span style={{ ...s.badge, background: bg, color }}>{label}</span>;
}

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

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18H5a1 1 0 0 1-.8-1.6c1-1.4 1.8-3.2 1.8-5V9a6 6 0 1 1 12 0v2.8c0 1.8.7 3.6 1.7 5a1 1 0 0 1-.8 1.6h-4" />
      <path d="M9.5 18a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M5 6H3v2a3 3 0 0 0 3 3h1" />
      <path d="M19 6h2v2a3 3 0 0 1-3 3h-1" />
      <path d="M9.5 11.5a4.7 4.7 0 0 0 5 0" />
    </svg>
  );
}

function ProgressTrack({ percent, color, compact }) {
  return (
    <div style={{ ...s.progressRail, marginTop: compact ? 0 : s.progressRail.marginTop }}>
      <div
        style={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: '999px',
          background: color || 'var(--primary)',
          transition: 'width 0.35s ease',
        }}
      />
    </div>
  );
}

function RingMetricCard({ value, label, sublabel, percent, ringColor, trackColor }) {
  const safePercent = Math.max(0, Math.min(percent || 0, 100));
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safePercent / 100);

  return (
    <div style={s.ringCard}>
      <div style={s.ringCardTop}>
        <div style={s.ringWrap}>
          <svg style={s.ringSvg} viewBox="0 0 112 112">
            <circle cx="56" cy="56" r={radius} stroke={trackColor} strokeWidth="11" fill="none" />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke={ringColor}
              strokeWidth="11"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
          </svg>
          <div style={s.ringValue}>{value}</div>
        </div>
        <div style={s.ringSub}>{label}</div>
      </div>
      <div style={s.ringSub}>{sublabel}</div>
    </div>
  );
}

function DashboardLeaderboard({ me, rows, displayName, isCompact }) {
  const current = me || null;

  return (
    <div style={{ ...s.dashboardRight, position: isCompact ? 'static' : s.dashboardRight.position }}>
      <div style={s.railHeaderTitle}>Cohort Leaderboard</div>
      <div style={s.railHeaderSub}>Track your performance against the cohort.</div>

      <div style={s.rankCard}>
        <div style={s.rankLabel}>YOUR RANK</div>
        <div style={s.rankRow}>
          <div style={s.rankAvatar}>{getInitials(current?.displayName || displayName)}</div>
          <div style={s.rankName}>{current?.displayName || displayName}</div>
          <div>
            <div style={s.rankNoLabel}>RANK</div>
            <div style={s.rankNo}>#{current?.rank || '-'}</div>
          </div>
        </div>
      </div>

      <div style={s.railList}>
        {rows.map((entry) => (
          <div key={entry.userId} style={s.railRow}>
            <div style={s.railAvatar}>{getInitials(entry.displayName)}</div>
            <div>
              <div style={s.railName}>{entry.displayName}</div>
              <div style={s.railMeta}>
                {entry.completedLectures} L / {entry.assignmentsSubmitted} A
              </div>
            </div>
            <div>
              <div style={s.railScoreValue}>{entry.totalPoints}</div>
              <div style={s.railScoreLabel}>SCORE</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, accent, progress, progressColor }) {
  return (
    <div style={{ ...s.card, ...s.statCard }}>
      <div>
        <div style={s.statTop}>
          <div style={{ ...s.statIcon, background: `${accent}18`, color: accent }}>●</div>
          <div style={s.statLabel}>{label}</div>
        </div>
        <div style={s.statValue}>{value}</div>
      </div>

      <div>
        <div style={s.statFoot}>{detail}</div>
        {typeof progress === 'number' && (
          <ProgressTrack percent={progress} color={progressColor || accent} />
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry }) {
  return (
    <div style={{ ...s.leaderboardRow, ...(entry.isCurrentUser ? s.leaderboardCurrent : {}) }}>
      <div style={s.leaderboardRank}>#{entry.rank}</div>

      <div style={{ minWidth: 0 }}>
        <div style={s.leaderboardName}>{entry.displayName}</div>
        <div style={s.leaderboardMeta}>
          {entry.completedLectures} lesson{entry.completedLectures === 1 ? '' : 's'} complete
          {' • '}
          {entry.assignmentsSubmitted} assignment{entry.assignmentsSubmitted === 1 ? '' : 's'} submitted
        </div>
      </div>

      <div style={s.leaderboardPoints}>
        <div style={s.leaderboardPointsValue}>{entry.totalPoints}</div>
        <div style={s.leaderboardPointsLabel}>Points</div>
      </div>
    </div>
  );
}

function FocusItem({ item }) {
  const content = (
    <>
      <div style={s.focusTitle}>{item.title}</div>
      <div style={s.focusMeta}>{item.subtitle}</div>
      <span style={s.focusCta}>{item.cta}</span>
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" style={s.focusItem}>
        {content}
      </a>
    );
  }

  return (
    <Link to={item.to} style={s.focusItem}>
      {content}
    </Link>
  );
}

function RecordedSessionCard({ session, isCompact }) {
  const isPlayable = !!session.url;

  const content = (
    <>
      <LessonIcon status={isPlayable ? 'in-progress' : 'not-started'} />

      <div style={s.lessonInfo}>
        <div style={s.lessonTitle}>
          {session.displaySessionNumber} {session.title || `${session.sourceTitle} Recording`}
        </div>
        <div style={s.lessonDesc}>
          {session.description || `Recorded session for ${session.sourceTitle}`}
        </div>
      </div>

      <div style={{ justifySelf: 'end' }}>
        <span
          style={{
            ...s.badge,
            background: isPlayable ? 'var(--accent)' : 'var(--muted)',
            color: isPlayable ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
            border: isPlayable ? '1px solid rgba(0, 111, 143, 0.12)' : '1px solid rgba(15, 40, 80, 0.05)',
          }}
        >
          {isPlayable ? 'Watch Video' : 'Coming Soon'}
        </span>
      </div>
    </>
  );

  if (!isPlayable) {
    return (
      <div
        style={{
          ...s.lessonCard,
          gridTemplateColumns: isCompact ? '24px 1fr auto' : s.lessonCard.gridTemplateColumns,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/learn/${session.courseId}/${session.id}`}
      className="lesson-row-hover"
      style={{
        ...s.lessonCard,
        gridTemplateColumns: isCompact ? '24px 1fr auto' : s.lessonCard.gridTemplateColumns,
      }}
    >
      {content}
    </Link>
  );
}

function PlaceholderPanel({ title, body, actionLabel, onAction }) {
  return (
    <div style={s.card}>
      <div style={s.panelHeader}>
        <div>
          <div style={s.sectionTitle}>{title}</div>
          <div style={s.sectionMeta}>{body}</div>
        </div>
      </div>
      {actionLabel && (
        <button type="button" style={s.primaryAction} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { isAdmin, logout, updateDisplayName, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeView, setActiveView] = useState(() => getInitialDashboardView(searchParams));
  const [activeCoursesTab, setActiveCoursesTab] = useState('videos');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [savingDisplayName, setSavingDisplayName] = useState(false);
  const [linkedinUrlInput, setLinkedinUrlInput] = useState('');
  const [timezoneInput, setTimezoneInput] = useState('UTC');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      setLinkedinUrlInput(localStorage.getItem(`settings_linkedin_${user.username}`) || '');
      setTimezoneInput(localStorage.getItem(`settings_timezone_${user.username}`) || 'UTC');
      setEmailNotifications(localStorage.getItem(`settings_email_${user.username}`) !== 'false');
      setWhatsappNotifications(localStorage.getItem(`settings_whatsapp_${user.username}`) === 'true');
    }
  }, [user]);
  const [isCompact, setIsCompact] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 980 : false,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsCompact(window.innerWidth < 980);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const groups = activeCoursesTab === 'videos'
      ? buildWeekGroups(weeks)
      : buildRecordedSessionGroups(weeks);
    if (groups.length === 0) return;

    setExpandedGroups((prev) => {
      const relevant = groups.filter((group) => Object.prototype.hasOwnProperty.call(prev, group.groupNumber));
      if (relevant.length > 0) {
        const next = {};
        relevant.forEach((group) => { next[group.groupNumber] = prev[group.groupNumber]; });
        return next;
      }

      const firstIncomplete = groups.find((group) =>
        activeCoursesTab === 'videos'
          ? group.lessons.some((lesson) => weekStatus(lesson, progressMap[lesson.weekId]) !== 'complete')
          : group.sessions.length > 0,
      ) || groups[0];

      return { [firstIncomplete.groupNumber]: true };
    });
  }, [weeks, activeCoursesTab, progressMap]);

  useEffect(() => {
    const entries = expandCalendarEntries(buildCalendarEventDefinitions(weeks));
    if (entries.length === 0) return;

    const firstEntryDate = parseDateKey(entries[0].dateKey);
    if (!firstEntryDate) return;

    setCalendarMonth((prev) => {
      const monthHasEvents = entries.some((entry) => {
        const entryDate = parseDateKey(entry.dateKey);
        return entryDate
          && entryDate.getFullYear() === prev.getFullYear()
          && entryDate.getMonth() === prev.getMonth();
      });

      return monthHasEvents ? prev : startOfMonth(firstEntryDate);
    });

    setSelectedCalendarDate((prev) => {
      if (prev && entries.some((entry) => entry.dateKey === prev)) return prev;
      return entries[0].dateKey;
    });
  }, [weeks]);

  useEffect(() => {
    setDisplayNameInput(getDisplayName(user));
  }, [user]);

  useEffect(() => {
    setActiveView(getInitialDashboardView(searchParams));
  }, [searchParams]);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const { data } = await getMyCourses();
      const courseList = data.courses || [];
      setCourses(courseList);

      if (courseList.length > 0) {
        const course = courseList[0];
        setActiveCourse(course);
        await loadCourse(course.courseId);
      }
    } catch {
      setError('Failed to load your courses. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCourse(courseId) {
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId, { includeLeaderboard: true }),
      ]);

      setWeeks(weeksRes.data.weeks || []);

      const nextProgressMap = {};
      for (const progress of (progressRes.data.progress || [])) {
        nextProgressMap[progress.weekId] = progress;
      }

      setProgressMap(nextProgressMap);
      setLeaderboard(progressRes.data.leaderboard || []);
      setExpandedGroups({});
      setExpandedAssignments({});
    } catch {
      setError('Failed to load course content.');
    }
  }

  async function handleSelectCourse(course) {
    if (!course || course.courseId === activeCourse?.courseId) return;
    setActiveCourse(course);
    setLoading(true);
    setError('');

    try {
      await loadCourse(course.courseId);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function handleSaveDisplayName(e) {
    e.preventDefault();
    setSavingDisplayName(true);
    setSettingsMessage('');

    try {
      const result = await updateDisplayName(displayNameInput);
      if (user) {
        localStorage.setItem(`settings_linkedin_${user.username}`, linkedinUrlInput);
        localStorage.setItem(`settings_timezone_${user.username}`, timezoneInput);
        localStorage.setItem(`settings_email_${user.username}`, emailNotifications ? 'true' : 'false');
        localStorage.setItem(`settings_whatsapp_${user.username}`, whatsappNotifications ? 'true' : 'false');
      }
      setSettingsMessage(result.error || 'Profile settings saved.');
    } catch (err) {
      setSettingsMessage('Failed to save profile settings.');
    } finally {
      setSavingDisplayName(false);
    }
  }

  function toggleWeekGroup(groupNumber) {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupNumber]: !prev[groupNumber],
    }));
  }

  function toggleAssignment(assignmentId) {
    setExpandedAssignments((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  }

  function changeCalendarMonth(offset) {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedCalendarDate('');
  }

  function jumpToCurrentMonth() {
    const todayDate = new Date();
    setCalendarMonth(startOfMonth(todayDate));
    setSelectedCalendarDate(toDateKey(todayDate));
  }

  if (loading) return <div style={s.loading}>Loading your dashboard…</div>;
  if (error) return <div style={s.error}>{error}</div>;

  const weekGroups = buildWeekGroups(weeks);
  const recordedSessionGroups = buildRecordedSessionGroups(weeks);
  const courseAssignments = buildAssignments(weeks);
  const completedCount = weeks.filter((week) => weekStatus(week, progressMap[week.weekId]) === 'complete').length;
  const remainingCount = Math.max(weeks.length - completedCount, 0);
  const progressPercent = weeks.length > 0 ? Math.round((completedCount / weeks.length) * 100) : 0;
  const leaderboardRows = (leaderboard || []).filter((entry) => entry.totalPoints > 0 || entry.isCurrentUser);
  const myLeaderboardEntry = leaderboardRows.find((entry) => entry.isCurrentUser) || null;
  const topLeaderboard = leaderboardRows.slice(0, 6);
  const assignmentsSubmittedCount = myLeaderboardEntry?.assignmentsSubmitted || 0;
  const currentDateLabel = formatDateLabel();
  const displayName = getDisplayName(user);
  const calendarEventDefinitions = buildCalendarEventDefinitions(weeks);
  const calendarEntries = expandCalendarEntries(calendarEventDefinitions);
  const calendarEntriesByDate = buildCalendarEntriesByDate(calendarEntries);
  const visibleCalendarMonth = startOfMonth(calendarMonth);
  const calendarGridDays = buildCalendarGridDays(visibleCalendarMonth);
  const visibleMonthDateKeys = calendarGridDays.map((date) => toDateKey(date));
  const today = new Date();
  const todayKey = toDateKey(today);
  const firstVisibleEventKey = visibleMonthDateKeys.find((dateKey) => (calendarEntriesByDate[dateKey] || []).length > 0);
  const visibleToday = calendarGridDays.some((date) => isSameDate(date, today));
  const defaultSelectedDateKey = firstVisibleEventKey || (visibleToday ? todayKey : toDateKey(visibleCalendarMonth));
  const activeSelectedDateKey = selectedCalendarDate && visibleMonthDateKeys.includes(selectedCalendarDate)
    ? selectedCalendarDate
    : defaultSelectedDateKey;

  const focusItems = [];
  const allLessons = weekGroups.flatMap((group) => group.lessons);
  const activeLesson = allLessons.find((lesson) => {
    const status = weekStatus(lesson, progressMap[lesson.weekId]);
    return status === 'in-progress' || status === 'quiz-ready';
  }) || allLessons.find((lesson) => weekStatus(lesson, progressMap[lesson.weekId]) === 'not-started');

  if (activeLesson) {
    const status = weekStatus(activeLesson, progressMap[activeLesson.weekId]);
    focusItems.push({
      title: status === 'quiz-ready' ? 'Quiz unlocked' : 'Continue your next lesson',
      subtitle: `${activeLesson.displayWeekNumber} • ${activeLesson.title}`,
      to: `/learn/${activeLesson.courseId}/${activeLesson.weekId}`,
      cta: status === 'quiz-ready' ? 'Open lesson' : 'Resume lesson',
    });
  }

  const qaLesson = allLessons.find((lesson) => progressMap[lesson.weekId]?.videoComplete && lesson.qaLink);
  if (qaLesson) {
    focusItems.push({
      title: 'Q&A available',
      subtitle: `You can book the session for ${qaLesson.title}`,
      href: qaLesson.qaLink,
      cta: 'Book session',
    });
  }

  const upcomingLesson = allLessons.find((lesson) => {
    const status = weekStatus(lesson, progressMap[lesson.weekId]);
    return status === 'not-started' && lesson.weekId !== activeLesson?.weekId;
  });

  if (upcomingLesson) {
    focusItems.push({
      title: 'Up next',
      subtitle: `${upcomingLesson.displayWeekNumber} • ${upcomingLesson.title}`,
      to: `/learn/${upcomingLesson.courseId}/${upcomingLesson.weekId}`,
      cta: 'Preview lesson',
    });
  }

  const currentGroup = weekGroups.find((group) =>
    group.lessons.some((lesson) => weekStatus(lesson, progressMap[lesson.weekId]) !== 'complete'),
  ) || weekGroups[weekGroups.length - 1];

  const shellStyle = {
    ...s.shell,
    gridTemplateColumns: isCompact ? '1fr' : '250px minmax(0, 1fr)',
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
  };

  function renderDashboardView() {
    const assignmentsTotal = courseAssignments.length;
    const courseScore = myLeaderboardEntry?.totalPoints || 0;
    const continueLesson = activeLesson || upcomingLesson || null;
    const continueLessonPercent = continueLesson
      ? getLessonProgressPercent(continueLesson, progressMap[continueLesson.weekId])
      : 0;
    const leaderboardList = topLeaderboard.filter((entry) => !entry.isCurrentUser).slice(0, 6);
    const activeCourseLine = activeCourse?.name
      ? `ACTIVE COURSE: ${activeCourse.name}${currentGroup ? ` (Week ${currentGroup.groupNumber})` : ''}`
      : 'ACTIVE COURSE: Not assigned yet';

    return (
      <div
        style={{
          ...s.dashboardHero,
          gridTemplateColumns: isCompact ? '1fr' : s.dashboardHero.gridTemplateColumns,
        }}
      >
        <div style={s.dashboardLeft}>
          <div
            style={{
              ...s.metricCards,
              gridTemplateColumns: isCompact ? '1fr' : s.metricCards.gridTemplateColumns,
            }}
          >
            <RingMetricCard
              value={completedCount}
              label="lessons completed"
              sublabel={`${weeks.length} lessons total`}
              percent={weeks.length > 0 ? (completedCount / weeks.length) * 100 : 0}
              ringColor="#1f8bb1"
              trackColor="#d8e9f2"
            />
            <RingMetricCard
              value={assignmentsSubmittedCount}
              label="assignments submitted"
              sublabel={`${assignmentsTotal} total assignments`}
              percent={assignmentsTotal > 0 ? (assignmentsSubmittedCount / assignmentsTotal) * 100 : 0}
              ringColor="#df9718"
              trackColor="#f3e5cf"
            />
            <div style={s.scoreCard}>
              <div style={s.scoreRow}>
                <TrophyIcon />
                <div style={s.scoreValue}>{courseScore}</div>
              </div>
              <div style={s.scoreLabel}>Course Score</div>
            </div>
          </div>

          <div style={s.continueCard}>
            <div style={s.activeCourse}>{activeCourseLine}</div>
            <div style={{ ...s.headerEyebrow, marginBottom: '0.5rem', color: '#0f172a' }}>
              Continue Learning
            </div>
            <div style={s.continueTitle}>
              {continueLesson
                ? `${continueLesson.displayWeekNumber} • ${continueLesson.title}`
                : 'No lesson available yet'}
            </div>

            <div style={s.segmentedTrack}>
              {Array.from({ length: 5 }, (_, index) => {
                const segmentPercent = Math.max(
                  0,
                  Math.min(100, (continueLessonPercent - (index * 20)) * 5),
                );
                return (
                  <div key={index} style={s.segmentedBar}>
                    <div style={{ ...s.segmentedFill, width: `${segmentPercent}%` }} />
                  </div>
                );
              })}
            </div>

            {continueLesson ? (
              <Link
                to={`/learn/${continueLesson.courseId}/${continueLesson.weekId}`}
                style={s.resumeButton}
              >
                <span>▶</span>
                <span>Resume Lesson</span>
              </Link>
            ) : (
              <button type="button" style={{ ...s.resumeButton, opacity: 0.55 }} disabled>
                <span>▶</span>
                <span>Resume Lesson</span>
              </button>
            )}

            <div style={s.upNext}>
              Up next:{' '}
              {upcomingLesson
                ? `${upcomingLesson.displayWeekNumber} • ${upcomingLesson.title}`
                : continueLesson
                  ? `${continueLesson.displayWeekNumber} • ${continueLesson.title}`
                  : 'No upcoming lesson yet'}
            </div>
          </div>
        </div>

        {topLeaderboard.length === 0 ? (
          <div style={s.dashboardRight}>
            <div style={s.railHeaderTitle}>Cohort Leaderboard</div>
            <div style={s.railHeaderSub}>Track your performance against the cohort.</div>
            <div style={s.empty}>Leaderboard points will appear after lessons and assignments are completed.</div>
          </div>
        ) : (
          <DashboardLeaderboard
            me={myLeaderboardEntry}
            rows={leaderboardList.length > 0 ? leaderboardList : topLeaderboard.slice(0, 6)}
            displayName={displayName}
            isCompact={isCompact}
          />
        )}
      </div>
    );
  }

  function renderSchedulingView() {
    return (
      <div style={s.card}>
        <div style={s.panelHeader}>
          <div>
            <div style={s.sectionTitle}>1:1 Scheduling</div>
            <div style={s.sectionMeta}>Schedule links and mentor slots will appear here.</div>
          </div>
        </div>
        {qaLesson ? (
          <a href={qaLesson.qaLink} target="_blank" rel="noopener noreferrer" style={s.primaryAction}>
            Open Q&amp;A Booking
          </a>
        ) : (
          <div style={s.empty}>No scheduling link is available yet for your completed lessons.</div>
        )}
      </div>
    );
  }

  function renderCoursesView() {
    const showingVideos = activeCoursesTab === 'videos';
    const activeGroups = showingVideos ? weekGroups : recordedSessionGroups;

    return (
      <div style={s.card}>
        <div style={s.panelHeader}>
          <div>
            <div style={s.sectionTitle}>{showingVideos ? 'Course Videos' : 'Live Recorded Sessions'}</div>
          </div>
          <div style={s.courseTabs}>
            <button
              type="button"
              style={{ ...s.courseTab, ...(showingVideos ? s.courseTabActive : {}) }}
              onClick={() => {
                setActiveCoursesTab('videos');
                setExpandedGroups({});
              }}
            >
              Course Videos
            </button>
            <button
              type="button"
              style={{ ...s.courseTab, ...(!showingVideos ? s.courseTabActive : {}) }}
              onClick={() => {
                setActiveCoursesTab('recordings');
                setExpandedGroups({});
              }}
            >
              Live Recorded Sessions
            </button>
          </div>
        </div>

        {activeGroups.length === 0 ? (
          <div style={s.empty}>No weeks have been released yet for this course.</div>
        ) : (
          <div style={s.accordionList}>
            {activeGroups.map((group) => {
              const completedLessons = showingVideos
                ? group.lessons.filter((lesson) => weekStatus(lesson, progressMap[lesson.weekId]) === 'complete').length
                : 0;
              const groupPercent = showingVideos && group.lessons.length > 0
                ? Math.round((completedLessons / group.lessons.length) * 100)
                : 0;
              const isExpanded = !!expandedGroups[group.groupNumber];
              const groupItemCount = showingVideos ? group.lessons.length : group.sessions.length;

              return (
                <div key={group.groupNumber} style={s.weekGroupCard}>
                  <button
                    type="button"
                    style={s.weekGroupHeader}
                    onClick={() => toggleWeekGroup(group.groupNumber)}
                  >
                    <div style={s.weekGroupTop}>
                      <div>
                        <div style={s.weekGroupLabel}>
                          {group.groupNumber === 'Supplemental'
                            ? 'Supplemental Content'
                            : `Week ${group.groupNumber}`}
                        </div>
                        <div style={s.weekGroupMeta}>
                          {groupItemCount} {showingVideos ? `video${groupItemCount === 1 ? '' : 's'}` : `recording${groupItemCount === 1 ? '' : 's'}`}
                          {showingVideos && (
                            <>
                              {' • '}
                              {completedLessons} complete
                            </>
                          )}
                        </div>
                      </div>

                      <div style={s.weekGroupRight}>
                        <div style={s.weekGroupCount}>
                          {showingVideos ? `${groupPercent}% complete` : `${groupItemCount} available`}
                        </div>
                        <div style={s.weekGroupToggle}>{isExpanded ? '−' : '+'}</div>
                      </div>
                    </div>

                    {showingVideos && <ProgressTrack percent={groupPercent} color="var(--primary)" />}
                  </button>

                  {isExpanded && (
                    <div style={s.weekGroupBody}>
                      {showingVideos ? (
                        group.lessons.map((lesson) => {
                          const progress = progressMap[lesson.weekId];
                          const status = weekStatus(lesson, progress);
                          const percent = getLessonProgressPercent(lesson, progress);
                          const progressColor = status === 'complete'
                            ? 'var(--success)'
                            : status === 'quiz-ready'
                              ? 'hsl(38, 81%, 46%)'
                              : 'var(--primary)';

                          return (
                            <Link
                              key={lesson.weekId}
                              to={`/learn/${lesson.courseId}/${lesson.weekId}`}
                              className="lesson-row-hover"
                              style={{
                                ...s.lessonCard,
                                gridTemplateColumns: isCompact ? '24px 1fr auto' : s.lessonCard.gridTemplateColumns,
                              }}
                            >
                              <LessonIcon status={status} />

                              <div style={s.lessonInfo}>
                                <div style={s.lessonTitle}>{lesson.displayWeekNumber} {lesson.title}</div>
                                <div style={s.lessonDesc}>{lesson.description}</div>
                              </div>

                              <div style={{ justifySelf: 'end' }}>
                                <LessonStatusBadge status={status} percent={percent} />
                              </div>
                            </Link>
                          );
                        })
                      ) : group.sessions.length === 0 ? (
                        <div style={s.empty}>No live recorded sessions have been added for this week yet.</div>
                      ) : (
                        group.sessions.map((session) => (
                          <RecordedSessionCard
                            key={session.id || `${session.sourceWeekId}-${session.displaySessionNumber}`}
                            session={session}
                            isCompact={isCompact}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderCalendarView() {
    const calendarBoardStyle = {
      ...s.calendarBoard,
      minWidth: isCompact ? '720px' : '0',
    };

    return (
      <div style={s.card}>
        <div style={s.calendarToolbar}>
          <div>
            <div style={s.sectionTitle}>Calendar</div>
          </div>

          <div style={s.calendarControls}>
            <button type="button" style={s.calendarNavButton} onClick={() => changeCalendarMonth(-1)}>
              ‹
            </button>
            <div style={s.calendarMonthLabel}>{formatMonthLabel(visibleCalendarMonth)}</div>
            <button type="button" style={s.calendarNavButton} onClick={() => changeCalendarMonth(1)}>
              ›
            </button>
            <button type="button" style={s.calendarTodayButton} onClick={jumpToCurrentMonth}>
              This Month
            </button>
          </div>
        </div>

        <div style={s.calendarScroller}>
          <div style={calendarBoardStyle}>
            <div style={s.calendarWeekdayRow}>
              {CALENDAR_WEEKDAYS.map((day) => (
                <div key={day} style={s.calendarWeekday}>{day}</div>
              ))}
            </div>

            <div style={s.calendarMonthGrid}>
              {calendarGridDays.map((date) => {
                const dateKey = toDateKey(date);
                const dayEntries = calendarEntriesByDate[dateKey] || [];
                const isCurrentMonth = date.getMonth() === visibleCalendarMonth.getMonth()
                  && date.getFullYear() === visibleCalendarMonth.getFullYear();
                const isToday = isSameDate(date, today);
                const isSelected = dateKey === activeSelectedDateKey;
                const dayNumberStyle = {
                  ...s.calendarDayNumber,
                  ...(isToday ? s.calendarDayNumberToday : {}),
                  ...(isSelected ? s.calendarDayNumberSelected : {}),
                };

                return (
                  <button
                    key={dateKey}
                    type="button"
                    style={{
                      ...s.calendarCell,
                      ...(isCurrentMonth ? {} : s.calendarCellMuted),
                      ...(isToday ? s.calendarCellToday : {}),
                      ...(isSelected ? s.calendarCellSelected : {}),
                      minHeight: isCompact ? '96px' : s.calendarCell.minHeight,
                    }}
                    onClick={() => setSelectedCalendarDate(dateKey)}
                  >
                    <div style={s.calendarCellTop}>
                      <div style={dayNumberStyle}>{date.getDate()}</div>
                      {dayEntries.length > 0 && (
                        <div style={s.calendarCellCount}>
                          {dayEntries.length} item{dayEntries.length === 1 ? '' : 's'}
                        </div>
                      )}
                    </div>

                    <div style={s.calendarCellEvents}>
                      {dayEntries.slice(0, 2).map((entry, index) => (
                        <span
                          key={`${dateKey}-${entry.title}-${index}`}
                          style={{
                            ...s.calendarChip,
                            background: entry.palette.bg,
                            color: entry.palette.color,
                          }}
                        >
                          {entry.title}
                        </span>
                      ))}

                      {dayEntries.length > 2 && (
                        <span style={s.calendarChipMore}>+{dayEntries.length - 2} more</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    );
  }

  function renderAssignmentsView() {
    return (
      <div style={s.card}>
        <div style={s.panelHeader}>
          <div>
            <div style={s.sectionTitle}>Assignments</div>
            <div style={s.sectionMeta}>Open an assignment to upload your file with drag and drop.</div>
          </div>
        </div>

        {courseAssignments.length === 0 ? (
          <div style={s.empty}>Assignments will appear here once your admin adds them to a course module.</div>
        ) : (
          <div style={s.accordionList}>
            {courseAssignments.map((assignment) => {
              const isExpanded = !!expandedAssignments[assignment.id];
              const sourceWeekLabel = assignment.weekId === '__supplemental__'
                ? 'Supplemental Content'
                : Number.isFinite(Number(assignment.weekNumber))
                  ? `Week ${Math.floor(Number(assignment.weekNumber))}`
                  : 'Course Module';
              const assignmentLabel = `Assignment ${assignment.assignmentNumber}`;
              const assignmentTitle = assignment.title || assignmentLabel;

              return (
                <div key={assignment.id} style={s.weekGroupCard}>
                  <button
                    type="button"
                    style={s.weekGroupHeader}
                    onClick={() => toggleAssignment(assignment.id)}
                  >
                    <div style={s.weekGroupTop}>
                      <div>
                        <div style={s.weekGroupLabel}>{assignmentLabel}</div>
                        <div style={s.weekGroupMeta}>
                          {sourceWeekLabel}
                          {assignment.weekTitle ? ` • ${assignment.weekTitle}` : ''}
                        </div>
                      </div>

                      <div style={s.weekGroupRight}>
                        <div style={s.weekGroupCount}>Upload file</div>
                        <div style={s.weekGroupToggle}>{isExpanded ? '−' : '+'}</div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={s.weekGroupBody}>
                      <div>
                        <div style={s.lessonTitle}>{assignmentTitle}</div>
                        <div style={s.lessonDesc}>
                          {assignment.description || 'Upload your completed work for this assignment here.'}
                        </div>
                      </div>

                      <AssignmentUpload
                        courseId={assignment.courseId}
                        weekId={assignment.weekId}
                        assignmentId={assignment.id}
                        assignmentTitle={assignmentTitle}
                        embedded
                        title={null}
                        subtitle={`Drag and drop your file for ${assignmentLabel}, or browse to upload it.`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderSettingsView() {
    return (
      <div style={s.card}>
        <div style={s.panelHeader}>
          <div>
            <div style={s.sectionTitle}>Profile Settings</div>
            <div style={s.sectionMeta}>Update your display name, LinkedIn profile, and notification preferences.</div>
          </div>
        </div>

        <form style={s.settingsForm} onSubmit={handleSaveDisplayName}>
          <div style={s.settingsField}>
            <label htmlFor="display-name" style={s.settingsLabel}>Display name</label>
            <input
              id="display-name"
              type="text"
              style={s.settingsInput}
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <div style={s.settingsField}>
            <label htmlFor="linkedin-url" style={s.settingsLabel}>LinkedIn URL</label>
            <input
              id="linkedin-url"
              type="text"
              style={s.settingsInput}
              value={linkedinUrlInput}
              onChange={(e) => setLinkedinUrlInput(e.target.value)}
              placeholder="https://linkedin.com/in/you"
            />
          </div>

          <div style={s.settingsField}>
            <label htmlFor="timezone" style={s.settingsLabel}>Timezone</label>
            <input
              id="timezone"
              type="text"
              style={s.settingsInput}
              value={timezoneInput}
              onChange={(e) => setTimezoneInput(e.target.value)}
              placeholder="UTC"
            />
          </div>

          <div style={{ ...s.settingsField, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <div>
              <div style={{ ...s.settingsLabel, textTransform: 'none', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', letterSpacing: 'normal' }}>Email notifications</div>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              style={{
                width: '46px',
                height: '24px',
                borderRadius: '999px',
                background: emailNotifications ? '#198754' : '#e4e4e7',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
                border: 'none',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '2px',
                  left: emailNotifications ? '24px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>

          <div style={{ ...s.settingsField, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(15, 40, 80, 0.08)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ ...s.settingsLabel, textTransform: 'none', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', letterSpacing: 'normal' }}>WhatsApp notifications</div>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappNotifications(!whatsappNotifications)}
              style={{
                width: '46px',
                height: '24px',
                borderRadius: '999px',
                background: whatsappNotifications ? '#198754' : '#e4e4e7',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
                border: 'none',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '2px',
                  left: whatsappNotifications ? '24px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>

          <div style={s.settingsField}>
            <label htmlFor="login-email" style={s.settingsLabel}>Login email</label>
            <input
              id="login-email"
              type="text"
              style={{ ...s.settingsInput, background: '#f8fafc', color: 'var(--muted-foreground)', cursor: 'not-allowed' }}
              value={user?.email || user?.signInDetails?.loginId || user?.username || ''}
              readOnly
            />
          </div>

          <div style={{ ...s.settingsActions, marginTop: '1.25rem' }}>
            <button type="submit" style={{ ...s.primaryAction, background: '#198754', marginTop: 0 }} disabled={savingDisplayName}>
              {savingDisplayName ? 'Saving…' : 'Save'}
            </button>
            <button type="button" style={s.mutedAction} onClick={handleSignOut}>
              Sign out
            </button>
          </div>

          {settingsMessage && (
            <div style={s.settingsMessage}>{settingsMessage}</div>
          )}
        </form>
      </div>
    );
  }

  function renderCohortView() {
    const studentList = leaderboard.length > 0 ? leaderboard : [
      { userId: '1', displayName: 'Vipul Kohli', completedLectures: 0, totalPoints: 0, isCurrentUser: false },
      { userId: '2', displayName: displayName, completedLectures: 0, totalPoints: 0, isCurrentUser: true }
    ];

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {studentList.map((student) => {
            const initials = getInitials(student.displayName);
            const savedLinkedin = student.isCurrentUser
              ? linkedinUrlInput
              : student.linkedinUrl;
            
            const linkedinUrl = savedLinkedin || `https://www.linkedin.com/in/${student.displayName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

            return (
              <div
                key={student.userId}
                onClick={() => window.open(linkedinUrl, '_blank')}
                className="cohort-card-hover"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(20, 49, 86, 0.08)',
                  borderRadius: '22px',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(15, 40, 80, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(25, 135, 84, 0.08)',
                    color: '#198754',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  {initials}
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: '0.3rem',
                  }}
                >
                  {student.displayName}
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {student.completedLectures} lessons • {student.totalPoints} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  let viewEyebrow = 'Student Dashboard';
  let viewTitle = `Welcome back, ${displayName}`;
  let viewSubtitle = '';

  if (activeView === 'courses') {
    viewEyebrow = 'My Courses';
    viewTitle = activeCourse?.name || 'My Courses';
    viewSubtitle = activeCourse?.description || 'Browse your course videos and live recorded sessions grouped by week.';
  }

  if (activeView === 'cohort') {
    viewEyebrow = 'Cohort';
    viewTitle = 'Cohort';
    viewSubtitle = '';
  }

  if (activeView === 'calendar') {
    viewEyebrow = 'Calendar';
    viewTitle = 'Learning Calendar';
    viewSubtitle = 'Find your upcoming lectures.';
  }

  if (activeView === 'scheduling') {
    viewEyebrow = '1:1 Scheduling';
    viewTitle = 'Book Your Mentoring Session';
    viewSubtitle = 'Access your live booking links and scheduling updates.';
  }

  if (activeView === 'assignments') {
    viewEyebrow = 'Assignments';
    viewTitle = activeCourse?.name ? `${activeCourse.name} Assignments` : 'Assignments';
    viewSubtitle = 'Open an assignment card to upload your work from the dashboard sidebar.';
  }

  if (activeView === 'settings') {
    viewEyebrow = 'Profile';
    viewTitle = 'Settings';
    viewSubtitle = '';
  }

  return (
    <div style={s.page}>
      <div style={shellStyle}>
        <aside style={sidebarStyle}>
          <div style={s.sidebarGlow} />

          <div style={s.brand}>
            <div style={s.brandMark}>S</div>
            <span>StepSmart</span>
          </div>

          <div style={s.navStack}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                style={{
                  ...s.navButton,
                  ...(activeView === item.id ? s.navButtonActive : {}),
                }}
                onClick={() => setActiveView(item.id)}
              >
                {activeView === item.id && <span style={s.navActiveRail} />}
                <span style={s.navButtonIcon}>
                  <SidebarIcon kind={item.icon} />
                </span>
                {item.label}
              </button>
            ))}
          </div>

          <div style={s.sidebarSection}>
            <div style={s.sidebarDivider} />
            {isAdmin && (
              <Link to="/admin" style={s.adminLink}>
                Open Admin
              </Link>
            )}

            <button type="button" style={s.signOutBtn} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </aside>

        <main style={s.main}>
          <div style={s.header}>
            <div>
              <div style={s.headerEyebrow}>{viewEyebrow}</div>
              <div style={s.headerTitle}>{viewTitle}</div>
              {viewSubtitle && <div style={s.headerSub}>{viewSubtitle}</div>}
            </div>

            {activeView === 'dashboard' ? (
              <div style={s.profileWrap}>
                <div style={s.profileAvatar}>{getInitials(displayName)}</div>
                <div>
                  <div style={s.profileName}>{displayName}</div>
                  <div style={s.profileDate}>{currentDateLabel}</div>
                </div>
                <div style={s.bellWrap}>
                  <BellIcon />
                  <span style={s.bellDot} />
                </div>
              </div>
            ) : activeView === 'cohort' ? (
              <a
                href="https://chat.whatsapp.com/mock-invite-code"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '10px',
                  background: '#198754',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.opacity = 0.9; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = 1; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>Open WhatsApp Community</span>
              </a>
            ) : courses.length > 1 ? (
              <div style={s.courseTabs}>
                {courses.map((course) => (
                  <button
                    key={course.courseId}
                    type="button"
                    style={{
                      ...s.courseTab,
                      ...(activeCourse?.courseId === course.courseId ? s.courseTabActive : {}),
                    }}
                    onClick={() => handleSelectCourse(course)}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {activeView === 'dashboard' && renderDashboardView()}
          {activeView === 'courses' && renderCoursesView()}
          {activeView === 'cohort' && renderCohortView()}
          {activeView === 'scheduling' && renderSchedulingView()}
          {activeView === 'assignments' && renderAssignmentsView()}
          {activeView === 'calendar' && renderCalendarView()}
          {activeView === 'settings' && renderSettingsView()}
        </main>
      </div>
    </div>
  );
}
