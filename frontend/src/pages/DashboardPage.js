import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, getCourseWeeks, getProgress } from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8' },
  nav: {
    background: '#fff', borderBottom: '1px solid #e5e7eb',
    padding: '0 2rem', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '60px',
  },
  navBrand: { fontWeight: 700, fontSize: '1.2rem', color: '#1a1a2e', textDecoration: 'none' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink: { color: '#4f46e5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 },
  signOutBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '6px',
    padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.875rem', color: '#555',
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  heading: { fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' },
  subheading: { color: '#666', marginBottom: '2rem' },
  weekCard: {
    background: '#fff', borderRadius: '12px', padding: '1.5rem',
    marginBottom: '1rem', border: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', gap: '1.25rem',
    textDecoration: 'none', color: 'inherit',
    transition: 'box-shadow 0.2s',
  },
  weekNum: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: '#ede9fe', color: '#4f46e5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '1rem', flexShrink: 0,
  },
  weekInfo: { flex: 1 },
  weekTitle: { fontWeight: 600, fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.2rem' },
  weekDesc: { fontSize: '0.85rem', color: '#666' },
  statusBadge: {
    fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem',
    borderRadius: '99px', flexShrink: 0,
  },
  progressBar: {
    height: '6px', background: '#e5e7eb', borderRadius: '3px',
    marginTop: '0.5rem', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: '3px', transition: 'width 0.3s' },
  locked: { opacity: 0.5, cursor: 'default', pointerEvents: 'none' },
  error: { color: '#dc2626', padding: '2rem' },
  loading: { padding: '2rem', color: '#666' },
};

function weekStatus(progress) {
  if (!progress) return 'not-started';
  if (progress.quizPassed) return 'complete';
  if (progress.videoComplete) return 'quiz-ready';
  if (progress.watchedSegments?.length > 0) return 'in-progress';
  return 'not-started';
}

function StatusBadge({ status }) {
  const map = {
    'complete': { label: 'Complete', bg: '#d1fae5', color: '#065f46' },
    'quiz-ready': { label: 'Take Quiz', bg: '#fef3c7', color: '#92400e' },
    'in-progress': { label: 'In Progress', bg: '#dbeafe', color: '#1e40af' },
    'not-started': { label: 'Not Started', bg: '#f3f4f6', color: '#6b7280' },
  };
  const { label, bg, color } = map[status] || map['not-started'];
  return <span style={{ ...s.statusBadge, background: bg, color }}>{label}</span>;
}

function ProgressBar({ progress }) {
  if (!progress) return null;
  const segments = progress.watchedSegments?.length || 0;
  const total = progress.duration ? Math.ceil(progress.duration / 10) : 1;
  const pct = Math.min(Math.round((segments / total) * 100), 100);
  const color = progress.videoComplete ? '#10b981' : '#4f46e5';
  return (
    <div style={s.progressBar}>
      <div style={{ ...s.progressFill, width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [progressMap, setProgressMap] = useState({});  // weekId → progress item
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data } = await getMyCourses();
      const courseList = data.courses || [];
      setCourses(courseList);

      if (courseList.length > 0) {
        const course = courseList[0];
        setActiveCourse(course);
        await loadCourse(course.courseId);
      }
    } catch (err) {
      setError('Failed to load your courses. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCourse(courseId) {
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId),
      ]);
      setWeeks(weeksRes.data.weeks || []);

      const map = {};
      for (const p of (progressRes.data.progress || [])) {
        map[p.weekId] = p;
      }
      setProgressMap(map);
    } catch (err) {
      setError('Failed to load course content.');
    }
  }

  async function handleSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) return <div style={s.loading}>Loading your courses…</div>;
  if (error) return <div style={s.error}>{error}</div>;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>CourseLab</span>
        <div style={s.navRight}>
          {isAdmin && (
            <Link to="/admin" style={s.navLink}>Admin Panel</Link>
          )}
          <button style={s.signOutBtn} onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.heading}>
          {activeCourse ? activeCourse.name : 'My Courses'}
        </div>
        <div style={s.subheading}>
          {activeCourse ? activeCourse.description : 'Welcome back!'}
        </div>

        {weeks.length === 0 ? (
          <p style={{ color: '#666' }}>No weeks have been released yet. Check back soon.</p>
        ) : (
          weeks.map((week) => {
            const progress = progressMap[week.weekId];
            const status = weekStatus(progress);
            const isLocked = !week.visible;
            return (
              <Link
                key={week.weekId}
                to={`/learn/${week.courseId}/${week.weekId}`}
                style={{ ...s.weekCard, ...(isLocked ? s.locked : {}) }}
              >
                <div style={s.weekNum}>{week.weekNumber}</div>
                <div style={s.weekInfo}>
                  <div style={s.weekTitle}>{week.title}</div>
                  <div style={s.weekDesc}>{week.description}</div>
                  <ProgressBar progress={progress} />
                </div>
                <StatusBadge status={isLocked ? 'not-started' : status} />
              </Link>
            );
          })
        )}
      </main>
    </div>
  );
}
