import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseWeeks, getProgress } from '../utils/api';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';

const s = {
  page: { minHeight: '100vh', background: '#0f0f11', color: '#fff' },
  nav: {
    background: '#1a1a2e', borderBottom: '1px solid #2d2d4e',
    padding: '0 1.5rem', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '56px',
  },
  navBrand: { fontWeight: 700, color: '#fff', textDecoration: 'none', fontSize: '1.1rem' },
  backLink: { color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '0',
    minHeight: 'calc(100vh - 56px)',
  },
  main: { padding: '1.5rem', overflow: 'auto' },
  sidebar: {
    borderLeft: '1px solid #2d2d4e', background: '#13131f',
    padding: '1.5rem', overflow: 'auto',
  },
  weekTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' },
  weekDesc: { color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' },
  qaSection: { marginTop: '1.5rem' },
  qaLink: {
    display: 'inline-block', padding: '0.6rem 1.2rem',
    background: '#4f46e5', color: '#fff', borderRadius: '8px',
    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
  },
  sidebarHeading: { fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' },
  divider: { border: 'none', borderTop: '1px solid #2d2d4e', margin: '1.5rem 0' },
  loading: { padding: '3rem', color: '#9ca3af', textAlign: 'center' },
  error: { padding: '3rem', color: '#f87171', textAlign: 'center' },
};

function extractYouTubeId(url) {
  if (!url) return null;
  // Handles youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/);
  return match ? match[1] : null;
}

export default function LearnPage() {
  const { courseId, weekId } = useParams();
  const navigate = useNavigate();

  const [week, setWeek] = useState(null);
  const [progress, setProgress] = useState(null);
  const [videoComplete, setVideoComplete] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeek();
  }, [courseId, weekId]);

  async function loadWeek() {
    setLoading(true);
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId),
      ]);

      const allWeeks = weeksRes.data.weeks || [];
      const found = allWeeks.find((w) => w.weekId === weekId);
      if (!found) {
        setError('Week not found or not yet released.');
        return;
      }
      setWeek(found);

      const allProgress = progressRes.data.progress || [];
      const weekProgress = allProgress.find((p) => p.weekId === weekId) || null;
      setProgress(weekProgress);
      setVideoComplete(weekProgress?.videoComplete || false);
      setQuizPassed(weekProgress?.quizPassed || false);
    } catch (err) {
      setError('Failed to load this week. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleVideoComplete() {
    setVideoComplete(true);
  }

  function handleQuizPassed() {
    setQuizPassed(true);
  }

  if (loading) return <div style={{ ...s.page, ...s.loading }}>Loading week content…</div>;
  if (error) return <div style={{ ...s.page, ...s.error }}>{error}</div>;
  if (!week) return null;

  const videoId = extractYouTubeId(week.youtubeUrl);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/dashboard" style={s.backLink}>← Back to Dashboard</Link>
        <span style={s.navBrand}>CourseLab</span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Week {week.weekNumber}</span>
      </nav>

      <div style={s.layout}>
        {/* Main content area */}
        <div style={s.main}>
          <div style={s.weekTitle}>{week.title}</div>
          <div style={s.weekDesc}>{week.description}</div>

          {videoId ? (
            <VideoPlayer
              videoId={videoId}
              courseId={courseId}
              weekId={weekId}
              initialProgress={progress}
              onVideoComplete={handleVideoComplete}
            />
          ) : (
            <div style={{ color: '#f87171', padding: '1rem' }}>
              No video has been attached to this week yet.
            </div>
          )}

          {/* Q&A link — shown after video is complete */}
          {videoComplete && week.qaLink && (
            <div style={s.qaSection}>
              <a href={week.qaLink} target="_blank" rel="noopener noreferrer" style={s.qaLink}>
                Book your Q&A Session →
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sidebarHeading}>Your Progress</div>

          <ProgressStep
            label="Watch Video"
            done={videoComplete}
            active={!videoComplete}
          />
          <ProgressStep
            label="Pass Quiz"
            done={quizPassed}
            active={videoComplete && !quizPassed}
            locked={!videoComplete}
          />
          <ProgressStep
            label="Week Complete"
            done={quizPassed}
            locked={!quizPassed}
          />

          <hr style={s.divider} />

          {/* Quiz section — only shown when video is complete */}
          <div style={s.sidebarHeading}>Quiz</div>
          {!videoComplete ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Complete the video to unlock the quiz.
            </p>
          ) : (
            <QuizComponent
              courseId={courseId}
              weekId={weekId}
              questions={week.quiz?.questions || []}
              initialPassed={quizPassed}
              onQuizPassed={handleQuizPassed}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ label, done, active, locked }) {
  let icon = '○';
  let color = '#4b5563';
  if (done) { icon = '✓'; color = '#10b981'; }
  else if (active) { icon = '●'; color = '#4f46e5'; }
  else if (locked) { color = '#374151'; }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', opacity: locked ? 0.5 : 1 }}>
      <span style={{ color, fontWeight: 700, fontSize: '1rem', width: '20px', textAlign: 'center' }}>{icon}</span>
      <span style={{ color: done ? '#10b981' : active ? '#c7d2fe' : '#6b7280', fontSize: '0.875rem' }}>{label}</span>
    </div>
  );
}
