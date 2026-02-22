import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminGetStudents,
  adminCreateStudent,
  adminGetWeeks,
  adminCreateWeek,
  adminUpdateWeek,
  adminDeleteWeek,
  adminGetAllProgress,
} from '../utils/api';

// Default course — in a multi-course system you'd add a course selector.
const COURSE_ID = 'course-001';

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8' },
  nav: {
    background: '#1a1a2e', padding: '0 2rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem', height: '60px',
  },
  navBrand: { fontWeight: 700, color: '#fff', fontSize: '1.1rem' },
  backLink: { color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' },
  tabs: { display: 'flex', gap: '0', borderBottom: '2px solid #e5e7eb', background: '#fff', paddingLeft: '2rem' },
  tab: {
    padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
    color: '#6b7280', background: 'none', border: 'none', borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  tabActive: { color: '#4f46e5', borderBottomColor: '#4f46e5' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e5e7eb' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontWeight: 600 },
  td: { padding: '0.6rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' },
  input: {
    width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.9rem',
    border: '1.5px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box',
    marginBottom: '0.75rem', outline: 'none',
  },
  textarea: {
    width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem',
    border: '1.5px solid #e5e7eb', borderRadius: '6px', boxSizing: 'border-box',
    marginBottom: '0.75rem', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit',
  },
  btn: {
    padding: '0.55rem 1.25rem', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.875rem',
  },
  btnDanger: { background: '#ef4444' },
  btnSecondary: { background: '#6b7280' },
  btnSuccess: { background: '#10b981' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  badge: { display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '99px' },
  success: { background: '#d1fae5', color: '#065f46' },
  info: { background: '#dbeafe', color: '#1e40af' },
  warning: { background: '#fef3c7', color: '#92400e' },
  muted: { background: '#f3f4f6', color: '#6b7280' },
};

// ────────────────────────────────────────────────────────────────────────────────
// Students Tab
// ────────────────────────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', name: '', tempPassword: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await adminGetStudents();
      setStudents(data.students || []);
    } catch { setMessage('Failed to load students.'); }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setMessage('');
    try {
      await adminCreateStudent(form);
      setMessage(`Student ${form.email} created. They will receive a temp password email.`);
      setForm({ email: '', name: '', tempPassword: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create student.');
    } finally { setCreating(false); }
  }

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Add Student</div>
        <form onSubmit={handleCreate}>
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="student@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" placeholder="Jane Smith"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <label style={s.label}>Temporary Password</label>
          <input style={{ ...s.input, maxWidth: '280px' }} type="text" placeholder="TempPass123!"
            value={form.tempPassword} onChange={(e) => setForm({ ...form, tempPassword: e.target.value })} required />
          <br />
          <button style={s.btn} type="submit" disabled={creating}>
            {creating ? 'Creating…' : 'Create Student'}
          </button>
          {message && <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#4f46e5' }}>{message}</p>}
        </form>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>All Students ({students.length})</div>
        {loading ? <p>Loading…</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Email</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.Username}>
                  <td style={s.td}>{st.email}</td>
                  <td style={s.td}>{st.name || '—'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(st.UserStatus === 'CONFIRMED' ? s.success : s.warning) }}>
                      {st.UserStatus}
                    </span>
                  </td>
                  <td style={s.td}>{new Date(st.UserCreateDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Weeks Tab
// ────────────────────────────────────────────────────────────────────────────────
const EMPTY_WEEK = {
  title: '', description: '', weekNumber: '', youtubeUrl: '', qaLink: '',
  quiz: { questions: [] },
};

const EMPTY_QUESTION = { id: '', text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' };

function WeeksTab() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_WEEK);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await adminGetWeeks(COURSE_ID);
      setWeeks((data.weeks || []).sort((a, b) => a.weekNumber - b.weekNumber));
    } catch { setMessage('Failed to load weeks.'); }
    finally { setLoading(false); }
  }

  function startAdd() {
    setForm({ ...EMPTY_WEEK, weekNumber: String(weeks.length + 1) });
    setEditingId(null);
    setShowForm(true);
    setMessage('');
  }

  function startEdit(week) {
    setForm({
      title: week.title,
      description: week.description,
      weekNumber: String(week.weekNumber),
      youtubeUrl: week.youtubeUrl || '',
      qaLink: week.qaLink || '',
      quiz: week.quiz || { questions: [] },
    });
    setEditingId(week.weekId);
    setShowForm(true);
    setMessage('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form, weekNumber: parseInt(form.weekNumber, 10) };
      if (editingId) {
        await adminUpdateWeek(COURSE_ID, editingId, payload);
        setMessage('Week updated.');
      } else {
        await adminCreateWeek(COURSE_ID, payload);
        setMessage('Week created.');
      }
      setShowForm(false);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  }

  async function handleToggleVisible(week) {
    try {
      await adminUpdateWeek(COURSE_ID, week.weekId, { visible: !week.visible });
      load();
    } catch { setMessage('Failed to update visibility.'); }
  }

  async function handleDelete(weekId) {
    if (!window.confirm('Delete this week? This cannot be undone.')) return;
    try {
      await adminDeleteWeek(COURSE_ID, weekId);
      load();
    } catch { setMessage('Delete failed.'); }
  }

  // Question helpers
  function addQuestion() {
    const q = { ...EMPTY_QUESTION, id: `q${Date.now()}` };
    setForm((f) => ({ ...f, quiz: { questions: [...f.quiz.questions, q] } }));
  }

  function updateQuestion(idx, field, value) {
    setForm((f) => {
      const qs = [...f.quiz.questions];
      qs[idx] = { ...qs[idx], [field]: value };
      return { ...f, quiz: { questions: qs } };
    });
  }

  function updateOption(qIdx, oIdx, value) {
    setForm((f) => {
      const qs = [...f.quiz.questions];
      const opts = [...qs[qIdx].options];
      opts[oIdx] = value;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...f, quiz: { questions: qs } };
    });
  }

  function removeQuestion(idx) {
    setForm((f) => ({
      ...f,
      quiz: { questions: f.quiz.questions.filter((_, i) => i !== idx) },
    }));
  }

  return (
    <div>
      {message && <p style={{ color: '#4f46e5', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <button style={s.btn} onClick={startAdd}>+ Add Week</button>
      </div>

      {showForm && (
        <div style={s.card}>
          <div style={s.cardTitle}>{editingId ? 'Edit Week' : 'New Week'}</div>
          <form onSubmit={handleSave}>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Week Number</label>
                <input style={s.input} type="number" min="1"
                  value={form.weekNumber} onChange={(e) => setForm({ ...form, weekNumber: e.target.value })} required />
              </div>
              <div>
                <label style={s.label}>YouTube URL</label>
                <input style={s.input} type="url" placeholder="https://youtu.be/..."
                  value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
              </div>
            </div>
            <label style={s.label}>Title</label>
            <input style={s.input} type="text" placeholder="Week title"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label style={s.label}>Description</label>
            <textarea style={s.textarea} placeholder="Short description shown on dashboard"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label style={s.label}>Calendly / Q&A Link</label>
            <input style={s.input} type="url" placeholder="https://calendly.com/..."
              value={form.qaLink} onChange={(e) => setForm({ ...form, qaLink: e.target.value })} />

            {/* Quiz questions */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Quiz Questions</strong>
                <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addQuestion}>+ Question</button>
              </div>
              {form.quiz.questions.map((q, qi) => (
                <div key={q.id || qi} style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Question {qi + 1}</strong>
                    <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => removeQuestion(qi)}>Remove</button>
                  </div>
                  <label style={s.label}>Question Text</label>
                  <input style={s.input} type="text" value={q.text}
                    onChange={(e) => updateQuestion(qi, 'text', e.target.value)} placeholder="What is...?" />
                  <div style={s.grid2}>
                    {q.options.map((opt, oi) => (
                      <div key={oi}>
                        <label style={s.label}>Option {String.fromCharCode(65 + oi)}</label>
                        <input style={s.input} type="text" value={opt}
                          onChange={(e) => updateOption(qi, oi, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div style={s.grid2}>
                    <div>
                      <label style={s.label}>Correct Option (0=A, 1=B, 2=C, 3=D)</label>
                      <input style={s.input} type="number" min="0" max="3"
                        value={q.correctIndex}
                        onChange={(e) => updateQuestion(qi, 'correctIndex', parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                      <label style={s.label}>Explanation (shown after submission)</label>
                      <input style={s.input} type="text" value={q.explanation}
                        onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button style={s.btn} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Week'}</button>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.card}>
        <div style={s.cardTitle}>All Weeks</div>
        {loading ? <p>Loading…</p> : weeks.length === 0 ? <p style={{ color: '#6b7280' }}>No weeks yet.</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Title</th>
                <th style={s.th}>Questions</th>
                <th style={s.th}>Visibility</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.weekId}>
                  <td style={s.td}>{w.weekNumber}</td>
                  <td style={s.td}>{w.title}</td>
                  <td style={s.td}>{w.quiz?.questions?.length || 0}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(w.visible ? s.success : s.muted) }}>
                      {w.visible ? 'Released' : 'Hidden'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button style={{ ...s.btn, padding: '0.3rem 0.7rem', fontSize: '0.775rem' }} onClick={() => startEdit(w)}>Edit</button>
                      <button style={{ ...s.btn, ...s.btnSuccess, padding: '0.3rem 0.7rem', fontSize: '0.775rem' }} onClick={() => handleToggleVisible(w)}>
                        {w.visible ? 'Hide' : 'Release'}
                      </button>
                      <button style={{ ...s.btn, ...s.btnDanger, padding: '0.3rem 0.7rem', fontSize: '0.775rem' }} onClick={() => handleDelete(w.weekId)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Progress Tab
// ────────────────────────────────────────────────────────────────────────────────
function ProgressTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await adminGetAllProgress(COURSE_ID);
      setData(res.data.progress || []);
    } catch { setError('Failed to load progress data.'); }
    finally { setLoading(false); }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;

  return (
    <div style={s.card}>
      <div style={s.cardTitle}>Student Progress — {COURSE_ID}</div>
      {data.length === 0 ? <p style={{ color: '#6b7280' }}>No progress recorded yet.</p> : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>User ID</th>
              <th style={s.th}>Week</th>
              <th style={s.th}>Video</th>
              <th style={s.th}>Quiz</th>
              <th style={s.th}>Attempts</th>
              <th style={s.th}>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={i}>
                <td style={s.td} title={p.userId}>{p.userId?.slice(0, 8)}…</td>
                <td style={s.td}>{p.weekId}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...(p.videoComplete ? s.success : s.info) }}>
                    {p.videoComplete ? 'Done' : `${p.watchedSegments?.length || 0} segs`}
                  </span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...(p.quizPassed ? s.success : p.quizScore !== null ? s.warning : s.muted) }}>
                    {p.quizPassed ? `Passed (${p.quizScore}/${p.quizTotal})` : p.quizScore !== null ? `${p.quizScore}/${p.quizTotal}` : 'Not taken'}
                  </span>
                </td>
                <td style={s.td}>{p.quizAttempts || 0}</td>
                <td style={s.td}>{p.lastSeen ? new Date(p.lastSeen).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Admin Page
// ────────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState('weeks');

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>CourseLab Admin</span>
        <Link to="/dashboard" style={s.backLink}>← Student View</Link>
      </nav>

      <div style={s.tabs}>
        {[
          { id: 'weeks', label: 'Manage Weeks' },
          { id: 'students', label: 'Students' },
          { id: 'progress', label: 'Progress' },
        ].map((t) => (
          <button
            key={t.id}
            style={{ ...s.tab, ...(tab === t.id ? s.tabActive : {}) }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {tab === 'weeks' && <WeeksTab />}
        {tab === 'students' && <StudentsTab />}
        {tab === 'progress' && <ProgressTab />}
      </div>
    </div>
  );
}
