import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, getCourseWeeks, getProgress, adminGetWeeks } from '../utils/api';
import AssignmentUpload from '../components/AssignmentUpload';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'courses', label: 'My Courses' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'settings', label: 'Settings' },
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
    fontSize: '1.7rem',
    fontWeight: 800,
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
    border: 'none',
    textAlign: 'left',
    borderRadius: '14px',
    padding: '0.9rem 1rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.78)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s, transform 0.2s',
  },
  navButtonActive: {
    background: 'rgba(255,255,255,0.14)',
    color: '#fff',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  sidebarSection: { position: 'relative', marginTop: 'auto' },
  sidebarLabel: {
    fontSize: '0.76rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.62)',
    marginBottom: '0.75rem',
    fontWeight: 700,
  },
  sidebarCard: {
    padding: '1rem',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.16)',
    color: '#fff',
    marginBottom: '0.9rem',
  },
  sidebarCardTitle: { fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' },
  sidebarCardMeta: { color: 'rgba(255,255,255,0.72)', fontSize: '0.83rem', lineHeight: 1.5 },
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
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: '0.55rem',
  },
  headerTitle: {
    fontSize: 'clamp(1.9rem, 3.2vw, 2.65rem)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: 'var(--foreground)',
    marginBottom: '0.35rem',
  },
  headerSub: {
    color: 'var(--muted-foreground)',
    fontSize: '0.98rem',
    lineHeight: 1.6,
    maxWidth: '780px',
  },
  courseTabs: { display: 'flex', flexWrap: 'wrap', gap: '0.6rem' },
  courseTab: {
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.76)',
    color: 'var(--muted-foreground)',
    borderRadius: '999px',
    padding: '0.65rem 1rem',
    fontWeight: 700,
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
    fontSize: '0.86rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statValue: {
    fontSize: '2.1rem',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: 'var(--foreground)',
    marginTop: '0.55rem',
  },
  statFoot: { color: 'var(--muted-foreground)', fontSize: '0.88rem' },
  progressRail: {
    width: '100%',
    height: '8px',
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
    fontSize: '1.28rem',
    fontWeight: 800,
    color: 'var(--foreground)',
    letterSpacing: '-0.02em',
  },
  sectionMeta: { color: 'var(--muted-foreground)', fontSize: '0.92rem' },
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
    fontSize: '0.97rem',
    fontWeight: 700,
    color: 'var(--foreground)',
    marginBottom: '0.2rem',
  },
  leaderboardMeta: { color: 'var(--muted-foreground)', fontSize: '0.84rem' },
  leaderboardPoints: { textAlign: 'right' },
  leaderboardPointsValue: { fontSize: '1.05rem', fontWeight: 800, color: 'var(--foreground)' },
  leaderboardPointsLabel: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--muted-foreground)',
    fontWeight: 700,
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
  focusTitle: { fontSize: '0.98rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.28rem' },
  focusMeta: { color: 'var(--muted-foreground)', fontSize: '0.86rem', lineHeight: 1.5 },
  focusCta: {
    display: 'inline-flex',
    marginTop: '0.7rem',
    color: 'var(--primary)',
    fontWeight: 700,
    fontSize: '0.86rem',
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
  weekGroupLabel: { fontSize: '1.12rem', fontWeight: 800, color: 'var(--foreground)' },
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
    padding: '0 1.25rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  lessonCard: {
    display: 'grid',
    gridTemplateColumns: '78px minmax(0, 1fr) auto',
    gap: '0.95rem',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    padding: '1rem',
    borderRadius: '18px',
    background: 'var(--background)',
    border: '1px solid rgba(15, 40, 80, 0.06)',
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
  lessonTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.2rem' },
  lessonDesc: { fontSize: '0.87rem', color: 'var(--muted-foreground)', lineHeight: 1.55 },
  lessonProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.8rem',
  },
  lessonProgressValue: { fontSize: '0.84rem', color: 'var(--muted-foreground)', fontWeight: 700 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
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
    fontSize: '0.82rem',
    fontWeight: 800,
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

  weeks.forEach((week) => {
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

function normalizeSupplementalContent(raw) {
  return {
    assignments: Array.isArray(raw?.assignments) ? raw.assignments : [],
    liveRecordedSessions: Array.isArray(raw?.liveRecordedSessions) ? raw.liveRecordedSessions : [],
    calendarEvents: Array.isArray(raw?.calendarEvents) ? raw.calendarEvents : [],
  };
}

function findLegacySupplementalWeek(weeks = []) {
  return weeks.find((week) => {
    const hasSupplementalPayload = (week.assignments?.length || 0)
      || (week.liveRecordedSessions?.length || 0)
      || (week.calendarEvents?.length || 0);
    const supplementalById = week.weekId === '__supplemental__';
    const supplementalByKey = week.sk === 'WEEK#__supplemental__';
    const supplementalByShape = Number(week.weekNumber) === 0
      && !week.youtubeUrl
      && hasSupplementalPayload
      && /supplemental/i.test(week.title || '');
    return supplementalById || supplementalByKey || supplementalByShape;
  });
}

function buildRecordedSessionGroups(weeks, supplementalSessions = [], fallbackCourseId = '') {
  const groups = new Map();
  const sortedWeeks = [...weeks].sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));

  sortedWeeks.forEach((week) => {
    const numericWeek = Number(week.weekNumber);
    const groupNumber = Number.isFinite(numericWeek) && numericWeek > 0
      ? Math.floor(numericWeek)
      : groups.size + 1;

    if (!groups.has(groupNumber)) {
      groups.set(groupNumber, {
        groupNumber,
        sessions: [],
      });
    }

    const group = groups.get(groupNumber);
    (week.liveRecordedSessions || []).forEach((session) => {
      const sessionNumber = `${groupNumber}.${group.sessions.length + 1}`;
      group.sessions.push({
        ...session,
        courseId: week.courseId,
        sourceWeekId: week.weekId,
        sourceTitle: week.title,
        displaySessionNumber: sessionNumber,
      });
    });
  });

  if (supplementalSessions.length > 0) {
    if (!groups.has(0)) {
      groups.set(0, {
        groupNumber: 0,
        groupLabel: 'Course Sessions',
        sessions: [],
      });
    }

    const group = groups.get(0);
    supplementalSessions.forEach((session, index) => {
      group.sessions.push({
        ...session,
        id: session.id || `rec-supplemental-${index + 1}`,
        courseId: fallbackCourseId || sortedWeeks[0]?.courseId || '',
        sourceWeekId: '__supplemental__',
        sourceTitle: 'Course Sessions',
        displaySessionNumber: `C.${group.sessions.length + 1}`,
      });
    });
  }

  return [...groups.values()].sort((a, b) => a.groupNumber - b.groupNumber);
}

function buildAssignments(weeks, supplementalAssignments = [], fallbackCourseId = '') {
  const sortedWeeks = [...weeks].sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
  let assignmentNumber = 0;
  const combined = [];

  sortedWeeks.forEach((week) => {
    (week.assignments || []).forEach((assignment, index) => {
      assignmentNumber += 1;
      combined.push({
        id: assignment.id || `assignment-${week.weekId}-${index + 1}`,
        courseId: week.courseId,
        weekId: week.weekId,
        weekNumber: week.weekNumber,
        weekTitle: week.title,
        sourceLabel: Number.isFinite(Number(week.weekNumber))
          ? `Week ${Math.floor(Number(week.weekNumber))}`
          : 'Course Module',
        assignmentNumber,
        title: (assignment.title || '').trim(),
        description: (assignment.description || '').trim(),
      });
    });
  });

  supplementalAssignments.forEach((assignment, index) => {
    assignmentNumber += 1;
    combined.push({
      id: assignment.id || `assignment-supplemental-${index + 1}`,
      courseId: fallbackCourseId || sortedWeeks[0]?.courseId || '',
      weekId: '__supplemental__',
      weekNumber: null,
      weekTitle: 'Course Assignments',
      sourceLabel: 'Course Assignments',
      assignmentNumber,
      title: (assignment.title || '').trim(),
      description: (assignment.description || '').trim(),
    });
  });

  return combined;
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

function getLeaderboardScore(entry) {
  if (typeof entry?.score === 'number' && Number.isFinite(entry.score)) return entry.score;
  if (typeof entry?.totalPoints === 'number' && Number.isFinite(entry.totalPoints)) return entry.totalPoints;
  return 0;
}

function normalizeLeaderboardEntries(entries = []) {
  const normalized = (entries || []).map((entry, index) => ({
    ...entry,
    displayName: (entry?.displayName || entry?.name || entry?.email || `Student ${index + 1}`).trim(),
    completedLectures: Number(entry?.completedLectures || 0),
    assignmentsSubmitted: Number(entry?.assignmentsSubmitted || 0),
    score: getLeaderboardScore(entry),
  }));

  return normalized
    .sort((a, b) =>
      b.score - a.score ||
      b.completedLectures - a.completedLectures ||
      b.assignmentsSubmitted - a.assignmentsSubmitted ||
      a.displayName.localeCompare(b.displayName)
    )
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      totalPoints: entry.score,
    }));
}

