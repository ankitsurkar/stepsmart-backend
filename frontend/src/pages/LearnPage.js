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
    background: '#0F9D58', // Teal-green matching the screenshot
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
    background: '#9CD3C4', // Soft teal-green from screenshot
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

export default function LearnPage() {
  const { courseId, weekId } = useParams();

  const [week, setWeek] = useState(null);
  const [allWeeks, setAllWeeks] = useState([]);
  const [displayWeekNumber, setDisplayWeekNumber] = useState('');
  const [progress, setProgress] = useState(null);
  const [videoComplete, setVideoComplete] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tabs and Questions state
  const [activeTab, setActiveTab] = useState('progress');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [questionsList, setQuestionsList] = useState([
    { id: 1, author: 'Student A', text: 'Are we covering advanced metrics in week 3?', date: '2 days ago' },
    { id: 2, author: 'Parth Randive', text: 'Yes, week 3 focuses heavily on key product-led growth metrics!', date: '1 day ago' },
  ]);

  useEffect(() => { loadWeek(); }, [courseId, weekId]);

  async function loadWeek() {
    setLoading(true);
    try {
      const [weeksRes, progressRes] = await Promise.all([
        getCourseWeeks(courseId),
        getProgress(courseId),
      ]);
      
      let found = null;
      const isRecordedSession = String(weekId).startsWith('rec-');

      const modulesList = weeksRes.data.modules || [];
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

      const weekProgress = (progressRes.data.progress || []).find((p) => p.weekId === weekId) || null;
      setProgress(weekProgress);
      setVideoComplete(weekProgress?.videoComplete || false);
      setQuizPassed(weekProgress?.quizPassed || false);
      setQuizUnlocked(weekProgress?.videoComplete || false);
    } catch (err) {
      console.error(err);
      setError('Failed to load this content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handlePostQuestion() {
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: Date.now(),
      author: 'You',
      text: newQuestionText.trim(),
      date: 'Just now',
    };
    setQuestionsList([newQ, ...questionsList]);
    setNewQuestionText('');
  }

  if (loading) return <div style={s.loading}>Loading week content…</div>;
  if (error) return <div style={s.error}>{error}</div>;
  if (!week) return null;

  const isRecordedSession = String(weekId).startsWith('rec-');
  const videoUrl = week.storageProvider === 'supabase' ? week.url : null;
  const videoId = videoUrl ? null : extractYouTubeId(week.youtubeUrl || week.url);
  const hasQuiz = (week.quiz?.questions || []).length > 0;
  const weekComplete = videoComplete && (!hasQuiz || quizPassed);

  // Find next lesson
  const currentIdx = allWeeks.findIndex((w) => (w.weekId || w.id) === weekId);
  const nextWeek = currentIdx !== -1 && currentIdx < allWeeks.length - 1 ? allWeeks[currentIdx + 1] : null;

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <Link to="/dashboard?view=courses" style={s.backLink}>← My Courses</Link>
        <span style={s.navBrand}>StepSmart</span>
        {isRecordedSession ? (
          <span style={s.weekBadge}>Recorded Session</span>
        ) : (
          <span style={s.weekBadge}>Week {displayWeekNumber || week.weekNumber}</span>
        )}
      </nav>

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
              onVideoComplete={() => setVideoComplete(true)}
              onQuizUnlock={() => setQuizUnlocked(true)}
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
              onClick={() => setActiveTab('progress')}
              style={{ ...s.tabBtn, ...(activeTab === 'progress' ? s.tabBtnActive : {}) }}
            >
              Your Progress
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              style={{ ...s.tabBtn, ...(activeTab === 'transcript' ? s.tabBtnActive : {}) }}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              style={{ ...s.tabBtn, ...(activeTab === 'resources' ? s.tabBtnActive : {}) }}
            >
              Resources
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'progress' && (
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

          {activeTab === 'resources' && (
            <div style={s.tabContentCard}>
              <div style={s.sidebarHeading}>Resources</div>
              {week.resources && week.resources.length > 0 ? (
                <div style={s.resourceList}>
                  {week.resources.map((r, i) => (
                    <a key={r.id || i} href={r.url} target="_blank" rel="noopener noreferrer" style={s.resourceLink}>
                      <span style={{ fontSize: '1.1rem' }}>📄</span>
                      {r.title}
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                  No resources for this lesson.
                </p>
              )}
            </div>
          )}

          {/* Quiz Card */}
          <div style={s.tabContentCard}>
            <div style={{ ...s.sidebarHeading, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{quizPassed ? '✓' : !quizUnlocked ? '🔒' : '📝'}</span>
              <span>Quiz</span>
            </div>
            {!hasQuiz ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                No quiz for this week. This week is complete after finishing the video.
              </p>
            ) : !quizUnlocked ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                Watch at least 80% of the video to unlock the quiz.
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

          {/* Reference Documents */}
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

          {/* Questions & Answers Card */}
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

          {/* Next Lesson Navigation Button */}
          {nextWeek && (
            <div style={s.nextBtnContainer}>
              <Link to={`/learn/${courseId}/${nextWeek.weekId || nextWeek.id}`} style={s.nextBtn}>
                Next lesson →
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
