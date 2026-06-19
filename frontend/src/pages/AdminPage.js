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
  adminGetAllSubmissions,
  adminUpdateSupplementalContent,
  adminGetLeads,
  getMyCourses,
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
function StudentsTab({ courseId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', name: '', tempPassword: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { load(); }, [courseId]);

  async function load() {
    setLoading(true);
    try { const { data } = await adminGetStudents(courseId); setStudents(data.students || []); }
    catch { setMessage('Failed to load students.'); }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true); setMessage('');
    try {
      await adminCreateStudent({ ...form, courseId });
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
  transcript: '',
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

function buildDraftBasicPayload(form) {
  const payload = {};
  const parsedWeekNumber = Number.parseFloat(form.weekNumber);

  if (Number.isFinite(parsedWeekNumber)) payload.weekNumber = parsedWeekNumber;
  if ((form.title || '').trim()) payload.title = form.title.trim();
  if ((form.description || '').trim()) payload.description = form.description.trim();
  if ((form.youtubeUrl || '').trim()) payload.youtubeUrl = form.youtubeUrl.trim();
  if ((form.qaLink || '').trim()) payload.qaLink = form.qaLink.trim();
  if ((form.transcript || '').trim()) payload.transcript = form.transcript.trim();

  return payload;
}

function SectionSaveButton({ label, saving, disabled, onClick, message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
      <button
        type="button"
        style={{ ...s.btn, ...s.btnSuccess, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
        disabled={saving || disabled}
        onClick={onClick}
      >
        {saving ? 'Saving…' : label}
      </button>
      {disabled && (
        <span style={{ fontSize: '0.76rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Save basic info first</span>
      )}
      {message && (
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: message.startsWith('✓') ? 'var(--success-fg, #15803d)' : 'var(--destructive, #dc2626)' }}>{message}</span>
      )}
    </div>
  );
}

function WeeksTab({ courseId }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_WEEK);
  const [editingId, setEditingId] = useState(null);
  const [savingSection, setSavingSection] = useState('');
  const [sectionMessages, setSectionMessages] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  // States for importing from other courses
  const [importCourseId, setImportCourseId] = useState('');
  const [importCoursesList, setImportCoursesList] = useState([]);
  const [importWeeks, setImportWeeks] = useState([]);
  const [importWeekId, setImportWeekId] = useState('');
  const [importOptions, setImportOptions] = useState({
    quiz: true,
    docs: true,
    resources: true,
    assignments: true,
    transcript: true,
  });
  const [importMessage, setImportMessage] = useState('');
  const [importWeeksLoading, setImportWeeksLoading] = useState(false);

  useEffect(() => { load(); }, [courseId]);

  // Load list of available courses/batches for the import dropdown
  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await getMyCourses();
        if (data.courses && data.courses.length > 0) {
          setImportCoursesList(data.courses);
          const other = data.courses.find(c => c.courseId !== courseId);
          if (other) {
            setImportCourseId(other.courseId);
          } else {
            setImportCourseId(data.courses[0].courseId);
          }
        } else {
          setImportCoursesList([
            { courseId: 'course-001', name: 'Batch 1 (course-001)' },
            { courseId: 'course-002', name: 'Batch 2 (course-002)' }
          ]);
          setImportCourseId(courseId === 'course-002' ? 'course-001' : 'course-002');
        }
      } catch (err) {
        console.error('Failed to fetch courses for import:', err);
        setImportCoursesList([
          { courseId: 'course-001', name: 'Batch 1 (course-001)' },
          { courseId: 'course-002', name: 'Batch 2 (course-002)' }
        ]);
        setImportCourseId(courseId === 'course-002' ? 'course-001' : 'course-002');
      }
    }
    fetchCourses();
  }, [courseId]);

  // Fetch weeks for the selected source course
  useEffect(() => {
    if (!importCourseId) return;
    async function fetchImportWeeks() {
      setImportWeeksLoading(true);
      setImportMessage('');
      try {
        const { data } = await adminGetWeeks(importCourseId);
        const filteredWeeks = (data.weeks || []).filter(w => w.weekId !== '__supplemental__');
        setImportWeeks(filteredWeeks);
        if (filteredWeeks.length > 0) {
          setImportWeekId(filteredWeeks[0].weekId);
        } else {
          setImportWeekId('');
        }
      } catch (err) {
        console.error('Failed to fetch source weeks:', err);
        setImportWeeks([]);
        setImportWeekId('');
      } finally {
        setImportWeeksLoading(false);
      }
    }
    fetchImportWeeks();
  }, [importCourseId]);

  async function load() {
    setLoading(true);
    try { const { data } = await adminGetWeeks(courseId); setWeeks((data.weeks || []).sort((a, b) => a.weekNumber - b.weekNumber)); }
    catch { setMessage('Failed to load weeks.'); }
    finally { setLoading(false); }
  }

  function setSectionMsg(section, msg) {
    setSectionMessages((prev) => ({ ...prev, [section]: msg }));
  }

  function clearSectionMessages() {
    setSectionMessages({});
  }

  function startAdd() {
    setForm({ ...EMPTY_WEEK, weekNumber: String(weeks.length + 1) });
    setEditingId(null); setShowForm(true); setMessage(''); clearSectionMessages();
    setImportMessage('');
  }

  function startEdit(week) {
    setForm({
      title: week.title, description: week.description, weekNumber: String(week.weekNumber),
      youtubeUrl: week.youtubeUrl || '',
      qaLink: week.qaLink || '',
      transcript: week.transcript || '',
      quiz: week.quiz || { questions: [] },
      resources: week.resources || [],
      docs: week.docs || [],
      assignments: week.assignments || [],
      liveRecordedSessions: week.liveRecordedSessions || [],
      calendarEvents: week.calendarEvents || [],
    });
    setEditingId(week.weekId); setShowForm(true); setMessage(''); clearSectionMessages();
    setImportMessage('');
  }

  function handleImport() {
    if (!importWeekId) {
      setImportMessage('❌ Please select a week to import from.');
      return;
    }
    const sourceWeek = importWeeks.find(w => w.weekId === importWeekId);
    if (!sourceWeek) {
      setImportMessage('❌ Selected week not found.');
      return;
    }

    const updates = {};
    const importedItemsList = [];

    if (importOptions.quiz && sourceWeek.quiz?.questions) {
      updates.quiz = {
        questions: sourceWeek.quiz.questions.map((q) => ({
          ...q,
          id: makeClientId('q'),
        })),
      };
      importedItemsList.push('Quiz');
    }
    if (importOptions.docs && sourceWeek.docs) {
      updates.docs = sourceWeek.docs.map((d) => ({
        ...d,
        id: makeClientId('doc'),
      }));
      importedItemsList.push('Reference Documents');
    }
    if (importOptions.resources && sourceWeek.resources) {
      updates.resources = sourceWeek.resources.map((r) => ({
        ...r,
        id: makeClientId('r'),
      }));
      importedItemsList.push('Resources');
    }
    if (importOptions.assignments && sourceWeek.assignments) {
      updates.assignments = sourceWeek.assignments.map((a) => ({
        ...a,
        id: makeClientId('assignment'),
      }));
      importedItemsList.push('Assignments');
    }
    if (importOptions.transcript && sourceWeek.transcript) {
      updates.transcript = sourceWeek.transcript;
      importedItemsList.push('Transcript');
    }

    if (importedItemsList.length === 0) {
      setImportMessage('⚠️ No sections were selected for import.');
      return;
    }

    setForm((prev) => ({
      ...prev,
      ...updates,
    }));

    setImportMessage(`✓ Imported ${importedItemsList.join(', ')} from ${
      importCoursesList.find((c) => c.courseId === importCourseId)?.name || importCourseId
    } - ${sourceWeek.title || 'Untitled'}. Make sure to click save on each section below.`);
  }

  async function handleSaveBasicInfo(e) {
    e.preventDefault();
    setSavingSection('basic'); setSectionMsg('basic', '');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        weekNumber: parseFloat(form.weekNumber),
        youtubeUrl: form.youtubeUrl,
        qaLink: form.qaLink,
        transcript: form.transcript,
      };
      if (editingId) {
        await adminUpdateWeek(courseId, editingId, payload);
        setSectionMsg('basic', '✓ Basic info saved');
      } else {
        const result = await adminCreateWeek(courseId, payload);
        const newWeekId = result?.data?.week?.weekId;
        if (newWeekId) setEditingId(newWeekId);
        setSectionMsg('basic', '✓ Week created — you can now save other sections');
      }
      load();
    } catch (err) { setSectionMsg('basic', err.response?.data?.message || 'Save failed.'); }
    finally { setSavingSection(''); }
  }

  async function handleSaveSection(sectionKey, payload) {
    setSavingSection(sectionKey); setSectionMsg(sectionKey, '');
    try {
      let targetWeekId = editingId;
      let createdWeek = null;

      if (!targetWeekId) {
        const draftPayload = {
          ...buildDraftBasicPayload(form),
          ...payload,
        };
        const createResult = await adminCreateWeek(courseId, draftPayload);
        createdWeek = createResult?.data?.week || null;
        targetWeekId = createdWeek?.weekId || null;

        if (!targetWeekId) {
          throw new Error('Failed to create a draft week.');
        }

        setEditingId(targetWeekId);
        setSectionMsg('basic', '✓ Draft week created');
        setForm((prev) => ({
          ...prev,
          weekNumber: prev.weekNumber || String(createdWeek.weekNumber || ''),
          title: prev.title || createdWeek.title || '',
          description: prev.description || createdWeek.description || '',
          youtubeUrl: prev.youtubeUrl || createdWeek.youtubeUrl || '',
          qaLink: prev.qaLink || createdWeek.qaLink || '',
        }));
      } else {
        await adminUpdateWeek(courseId, targetWeekId, payload);
      }

      setSectionMsg(sectionKey, createdWeek ? '✓ Saved and created week' : '✓ Saved');
      load();
    } catch (err) { setSectionMsg(sectionKey, err.response?.data?.message || 'Save failed.'); }
    finally { setSavingSection(''); }
  }

  async function handleToggleVisible(week) {
    try { await adminUpdateWeek(courseId, week.weekId, { visible: !week.visible }); load(); }
    catch { setMessage('Failed to update visibility.'); }
  }

  async function handleDelete(weekId) {
    if (!window.confirm('Delete this week? This cannot be undone.')) return;
    try { await adminDeleteWeek(courseId, weekId); load(); }
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

  function addAssignment() {
    setForm((f) => ({
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

  function updateAssignment(idx, field, value) {
    setForm((f) => {
      const assignments = [...(f.assignments || [])];
      assignments[idx] = { ...assignments[idx], [field]: value };
      return { ...f, assignments };
    });
  }

  function removeAssignment(idx) {
    setForm((f) => ({ ...f, assignments: (f.assignments || []).filter((_, i) => i !== idx) }));
  }

  function addRecordedSession() {
    const session = { ...EMPTY_RECORDED_SESSION, id: `rec${Date.now()}` };
    setForm((f) => ({ ...f, liveRecordedSessions: [...(f.liveRecordedSessions || []), session] }));
  }

  function updateRecordedSession(idx, field, value) {
    setForm((f) => {
      const sessions = [...(f.liveRecordedSessions || [])];
      sessions[idx] = { ...sessions[idx], [field]: value };
      return { ...f, liveRecordedSessions: sessions };
    });
  }

  function removeRecordedSession(idx) {
    setForm((f) => ({ ...f, liveRecordedSessions: (f.liveRecordedSessions || []).filter((_, i) => i !== idx) }));
  }

  function addCalendarEvent() {
    const event = { ...EMPTY_CALENDAR_EVENT, id: `cal${Date.now()}` };
    setForm((f) => ({ ...f, calendarEvents: [...(f.calendarEvents || []), event] }));
  }

  function updateCalendarEvent(idx, field, value) {
    setForm((f) => {
      const events = [...(f.calendarEvents || [])];
      events[idx] = { ...events[idx], [field]: value };
      return { ...f, calendarEvents: events };
    });
  }

  function removeCalendarEvent(idx) {
    setForm((f) => ({ ...f, calendarEvents: (f.calendarEvents || []).filter((_, i) => i !== idx) }));
  }

  return (
    <div>
      {message && <p style={s.message}>{message}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button style={s.btn} onClick={startAdd}>+ Add Week</button>
      </div>

      {showForm && (
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
            <div style={s.cardTitle}>{editingId ? 'Edit Week' : 'New Week'}</div>
            <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => setShowForm(false)}>✕ Close</button>
          </div>

          {/* ── Import Panel ────────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, hsl(210, 100%, 98%) 0%, hsl(210, 100%, 96%) 100%)',
            border: '1px solid hsl(210, 100%, 85%)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'hsl(210, 100%, 25%)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span>📥</span> Import Quiz & Documents from Another Cohort
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ ...s.label, color: 'hsl(210, 100%, 20%)' }}>Source Batch</label>
                <select
                  value={importCourseId}
                  onChange={(e) => setImportCourseId(e.target.value)}
                  style={{ ...s.input, marginBottom: 0 }}
                >
                  {importCoursesList.map(c => (
                    <option key={c.courseId} value={c.courseId}>{c.name || c.courseId}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ ...s.label, color: 'hsl(210, 100%, 20%)' }}>Source Week</label>
                {importWeeksLoading ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', padding: '0.6rem 0' }}>Loading weeks...</div>
                ) : importWeeks.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', padding: '0.6rem 0' }}>No weeks found in source batch.</div>
                ) : (
                  <select
                    value={importWeekId}
                    onChange={(e) => setImportWeekId(e.target.value)}
                    style={{ ...s.input, marginBottom: 0 }}
                  >
                    {importWeeks.map(w => (
                      <option key={w.weekId} value={w.weekId}>W{w.weekNumber}: {w.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {importWeeks.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ ...s.label, color: 'hsl(210, 100%, 20%)', marginBottom: '0.5rem' }}>Items to Import</label>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={importOptions.quiz} onChange={(e) => setImportOptions({ ...importOptions, quiz: e.target.checked })} />
                    Quiz Questions ({importWeeks.find(w => w.weekId === importWeekId)?.quiz?.questions?.length || 0})
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={importOptions.docs} onChange={(e) => setImportOptions({ ...importOptions, docs: e.target.checked })} />
                    Reference Docs ({importWeeks.find(w => w.weekId === importWeekId)?.docs?.length || 0})
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={importOptions.resources} onChange={(e) => setImportOptions({ ...importOptions, resources: e.target.checked })} />
                    Resources ({importWeeks.find(w => w.weekId === importWeekId)?.resources?.length || 0})
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={importOptions.assignments} onChange={(e) => setImportOptions({ ...importOptions, assignments: e.target.checked })} />
                    Assignments ({importWeeks.find(w => w.weekId === importWeekId)?.assignments?.length || 0})
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={importOptions.transcript} onChange={(e) => setImportOptions({ ...importOptions, transcript: e.target.checked })} />
                    Transcript
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              style={{ ...s.btn, background: 'hsl(210, 100%, 35%)', color: '#fff' }}
              onClick={handleImport}
              disabled={importWeeks.length === 0 || importWeeksLoading}
            >
              📥 Import Selected Content
            </button>

            {importMessage && (
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: importMessage.startsWith('✓') ? 'var(--success-fg, #15803d)' : 'var(--destructive, #dc2626)',
                background: importMessage.startsWith('✓') ? 'var(--success-light)' : 'hsl(0, 84%, 96%)',
                border: `1px solid ${importMessage.startsWith('✓') ? 'var(--success)' : 'var(--destructive)'}`,
                padding: '0.6rem 0.85rem',
                borderRadius: '8px'
              }}>
                {importMessage}
              </div>
            )}
          </div>

          {/* ── Basic Info ──────────────────────────────────────────────── */}
          <form onSubmit={handleSaveBasicInfo}>
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

            <label style={s.label}>Transcript (Shown in Transcript tab)</label>
            <textarea style={s.textarea} placeholder="Full lecture transcript / notes..."
              value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} />

            <label style={s.label}>Q&amp;A / Calendly Link</label>
            <input style={s.input} type="url" placeholder="https://calendly.com/..."
              value={form.qaLink} onChange={(e) => setForm({ ...form, qaLink: e.target.value })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <button style={s.btn} type="submit" disabled={savingSection === 'basic'}>
                {savingSection === 'basic' ? 'Saving…' : editingId ? 'Save Basic Info' : 'Create Week'}
              </button>
              {sectionMessages.basic && (
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: sectionMessages.basic.startsWith('✓') ? 'var(--success-fg, #15803d)' : 'var(--destructive, #dc2626)' }}>{sectionMessages.basic}</span>
              )}
            </div>
          </form>

          {/* ── Calendar Events ─────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Calendar Events</span>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addCalendarEvent}>+ Calendar Event</button>
            </div>
            {(form.calendarEvents || []).map((event, ci) => (
              <div key={event.id || ci} style={s.qPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Event {ci + 1}</span>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeCalendarEvent(ci)}>Remove</button>
                </div>

                <div style={s.grid2}>
                  <div>
                    <label style={s.label}>Event Type</label>
                    <input
                      style={s.input}
                      type="text"
                      placeholder="e.g. Recorded Video Upload"
                      value={event.kind}
                      onChange={(e) => updateCalendarEvent(ci, 'kind', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Title</label>
                    <input
                      style={s.input}
                      type="text"
                      placeholder="e.g. Product Strategy"
                      value={event.title}
                      onChange={(e) => updateCalendarEvent(ci, 'title', e.target.value)}
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
                      onChange={(e) => updateCalendarEvent(ci, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={s.label}>End Date (Optional)</label>
                    <input
                      style={s.input}
                      type="date"
                      value={event.endDate}
                      onChange={(e) => updateCalendarEvent(ci, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <label style={s.label}>Description</label>
                <textarea
                  style={s.textarea}
                  placeholder="Short description shown in the student calendar"
                  value={event.description}
                  onChange={(e) => updateCalendarEvent(ci, 'description', e.target.value)}
                />
              </div>
            ))}
            <SectionSaveButton
              label="Save Calendar Events"
              saving={savingSection === 'calendarEvents'}
              onClick={() => handleSaveSection('calendarEvents', { calendarEvents: form.calendarEvents || [] })}
              message={sectionMessages.calendarEvents}
            />
          </div>

          {/* ── Resources ───────────────────────────────────────────────── */}
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
                      value={r.title} onChange={(e) => updateResource(ri, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>URL (Link)</label>
                    <input style={s.input} type="url" placeholder="https://..."
                      value={r.url} onChange={(e) => updateResource(ri, 'url', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <SectionSaveButton
              label="Save Resources"
              saving={savingSection === 'resources'}
              onClick={() => handleSaveSection('resources', { resources: form.resources || [] })}
              message={sectionMessages.resources}
            />
          </div>

          {/* ── Reference Documents ─────────────────────────────────────── */}
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
            <SectionSaveButton
              label="Save Documents"
              saving={savingSection === 'docs'}
              onClick={() => handleSaveSection('docs', { docs: form.docs || [] })}
              message={sectionMessages.docs}
            />
          </div>

          {/* ── Assignments ─────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Assignments</span>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addAssignment}>+ Assignment</button>
            </div>
            {(form.assignments || []).map((assignment, ai) => (
              <div key={assignment.id || ai} style={s.qPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Assignment {ai + 1}</span>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeAssignment(ai)}>Remove</button>
                </div>
                <label style={s.label}>Title</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder={`Assignment ${ai + 1}`}
                  value={assignment.title}
                  onChange={(e) => updateAssignment(ai, 'title', e.target.value)}
                />
                <label style={s.label}>Instructions</label>
                <textarea
                  style={s.textarea}
                  placeholder="Tell students what to upload for this assignment."
                  value={assignment.description}
                  onChange={(e) => updateAssignment(ai, 'description', e.target.value)}
                />
              </div>
            ))}
            <SectionSaveButton
              label="Save Assignments"
              saving={savingSection === 'assignments'}
              onClick={() => handleSaveSection('assignments', { assignments: normalizeAssignments(form.assignments || []) })}
              message={sectionMessages.assignments}
            />
          </div>

          {/* ── Live Recorded Sessions ──────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Live Recorded Sessions</span>
              <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={addRecordedSession}>+ Recorded Session</button>
            </div>
            {(form.liveRecordedSessions || []).map((session, si) => (
              <div key={session.id || si} style={s.qPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Recording {si + 1}</span>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.72rem' }} onClick={() => removeRecordedSession(si)}>Remove</button>
                </div>
                <label style={s.label}>Title</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="e.g. Week 1 Live Session Recording"
                  value={session.title}
                  onChange={(e) => updateRecordedSession(si, 'title', e.target.value)}
                />
                <label style={s.label}>Description</label>
                <textarea
                  style={s.textarea}
                  placeholder="Short description shown in the student dashboard"
                  value={session.description}
                  onChange={(e) => updateRecordedSession(si, 'description', e.target.value)}
                />
                <label style={s.label}>Recording URL</label>
                <input
                  style={s.input}
                  type="url"
                  placeholder="https://..."
                  value={session.url}
                  onChange={(e) => updateRecordedSession(si, 'url', e.target.value)}
                />
              </div>
            ))}
            <SectionSaveButton
              label="Save Recorded Sessions"
              saving={savingSection === 'liveRecordedSessions'}
              onClick={() => handleSaveSection('liveRecordedSessions', { liveRecordedSessions: form.liveRecordedSessions || [] })}
              message={sectionMessages.liveRecordedSessions}
            />
          </div>

          {/* ── Quiz ────────────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
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
            <SectionSaveButton
              label="Save Quiz"
              saving={savingSection === 'quiz'}
              onClick={() => handleSaveSection('quiz', { quiz: form.quiz })}
              message={sectionMessages.quiz}
            />
          </div>
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
                    <th style={s.th}>Calendar</th>
                    <th style={s.th}>Assignments</th>
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
                      <td style={s.td}>{w.calendarEvents?.length || 0}</td>
                      <td style={s.td}>{w.assignments?.length || 0}</td>
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

function SupplementalContentTab({ courseId }) {
  const [data, setData] = useState({ assignments: [], liveRecordedSessions: [], calendarEvents: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { load(); }, [courseId]);

  async function load() {
    setLoading(true);
    try {
      const { data: resData } = await adminGetWeeks(courseId);
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
      await adminUpdateSupplementalContent(courseId, data);
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
                courseId={courseId}
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
// Daily Reminders Tab
// ────────────────────────────────────────────────────────────────────────────────
function RemindersTab({ courseId }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { load(); }, [courseId]);

  async function load() {
    setLoading(true);
    try {
      const { data: resData } = await adminGetWeeks(courseId);
      const rawReminders = resData.supplementalContent?.reminders;
      setReminders(Array.isArray(rawReminders) ? rawReminders : []);
    } catch {
      setMessage('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await adminUpdateSupplementalContent(courseId, { reminders });
      setMessage('Reminders saved successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  const addReminder = () => {
    setReminders(prev => [...prev, { id: 'rem-' + Date.now(), title: '', deadline: '' }]);
  };

  const updateReminder = (idx, field, val) => {
    setReminders(prev => {
      const list = [...prev];
      list[idx] = { ...list[idx], [field]: val };
      return list;
    });
  };

  const removeReminder = (idx) => {
    setReminders(prev => prev.filter((_, i) => i !== idx));
  };

  if (loading) return <p style={{ color: 'var(--muted-foreground)', padding: '2rem 0', textAlign: 'center' }}>Loading daily reminders...</p>;

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <span>⏰</span> Weekly Reminder
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
          Set student weekly reminders and deadlines. These reminders will appear on all student dashboards.
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

      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={s.cardTitle}>Configure Reminders</div>
          <button type="button" style={s.btn} onClick={addReminder}>+ Add Reminder</button>
        </div>

        {reminders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⏰</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>No daily reminders set. Add one above!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reminders.map((rem, i) => (
              <div key={rem.id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end', background: '#fff', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px' }}>
                <div>
                  <label style={s.label}>Reminder Action / Title</label>
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. Complete Quiz" value={rem.title} onChange={e => updateReminder(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Deadline Text / Subtitle</label>
                  <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. Deadline: 22mn 22s" value={rem.deadline} onChange={e => updateReminder(i, 'deadline', e.target.value)} />
                </div>
                <button type="button" style={{ ...s.btn, ...s.btnDanger, height: '38px', borderRadius: '8px' }} onClick={() => removeReminder(i)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ ...s.btn, padding: '0.85rem 2.5rem', fontSize: '0.9rem', borderRadius: '10px', boxShadow: 'var(--shadow-md)' }} type="submit" disabled={saving}>
          {saving ? 'Saving changes...' : 'Save Reminders ✓'}
        </button>
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Progress Tab
// ────────────────────────────────────────────────────────────────────────────────
function ProgressTab({ courseId }) {
  const [data,     setData]     = useState([]);
  const [students, setStudents] = useState({});   // userId → name
  const [weeks,    setWeeks]    = useState({});    // weekId → title
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => { load(); }, [courseId]);
  async function load() {
    setLoading(true);
    try {
      const [progressRes, studentsRes, weeksRes] = await Promise.all([
        adminGetAllProgress(courseId),
        adminGetStudents(courseId),
        adminGetWeeks(courseId),
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
      <div style={s.cardTitle}>Student Progress — {courseId}</div>
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
function SubmissionsTab({ courseId }) {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, [courseId]);

  async function load() {
    setLoading(true);
    try {
      const [subRes, stuRes] = await Promise.all([
        adminGetAllSubmissions(courseId),
        adminGetStudents(courseId)
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
        <div style={s.cardTitle}>Student Submissions — {courseId}</div>
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
// Leads Tab
// ────────────────────────────────────────────────────────────────────────────────
function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await adminGetLeads();
      setLeads(data.leads || []);
    } catch {
      setError('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = leads.filter((lead) => {
    const term = search.toLowerCase();
    return (
      (lead.name || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term) ||
      (lead.phone || '').toLowerCase().includes(term)
    );
  });

  if (loading) return <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>;
  if (error) return <p style={{ color: 'var(--destructive)' }}>{error}</p>;

  return (
    <div>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={s.cardTitle}>Landing Page Leads ({leads.length})</div>
          <input
            style={{ ...s.input, width: '250px', marginBottom: 0 }}
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {leads.length === 0 ? (
          <p style={{ color: 'var(--muted-foreground)' }}>No leads submitted yet.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Source</th>
                <th style={s.th}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.enrollmentId || i}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600 }}>{lead.name || '—'}</div>
                  </td>
                  <td style={s.td}>{lead.email || '—'}</td>
                  <td style={s.td}>{lead.phone || '—'}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...s.badgeInfo }}>
                      {lead.masterclassId || 'default'}
                    </span>
                  </td>
                  <td style={s.td}>
                    {lead.timestamp ? new Date(lead.timestamp).toLocaleString() : '—'}
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
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Admin Page
// ────────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState('weeks');
  const [currentCourseId, setCurrentCourseId] = useState(() => {
    return localStorage.getItem('admin_selected_course_id') || 'course-001';
  });

  const handleCourseChange = (courseId) => {
    setCurrentCourseId(courseId);
    localStorage.setItem('admin_selected_course_id', courseId);
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={s.navBrand}>StepSmart Admin</span>
          <span style={s.navSep}>|</span>
          <Link to="/dashboard" style={s.backLink}>← Student View</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
          <span>Batch:</span>
          <select 
            value={currentCourseId} 
            onChange={(e) => handleCourseChange(e.target.value)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              outline: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            <option value="course-001" style={{ color: '#000' }}>Batch 1 (course-001)</option>
            <option value="course-002" style={{ color: '#000' }}>Batch 2 (course-002)</option>
          </select>
        </div>
      </nav>

      <div style={s.tabs}>
        {[
          { id: 'weeks', label: 'Manage Weeks' },
          { id: 'supplemental', label: 'Supplemental Content' },
          { id: 'reminders', label: 'Weekly Reminder' },
          { id: 'students', label: 'Students' },
          { id: 'progress', label: 'Progress' },
          { id: 'submissions', label: 'Submissions' },
          { id: 'leads', label: 'Leads' },
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
        {tab === 'weeks' && <WeeksTab courseId={currentCourseId} />}
        {tab === 'supplemental' && <SupplementalContentTab courseId={currentCourseId} />}
        {tab === 'reminders' && <RemindersTab courseId={currentCourseId} />}
        {tab === 'students' && <StudentsTab courseId={currentCourseId} />}
        {tab === 'progress' && <ProgressTab courseId={currentCourseId} />}
        {tab === 'submissions' && <SubmissionsTab courseId={currentCourseId} />}
        {tab === 'leads' && <LeadsTab />}
      </div>
    </div>
  );
}
