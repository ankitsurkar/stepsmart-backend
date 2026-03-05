import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseWeeks, getProgress } from '../utils/api';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';

const s = {
  page: { minHeight: '100vh', background: 'var(--background)' },

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
    display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 56px)',
  },

  // ── Main / video area ─────────────────────────────────────────────────────
  main: { padding: '1.5rem', overflow: 'auto' },
  weekTitle: {
    fontSize: '1.3rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.2rem',
  },
  weekDesc: {
    color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.25rem',
    lineHeight: 1.6,
  },
  qaSection: { marginTop: '1.25rem' },
  qaLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.6rem 1.25rem', background: 'var(--primary)',
    color: 'var(--primary-foreground)', borderRadius: '8px',
    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
  },

  // ── Resources ────────────────────────────────────────────────────────────
  resourceSection: { marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' },
  resourceHeading: { fontSize: '1.05rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '1rem' },
  resourceList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  resourceLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.75rem 1rem', background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--foreground)', textDecoration: 'none',
    fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.15s, border-color 0.15s',
  },

  // ── Sidebar ───────────────────────────────────────────────────────────────
  sidebar: {
    borderLeft: '1px solid var(--border)', background: 'var(--card)',
    padding: '1.5rem', overflow: 'auto',
    display: 'flex', flexDirection: 'column', gap: '0',
  },
  sidebarSection: { marginBottom: '1.5rem' },
  sidebarHeading: {
    fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted-foreground)',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem',
  },
  divider: { border: 'none', borderTop: '1px solid var(--border)', margin: '1.25rem 0' },

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
};

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/);
  return match ? match[1] : null;
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

export default function LearnPage() {
  const { courseId, weekId } = useParams();

  const [week, setWeek] = useState(null);
  const [progress, setProgress] = useState(null);
  const [videoComplete, setVideoComplete] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadWeek(); }, [courseId, weekId]);

  async function loadWeek() {
    setLoading(true);
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId),
      ]);
      const allWeeks = weeksRes.data.weeks || [];
      const found = allWeeks.find((w) => w.weekId === weekId);
      if (!found) { setError('Week not found or not yet released.'); return; }
      setWeek(found);
      const weekProgress = (progressRes.data.progress || []).find((p) => p.weekId === weekId) || null;
      setProgress(weekProgress);
      setVideoComplete(weekProgress?.videoComplete || false);
      setQuizPassed(weekProgress?.quizPassed || false);
    } catch { setError('Failed to load this week. Please try again.'); }
    finally { setLoading(false); }
  }

  if (loading) return <div style={s.loading}>Loading week content…</div>;
  if (error) return <div style={s.error}>{error}</div>;
  if (!week) return null;

  const videoId = extractYouTubeId(week.youtubeUrl);

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <Link to="/dashboard" style={s.backLink}>← Dashboard</Link>
        <span style={s.navBrand}>StepSmart</span>
        <span style={s.weekBadge}>Week {week.weekNumber}</span>
      </nav>

      <div style={s.layout}>
        {/* Main content */}
        <div style={s.main}>
          <div style={s.weekTitle}>{week.title}</div>
          <div style={s.weekDesc}>{week.description}</div>

          {videoId ? (
            <VideoPlayer
              videoId={videoId}
              courseId={courseId}
              weekId={weekId}
              initialProgress={progress}
              onVideoComplete={() => setVideoComplete(true)}
            />
          ) : (
            <div style={s.noVideo}>No video has been attached to this week yet.</div>
          )}

          {videoComplete && week.qaLink && (
            <div style={s.qaSection}>
              <a href={week.qaLink} target="_blank" rel="noopener noreferrer" style={s.qaLink}>
                Book your Q&amp;A session →
              </a>
            </div>
          )}

          {videoComplete && week.resources && week.resources.length > 0 && (
            <div style={s.resourceSection}>
              <div style={s.resourceHeading}>Resources</div>
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
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sidebarSection}>
            <div style={s.sidebarHeading}>Your progress</div>
            <ProgressStep label="Watch video" done={videoComplete} active={!videoComplete} />
            <ProgressStep label="Pass quiz" done={quizPassed} active={videoComplete && !quizPassed} locked={!videoComplete} />
            <ProgressStep label="Week complete" done={quizPassed} locked={!quizPassed} />
          </div>

          <hr style={s.divider} />

          <div style={s.sidebarSection}>
            <div style={s.sidebarHeading}>Quiz</div>
            {!videoComplete ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Finish the video to unlock the quiz.
              </p>
            ) : (
              <QuizComponent
                courseId={courseId}
                weekId={weekId}
                questions={week.quiz?.questions || []}
                initialPassed={quizPassed}
                onQuizPassed={() => setQuizPassed(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