function formatDateLabel() {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  } catch {
    return 'Today';
  }
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

function buildCalendarEventDefinitions(weeks, supplementalEvents = []) {
  const weekEvents = [...weeks]
    .sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0))
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

  const globalEvents = supplementalEvents
    .map((event, index) => ({
      ...event,
      id: event.id || `calendar-supplemental-${index + 1}`,
      kind: event.kind || 'Course Event',
      title: event.title || 'Course Event',
      description: event.description || '',
      startDate: event.startDate || '',
      endDate: event.endDate || event.startDate || '',
      weekLabel: null,
      sourceWeekId: '__supplemental__',
    }))
    .filter((event) => event.startDate);

  const mergedEvents = [...weekEvents, ...globalEvents];

  const events = mergedEvents.length > 0
    ? mergedEvents
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

function StatusBadge({ status }) {
  const { label, bg, color } = BADGE[status] || BADGE['not-started'];
  return <span style={{ ...s.badge, background: bg, color }}>{label}</span>;
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
        <div style={s.leaderboardPointsValue}>{entry.score}</div>
        <div style={s.leaderboardPointsLabel}>Score</div>
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
  const content = (
    <>
      <div style={s.lessonNumber}>{session.displaySessionNumber}</div>

      <div style={s.lessonInfo}>
        <div style={s.lessonTitle}>{session.title || `${session.sourceTitle} Recording`}</div>
        <div style={s.lessonDesc}>
          {session.description || `Recorded session for ${session.sourceTitle}`}
        </div>
      </div>

      <div style={{ justifySelf: isCompact ? 'start' : 'end' }}>
        <span style={{ ...s.badge, background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
          {session.url ? 'Open Recording' : 'Coming Soon'}
        </span>
      </div>
    </>
  );

  if (!session.url) {
    return (
      <div
        style={{
          ...s.lessonCard,
          gridTemplateColumns: isCompact ? '1fr' : s.lessonCard.gridTemplateColumns,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={session.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...s.lessonCard,
        gridTemplateColumns: isCompact ? '1fr' : s.lessonCard.gridTemplateColumns,
      }}
    >
      {content}
    </a>
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
  const [supplementalContent, setSupplementalContent] = useState(() => normalizeSupplementalContent());
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
  const [isCompact, setIsCompact] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 980 : false,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!activeCourse?.courseId) return;

    setLoading(true);
    setError('');

    loadCourse(activeCourse.courseId)
      .finally(() => setLoading(false));
  }, [activeCourse?.courseId, isAdmin]);

  useEffect(() => {
    function handleResize() {
      setIsCompact(window.innerWidth < 980);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const releasedLessonWeeks = weeks.filter((week) => week.visible === true);
    const groups = activeCoursesTab === 'videos'
      ? buildWeekGroups(releasedLessonWeeks)
      : buildRecordedSessionGroups(
        weeks,
        supplementalContent.liveRecordedSessions || [],
        activeCourse?.courseId || '',
      );
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
  }, [weeks, supplementalContent, activeCoursesTab, progressMap, activeCourse]);

  useEffect(() => {
    const entries = expandCalendarEntries(buildCalendarEventDefinitions(
      weeks,
      supplementalContent.calendarEvents || [],
    ));
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
  }, [weeks, supplementalContent]);

  useEffect(() => {
    setDisplayNameInput(getDisplayName(user));
  }, [user]);

  useEffect(() => {
    setActiveView(getInitialDashboardView(searchParams));
  }, [searchParams]);

  async function loadData() {
    setLoading(true);
    setError('');
    let deferLoadingClear = false;

    try {
      const { data } = await getMyCourses();
      const courseList = data.courses || [];
      setCourses(courseList);

      if (courseList.length > 0) {
        const course = courseList[0];
        setActiveCourse(course);
        deferLoadingClear = true;
      }
    } catch {
      setError('Failed to load your courses. Please refresh.');
    } finally {
      if (!deferLoadingClear) setLoading(false);
    }
  }

  async function loadCourse(courseId) {
    try {
      const requests = [
        getCourseWeeks(courseId),
        getProgress(courseId, { includeLeaderboard: true }),
      ];

      if (isAdmin) {
        requests.push(adminGetWeeks(courseId));
      }

      const [weeksRes, progressRes, adminWeeksRes] = await Promise.all(requests);

      const allWeeks = weeksRes.data.weeks || [];
      const legacySupplementalWeek = findLegacySupplementalWeek(allWeeks);
      const regularWeeks = allWeeks.filter((week) => week !== legacySupplementalWeek && week.weekId !== '__supplemental__');
      const responseSupplemental = normalizeSupplementalContent(weeksRes.data.supplementalContent);
      const hasSupplementalInResponse = responseSupplemental.assignments.length > 0
        || responseSupplemental.liveRecordedSessions.length > 0
        || responseSupplemental.calendarEvents.length > 0;
      const adminWeeks = adminWeeksRes?.data?.weeks || [];
      const adminLegacySupplementalWeek = findLegacySupplementalWeek(adminWeeks);
      const adminSupplemental = normalizeSupplementalContent(
        (adminWeeksRes?.data?.supplementalContent && (
          (adminWeeksRes.data.supplementalContent.assignments?.length || 0)
          || (adminWeeksRes.data.supplementalContent.liveRecordedSessions?.length || 0)
          || (adminWeeksRes.data.supplementalContent.calendarEvents?.length || 0)
        ))
          ? adminWeeksRes.data.supplementalContent
          : adminLegacySupplementalWeek,
      );
      const hasAdminSupplemental = adminSupplemental.assignments.length > 0
        || adminSupplemental.liveRecordedSessions.length > 0
        || adminSupplemental.calendarEvents.length > 0;

      const supplementalSource = hasSupplementalInResponse
        ? responseSupplemental
        : hasAdminSupplemental
          ? adminSupplemental
          : normalizeSupplementalContent(legacySupplementalWeek);

      setWeeks(regularWeeks);
      setSupplementalContent(normalizeSupplementalContent(supplementalSource));

      const nextProgressMap = {};
      for (const progress of (progressRes.data.progress || [])) {
        nextProgressMap[progress.weekId] = progress;
      }

      setProgressMap(nextProgressMap);
      setLeaderboard(normalizeLeaderboardEntries(progressRes.data.leaderboard || []));
      setExpandedGroups({});
      setExpandedAssignments({});
    } catch {
      setError('Failed to load course content.');
    }
  }

  async function handleSelectCourse(course) {
    if (!course || course.courseId === activeCourse?.courseId) return;
    setActiveCourse(course);
  }

  async function handleSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function handleSaveDisplayName(e) {
    e.preventDefault();
    setSavingDisplayName(true);
    setSettingsMessage('');

    const result = await updateDisplayName(displayNameInput);
    setSettingsMessage(result.error || 'Display name updated.');
    setSavingDisplayName(false);
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

  const normalizedSupplemental = normalizeSupplementalContent(supplementalContent);
  const releasedLessonWeeks = weeks.filter((week) => week.visible === true);
  const weekGroups = buildWeekGroups(releasedLessonWeeks);
  const recordedSessionGroups = buildRecordedSessionGroups(
    weeks,
    normalizedSupplemental.liveRecordedSessions,
    activeCourse?.courseId || '',
  );
  const courseAssignments = buildAssignments(
    weeks,
    normalizedSupplemental.assignments,
    activeCourse?.courseId || '',
  );
  const completedCount = releasedLessonWeeks
    .filter((week) => weekStatus(week, progressMap[week.weekId]) === 'complete').length;
  const remainingCount = Math.max(releasedLessonWeeks.length - completedCount, 0);
  const progressPercent = releasedLessonWeeks.length > 0
    ? Math.round((completedCount / releasedLessonWeeks.length) * 100)
    : 0;
  const leaderboardRows = leaderboard || [];
  const myLeaderboardEntry = leaderboardRows.find((entry) => entry.isCurrentUser) || null;
  const topLeaderboard = leaderboardRows.slice(0, 6);
  const assignmentsSubmittedCount = myLeaderboardEntry?.assignmentsSubmitted || 0;
  const currentDateLabel = formatDateLabel();
  const displayName = getDisplayName(user);
  const calendarEventDefinitions = buildCalendarEventDefinitions(
    weeks,
    normalizedSupplemental.calendarEvents,
  );
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

  const sectionGridStyle = {
    ...s.sectionGrid,
    gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.35fr) minmax(280px, 0.95fr)',
  };

  const dashboardCardsGridStyle = {
    ...s.sectionGrid,
    gridTemplateColumns: isCompact ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  };

  const dashboardLayoutStyle = {
    ...s.dashboardLayout,
    gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1fr) 320px',
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
    return (
      <div style={dashboardLayoutStyle}>
        <div style={s.dashboardMain}>
          <div style={s.statsGrid}>
            <StatCard
              label="Lessons Completed"
              value={completedCount}
              detail={`${releasedLessonWeeks.length} lessons available in this course`}
              accent="var(--primary)"
              progress={progressPercent}
              progressColor="var(--primary)"
            />
            <StatCard
              label="Assignments Submitted"
              value={assignmentsSubmittedCount}
              detail={`${remainingCount} lesson${remainingCount === 1 ? '' : 's'} still remaining`}
              accent="hsl(38, 81%, 46%)"
            />
            <StatCard
              label="Course Progress"
              value={`${progressPercent}%`}
              detail={activeCourse?.name || 'Current course'}
              accent="var(--success)"
              progress={progressPercent}
              progressColor="var(--success)"
            />
          </div>

          <div style={dashboardCardsGridStyle}>
            <div style={s.card}>
              <div style={s.panelHeader}>
                <div>
                  <div style={s.sectionTitle}>Today&apos;s Focus</div>
                  <div style={s.sectionMeta}>{currentDateLabel}</div>
                </div>
              </div>

              {focusItems.length === 0 ? (
                <div style={s.empty}>You&apos;re all caught up for now. New lessons will appear in My Courses.</div>
              ) : (
                <div style={s.focusList}>
                  {focusItems.slice(0, 3).map((item) => (
                    <FocusItem key={`${item.title}-${item.subtitle}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={s.panelHeader}>
                <div>
                  <div style={s.sectionTitle}>Course Snapshot</div>
                </div>
              </div>

              <div style={s.snapshotRows}>
                <div style={s.snapshotRow}>
                  <div style={s.snapshotLabel}>Active course</div>
                  <div style={s.snapshotValue}>{activeCourse?.name || 'No course assigned'}</div>
                </div>
                <div style={s.snapshotRow}>
                  <div style={s.snapshotLabel}>Current week group</div>
                  <div style={s.snapshotValue}>{currentGroup ? `Week ${currentGroup.groupNumber}` : 'Not started'}</div>
                </div>
                <div style={s.snapshotRow}>
                  <div style={s.snapshotLabel}>Assignments submitted</div>
                  <div style={s.snapshotValue}>{assignmentsSubmittedCount}</div>
                </div>
                <div style={{ ...s.snapshotRow, borderBottom: 'none', paddingBottom: 0 }}>
                  <div style={s.snapshotLabel}>Points earned</div>
                  <div style={s.snapshotValue}>{myLeaderboardEntry?.score || 0}</div>
                </div>
              </div>

              <button type="button" style={s.primaryAction} onClick={() => setActiveView('courses')}>
                Open My Courses
              </button>
            </div>
          </div>
        </div>

        <div style={{ ...s.card, position: isCompact ? 'static' : 'sticky', top: '1.25rem' }}>
          <div style={s.panelHeader}>
            <div>
              <div style={s.sectionTitle}>Leaderboard</div>
              <div style={s.sectionMeta}>Track how you&apos;re performing against the cohort.</div>
            </div>
          </div>

          {topLeaderboard.length === 0 ? (
            <div style={s.empty}>Leaderboard points will appear after lessons and assignments are completed.</div>
          ) : (
            <div style={s.leaderboardList}>
              {topLeaderboard.map((entry) => (
                <LeaderboardRow key={entry.userId} entry={entry} />
              ))}
            </div>
          )}
        </div>
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
          <div style={s.empty}>
            {showingVideos
              ? 'No weeks have been released yet for this course.'
              : 'No live recorded sessions have been added yet.'}
          </div>
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
                          {showingVideos ? `Week ${group.groupNumber}` : (group.groupLabel || `Week ${group.groupNumber}`)}
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
                              style={{
                                ...s.lessonCard,
                                gridTemplateColumns: isCompact ? '1fr' : s.lessonCard.gridTemplateColumns,
                              }}
                            >
                              <div style={s.lessonNumber}>{lesson.displayWeekNumber}</div>

                              <div style={s.lessonInfo}>
                                <div style={s.lessonTitle}>{lesson.title}</div>
                                <div style={s.lessonDesc}>{lesson.description}</div>
                                <div style={s.lessonProgressRow}>
                                  <div style={{ flex: 1 }}>
                                    <ProgressTrack percent={percent} color={progressColor} compact />
                                  </div>
                                  <span style={s.lessonProgressValue}>{percent}%</span>
                                </div>
                              </div>

                              <div style={{ justifySelf: isCompact ? 'start' : 'end' }}>
                                <StatusBadge status={status} />
                              </div>
                            </Link>
                          );
                        })
                      ) : group.sessions.length === 0 ? (
                        <div style={s.empty}>No live recorded sessions have been added yet.</div>
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
              const sourceWeekLabel = assignment.sourceLabel
                || (Number.isFinite(Number(assignment.weekNumber))
                  ? `Week ${Math.floor(Number(assignment.weekNumber))}`
                  : 'Course Module');
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
            <div style={s.sectionTitle}>Account Settings</div>
            <div style={s.sectionMeta}>Update how your name appears across your student dashboard.</div>
          </div>
        </div>

        <form style={s.settingsForm} onSubmit={handleSaveDisplayName}>
          <div style={s.settingsField}>
            <label htmlFor="display-name" style={s.settingsLabel}>Display Name</label>
            <input
              id="display-name"
              type="text"
              style={s.settingsInput}
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              placeholder="Enter your display name"
            />
            <div style={s.settingsHelp}>
              This name will show on your dashboard and anywhere your student profile appears.
            </div>
          </div>

          <div style={s.snapshotRows}>
            <div style={s.snapshotRow}>
              <div style={s.snapshotLabel}>Login</div>
              <div style={s.snapshotValue}>{user?.email || user?.signInDetails?.loginId || user?.username || 'Signed in'}</div>
            </div>
            <div style={{ ...s.snapshotRow, borderBottom: 'none', paddingBottom: 0 }}>
              <div style={s.snapshotLabel}>Role</div>
              <div style={s.snapshotValue}>{isAdmin ? 'Admin + Student' : 'Student'}</div>
            </div>
          </div>

          <div style={s.settingsActions}>
            <button type="submit" style={s.primaryAction} disabled={savingDisplayName}>
              {savingDisplayName ? 'Saving…' : 'Save Display Name'}
            </button>
            <button type="button" style={s.mutedAction} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          {settingsMessage && (
            <div style={s.settingsMessage}>{settingsMessage}</div>
          )}
        </form>
      </div>
    );
  }

  let viewEyebrow = 'Student Dashboard';
  let viewTitle = `Welcome back, ${displayName}`;
  let viewSubtitle = `${activeCourse?.name || 'Your course'} • Track your progress, next actions, and personal performance in one place.`;

  if (activeView === 'courses') {
    viewEyebrow = 'My Courses';
    viewTitle = activeCourse?.name || 'My Courses';
    viewSubtitle = activeCourse?.description || 'Browse your course videos and live recorded sessions grouped by week.';
  }

  if (activeView === 'calendar') {
    viewEyebrow = 'Calendar';
    viewTitle = 'Learning Calendar';
    viewSubtitle = 'Find your upcoming lectures.';
  }

  if (activeView === 'assignments') {
    viewEyebrow = 'Assignments';
    viewTitle = activeCourse?.name ? `${activeCourse.name} Assignments` : 'Assignments';
    viewSubtitle = 'Open an assignment card to upload your work from the dashboard sidebar.';
  }

  if (activeView === 'settings') {
    viewEyebrow = 'Settings';
    viewTitle = 'Student Settings';
    viewSubtitle = 'Review account details and profile-level preferences for your learning workspace.';
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
                {item.label}
              </button>
            ))}
          </div>

          <div style={s.sidebarSection}>
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
              <div style={s.headerSub}>{viewSubtitle}</div>
            </div>

            {courses.length > 1 && (
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
            )}
          </div>

          {activeView === 'dashboard' && renderDashboardView()}
          {activeView === 'courses' && renderCoursesView()}
          {activeView === 'assignments' && renderAssignmentsView()}
          {activeView === 'calendar' && renderCalendarView()}
          {activeView === 'settings' && renderSettingsView()}
        </main>
      </div>
    </div>
  );
}
