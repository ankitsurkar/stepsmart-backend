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
};
const EMPTY_SUPPLEMENTAL = {
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

const SECTION_META = {
  calendarEvents: { label: 'Calendar events' },
  assignments: { label: 'Assignments' },
  liveRecordedSessions: { label: 'Live recorded sessions' },
};

function WeeksTab() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_WEEK);
  const [supplementalForm, setSupplementalForm] = useState(EMPTY_SUPPLEMENTAL);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await adminGetWeeks(COURSE_ID);
      const allWeeks = data.weeks || [];
      const legacySupplementalWeek = allWeeks.find((week) => {
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
      const visibleWeeks = allWeeks
        .filter((week) => week !== legacySupplementalWeek && week.weekId !== '__supplemental__')
        .sort((a, b) => a.weekNumber - b.weekNumber);
      setWeeks(visibleWeeks);

      const supplementalFromResponse = data.supplementalContent || {};
      const supplementalSource = (
        (supplementalFromResponse.assignments?.length || 0)
        || (supplementalFromResponse.liveRecordedSessions?.length || 0)
        || (supplementalFromResponse.calendarEvents?.length || 0)
      )
        ? supplementalFromResponse
        : legacySupplementalWeek || {};

      setSupplementalForm({
        assignments: normalizeAssignments(supplementalSource.assignments || []),
        liveRecordedSessions: supplementalSource.liveRecordedSessions || [],
        calendarEvents: supplementalSource.calendarEvents || [],
      });
    }
    catch { setMessage('Failed to load weeks.'); }
    finally { setLoading(false); }
  }

  function startAdd() {
    setForm({ ...EMPTY_WEEK, weekNumber: String(weeks.length + 1) });
    setEditingId(null); setShowForm(true); setMessage('');
  }

  function startEdit(week) {
    setForm({
      title: week.title, description: week.description, weekNumber: String(week.weekNumber),
      youtubeUrl: week.youtubeUrl || '',
      qaLink: week.qaLink || '',
      quiz: week.quiz || { questions: [] },
      resources: week.resources || [],
      docs: week.docs || [],
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
      if (editingId) { await adminUpdateWeek(COURSE_ID, editingId, payload); setMessage('Week updated.'); }
      else { await adminCreateWeek(COURSE_ID, payload); setMessage('Week created.'); }
      setShowForm(false); setEditingId(null); load();
    } catch (err) { setMessage(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleToggleVisible(week) {
    try { await adminUpdateWeek(COURSE_ID, week.weekId, { visible: !week.visible }); load(); }
    catch { setMessage('Failed to update visibility.'); }
  }

  async function handleDelete(weekId) {
    if (!window.confirm('Delete this week? This cannot be undone.')) return;
    try { await adminDeleteWeek(COURSE_ID, weekId); load(); }
    catch { setMessage('Delete failed.'); }
  }

  function addQuestion() {
    const q = { ...EMPTY_Q, id: `q${Date.now()}` };
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
      const opts = [...qs[qIdx].options]; opts[oIdx] = value;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...f, quiz: { questions: qs } };
    });
  }

  function removeQuestion(idx) {
    setForm((f) => ({ ...f, quiz: { questions: f.quiz.questions.filter((_, i) => i !== idx) } }));
  }

  function addResource() {
    const r = { ...EMPTY_RESOURCE, id: `r${Date.now()}` };
    setForm((f) => ({ ...f, resources: [...(f.resources || []), r] }));
  }

  function updateResource(idx, field, value) {
    setForm((f) => {
      const resList = [...(f.resources || [])];
      resList[idx] = { ...resList[idx], [field]: value };
      return { ...f, resources: resList };
    });
  }

  function removeResource(idx) {
    setForm((f) => ({ ...f, resources: (f.resources || []).filter((_, i) => i !== idx) }));
  }

  function addDoc() {
    const d = { ...EMPTY_DOC, id: `doc${Date.now()}` };
    setForm((f) => ({ ...f, docs: [...(f.docs || []), d] }));
  }

  function updateDoc(idx, field, value) {
    setForm((f) => {
      const docs = [...(f.docs || [])];
      docs[idx] = { ...docs[idx], [field]: value };
      return { ...f, docs };
    });
  }

  function removeDoc(idx) {
    setForm((f) => ({ ...f, docs: (f.docs || []).filter((_, i) => i !== idx) }));
  }

  function addSupplementalAssignment() {
    setSupplementalForm((f) => ({
      ...f,
      assignments: [
        ...(f.assignments || []),
        {
          ...EMPTY_ASSIGNMENT,
          id: makeClientId('assignment'),
          title: `Assignment ${(f.assignments || []).length + 1}`,
        },
      ],
    }));
  }

  function updateSupplementalAssignment(idx, field, value) {
    setSupplementalForm((f) => {
      const assignments = [...(f.assignments || [])];
      assignments[idx] = { ...assignments[idx], [field]: value };
      return { ...f, assignments };
    });
  }

  function removeSupplementalAssignment(idx) {
    setSupplementalForm((f) => ({
      ...f,
      assignments: (f.assignments || []).filter((_, i) => i !== idx),
    }));
  }

  function addSupplementalRecordedSession() {
    const session = { ...EMPTY_RECORDED_SESSION, id: makeClientId('rec') };
    setSupplementalForm((f) => ({
      ...f,
      liveRecordedSessions: [...(f.liveRecordedSessions || []), session],
    }));
  }

  function updateSupplementalRecordedSession(idx, field, value) {
    setSupplementalForm((f) => {
      const sessions = [...(f.liveRecordedSessions || [])];
      sessions[idx] = { ...sessions[idx], [field]: value };
      return { ...f, liveRecordedSessions: sessions };
    });
  }

  function removeSupplementalRecordedSession(idx) {
    setSupplementalForm((f) => ({
      ...f,
      liveRecordedSessions: (f.liveRecordedSessions || []).filter((_, i) => i !== idx),
    }));
  }

  function addSupplementalCalendarEvent() {
    const event = { ...EMPTY_CALENDAR_EVENT, id: makeClientId('cal') };
    setSupplementalForm((f) => ({
      ...f,
      calendarEvents: [...(f.calendarEvents || []), event],
    }));
  }

  function updateSupplementalCalendarEvent(idx, field, value) {
    setSupplementalForm((f) => {
      const events = [...(f.calendarEvents || [])];
      events[idx] = { ...events[idx], [field]: value };
      return { ...f, calendarEvents: events };
    });
  }

  function removeSupplementalCalendarEvent(idx) {
    setSupplementalForm((f) => ({
      ...f,
      calendarEvents: (f.calendarEvents || []).filter((_, i) => i !== idx),
    }));
  }

  async function handleSaveSection(sectionKey) {
    const updates = {};
    if (sectionKey === 'assignments') {
      updates.assignments = normalizeAssignments(supplementalForm.assignments || []);
    } else if (sectionKey === 'calendarEvents') {
      updates.calendarEvents = supplementalForm.calendarEvents || [];
    } else if (sectionKey === 'liveRecordedSessions') {
      updates.liveRecordedSessions = supplementalForm.liveRecordedSessions || [];
    } else {
      return;
    }

    setSavingSection(sectionKey);
    setMessage('');
    try {
      await adminUpdateSupplementalContent(COURSE_ID, {
        ...updates,
        // Backward-compatible fallback for older backend code paths that still
        // route this through week updates.
        title: 'Course Supplemental Content',
        description: 'System-managed course-level content',
        weekNumber: 0,
        visible: true,
        youtubeUrl: null,
        qaLink: null,
        quiz: { questions: [] },
        resources: [],
        docs: [],
      });

      if (sectionKey === 'assignments') {
        setSupplementalForm((f) => ({ ...f, assignments: updates.assignments }));
      }

      const hasCalendarWithoutStartDate = sectionKey === 'calendarEvents'
        && (updates.calendarEvents || []).some((event) => !event.startDate);

      let successMessage = `${SECTION_META[sectionKey].label} saved.`;
      successMessage += ' This is independent from weeks and visible for students immediately.';
      if (hasCalendarWithoutStartDate) successMessage += ' Add Start Date for each event to make it visible in Calendar.';

      setMessage(successMessage);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || `Failed to save ${SECTION_META[sectionKey].label}.`);
    } finally {
      setSavingSection('');
    }
  }

  async function handleClearSection(sectionKey) {
    const updates = {};
    if (sectionKey === 'assignments') {
      updates.assignments = [];
    } else if (sectionKey === 'calendarEvents') {
      updates.calendarEvents = [];
    } else if (sectionKey === 'liveRecordedSessions') {
      updates.liveRecordedSessions = [];
    } else {
      return;
    }

    setSavingSection(sectionKey);
    setMessage('');
    try {
      await adminUpdateSupplementalContent(COURSE_ID, {
        ...updates,
        // Keep metadata stable for older backend code paths.
        title: 'Course Supplemental Content',
        description: 'System-managed course-level content',
        weekNumber: 0,
        visible: true,
      });
      setSupplementalForm((f) => ({ ...f, ...updates }));
      setMessage(`${SECTION_META[sectionKey].label} removed.`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to remove ${SECTION_META[sectionKey].label}.`);
    } finally {
      setSavingSection('');
    }
  }

  return (
    <div>
      {message && <p style={s.message}>{message}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button style={s.btn} onClick={startAdd}>+ Add Week</button>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Course Content (Independent of Week Release)</div>

        {/* Calendar Events */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Calendar Events</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addSupplementalCalendarEvent}>+ Calendar Event</button>
              <button
                type="button"
                style={s.btn}
                disabled={saving || !!savingSection}
                onClick={() => handleSaveSection('calendarEvents')}
              >
                {savingSection === 'calendarEvents' ? 'Saving…' : 'Save Calendar'}
              </button>
              <button
                type="button"
                style={{ ...s.btn, ...s.btnDanger }}
                disabled={saving || !!savingSection}
                onClick={() => handleClearSection('calendarEvents')}
              >
                Remove Saved
              </button>
            </div>
          </div>
          {(supplementalForm.calendarEvents || []).map((event, ci) => (
            <div key={event.id || ci} style={s.qPanel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Event {ci + 1}</span>
                <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeSupplementalCalendarEvent(ci)}>Remove</button>
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Event Type</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Recorded Video Upload"
                    value={event.kind}
                    onChange={(e) => updateSupplementalCalendarEvent(ci, 'kind', e.target.value)}
                  />
                </div>
                <div>
                  <label style={s.label}>Title</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Product Strategy"
                    value={event.title}
                    onChange={(e) => updateSupplementalCalendarEvent(ci, 'title', e.target.value)}
                  />
                </div>
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Start Date</label>
                  <input
                    style={s.input}
                    type="date"
                    value={event.startDate}
                    onChange={(e) => updateSupplementalCalendarEvent(ci, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label style={s.label}>End Date (Optional)</label>
                  <input
                    style={s.input}
                    type="date"
                    value={event.endDate}
                    onChange={(e) => updateSupplementalCalendarEvent(ci, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <label style={s.label}>Description</label>
              <textarea
                style={s.textarea}
                placeholder="Short description shown in the student calendar"
                value={event.description}
                onChange={(e) => updateSupplementalCalendarEvent(ci, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Assignments */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Assignments</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addSupplementalAssignment}>+ Assignment</button>
              <button
                type="button"
                style={s.btn}
                disabled={saving || !!savingSection}
                onClick={() => handleSaveSection('assignments')}
              >
                {savingSection === 'assignments' ? 'Saving…' : 'Save Assignments'}
              </button>
              <button
                type="button"
                style={{ ...s.btn, ...s.btnDanger }}
                disabled={saving || !!savingSection}
                onClick={() => handleClearSection('assignments')}
              >
                Remove Saved
              </button>
            </div>
          </div>
          {(supplementalForm.assignments || []).map((assignment, ai) => (
            <div key={assignment.id || ai} style={s.qPanel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Assignment {ai + 1}</span>
                <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeSupplementalAssignment(ai)}>Remove</button>
              </div>
              <label style={s.label}>Title</label>
              <input
                style={s.input}
                type="text"
                placeholder={`Assignment ${ai + 1}`}
                value={assignment.title}
                onChange={(e) => updateSupplementalAssignment(ai, 'title', e.target.value)}
              />
              <label style={s.label}>Instructions</label>
              <textarea
                style={s.textarea}
                placeholder="Tell students what to upload for this assignment."
                value={assignment.description}
                onChange={(e) => updateSupplementalAssignment(ai, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Live Recorded Sessions */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Live Recorded Sessions</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addSupplementalRecordedSession}>+ Recorded Session</button>
              <button
                type="button"
                style={s.btn}
                disabled={saving || !!savingSection}
                onClick={() => handleSaveSection('liveRecordedSessions')}
              >
                {savingSection === 'liveRecordedSessions' ? 'Saving…' : 'Save Live Sessions'}
              </button>
              <button
                type="button"
                style={{ ...s.btn, ...s.btnDanger }}
                disabled={saving || !!savingSection}
                onClick={() => handleClearSection('liveRecordedSessions')}
              >
                Remove Saved
              </button>
            </div>
          </div>
          {(supplementalForm.liveRecordedSessions || []).map((session, si) => (
            <div key={session.id || si} style={s.qPanel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Recording {si + 1}</span>
                <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeSupplementalRecordedSession(si)}>Remove</button>
              </div>
              <label style={s.label}>Title</label>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. Week 1 Live Session Recording"
                value={session.title}
                onChange={(e) => updateSupplementalRecordedSession(si, 'title', e.target.value)}
              />
              <label style={s.label}>Description</label>
              <textarea
                style={s.textarea}
                placeholder="Short description shown in the student dashboard"
                value={session.description}
                onChange={(e) => updateSupplementalRecordedSession(si, 'description', e.target.value)}
              />
              <label style={s.label}>Recording URL</label>
              <input
                style={s.input}
                type="url"
                placeholder="https://..."
                value={session.url}
                onChange={(e) => updateSupplementalRecordedSession(si, 'url', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={s.card}>
          <div style={s.cardTitle}>{editingId ? 'Edit Week' : 'New Week'}</div>
          <form onSubmit={handleSave}>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Module Number</label>
                <input style={s.input} type="number" min="0" step="any"
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
            <label style={s.label}>Q&amp;A / Calendly Link</label>
            <input style={s.input} type="url" placeholder="https://calendly.com/..."
              value={form.qaLink} onChange={(e) => setForm({ ...form, qaLink: e.target.value })} />

            {/* Resources */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Resources (Links, PDFs, etc.)</span>
                <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addResource}>+ Resource</button>
              </div>
              {(form.resources || []).map((r, ri) => (
                <div key={r.id || ri} style={s.qPanel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Resource {ri + 1}</span>
                    <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeResource(ri)}>Remove</button>
                  </div>
                  <div style={s.grid2}>
                    <div>
                      <label style={s.label}>Title</label>
                      <input style={s.input} type="text" placeholder="e.g. Week 1 Slides"
                        value={r.title} onChange={(e) => updateResource(ri, 'title', e.target.value)} required />
                    </div>
                    <div>
                      <label style={s.label}>URL (Link)</label>
                      <input style={s.input} type="url" placeholder="https://..."
                        value={r.url} onChange={(e) => updateResource(ri, 'url', e.target.value)} required />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reference Documents */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Reference Documents</span>
                <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addDoc}>+ Document</button>
              </div>
              {(form.docs || []).map((doc, di) => (
                <div key={doc.id || di} style={{ ...s.qPanel, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                  <div>
                    <label style={s.label}>Label</label>
                    <input style={{ ...s.input, marginBottom: 0 }} type="text" placeholder="e.g. Week 1 Slides"
                      value={doc.label} onChange={(e) => updateDoc(di, 'label', e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>Drive URL</label>
                    <input style={{ ...s.input, marginBottom: 0 }} type="url" placeholder="https://drive.google.com/..."
                      value={doc.url} onChange={(e) => updateDoc(di, 'url', e.target.value)} />
                  </div>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.3rem 0.5rem', fontSize: '0.72rem', marginBottom: 0 }}
                    onClick={() => removeDoc(di)}>✕</button>
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Quiz Questions</span>
                <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addQuestion}>+ Question</button>
              </div>
              {form.quiz.questions.map((q, qi) => (
                <div key={q.id || qi} style={s.qPanel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Q{qi + 1}</span>
                    <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeQuestion(qi)}>Remove</button>
                  </div>
                  <label style={s.label}>Question text</label>
                  <input style={s.input} type="text"
                    value={q.text} onChange={(e) => updateQuestion(qi, 'text', e.target.value)} placeholder="What is...?" />
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
                      <label style={s.label}>Correct (0=A 1=B 2=C 3=D)</label>
                      <input style={s.input} type="number" min="0" max="3"
                        value={q.correctIndex} onChange={(e) => updateQuestion(qi, 'correctIndex', parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                      <label style={s.label}>Explanation</label>
                      <input style={s.input} type="text" value={q.explanation}
                        onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
              <button style={s.btn} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Week'}</button>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form >
        </div >
      )
      }

      <div style={s.card}>
        <div style={s.cardTitle}>All Weeks</div>
        {loading ? <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>
          : weeks.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No weeks yet.</p>
            : (
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
            )}
      </div>
    </div >
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
// Main Admin Page
// ────────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState('weeks');

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>StepSmart Admin</span>
        <span style={s.navSep}>|</span>
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
