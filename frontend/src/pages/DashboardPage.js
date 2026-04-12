import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, getCourseWeeks, getProgress } from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: 'var(--background)' },

  // ── Nav ──────────────────────────────────────────────────────────────────
  nav: {
    background: 'var(--primary)', padding: '0 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  navBrand: {
    fontWeight: 800, fontSize: '1.15rem', color: '#fff',
    textDecoration: 'none', letterSpacing: '-0.01em',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  navDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.7)',
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink: {
    color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
    fontSize: '0.875rem', fontWeight: 600,
    padding: '0.3rem 0.75rem', borderRadius: '6px',
    background: 'rgba(255,255,255,0.15)', transition: 'background 0.15s',
  },
  signOutBtn: {
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px', padding: '0.35rem 0.9rem', cursor: 'pointer',
    fontSize: '0.875rem', color: '#fff', fontWeight: 500,
  },

  // ── Hero strip ────────────────────────────────────────────────────────────
  hero: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-foreground) 100%)',
    padding: '2.5rem 2rem', color: '#fff',
  },
  heroInner: { maxWidth: '900px', margin: '0 auto' },
  heroTitle: { fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: '1rem' },
  heroStats: {
    display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
    marginTop: '1.15rem',
  },
  heroStat: {
    display: 'inline-flex', alignItems: 'baseline', gap: '0.45rem',
    padding: '0.55rem 0.9rem', borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
  },
  heroStatValue: { fontSize: '1rem', fontWeight: 800, color: '#fff' },
  heroStatLabel: { fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' },

  // ── Main content ──────────────────────────────────────────────────────────
  main: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  sectionLabel: {
    fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-foreground)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem',
  },
  leaderboardCard: {
    background: 'var(--card)', borderRadius: '16px', padding: '1.25rem',
    marginBottom: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
  },
  leaderboardIntro: {
    color: 'var(--muted-foreground)', fontSize: '0.875rem',
    lineHeight: 1.6, marginBottom: '1rem',
  },
  leaderboardList: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  leaderboardRow: {
    display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr) auto',
    gap: '0.85rem', alignItems: 'center',
    padding: '0.85rem 1rem', borderRadius: '12px',
    background: 'var(--background)', border: '1px solid var(--border)',
  },
  leaderboardRowCurrent: {
    background: 'linear-gradient(135deg, rgba(72, 153, 194, 0.14) 0%, rgba(72, 153, 194, 0.05) 100%)',
    borderColor: 'rgba(72, 153, 194, 0.32)',
  },
  leaderboardRank: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'var(--accent)', color: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.92rem',
  },
  leaderboardIdentity: { minWidth: 0 },
  leaderboardNameRow: { display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.15rem' },
  leaderboardName: {
    fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  youBadge: {
    fontSize: '0.7rem', fontWeight: 800,
    padding: '0.18rem 0.45rem', borderRadius: '999px',
    background: 'var(--success-light)', color: 'var(--success-fg)',
    letterSpacing: '0.03em',
  },
  leaderboardMeta: { fontSize: '0.82rem', color: 'var(--muted-foreground)' },
  leaderboardPoints: { textAlign: 'right', flexShrink: 0 },
  leaderboardPointsValue: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--foreground)' },
  leaderboardPointsLabel: {
    fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted-foreground)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  leaderboardSubLabel: {
    fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted-foreground)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    margin: '1.1rem 0 0.75rem',
  },

  // ── Week cards ────────────────────────────────────────────────────────────
  weekCard: {
    background: 'var(--card)', borderRadius: '12px', padding: '1.25rem 1.5rem',
    marginBottom: '0.75rem', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: '1.25rem',
    textDecoration: 'none', color: 'inherit',
    boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s, transform 0.15s',
  },
  weekNum: {
    width: '44px', height: '44px', borderRadius: '10px',
    background: 'var(--accent)', color: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.95rem', flexShrink: 0,
  },
  weekNumComplete: {
    background: 'var(--success-light)', color: 'var(--success-fg)',
  },
  weekInfo: { flex: 1, minWidth: 0 },
  weekTitle: {
    fontWeight: 700, fontSize: '0.975rem', color: 'var(--foreground)',
    marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  weekDesc: { fontSize: '0.825rem', color: 'var(--muted-foreground)' },
  progressBarWrap: {
    height: '4px', background: 'var(--muted)', borderRadius: '2px',
    marginTop: '0.5rem', overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: '2px', transition: 'width 0.4s' },
  statusBadge: {
    fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem',
    borderRadius: '99px', flexShrink: 0, letterSpacing: '0.02em',
  },
  locked: { opacity: 0.45, cursor: 'default', pointerEvents: 'none' },

  // ── States ────────────────────────────────────────────────────────────────
  empty: { color: 'var(--muted-foreground)', textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' },
  error: { color: 'var(--destructive)', padding: '3rem 2rem' },
  loading: { padding: '3rem 2rem', color: 'var(--muted-foreground)' },
};

const BADGE = {
  complete:     { label: 'Complete',     bg: 'var(--success-light)', color: 'var(--success-fg)' },
  'quiz-ready': { label: 'Take Quiz',    bg: 'hsl(38, 92%, 90%)',    color: 'hsl(32, 81%, 29%)' },
  'in-progress':{ label: 'In Progress',  bg: 'var(--accent)',        color: 'var(--accent-foreground)' },
  'not-started':{ label: 'Not Started',  bg: 'var(--muted)',         color: 'var(--muted-foreground)' },
};

function hasQuiz(week) {
  return (week?.quiz?.questions || []).length > 0;
}

function weekStatus(week, progress) {
  if (!progress) return 'not-started';
  if (progress.quizPassed)   return 'complete';
  if (progress.videoComplete) return hasQuiz(week) ? 'quiz-ready' : 'complete';
  if (progress.watchedSegments?.length > 0) return 'in-progress';
  return 'not-started';
}

function StatusBadge({ status }) {
  const { label, bg, color } = BADGE[status] || BADGE['not-started'];
  return <span style={{ ...s.statusBadge, background: bg, color }}>{label}</span>;
}

function ProgressBar({ progress }) {
  if (!progress) return null;
  const segments = progress.watchedSegments?.length || 0;
  const total = progress.duration ? Math.ceil(progress.duration / 10) : 1;
  const pct = Math.min(Math.round((segments / total) * 100), 100);
  const color = progress.videoComplete ? 'var(--success)' : 'var(--primary)';
  return (
    <div style={s.progressBarWrap}>
      <div style={{ ...s.progressBarFill, width: `${pct}%`, background: color }} />
    </div>
  );
}

function LeaderboardRow({ entry }) {
  return (
    <div style={{ ...s.leaderboardRow, ...(entry.isCurrentUser ? s.leaderboardRowCurrent : {}) }}>
      <div style={s.leaderboardRank}>#{entry.rank}</div>

      <div style={s.leaderboardIdentity}>
        <div style={s.leaderboardNameRow}>
          <div style={s.leaderboardName}>{entry.displayName}</div>
          {entry.isCurrentUser && <span style={s.youBadge}>You</span>}
        </div>
        <div style={s.leaderboardMeta}>
          {entry.completedLectures} lecture{entry.completedLectures === 1 ? '' : 's'} complete
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

export default function DashboardPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

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
    } catch { setError('Failed to load your courses. Please refresh.'); }
    finally { setLoading(false); }
  }

  async function loadCourse(courseId) {
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId, { includeLeaderboard: true }),
      ]);
      setWeeks(weeksRes.data.weeks || []);
      const map = {};
      for (const p of (progressRes.data.progress || [])) map[p.weekId] = p;
      setProgressMap(map);
      setLeaderboard(progressRes.data.leaderboard || []);
    } catch { setError('Failed to load course content.'); }
  }

  async function handleSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) return <div style={s.loading}>Loading your courses…</div>;
  if (error)   return <div style={s.error}>{error}</div>;

  const completedCount = weeks.filter((w) => {
    const p = progressMap[w.weekId];
    if (!p) return false;
    return hasQuiz(w) ? !!p.quizPassed : !!p.videoComplete;
  }).length;
  const leaderboardRows = (leaderboard || []).filter((entry) => entry.totalPoints > 0 || entry.isCurrentUser);
  const myLeaderboardEntry = leaderboardRows.find((entry) => entry.isCurrentUser) || null;
  const topLeaderboard = leaderboardRows.slice(0, 8);
  const showPinnedCurrentUser = myLeaderboardEntry && !topLeaderboard.some((entry) => entry.userId === myLeaderboardEntry.userId);

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navDot} />
          StepSmart
        </div>
        <div style={s.navRight}>
          {isAdmin && <Link to="/admin" style={s.navLink}>Admin</Link>}
          <button style={s.signOutBtn} onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTitle}>{activeCourse?.name || 'My Courses'}</div>
          <div style={s.heroSub}>
            {activeCourse?.description || 'Welcome back!'}
            {weeks.length > 0 && (
              <span style={{ marginLeft: '1rem', fontWeight: 600 }}>
                {completedCount}/{weeks.length} weeks complete
              </span>
            )}
          </div>
          {myLeaderboardEntry && (
            <div style={s.heroStats}>
              <div style={s.heroStat}>
                <span style={s.heroStatValue}>{myLeaderboardEntry.totalPoints}</span>
                <span style={s.heroStatLabel}>total points</span>
              </div>
              <div style={s.heroStat}>
                <span style={s.heroStatValue}>#{myLeaderboardEntry.rank}</span>
                <span style={s.heroStatLabel}>leaderboard rank</span>
              </div>
              <div style={s.heroStat}>
                <span style={s.heroStatValue}>{myLeaderboardEntry.assignmentsSubmitted}</span>
                <span style={s.heroStatLabel}>assignments submitted</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Week list */}
      <main style={s.main}>
        {leaderboardRows.length > 0 && (
          <>
            <div style={s.sectionLabel}>Leaderboard</div>
            <div style={s.leaderboardCard}>
              <div style={s.leaderboardIntro}>
                Earn 1 point for each completed lecture and 5 points for the first assignment upload in a week.
              </div>

              <div style={s.leaderboardList}>
                {topLeaderboard.map((entry) => (
                  <LeaderboardRow key={entry.userId} entry={entry} />
                ))}
              </div>

              {showPinnedCurrentUser && (
                <>
                  <div style={s.leaderboardSubLabel}>Your Position</div>
                  <LeaderboardRow entry={myLeaderboardEntry} />
                </>
              )}
            </div>
          </>
        )}

        <div style={s.sectionLabel}>Course Weeks</div>

        {weeks.length === 0 ? (
          <div style={s.empty}>No weeks released yet — check back soon.</div>
        ) : (
          weeks.map((week) => {
            const progress = progressMap[week.weekId];
            const status = weekStatus(week, progress);
            const isLocked = !week.visible;
            const isComplete = status === 'complete';
            return (
              <Link
                key={week.weekId}
                to={`/learn/${week.courseId}/${week.weekId}`}
                style={{ ...s.weekCard, ...(isLocked ? s.locked : {}) }}
              >
                <div style={{ ...s.weekNum, ...(isComplete ? s.weekNumComplete : {}) }}>
                  {isComplete ? '✓' : week.weekNumber}
                </div>
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
