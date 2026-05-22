import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminGetStudents,
  adminCreateStudent,
  adminGetWeeks,
  adminCreateWeek,
  adminUpdateWeek,
  adminUpdateSupplementalContent,
  adminDeleteWeek,
  adminGetAllProgress,
  adminGetAllSubmissions,
} from '../utils/api';

const COURSE_ID = 'course-001';

const s = {
  page: { minHeight: '100vh', background: 'var(--background)' },

  // ── Nav ──────────────────────────────────────────────────────────────────
  nav: {
    background: 'var(--primary)', padding: '0 2rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem', height: '60px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  navBrand: { fontWeight: 800, color: '#fff', fontSize: '1.05rem', letterSpacing: '-0.01em' },
  backLink: { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 },
  navSep: { color: 'rgba(255,255,255,0.3)', fontSize: '1rem' },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabs: {
    display: 'flex', borderBottom: '2px solid var(--border)',
    background: 'var(--card)', paddingLeft: '2rem',
  },
  tab: {
    padding: '0.85rem 1.5rem', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.875rem', color: 'var(--muted-foreground)', background: 'none',
    border: 'none', borderBottom: '2.5px solid transparent', marginBottom: '-2px',
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: { color: 'var(--primary)', borderBottomColor: 'var(--primary)' },

  // ── Content area ──────────────────────────────────────────────────────────
  content: { maxWidth: '1040px', margin: '0 auto', padding: '2rem 1rem' },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    background: 'var(--card)', borderRadius: '12px', padding: '1.5rem',
    marginBottom: '1.25rem', border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)',
    marginBottom: '1.1rem',
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  label: {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--foreground)', marginBottom: '0.3rem',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  input: {
    width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.875rem',
    border: '1.5px solid var(--border)', borderRadius: '8px',
    background: 'var(--background)', color: 'var(--foreground)',
    boxSizing: 'border-box', marginBottom: '0.75rem', outline: 'none',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.875rem',
    border: '1.5px solid var(--border)', borderRadius: '8px',
    background: 'var(--background)', color: 'var(--foreground)',
    boxSizing: 'border-box', marginBottom: '0.75rem', minHeight: '76px',
    resize: 'vertical', fontFamily: 'inherit', outline: 'none',
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btn: {
    padding: '0.5rem 1.15rem', background: 'var(--primary)',
    color: 'var(--primary-foreground)', border: 'none', borderRadius: '7px',
    cursor: 'pointer', fontWeight: 700, fontSize: '0.825rem', transition: 'background 0.15s',
  },
  btnDanger: { background: 'var(--destructive)', color: '#fff' },
  btnSecondary: { background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' },
  btnSuccess: { background: 'var(--success)', color: '#fff' },

  // ── Tables ────────────────────────────────────────────────────────────────
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: {
    textAlign: 'left', padding: '0.55rem 0.75rem',
    borderBottom: '2px solid var(--border)',
    color: 'var(--muted-foreground)', fontWeight: 700, fontSize: '0.75rem',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  td: { padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' },

  // ── Badges ────────────────────────────────────────────────────────────────
  badge: {
    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
    padding: '0.2rem 0.55rem', borderRadius: '99px',
  },
  badgeSuccess: { background: 'var(--success-light)', color: 'var(--success-fg)' },
  badgeInfo: { background: 'var(--accent)', color: 'var(--accent-foreground)' },
  badgeWarning: { background: 'hsl(38, 92%, 90%)', color: 'hsl(32, 81%, 29%)' },
  badgeMuted: { background: 'var(--muted)', color: 'var(--muted-foreground)' },

  // ── Misc ──────────────────────────────────────────────────────────────────
  message: { color: 'var(--primary)', fontSize: '0.875rem', marginTop: '0.75rem', fontWeight: 500 },
  qPanel: {
    background: 'var(--background)', borderRadius: '8px', padding: '1rem',
    marginBottom: '0.75rem', border: '1px solid var(--border)',
  },
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
    try { const { data } = await adminGetStudents(); setStudents(data.students || []); }
    catch { setMessage('Failed to load students.'); }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true); setMessage('');
    try {
      await adminCreateStudent(form);
      setMessage(`Student ${form.email} created.`);
      setForm({ email: '', name: '', tempPassword: '' });
      load();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to create student.'); }
    finally { setCreating(false); }
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
          <button style={s.btn} type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create Student'}</button>
          {message && <p style={s.message}>{message}</p>}
        </form>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>All Students ({students.length})</div>
        {loading ? <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p> : (
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
                    <span style={{ ...s.badge, ...(st.UserStatus === 'CONFIRMED' ? s.badgeSuccess : s.badgeWarning) }}>
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
  title: '',
  description: '',
  weekNumber: '',
  youtubeUrl: '',
  qaLink: '',
  quiz: { questions: [] },
  resources: [],
  docs: [],
  assignments: [],
  liveRecordedSessions: [],
  calendarEvents: [],
};

const EMPTY_Q = { id: '', text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' };
const EMPTY_RESOURCE = { id: '', title: '', url: '' };
const EMPTY_DOC = { id: '', label: '', url: '' };
const EMPTY_ASSIGNMENT = { id: '', title: '', description: '' };
const EMPTY_RECORDED_SESSION = { id: '', title: '', description: '', url: '' };
const EMPTY_CALENDAR_EVENT = { id: '', kind: '', title: '', description: '', startDate: '', endDate: '' };

function makeClientId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAssignments(assignments = []) {
  return assignments.map((assignment, index) => ({
    id: assignment.id || makeClientId('assignment'),
    title: (assignment.title || '').trim() || `Assignment ${index + 1}`,
    description: (assignment.description || '').trim(),
  }));
}

function WeeksTab({ category = 'module' }) {
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
      const allWeeks = data.weeks || [];
      const visibleWeeks = allWeeks
        .filter((week) => (
          week.weekId !== '__supplemental__' &&
          week.sk !== 'WEEK#__supplemental__' &&
          Number(week.weekNumber) !== 0 &&
          (week.category || 'module') === category
        ))
        .sort((a, b) => (Number(a.weekNumber) || 0) - (Number(b.weekNumber) || 0));
      setWeeks(visibleWeeks);
    }
    catch { setMessage('Failed to load weeks.'); }
    finally { setLoading(false); }
  }

  function startAdd() {
    setForm({ ...EMPTY_WEEK, weekNumber: String(weeks.length + 1), category });
    setEditingId(null); setShowForm(true); setMessage('');
  }

  function startEdit(week) {
    setForm({
      title: week.title || '',
      description: week.description || '',
      weekNumber: String(week.weekNumber || ''),
      youtubeUrl: week.youtubeUrl || '',
      qaLink: week.qaLink || '',
      quiz: week.quiz || { questions: [] },
      resources: week.resources || [],
      docs: week.docs || [],
      assignments: normalizeAssignments(week.assignments || []),
      liveRecordedSessions: week.liveRecordedSessions || [],
      calendarEvents: week.calendarEvents || [],
    });
    setEditingId(week.weekId); setShowForm(true); setMessage('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setMessage('');
    try {
      const payload = {
        ...form,
        weekNumber: parseFloat(form.weekNumber),
      };
      if (editingId) {
        await adminUpdateWeek(COURSE_ID, editingId, payload);
        setMessage(`${category === 'live' ? 'Session' : 'Week'} updated.`);
      } else {
        await adminCreateWeek(COURSE_ID, payload);
        setMessage(`${category === 'live' ? 'Session' : 'Week'} created.`);
      }
      setShowForm(false);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisible(week) {
    try {
      await adminUpdateWeek(COURSE_ID, week.weekId, { visible: !week.visible });
      load();
    } catch {
      setMessage('Failed to update visibility.');
    }
  }

  async function handleDelete(weekId) {
    if (!window.confirm('Delete this week? This cannot be undone.')) return;
    try {
      await adminDeleteWeek(COURSE_ID, weekId);
      setMessage('Week deleted.');
      load();
    } catch {
      setMessage('Delete failed.');
    }
  }

  const addQuestion = () => {
    const q = { ...EMPTY_Q, id: `q${Date.now()}` };
    setForm((f) => ({ ...f, quiz: { ...f.quiz, questions: [...f.quiz.questions, q] } }));
  };
  const updateQuestion = (idx, field, val) => {
    setForm((f) => {
      const qs = [...f.quiz.questions];
      qs[idx] = { ...qs[idx], [field]: val };
      return { ...f, quiz: { ...f.quiz, questions: qs } };
    });
  };
  const updateOption = (qIdx, oIdx, val) => {
    setForm((f) => {
      const qs = [...f.quiz.questions];
      const opts = [...qs[qIdx].options];
      opts[oIdx] = val;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...f, quiz: { ...f.quiz, questions: qs } };
    });
  };
  const removeQuestion = (idx) => {
    setForm((f) => ({ ...f, quiz: { ...f.quiz, questions: f.quiz.questions.filter((_, i) => i !== idx) } }));
  };

  const addResource = () => setForm((f) => ({ ...f, resources: [...f.resources, { ...EMPTY_RESOURCE, id: `r${Date.now()}` }] }));
  const updateResource = (idx, field, val) => setForm((f) => {
    const list = [...f.resources];
    list[idx] = { ...list[idx], [field]: val };
    return { ...f, resources: list };
  });
  const removeResource = (idx) => setForm((f) => ({ ...f, resources: f.resources.filter((_, i) => i !== idx) }));

  const addDoc = () => setForm((f) => ({ ...f, docs: [...f.docs, { ...EMPTY_DOC, id: `doc${Date.now()}` }] }));
  const updateDoc = (idx, field, val) => setForm((f) => {
    const list = [...f.docs];
    list[idx] = { ...list[idx], [field]: val };
    return { ...f, docs: list };
  });
  const removeDoc = (idx) => setForm((f) => ({ ...f, docs: f.docs.filter((_, i) => i !== idx) }));

  const addAssignment = () => setForm((f) => ({
    ...f,
    assignments: [...f.assignments, { ...EMPTY_ASSIGNMENT, id: makeClientId('asgn'), title: `Assignment ${f.assignments.length + 1}` }]
  }));
  const updateAssignment = (idx, field, val) => setForm((f) => {
    const list = [...f.assignments];
    list[idx] = { ...list[idx], [field]: val };
    return { ...f, assignments: list };
  });
  const removeAssignment = (idx) => setForm((f) => ({ ...f, assignments: f.assignments.filter((_, i) => i !== idx) }));

  const addRecordedSession = () => setForm((f) => ({
    ...f,
    liveRecordedSessions: [...f.liveRecordedSessions, { ...EMPTY_RECORDED_SESSION, id: makeClientId('rec') }]
  }));
  const updateRecordedSession = (idx, field, val) => setForm((f) => {
    const list = [...f.liveRecordedSessions];
    list[idx] = { ...list[idx], [field]: val };
    return { ...f, liveRecordedSessions: list };
  });
  const removeRecordedSession = (idx) => setForm((f) => ({ ...f, liveRecordedSessions: f.liveRecordedSessions.filter((_, i) => i !== idx) }));

  return (
    <div>
      {message && <p style={s.message}>{message}</p>}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button style={s.btn} onClick={startAdd}>+ Create New {category === 'live' ? 'Session' : 'Week'}</button>
        <span style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
          {weeks.length} {category === 'live' ? 'live sessions' : 'modules'} configured
        </span>
      </div>

      {showForm && (
        <div style={{ ...s.card, marginBottom: '2rem', border: '2px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={s.cardTitle}>{editingId ? `Editing ${category === 'live' ? 'Live Session' : 'Module'} ${form.weekNumber}` : `Create New ${category === 'live' ? 'Live Session' : 'Module'}`}</div>
            <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.4rem 0.8rem' }} onClick={() => setShowForm(false)}>✕ Close Editor</button>
          </div>

          <form onSubmit={handleSave}>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>{category === 'live' ? 'Session Number' : 'Module Number'}</label>
                <input style={s.input} type="number" min="0" step="any"
                  value={form.weekNumber} onChange={(e) => setForm({ ...form, weekNumber: e.target.value })} required />
              </div>
              {category === 'module' && (
                <div>
                  <label style={s.label}>Main Lecture Video (YouTube URL)</label>
                  <input style={s.input} type="url" placeholder="https://youtu.be/..."
                    value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
                </div>
              )}
            </div>

            <label style={s.label}>Title</label>
            <input style={s.input} type="text" placeholder="e.g. Introduction to Product Management"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

            <label style={s.label}>Description</label>
            <textarea style={s.textarea} placeholder="Summary of what students will learn this week"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label style={s.label}>Q&amp;A / Calendly Link</label>
            <input style={s.input} type="url" placeholder="https://calendly.com/..."
              value={form.qaLink} onChange={(e) => setForm({ ...form, qaLink: e.target.value })} />

            {/* Resources & Docs Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Resources</span>
                  <button type="button" style={{ ...s.btn, ...s.btnSecondary, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={addResource}>+ Add</button>
                </div>
                {form.resources.map((r, i) => (
                  <div key={r.id || i} style={{ ...s.qPanel, marginBottom: '0.75rem' }}>
                    <input style={{ ...s.input, marginBottom: '0.5rem' }} placeholder="Title" value={r.title} onChange={(e) => updateResource(i, 'title', e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input style={{ ...s.input, marginBottom: 0 }} placeholder="URL" value={r.url} onChange={(e) => updateResource(i, 'url', e.target.value)} />
                      <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => removeResource(i)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Reference Docs</span>
                  <button type="button" style={{ ...s.btn, ...s.btnSecondary, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={addDoc}>+ Add</button>
                </div>
                {form.docs.map((d, i) => (
                  <div key={d.id || i} style={{ ...s.qPanel, marginBottom: '0.75rem' }}>
                    <input style={{ ...s.input, marginBottom: '0.5rem' }} placeholder="Label" value={d.label} onChange={(e) => updateDoc(i, 'label', e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input style={{ ...s.input, marginBottom: 0 }} placeholder="Drive URL" value={d.url} onChange={(e) => updateDoc(i, 'label', e.target.value)} />
                      <button type="button" style={{ ...s.btn, ...s.btnDanger }} onClick={() => removeDoc(i)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Recordings Section */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>Live Recorded Sessions</span>
                <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addRecordedSession}>+ Add Recording</button>
              </div>
              {form.liveRecordedSessions.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', textAlign: 'center', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>No recordings added yet.</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {form.liveRecordedSessions.map((rec, i) => (
                  <div key={rec.id || i} style={s.qPanel}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>Recording {i + 1}</span>
                      <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.4rem', fontSize: '0.7rem' }} onClick={() => removeRecordedSession(i)}>Remove</button>
                    </div>
                    <input style={s.input} placeholder="Title (e.g. Q&A Session)" value={rec.title} onChange={(e) => updateRecordedSession(i, 'title', e.target.value)} />
                    <textarea style={{ ...s.textarea, height: '60px' }} placeholder="Brief description" value={rec.description} onChange={(e) => updateRecordedSession(i, 'description', e.target.value)} />
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="URL (Zoom/YouTube)" value={rec.url} onChange={(e) => updateRecordedSession(i, 'url', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments Section (Modules Only) */}
            {category === 'module' && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>Assignments</span>
                  <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addAssignment}>+ Add Assignment</button>
                </div>
                {form.assignments.map((asgn, i) => (
                  <div key={asgn.id || i} style={s.qPanel}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>Assignment {i + 1}</span>
                      <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.4rem', fontSize: '0.7rem' }} onClick={() => removeAssignment(i)}>Remove</button>
                    </div>
                    <input style={s.input} placeholder="Assignment Title" value={asgn.title} onChange={(e) => updateAssignment(i, 'title', e.target.value)} />
                    <textarea style={{ ...s.textarea, marginBottom: 0 }} placeholder="Instructions for students" value={asgn.description} onChange={(e) => updateAssignment(i, 'description', e.target.value)} />
                  </div>
                ))}
              </div>
            )}

            {/* Quiz Section (Modules Only) */}
            {category === 'module' && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>Quiz Questions</span>
                  <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addQuestion}>+ Add Question</button>
                </div>
                {form.quiz.questions.map((q, i) => (
                  <div key={q.id || i} style={s.qPanel}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700 }}>Question {i + 1}</span>
                      <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.4rem' }} onClick={() => removeQuestion(i)}>✕</button>
                    </div>
                    <input style={s.input} placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(i, 'text', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Option {String.fromCharCode(65 + oi)} {q.correctIndex === oi && '(Correct)'}</label>
                          <input style={s.input} value={opt} onChange={(e) => updateOption(i, oi, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div style={s.grid2}>
                      <div>
                        <label style={s.label}>Correct Index (0-3)</label>
                        <input style={s.input} type="number" min="0" max="3" value={q.correctIndex} onChange={(e) => updateQuestion(i, 'correctIndex', parseInt(e.target.value, 10))} />
                      </div>
                      <div>
                        <label style={s.label}>Explanation</label>
                        <input style={s.input} value={q.explanation} onChange={(e) => updateQuestion(i, 'explanation', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button style={{ ...s.btn, padding: '0.8rem 2rem' }} type="submit" disabled={saving}>
                {saving ? 'Saving Changes...' : editingId ? 'Update Module' : 'Create Module'}
              </button>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary, padding: '0.8rem 1.5rem' }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--muted-foreground)' }}>Loading course structure...</p>
        </div>
      ) : (
        <div style={s.weekList}>
          {weeks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--background)', borderRadius: '22px', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>No {category === 'live' ? 'live sessions' : 'modules'} found for this course.</p>
              <button style={s.btn} onClick={startAdd}>Add your first {category === 'live' ? 'session' : 'module'}</button>
            </div>
          ) : (
            <div style={s.card}>
              <div style={s.cardTitle}>All {category === 'live' ? 'Live Sessions' : 'Weeks'}</div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Title</th>
                    <th style={s.th}>Resources</th>
                    <th style={s.th}>Questions</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.weekId}>
                      <td style={s.td}>{w.weekNumber}</td>
                      <td style={s.td}>{w.title}</td>
                      <td style={s.td}>{w.resources?.length || 0}</td>
                      <td style={s.td}>{w.quiz?.questions?.length || 0}</td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(w.visible ? s.badgeSuccess : s.badgeMuted) }}>
                          {w.visible ? 'Released' : 'Hidden'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button style={{ ...s.btn, padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => startEdit(w)}>Edit</button>
                          <button style={{ ...s.btn, ...(w.visible ? s.btnSecondary : s.btnSuccess), padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handleToggleVisible(w)}>
                            {w.visible ? 'Hide' : 'Release'}
                          </button>
                          <button style={{ ...s.btn, ...s.btnDanger, padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handleDelete(w.weekId)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
// Supplemental Content Tab
// ────────────────────────────────────────────────────────────────────────────────
function RecordedSessionEditor({ rec, i, updateItem, removeItem, courseId }) {
  const [uploadMode, setUploadMode] = useState(
    rec.storageProvider === 'supabase' ? 'file' : 'url'
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setUploadError('');
    try {
      const uploadUrlRes = await adminUpdateSupplementalContent(courseId, {
        action: 'getUploadUrl',
        fileName: file.name,
        mimeType: file.type,
      });
      const { signedUrl, storagePath, storageProvider } = uploadUrlRes.data;

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          updateItem('liveRecordedSessions', i, 'url', signedUrl);
          updateItem('liveRecordedSessions', i, 'storagePath', storagePath);
          updateItem('liveRecordedSessions', i, 'storageProvider', storageProvider);
          setUploading(false);
          setProgress(100);
        } else {
          setUploadError(`Upload failed status: ${xhr.status}`);
          setUploading(false);
        }
      };
      
      xhr.onerror = () => {
        setUploadError('Upload network error.');
        setUploading(false);
      };
      
      xhr.send(file);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Signed URL generation failed.');
      setUploading(false);
    }
  };

  const getFileName = (path) => {
    if (!path) return '';
    return path.split('/').pop().replace(/^\d+-/, '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (uploading) return;
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const eFake = { target: { files: [file] } };
      handleFileChange(eFake);
    }
  };

  const toggleContainerStyle = {
    display: 'flex',
    background: 'hsl(195, 83%, 97%)',
    borderRadius: '10px',
    padding: '3px',
    marginBottom: '1rem',
    border: '1px solid var(--border)',
  };

  const toggleButtonStyle = (active) => ({
    flex: 1,
    padding: '0.45rem',
    borderRadius: '8px',
    fontSize: '0.775rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    background: active ? '#fff' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--muted-foreground)',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
    transition: 'all 0.2s ease',
  });

  const dropZoneStyle = {
    border: '1.5px dashed var(--border)',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    background: 'var(--background)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  };

  return (
    <div style={{ ...s.qPanel, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-sm)', padding: '1.25rem', borderRadius: '12px', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.55rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>Session #{i + 1}</span>
        <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }} onClick={() => removeItem('liveRecordedSessions', i)}>✕ Remove</button>
      </div>

      <label style={s.label}>Session Title</label>
      <input style={s.input} placeholder="e.g. Saturday Live Lecture: Prioritization" value={rec.title} onChange={e => updateItem('liveRecordedSessions', i, 'title', e.target.value)} />

      <label style={s.label}>Description</label>
      <textarea style={{ ...s.textarea, height: '60px' }} placeholder="What was covered in this session?" value={rec.description} onChange={e => updateItem('liveRecordedSessions', i, 'description', e.target.value)} />

      <label style={s.label}>Video Content Source</label>
      <div style={toggleContainerStyle}>
        <button type="button" style={toggleButtonStyle(uploadMode === 'file')} onClick={() => setUploadMode('file')}>📁 Upload Video File</button>
        <button type="button" style={toggleButtonStyle(uploadMode === 'url')} onClick={() => setUploadMode('url')}>🔗 Video URL</button>
      </div>

      {uploadMode === 'url' ? (
        <div>
          <label style={s.label}>Video URL</label>
          <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. https://youtube.com/... or Vimeo/Zoom link" value={rec.url || ''} onChange={e => {
            updateItem('liveRecordedSessions', i, 'url', e.target.value);
            updateItem('liveRecordedSessions', i, 'storagePath', '');
            updateItem('liveRecordedSessions', i, 'storageProvider', '');
          }} />
        </div>
      ) : (
        <div>
          {uploading ? (
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <span>Uploading screen recording...</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'hsl(195, 83%, 94%)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.1s linear' }} />
              </div>
            </div>
          ) : rec.storagePath ? (
            <div style={{ padding: '0.85rem 1rem', border: '1px solid hsl(142, 72%, 80%)', borderRadius: '12px', background: 'hsl(142, 72%, 97%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'hsl(142, 72%, 20%)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {getFileName(rec.storagePath)}
                  </span>
                  <span style={{ fontSize: '0.675rem', color: 'hsl(142, 72%, 30%)' }}>Saved to Supabase Storage</span>
                </div>
              </div>
              <button type="button" style={{ ...s.btn, padding: '0.2rem 0.5rem', fontSize: '0.675rem', borderRadius: '6px', minWidth: 'fit-content' }} onClick={() => fileInputRef.current?.click()}>Replace</button>
            </div>
          ) : (
            <div style={dropZoneStyle} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
              <span style={{ fontSize: '1.5rem' }}>☁️</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Click to browse or drag video here</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--muted-foreground)' }}>Supports MP4, WebM, MOV</span>
            </div>
          )}
          
          <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
          {uploadError && <p style={{ color: 'var(--destructive)', fontSize: '0.7rem', marginTop: '0.4rem', fontWeight: 600 }}>⚠️ {uploadError}</p>}
        </div>
      )}
    </div>
  );
}

function SupplementalContentTab() {
  const [data, setData] = useState({ assignments: [], liveRecordedSessions: [], calendarEvents: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data: resData } = await adminGetWeeks(COURSE_ID);
      setData(normalizeSupplementalContent(resData.supplementalContent));
    } catch {
      setMessage('Failed to load supplemental content.');
    } finally {
      setLoading(false);
    }
  }

  function normalizeSupplementalContent(raw) {
    return {
      assignments: Array.isArray(raw?.assignments) ? raw.assignments : [],
      liveRecordedSessions: Array.isArray(raw?.liveRecordedSessions) ? raw.liveRecordedSessions : [],
      calendarEvents: Array.isArray(raw?.calendarEvents) ? raw.calendarEvents : [],
    };
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setMessage('');
    try {
      await adminUpdateSupplementalContent(COURSE_ID, data);
      setMessage('Supplemental content saved successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  // Helpers
  const addItem = (key, empty) => setData(d => ({ ...d, [key]: [...d[key], { ...empty, id: makeClientId(key === 'liveRecordedSessions' ? 'rec' : key.slice(0, 3)) }] }));
  const updateItem = (key, idx, field, val) => setData(d => {
    const list = [...d[key]];
    list[idx] = { ...list[idx], [field]: val };
    return { ...d, [key]: list };
  });
  const removeItem = (key, idx) => setData(d => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }));

  if (loading) return <p style={{ color: 'var(--muted-foreground)', padding: '2rem 0', textAlign: 'center' }}>Loading supplemental content assets...</p>;

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Intro Banner Card */}
      <div style={{
        background: 'linear-gradient(135deg, hsl(195, 83%, 98%) 0%, hsl(195, 83%, 95%) 100%)',
        border: '1px dashed rgba(195, 83%, 38%, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📚</span> Course Supplemental Assets
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
          Customize and publish course-wide assets including live recordings, assignments, and calendar events. Changes here are immediately reflected on the student dashboards.
        </div>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          background: message.includes('failed') || message.includes('Failed') ? 'hsl(0, 84%, 96%)' : 'var(--success-light)',
          color: message.includes('failed') || message.includes('Failed') ? 'var(--destructive)' : 'var(--success)',
          border: `1px solid ${message.includes('failed') || message.includes('Failed') ? 'var(--destructive)' : 'var(--success)'}`,
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}

      {/* Global Recorded Sessions Card */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ ...s.cardTitle, marginBottom: '0.2rem' }}>🎥 Global Recorded Sessions</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Upload live session and recorded lecture videos visible to all students.</div>
          </div>
          <button type="button" style={s.btn} onClick={() => addItem('liveRecordedSessions', EMPTY_RECORDED_SESSION)}>+ Add Recorded Session</button>
        </div>

        {data.liveRecordedSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🎥</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>No global recorded sessions added yet.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {data.liveRecordedSessions.map((rec, i) => (
              <RecordedSessionEditor
                key={rec.id || i}
                rec={rec}
                i={i}
                updateItem={updateItem}
                removeItem={removeItem}
                courseId={COURSE_ID}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global Course Assignments Card */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ ...s.cardTitle, marginBottom: '0.2rem' }}>📝 Global Course Assignments</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Create capstone assignments or course-wide submissions that all students must submit.</div>
          </div>
          <button type="button" style={s.btn} onClick={() => addItem('assignments', EMPTY_ASSIGNMENT)}>+ Add Assignment</button>
        </div>

        {data.assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📝</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>No global assignments added yet.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {data.assignments.map((asgn, i) => (
              <div key={asgn.id || i} style={{ ...s.qPanel, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-sm)', padding: '1.25rem', borderRadius: '12px', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.55rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>Assignment #{i + 1}</span>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }} onClick={() => removeItem('assignments', i)}>✕ Remove</button>
                </div>
                <label style={s.label}>Assignment Title</label>
                <input style={s.input} placeholder="e.g. Capstone Project: PRD Draft" value={asgn.title} onChange={e => updateItem('assignments', i, 'title', e.target.value)} />
                <label style={s.label}>Instructions & Description</label>
                <textarea style={{ ...s.textarea, marginBottom: 0, minHeight: '100px' }} placeholder="Provide detailed instructions and grading criteria..." value={asgn.description} onChange={e => updateItem('assignments', i, 'description', e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Course Calendar Events Card */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ ...s.cardTitle, marginBottom: '0.2rem' }}>📅 Global Course Calendar Events</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Schedule cohort-wide onboarding bootcamps, Live sessions, and deadlines.</div>
          </div>
          <button type="button" style={s.btn} onClick={() => addItem('calendarEvents', EMPTY_CALENDAR_EVENT)}>+ Add Calendar Event</button>
        </div>

        {data.calendarEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📅</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>No global calendar events created yet.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.25rem' }}>
            {data.calendarEvents.map((evt, i) => (
              <div key={evt.id || i} style={{ ...s.qPanel, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-sm)', padding: '1.25rem', borderRadius: '12px', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.55rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>Event #{i + 1}</span>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }} onClick={() => removeItem('calendarEvents', i)}>✕ Remove</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={s.label}>Event Category</label>
                    <select style={{ ...s.input, marginBottom: 0 }} value={evt.kind || ''} onChange={e => updateItem('calendarEvents', i, 'kind', e.target.value)}>
                      <option value="">Select Kind</option>
                      <option value="Course Module">Course Module</option>
                      <option value="Interview Module">Interview Module</option>
                      <option value="Recorded Video Upload">Recorded Video Upload</option>
                      <option value="Live Q&A">Live Q&A</option>
                      <option value="Orientation">Orientation</option>
                      <option value="Homework Deadline">Homework Deadline</option>
                      <option value="Other Event">Other Event</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Event Title</label>
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. Q&A, Bootcamp Kickoff" value={evt.title || ''} onChange={e => updateItem('calendarEvents', i, 'title', e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={s.label}>Start Date</label>
                    <input type="date" style={{ ...s.input, marginBottom: 0 }} value={evt.startDate || ''} onChange={e => updateItem('calendarEvents', i, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>End Date (Optional)</label>
                    <input type="date" style={{ ...s.input, marginBottom: 0 }} value={evt.endDate || ''} onChange={e => updateItem('calendarEvents', i, 'endDate', e.target.value)} />
                  </div>
                </div>

                <label style={s.label}>Description</label>
                <textarea style={{ ...s.textarea, minHeight: '60px', marginBottom: 0 }} placeholder="Provide brief details for the calendar Detail Popover..." value={evt.description || ''} onChange={e => updateItem('calendarEvents', i, 'description', e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button style={{ ...s.btn, padding: '0.85rem 2.5rem', fontSize: '0.9rem', borderRadius: '10px', boxShadow: 'var(--shadow-md)' }} type="submit" disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Supplemental Content ✓'}
        </button>
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Progress Tab
// ────────────────────────────────────────────────────────────────────────────────
function ProgressTab() {
  const [data,     setData]     = useState([]);
  const [students, setStudents] = useState({});   // userId → name
  const [weeks,    setWeeks]    = useState({});    // weekId → title
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const [progressRes, studentsRes, weeksRes] = await Promise.all([
        adminGetAllProgress(COURSE_ID),
        adminGetStudents(),
        adminGetWeeks(COURSE_ID),
      ]);
      setData(progressRes.data.progress || []);

      const studentMap = {};
      for (const st of (studentsRes.data.students || [])) {
        studentMap[st.Username] = st.name || st.email || st.Username;
      }
      setStudents(studentMap);

      const weekMap = {};
      for (const w of (weeksRes.data.weeks || [])) {
        weekMap[w.weekId] = `Week ${w.weekNumber} – ${w.title}`;
      }
      setWeeks(weekMap);
    }
    catch { setError('Failed to load progress data.'); }
    finally { setLoading(false); }
  }

  if (loading) return <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>;
  if (error) return <p style={{ color: 'var(--destructive)' }}>{error}</p>;

  return (
    <div style={s.card}>
      <div style={s.cardTitle}>Student Progress — {COURSE_ID}</div>
      {data.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No progress recorded yet.</p> : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Student</th>
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
                <td style={s.td}>{students[p.userId] || p.userId?.slice(0, 8) + '…'}</td>
                <td style={s.td}>{weeks[p.weekId] || p.weekId}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...(p.videoComplete ? s.badgeSuccess : s.badgeInfo) }}>
                    {p.videoComplete ? 'Done' : `${p.watchedSegments?.length || 0} segs`}
                  </span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...(p.quizPassed ? s.badgeSuccess : p.quizScore !== null ? s.badgeWarning : s.badgeMuted) }}>
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
// Submissions Tab
// ────────────────────────────────────────────────────────────────────────────────
function SubmissionsTab() {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [subRes, stuRes] = await Promise.all([
        adminGetAllSubmissions(COURSE_ID),
        adminGetStudents()
      ]);
      setSubmissions(subRes.data.submissions || []);
      
      const studentMap = {};
      for (const st of (stuRes.data.students || [])) {
        studentMap[st.Username] = {
          name: st.name || st.email || st.Username,
          email: st.email || ''
        };
      }
      setStudents(studentMap);
    } catch {
      setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = submissions.filter(sub => {
    const term = search.toLowerCase();
    const studentInfo = students[sub.userId] || {};
    const stSearchStr = `${studentInfo.name || ''} ${studentInfo.email || ''}`.toLowerCase();
    const asgnName = (sub.assignmentTitle || sub.fileName || '').toLowerCase();
    return stSearchStr.includes(term) || asgnName.includes(term);
  });

  if (loading) return <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>;
  if (error) return <p style={{ color: 'var(--destructive)' }}>{error}</p>;

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={s.cardTitle}>Student Submissions — {COURSE_ID}</div>
        <input 
          style={{ ...s.input, width: '250px', marginBottom: 0 }} 
          placeholder="Search by student or assignment..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>
      
      {submissions.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No submissions recorded yet.</p> : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Student</th>
              <th style={s.th}>Assignment</th>
              <th style={s.th}>Week</th>
              <th style={s.th}>Submitted At</th>
              <th style={s.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub, i) => (
              <tr key={i}>
                <td style={s.td}>
                  {students[sub.userId] ? (
                    <>
                      <div style={{ fontWeight: 600 }}>{students[sub.userId].name}</div>
                      {students[sub.userId].email && students[sub.userId].name !== students[sub.userId].email && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{students[sub.userId].email}</div>
                      )}
                    </>
                  ) : (
                    sub.userId?.slice(0, 8) + '…'
                  )}
                </td>
                <td style={s.td}>
                  <div style={{ fontWeight: 600 }}>{sub.assignmentTitle || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{sub.fileName}</div>
                </td>
                <td style={s.td}>{sub.weekId}</td>
                <td style={s.td}>{new Date(sub.uploadedAt).toLocaleString()}</td>
                <td style={s.td}>
                  {sub.driveUrl ? (
                    <a href={sub.driveUrl} target="_blank" rel="noreferrer" style={{ ...s.btn, textDecoration: 'none', display: 'inline-block' }}>Open ↗</a>
                  ) : 'No Link'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ ...s.td, textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No matches found for "{search}"
                </td>
              </tr>
            )}
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
  const [tab, setTab] = useState('modules');

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>StepSmart Admin</span>
        <span style={s.navSep}>|</span>
        <Link to="/dashboard" style={s.backLink}>← Student View</Link>
      </nav>

      <div style={s.tabs}>
        {[
          { id: 'modules', label: 'Course Modules' },
          { id: 'recordings', label: 'Live Sessions' },
          { id: 'supplemental', label: 'Supplemental Content' },
          { id: 'students', label: 'Students' },
          { id: 'progress', label: 'Progress' },
          { id: 'submissions', label: 'Submissions' },
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
        {tab === 'modules' && <WeeksTab category="module" />}
        {tab === 'recordings' && <WeeksTab category="live" />}
        {tab === 'supplemental' && <SupplementalContentTab />}
        {tab === 'students' && <StudentsTab />}
        {tab === 'progress' && <ProgressTab />}
        {tab === 'submissions' && <SubmissionsTab />}
      </div>
    </div>
  );
}
