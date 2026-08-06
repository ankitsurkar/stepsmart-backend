import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminGetStudents,
  adminCreateStudent,
  adminCreateCourse,
  adminGetWeeks,
  adminCreateWeek,
  adminUpdateWeek,
  adminDeleteWeek,
  adminGetAllProgress,
  adminGetAllSubmissions,
  adminUpdateSupplementalContent,
  adminGetLeads,
  getMyCourses,
  adminSaveGymQuestion,
  adminDeleteGymQuestion,
  adminSaveBlogPost,
  adminDeleteBlogPost,
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
    background: 'var(--card)', paddingLeft: '1rem',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
  },
  tab: {
    padding: '0.85rem 1.5rem', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.875rem', color: 'var(--muted-foreground)', background: 'none',
    border: 'none', borderBottom: '2.5px solid transparent', marginBottom: '-2px',
    transition: 'color 0.15s, border-color 0.15s',
    flexShrink: 0,
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
    try { const { data } = await adminGetStudents(courseId); setStudents((data.students || []).filter(st => st.enrolled)); }
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
          <div style={s.grid2} className="admin-grid2">
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
          <div className="responsive-table-container">
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
          </div>
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
  weekTitle: '',
  youtubeUrl: '',
  qaLink: '',
  transcript: '',
  textContent: '',
  category: 'module',
  storagePath: '',
  storageProvider: '',
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
const EMPTY_ASSIGNMENT = { id: '', title: '', description: '', solution: '', solutionUrl: '' };
const EMPTY_RECORDED_SESSION = { id: '', title: '', description: '', url: '' };
const EMPTY_CALENDAR_EVENT = { id: '', kind: '', title: '', description: '', startDate: '', endDate: '' };
const EMPTY_GLOBAL_RESOURCE = { title: '', description: '', docs: [] };
const EMPTY_RESOURCE_DOC = { label: '', url: '' };

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
    solution: (assignment.solution || '').trim(),
    solutionUrl: (assignment.solutionUrl || '').trim(),
  }));
}

function buildDraftBasicPayload(form) {
  const payload = {};
  const parsedWeekNumber = Number.parseFloat(form.weekNumber);

  if (Number.isFinite(parsedWeekNumber)) payload.weekNumber = parsedWeekNumber;
  if ((form.title || '').trim()) payload.title = form.title.trim();
  if ((form.weekTitle || '').trim()) payload.weekTitle = form.weekTitle.trim();
  if ((form.description || '').trim()) payload.description = form.description.trim();
  if ((form.youtubeUrl || '').trim()) payload.youtubeUrl = form.youtubeUrl.trim();
  if ((form.qaLink || '').trim()) payload.qaLink = form.qaLink.trim();
  if ((form.transcript || '').trim()) payload.transcript = form.transcript.trim();
  if (form.textContent !== undefined) payload.textContent = form.textContent.trim();
  if (form.category) payload.category = form.category;
  if (form.storagePath !== undefined) payload.storagePath = form.storagePath;
  if (form.storageProvider !== undefined) payload.storageProvider = form.storageProvider;

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

  const [uploadMode, setUploadMode] = useState('url');
  const [weekUploading, setWeekUploading] = useState(false);
  const [weekUploadProgress, setWeekUploadProgress] = useState(0);
  const [weekUploadError, setWeekUploadError] = useState('');
  const weekFileInputRef = React.useRef(null);

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

  const getFileName = (path) => {
    if (!path) return '';
    return path.split('/').pop().replace(/^\d+-/, '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (weekUploading) return;
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const eFake = { target: { files: [file] } };
      handleWeekFileChange(eFake);
    }
  };

  const handleWeekFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setWeekUploading(true);
    setWeekUploadProgress(0);
    setWeekUploadError('');
    try {
      let targetWeekId = editingId;
      if (!targetWeekId) {
        const draftPayload = {
          ...buildDraftBasicPayload(form),
          category: form.category || 'module'
        };
        const createResult = await adminCreateWeek(courseId, draftPayload);
        const createdWeek = createResult?.data?.week || null;
        targetWeekId = createdWeek?.weekId || null;
        if (!targetWeekId) {
          throw new Error('Failed to create a draft week for video upload.');
        }
        setEditingId(targetWeekId);
        setForm((prev) => ({
          ...prev,
          weekNumber: prev.weekNumber || String(createdWeek.weekNumber || ''),
          title: prev.title || createdWeek.title || '',
          description: prev.description || createdWeek.description || '',
          youtubeUrl: prev.youtubeUrl || createdWeek.youtubeUrl || '',
          qaLink: prev.qaLink || createdWeek.qaLink || '',
          category: prev.category || createdWeek.category || 'module',
        }));
      }

      const uploadUrlRes = await adminUpdateWeek(courseId, targetWeekId, {
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
          setWeekUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      
      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setForm((prev) => ({
            ...prev,
            youtubeUrl: '',
            storagePath,
            storageProvider,
          }));
          
          await adminUpdateWeek(courseId, targetWeekId, {
            youtubeUrl: '',
            storagePath,
            storageProvider,
          });

          setWeekUploading(false);
          setWeekUploadProgress(100);
          load();
        } else {
          setWeekUploadError(`Upload failed status: ${xhr.status}`);
          setWeekUploading(false);
        }
      };
      
      xhr.onerror = () => {
        setWeekUploadError('Upload network error.');
        setWeekUploading(false);
      };
      
      xhr.send(file);
    } catch (err) {
      setWeekUploadError(err.response?.data?.message || 'Signed URL generation failed.');
      setWeekUploading(false);
    }
  };

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
    setUploadMode('url');
    setWeekUploadError('');
    setEditingId(null); setShowForm(true); setMessage(''); clearSectionMessages();
    setImportMessage('');
  }

  function startEdit(week) {
    setForm({
      title: week.title, description: week.description, weekNumber: String(week.weekNumber),
      weekTitle: week.weekTitle || '',
      youtubeUrl: week.youtubeUrl || '',
      qaLink: week.qaLink || '',
      transcript: week.transcript || '',
      textContent: week.textContent || '',
      category: week.category || 'module',
      storagePath: week.storagePath || '',
      storageProvider: week.storageProvider || '',
      quiz: week.quiz || { questions: [] },
      resources: week.resources || [],
      docs: week.docs || [],
      assignments: week.assignments || [],
      liveRecordedSessions: week.liveRecordedSessions || [],
      calendarEvents: week.calendarEvents || [],
    });
    setUploadMode(week.storageProvider === 'supabase' ? 'file' : 'url');
    setWeekUploadError('');
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
        weekTitle: form.weekTitle,
        weekNumber: parseFloat(form.weekNumber),
        youtubeUrl: form.youtubeUrl,
        qaLink: form.qaLink,
        transcript: form.transcript,
        textContent: form.textContent,
        category: form.category || 'module',
        storagePath: form.storagePath || '',
        storageProvider: form.storageProvider || '',
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
            
            <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
            <div style={s.grid2} className="admin-grid2">
              <div>
                <label style={s.label}>Module / Order Number</label>
                <input style={s.input} type="number" min="0" step="any"
                  value={form.weekNumber} onChange={(e) => setForm({ ...form, weekNumber: e.target.value })} required />
              </div>
              <div>
                <label style={s.label}>Content Category</label>
                <select
                  style={s.input}
                  value={form.category || 'module'}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="module">Standard Week Course (Module)</option>
                  <option value="live">Live Session / Global Recording</option>
                </select>
              </div>
            </div>

            <label style={s.label}>Video Content Source</label>
            <div style={toggleContainerStyle}>
              <button type="button" style={toggleButtonStyle(uploadMode === 'file')} onClick={() => setUploadMode('file')}>📁 Upload Video File</button>
              <button type="button" style={toggleButtonStyle(uploadMode === 'url')} onClick={() => setUploadMode('url')}>🔗 Video URL</button>
            </div>

            {uploadMode === 'url' ? (
              <div>
                <label style={s.label}>Video URL / YouTube URL</label>
                <input style={s.input} type="url" placeholder="https://youtu.be/... or zoom link"
                  value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value, storagePath: '', storageProvider: '' })} />
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                {weekUploading ? (
                  <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      <span>Uploading video...</span>
                      <span>{weekUploadProgress}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'hsl(195, 83%, 94%)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${weekUploadProgress}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.1s linear' }} />
                    </div>
                  </div>
                ) : form.storagePath ? (
                  <div style={{ padding: '0.85rem 1rem', border: '1px solid hsl(142, 72%, 80%)', borderRadius: '12px', background: 'hsl(142, 72%, 97%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <span style={{ fontSize: '1.2rem' }}>✅</span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'hsl(142, 72%, 20%)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {getFileName(form.storagePath)}
                        </span>
                        <span style={{ fontSize: '0.675rem', color: 'hsl(142, 72%, 30%)' }}>Saved to Supabase Storage</span>
                      </div>
                    </div>
                    <button type="button" style={{ ...s.btn, padding: '0.2rem 0.5rem', fontSize: '0.675rem', borderRadius: '6px', minWidth: 'fit-content' }} onClick={() => weekFileInputRef.current?.click()}>Replace</button>
                  </div>
                ) : (
                  <div style={dropZoneStyle} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => weekFileInputRef.current?.click()}>
                    <span style={{ fontSize: '1.5rem' }}>☁️</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Click to browse or drag video here</span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--muted-foreground)' }}>Supports MP4, WebM, MOV</span>
                  </div>
                )}
                
                <input ref={weekFileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleWeekFileChange} />
                {weekUploadError && <p style={{ color: 'var(--destructive)', fontSize: '0.7rem', marginTop: '0.4rem', fontWeight: 600 }}>⚠️ {weekUploadError}</p>}
              </div>
            )}
            <label style={s.label}>Week Title / Module Title (Optional)</label>
            <input style={s.input} type="text" placeholder="e.g. Product Foundations (displayed next to 'Week 1')"
              value={form.weekTitle || ''} onChange={(e) => setForm({ ...form, weekTitle: e.target.value })} />

            <label style={s.label}>Lesson Title</label>
            <input style={s.input} type="text" placeholder="e.g. Introduction to Product Management"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label style={s.label}>Description</label>
            <textarea style={s.textarea} placeholder="Short description shown on dashboard"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label style={s.label}>Transcript (Shown in Transcript tab)</label>
            <textarea style={s.textarea} placeholder="Full lecture transcript / notes..."
              value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} />

            <label style={s.label}>Article / Document Content (Used if no YouTube URL is provided)</label>
            <textarea style={{ ...s.textarea, minHeight: '180px' }} placeholder="Write rich text / reading document content here..."
              value={form.textContent || ''} onChange={(e) => setForm({ ...form, textContent: e.target.value })} />

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

                <div style={s.grid2} className="admin-grid2">
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

                <div style={s.grid2} className="admin-grid2">
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
                <div style={s.grid2} className="admin-grid2">
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
              <div key={doc.id || di} className="admin-doc-row" style={{ ...s.qPanel, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
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
                <label style={s.label}>Solution Explanation (Optional)</label>
                <textarea
                  style={{ ...s.textarea, minHeight: '80px' }}
                  placeholder="Explain the correct solution or reference points..."
                  value={assignment.solution || ''}
                  onChange={(e) => updateAssignment(ai, 'solution', e.target.value)}
                />
                <label style={s.label}>Solution Document URL (Optional)</label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="https://example.com/solution-doc.pdf"
                  value={assignment.solutionUrl || ''}
                  onChange={(e) => updateAssignment(ai, 'solutionUrl', e.target.value)}
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
                <div style={s.grid2} className="admin-grid2">
                  {q.options.map((opt, oi) => (
                    <div key={oi}>
                      <label style={s.label}>Option {String.fromCharCode(65 + oi)}</label>
                      <input style={s.input} type="text" value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div style={s.grid2} className="admin-grid2">
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
              <div className="responsive-table-container">
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>#</th>
                      <th style={s.th}>Title</th>
                      <th style={s.th}>Category</th>
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
                        <td style={s.td}>
                          <span style={{
                            ...s.badge,
                            background: w.category === 'live' ? 'rgba(0, 111, 143, 0.08)' : 'rgba(15, 40, 80, 0.05)',
                            color: w.category === 'live' ? 'var(--primary)' : 'var(--muted-foreground)',
                            border: w.category === 'live' ? '1px solid rgba(0, 111, 143, 0.15)' : '1px solid rgba(15, 40, 80, 0.08)',
                          }}>
                            {w.category === 'live' ? 'Live Session' : 'Module'}
                          </span>
                        </td>
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
              </div>
            )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
// Supplemental Content Tab
// ────────────────────────────────────────────────────────────────────────────────


function SupplementalContentTab({ courseId, subSection = 'all' }) {
  const [data, setData] = useState({ assignments: [], liveRecordedSessions: [], calendarEvents: [], resources: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSubTab, setActiveSubTab] = useState(subSection || 'all');

  useEffect(() => {
    if (subSection) setActiveSubTab(subSection);
  }, [subSection]);

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
      resources: Array.isArray(raw?.resources) ? raw.resources : [],
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

  const addResourceDoc = (resIdx) => {
    setData(d => {
      const list = [...d.resources];
      const docs = [...(list[resIdx].docs || [])];
      docs.push({ ...EMPTY_RESOURCE_DOC, id: makeClientId('doc') });
      list[resIdx] = { ...list[resIdx], docs };
      return { ...d, resources: list };
    });
  };

  const updateResourceDoc = (resIdx, docIdx, field, val) => {
    setData(d => {
      const list = [...d.resources];
      const docs = [...(list[resIdx].docs || [])];
      docs[docIdx] = { ...docs[docIdx], [field]: val };
      list[resIdx] = { ...list[resIdx], docs };
      return { ...d, resources: list };
    });
  };

  const removeResourceDoc = (resIdx, docIdx) => {
    setData(d => {
      const list = [...d.resources];
      const docs = (list[resIdx].docs || []).filter((_, i) => i !== docIdx);
      list[resIdx] = { ...list[resIdx], docs };
      return { ...d, resources: list };
    });
  };

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
          Customize and publish course-wide assets including assignments and resources. Changes here are immediately reflected on the student dashboards.
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'all', label: 'All Content', icon: '📋' },
          { id: 'assignments', label: 'Assignments Page', icon: '📝' },
          { id: 'resources', label: 'Resources & Docs Page', icon: '📂' },
        ].map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setActiveSubTab(st.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: activeSubTab === st.id ? '1.5px solid hsl(198, 93%, 45%)' : '1px solid var(--border)',
              background: activeSubTab === st.id ? 'hsl(198, 93%, 95%)' : 'var(--card)',
              color: activeSubTab === st.id ? 'hsl(198, 93%, 35%)' : 'var(--muted-foreground)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{st.icon}</span>
            <span>{st.label}</span>
          </button>
        ))}
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

      {/* Global Course Assignments Section */}
      {(activeSubTab === 'all' || activeSubTab === 'assignments') && (
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
                <textarea style={{ ...s.textarea, minHeight: '100px' }} placeholder="Provide detailed instructions and grading criteria..." value={asgn.description} onChange={e => updateItem('assignments', i, 'description', e.target.value)} />
                <label style={s.label}>Solution Explanation (Optional)</label>
                <textarea style={{ ...s.textarea, minHeight: '80px' }} placeholder="Explain the correct solution or reference points..." value={asgn.solution || ''} onChange={e => updateItem('assignments', i, 'solution', e.target.value)} />
                <label style={s.label}>Solution Document URL (Optional)</label>
                <input style={{ ...s.input, marginBottom: 0 }} placeholder="https://example.com/solution-doc.pdf" value={asgn.solutionUrl || ''} onChange={e => updateItem('assignments', i, 'solutionUrl', e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Global Course Resources Section */}
      {(activeSubTab === 'all' || activeSubTab === 'resources') && (
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ ...s.cardTitle, marginBottom: '0.2rem' }}>📂 Course Resources</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Create syllabus sheets, templates, references, or general handouts that all students can access.</div>
            </div>
            <button type="button" style={s.btn} onClick={() => addItem('resources', EMPTY_GLOBAL_RESOURCE)}>+ Add Resource</button>
          </div>

          {data.resources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '12px', background: 'var(--background)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📂</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>No resources created yet.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.resources.map((res, i) => (
                <div key={res.id || i} style={{ ...s.qPanel, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-sm)', padding: '1.25rem', borderRadius: '12px', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.55rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>Resource #{i + 1}</span>
                    <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }} onClick={() => removeItem('resources', i)}>✕ Remove Resource</button>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={s.label}>Resource Title</label>
                    <input style={s.input} placeholder="e.g. Course Roadmap & Syllabus" value={res.title || ''} onChange={e => updateItem('resources', i, 'title', e.target.value)} />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={s.label}>Description</label>
                    <textarea style={{ ...s.textarea, minHeight: '80px', marginBottom: 0 }} placeholder="Brief details about the resource or instructions on how to use..." value={res.description || ''} onChange={e => updateItem('resources', i, 'description', e.target.value)} />
                  </div>

                  {/* Resource Documents Sub-section */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documents & Links</span>
                      <button type="button" style={{ ...s.btn, ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => addResourceDoc(i)}>+ Add Doc</button>
                    </div>

                    {(res.docs || []).length === 0 ? (
                      <div style={{ fontSize: '0.775rem', color: 'var(--muted-foreground)', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', textAlign: 'center' }}>
                        No attachments added yet. Click "+ Add Doc" above to attach templates or files.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(res.docs || []).map((doc, di) => (
                          <div key={doc.id || di} className="admin-doc-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '0.5rem', alignItems: 'end', background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <div>
                              <label style={{ ...s.label, fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Label</label>
                              <input style={{ ...s.input, marginBottom: 0, padding: '0.35rem 0.6rem', fontSize: '0.775rem' }} placeholder="e.g. Syllabus PDF" value={doc.label || ''} onChange={e => updateResourceDoc(i, di, 'label', e.target.value)} />
                            </div>
                            <div>
                              <label style={{ ...s.label, fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>File / Drive Link</label>
                              <input type="url" style={{ ...s.input, marginBottom: 0, padding: '0.35rem 0.6rem', fontSize: '0.775rem' }} placeholder="https://..." value={doc.url || ''} onChange={e => updateResourceDoc(i, di, 'url', e.target.value)} />
                            </div>
                            <button type="button" style={{ ...s.btn, ...s.btnDanger, padding: '0.35rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px', marginBottom: 0 }} onClick={() => removeResourceDoc(i, di)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
    setReminders(prev => [...prev, { id: 'rem-' + Date.now(), title: '', deadline: '', description: '' }]);
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
              <div key={rem.id || i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fff', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px' }}>
                <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={s.label}>Reminder Action / Title</label>
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. Complete Quiz" value={rem.title} onChange={e => updateReminder(i, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>Deadline Text / Subtitle</label>
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="e.g. Deadline: 22mn 22s" value={rem.deadline} onChange={e => updateReminder(i, 'deadline', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Description (Shown on Hover)</label>
                  <textarea style={{ ...s.textarea, height: '50px', marginBottom: 0 }} placeholder="Detailed instructions/context for this reminder..." value={rem.description || ''} onChange={e => updateReminder(i, 'description', e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" style={{ ...s.btn, ...s.btnDanger, height: '32px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => removeReminder(i)}>Remove</button>
                </div>
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
        const displayName = (st.name || st.email || st.Username) + (!st.enrolled ? ' (Staff)' : '');
        if (st.Username) studentMap[st.Username] = displayName;
        if (st.email) studentMap[st.email] = displayName;
        if (st.sub) studentMap[st.sub] = displayName;
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
        <div className="responsive-table-container">
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
        </div>
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
        const info = {
          name: (st.name || st.email || st.Username) + (!st.enrolled ? ' (Staff)' : ''),
          email: st.email || ''
        };
        if (st.Username) studentMap[st.Username] = info;
        if (st.email) studentMap[st.email] = info;
        if (st.sub) studentMap[st.sub] = info;
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
        <div className="responsive-table-container">
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
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <a 
                          href={
                            (() => {
                              const ext = (sub.fileName || '').split('.').pop().toLowerCase();
                              if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'odt', 'odp'].includes(ext)) {
                                  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sub.driveUrl)}`;
                              }
                              return sub.driveUrl;
                            })()
                          } 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ ...s.btn, textDecoration: 'none', display: 'inline-block', padding: '0.35rem 0.75rem' }}
                        >
                          👁️ View
                        </a>
                        <a 
                          href={sub.driveUrl} 
                          download={sub.fileName || 'submission'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none', display: 'inline-block', padding: '0.35rem 0.75rem' }}
                        >
                          ⬇️ Download
                        </a>
                      </div>
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
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// PM Gym Responses Tab
// ────────────────────────────────────────────────────────────────────────────────
function GymSubmissionsTab({ courseId }) {
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState({});
  const [gymQuestions, setGymQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeModalAnswer, setActiveModalAnswer] = useState(null);

  useEffect(() => { load(); }, [courseId]);

  async function load() {
    setLoading(true);
    try {
      const [progressRes, stuRes, weeksRes] = await Promise.all([
        adminGetAllProgress(courseId),
        adminGetStudents(courseId),
        adminGetWeeks(courseId)
      ]);
      setSubmissions(progressRes.data.gymSubmissions || []);
      
      const studentMap = {};
      for (const st of (stuRes.data.students || [])) {
        const info = {
          name: st.name || st.email || st.Username,
          email: st.email || '',
          enrolled: st.enrolled ?? true
        };
        if (st.Username) studentMap[st.Username] = info;
        if (st.email) studentMap[st.email] = info;
        if (st.sub) studentMap[st.sub] = info;
      }
      setStudents(studentMap);

      const gymMap = {};
      for (const q of (weeksRes.data.gymQuestions || [])) {
        gymMap[q.date] = q;
      }
      setGymQuestions(gymMap);
    } catch (err) {
      console.error(err);
      setError('Failed to load PM Gym responses.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = submissions.filter(sub => {
    const term = search.toLowerCase();
    const studentInfo = students[sub.userId] || {};
    const stSearchStr = `${studentInfo.name || ''} ${studentInfo.email || ''}`.toLowerCase();
    const dateStr = (sub.date || '').toLowerCase();
    const qInfo = gymQuestions[sub.date] || {};
    const qText = (qInfo.text || '').toLowerCase();
    return stSearchStr.includes(term) || dateStr.includes(term) || qText.includes(term);
  });

  if (loading) return <p style={{ color: 'var(--muted-foreground)' }}>Loading…</p>;
  if (error) return <p style={{ color: 'var(--destructive)' }}>{error}</p>;

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '1rem',
  };
  const modalContentStyle = {
    background: 'var(--card)',
    borderRadius: '16px',
    padding: '1.75rem',
    width: '90%',
    maxWidth: '550px',
    boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border)',
  };
  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.75rem',
  };
  const modalCloseBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: 'var(--muted-foreground)',
  };
  const detailLabelStyle = {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 700,
    color: 'var(--muted-foreground)',
    marginBottom: '0.2rem',
  };
  const detailValueStyle = {
    fontSize: '0.9rem',
    color: 'var(--foreground)',
    lineHeight: '1.45',
  };

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={s.cardTitle}>PM Gym Responses — {courseId}</div>
        <input 
          style={{ ...s.input, width: '250px', marginBottom: 0 }} 
          placeholder="Search by student, date, or question..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>
      
      {submissions.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No PM Gym responses recorded yet.</p> : (
        <div className="responsive-table-container">
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Student</th>
                <th style={s.th}>Date & Question</th>
                <th style={s.th}>Type</th>
                <th style={s.th}>Submitted Answer</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const sorted = [...filtered].sort((a, b) => {
                  const dateA = a.date || '';
                  const dateB = b.date || '';
                  if (dateA !== dateB) return dateA.localeCompare(dateB);
                  return (a.submittedAt || '').localeCompare(b.submittedAt || '');
                });

                return sorted.map((sub, i) => {
                  const studentInfo = students[sub.userId] || { name: sub.userId?.slice(0, 8) + '…', email: '', enrolled: false };
                  const question = gymQuestions[sub.date];
                  const isQuiz = sub.type === 'quiz';
                  
                  let answerDisplay = sub.answer;
                  if (isQuiz && question && question.options) {
                    const optIdx = parseInt(sub.answer, 10);
                    if (!isNaN(optIdx) && question.options[optIdx] !== undefined) {
                      const optLetter = String.fromCharCode(65 + optIdx);
                      answerDisplay = `Option ${optLetter}: ${question.options[optIdx]}`;
                    }
                  }
                  
                  let isCorrect = false;
                  if (isQuiz) {
                    isCorrect = question ? (parseInt(sub.answer, 10) === question.correctIndex) : (sub.score === 1);
                  } else {
                    isCorrect = question ? (String(sub.answer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()) : (sub.score === 1);
                  }

                  const isLong = answerDisplay && answerDisplay.length > 80;
                  const displayAnswerText = isLong ? `${answerDisplay.slice(0, 80)}...` : answerDisplay;
                  
                  return (
                    <tr key={i}>
                      <td style={s.td}>
                        <div style={{ fontWeight: 600 }}>
                          {studentInfo.name}
                          {studentInfo.enrolled === false && (
                            <span style={{ ...s.badge, ...s.badgeInfo, fontSize: '0.6rem', marginLeft: '6px', padding: '0.1rem 0.4rem', verticalAlign: 'middle' }}>Staff</span>
                          )}
                        </div>
                        {studentInfo.email && studentInfo.name !== studentInfo.email && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{studentInfo.email}</div>
                        )}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 600 }}>{sub.date}</div>
                        {question && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={question.text}>
                            {question.text}
                          </div>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(isQuiz ? s.badgeSuccess : s.badgeInfo) }}>
                          {isQuiz ? 'Quiz' : 'Text'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div 
                          onClick={() => setActiveModalAnswer({
                            studentName: studentInfo.name,
                            studentEmail: studentInfo.email,
                            date: sub.date,
                            questionText: question?.text,
                            isQuiz,
                            answerDisplay,
                            isCorrect,
                            submittedAt: sub.submittedAt,
                            enrolled: studentInfo.enrolled
                          })}
                          style={{ 
                            maxWidth: '350px', 
                            wordBreak: 'break-word', 
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            transition: 'background 0.15s'
                          }}
                          title="Click to view full details"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {displayAnswerText}
                          {isLong && (
                            <span style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '6px', fontSize: '0.75rem', textDecoration: 'underline' }}>
                              (view)
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(isCorrect ? s.badgeSuccess : s.badgeWarning) }}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </td>
                      <td style={s.td}>
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  );
                });
              })()}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...s.td, textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    No matches found for "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeModalAnswer && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                PM Gym Response Details
              </span>
              <button type="button" onClick={() => setActiveModalAnswer(null)} style={modalCloseBtnStyle}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={detailLabelStyle}>Student</div>
                <div style={detailValueStyle}>
                  <strong>{activeModalAnswer.studentName}</strong> {activeModalAnswer.studentEmail && `(${activeModalAnswer.studentEmail})`}
                  {activeModalAnswer.enrolled === false && (
                    <span style={{ ...s.badge, ...s.badgeInfo, fontSize: '0.6rem', marginLeft: '6px', padding: '0.1rem 0.4rem', verticalAlign: 'middle' }}>Staff</span>
                  )}
                </div>
              </div>
              <div>
                <div style={detailLabelStyle}>Date & Question</div>
                <div style={detailValueStyle}>
                  <strong>{activeModalAnswer.date}</strong>
                  {activeModalAnswer.questionText && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--muted-foreground)', whiteSpace: 'pre-wrap' }}>
                      {activeModalAnswer.questionText}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={detailLabelStyle}>Type</div>
                <div style={detailValueStyle}>
                  <span style={{ ...s.badge, ...(activeModalAnswer.isQuiz ? s.badgeSuccess : activeModalAnswer.isInfo || s.badgeInfo) }}>
                    {activeModalAnswer.isQuiz ? 'Quiz' : 'Text'}
                  </span>
                </div>
              </div>
              <div>
                <div style={detailLabelStyle}>Submitted Answer</div>
                <div style={{ 
                  ...detailValueStyle, 
                  whiteSpace: 'pre-wrap', 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  background: 'var(--background)', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)' 
                }}>
                  {activeModalAnswer.answerDisplay}
                </div>
              </div>
              <div>
                <div style={detailLabelStyle}>Status</div>
                <div style={detailValueStyle}>
                  <span style={{ ...s.badge, ...(activeModalAnswer.isCorrect ? s.badgeSuccess : s.badgeWarning) }}>
                    {activeModalAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
              {activeModalAnswer.submittedAt && (
                <div>
                  <div style={detailLabelStyle}>Submitted At</div>
                  <div style={detailValueStyle}>
                    {new Date(activeModalAnswer.submittedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
          <div className="responsive-table-container">
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
          </div>
        )}
      </div>
    </div>
  );
}

function formatImageUrl(url) {
  if (!url) return '';
  let clean = url.trim();

  // Strip wrapping quotes if present
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }

  // Handle Google Drive links
  if (clean.includes('drive.google.com')) {
    const matchFileD = clean.match(/\/file\/d\/([^/?]+)/);
    if (matchFileD && matchFileD[1]) {
      return `https://lh3.googleusercontent.com/d/${matchFileD[1]}`;
    }
    const matchUc = clean.match(/id=([^&]+)/);
    if (matchUc && matchUc[1]) {
      return `https://lh3.googleusercontent.com/d/${matchUc[1]}`;
    }
    const matchOpen = clean.match(/open\?id=([^&]+)/);
    if (matchOpen && matchOpen[1]) {
      return `https://lh3.googleusercontent.com/d/${matchOpen[1]}`;
    }
  }

  // Handle Dropbox links
  if (clean.includes('dropbox.com')) {
    clean = clean.replace('?dl=0', '?raw=1').replace('&dl=0', '&raw=1');
    if (!clean.includes('raw=1') && !clean.includes('dl=1')) {
      clean += (clean.includes('?') ? '&raw=1' : '?raw=1');
    }
  }

  // Handle protocol relative URLs
  if (clean.startsWith('//')) {
    clean = 'https:' + clean;
  }

  return clean;
}

// Blogs Tab
function BlogsTab({ courseId }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Form states
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [previewTab, setPreviewTab] = useState(false);
  const [imageType, setImageType] = useState('loops'); // 'loops' | 'collab' | 'editor' | 'custom'
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    load();
  }, [courseId]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminGetWeeks(courseId);
      setBlogs(data.blogs || []);
    } catch (err) {
      setMessage('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  }

  const displayBlogs = blogs;

  // Handle title change to auto-suggest slug/ID
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingId) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setId(slug);
    }
  };

  const insertTag = (before, after = '') => {
    const textarea = document.getElementById('blog-content-editor');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleAddPhoto = () => {
    const url = prompt('Enter photo/image URL:');
    if (url) {
      const formatted = formatImageUrl(url);
      insertTag(`![image](${formatted})`);
    }
  };

  const renderPreview = (text) => {
    if (!text) return '<p style="color: var(--muted-foreground); font-style: italic;">No content to preview.</p>';
    
    // 1. Extract raw HTML <img> tags before HTML character escaping
    const imgPlaceholders = [];
    let processed = text.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, (match, src) => {
      const formattedSrc = formatImageUrl(src);
      const placeholder = `__HTML_IMG_PLACEHOLDER_${imgPlaceholders.length}__`;
      const altMatch = match.match(/alt=["']([^"']*)["']/i);
      const altText = altMatch ? altMatch[1] : '';
      
      const imgHtml = `<img src="${formattedSrc}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem auto; display: block; box-shadow: var(--shadow-sm);" onError="this.style.display='none'" />`;
      imgPlaceholders.push({ placeholder, html: imgHtml });
      return placeholder;
    });

    // 2. Escape HTML special characters
    let html = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 3. Headings
    html = html.replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.5rem; color: var(--foreground);">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.35rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; color: var(--foreground);">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 style="font-size: 1.6rem; font-weight: 800; margin-top: 1.8rem; margin-bottom: 0.8rem; color: var(--foreground);">$1</h1>');

    // 4. Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 5. Markdown Images ![alt](url)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      const rawUrl = url.replace(/&amp;/g, '&');
      const formattedUrl = formatImageUrl(rawUrl);
      return `<img src="${formattedUrl}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem auto; display: block; box-shadow: var(--shadow-sm);" onError="this.style.display='none'" />`;
    });

    // 6. Standalone Image URLs
    html = html.replace(/^(https?:\/\/[^\s<>]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s<>]*)?)$/gim, (match, url) => {
      const rawUrl = url.replace(/&amp;/g, '&');
      const formattedUrl = formatImageUrl(rawUrl);
      return `<img src="${formattedUrl}" alt="Blog Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem auto; display: block; box-shadow: var(--shadow-sm);" onError="this.style.display='none'" />`;
    });

    // 7. Markdown Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
      const rawUrl = url.replace(/&amp;/g, '&');
      const formattedUrl = formatImageUrl(rawUrl);
      return `<a href="${formattedUrl}" target="_blank" style="color: var(--primary); text-decoration: underline;">${text}</a>`;
    });

    // 8. Restore extracted HTML img placeholders
    imgPlaceholders.forEach(({ placeholder, html: imgHtml }) => {
      html = html.replace(placeholder, imgHtml);
    });

    // 9. Paragraph wrapping
    html = html.replace(/\n\n/g, '</p><p style="margin-bottom: 0.85rem; line-height: 1.6; color: var(--foreground);">');
    html = '<p style="margin-bottom: 0.85rem; line-height: 1.6; color: var(--foreground);">' + html + '</p>';
    html = html.replace(/<p style=".*?"><\/p>/g, '');

    return html;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!id.trim() || !title.trim() || !description.trim()) {
      setMessage('❌ Please fill out all required fields.');
      return;
    }

    setSaving(true);
    setMessage('');

    // Determine image URL
    let imageUrl = '';
    if (imageType === 'loops') imageUrl = '/blog-loops.png';
    else if (imageType === 'collab') imageUrl = '/blog-collab.png';
    else if (imageType === 'editor') imageUrl = '/blog-editor.png';
    else imageUrl = formatImageUrl(customImageUrl);

    // Default date to today's date formatted nicely if empty
    const blogDate = date.trim() || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const payload = {
      id: id.trim(),
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      imageUrl,
      date: blogDate,
      createdAt: createdAt || new Date().toISOString()
    };

    try {
      await adminSaveBlogPost(courseId, payload);
      setMessage('✓ Blog post saved successfully!');
      
      // Reset form
      setId('');
      setTitle('');
      setDescription('');
      setContent('');
      setPreviewTab(false);
      setImageType('loops');
      setCustomImageUrl('');
      setDate('');
      setCreatedAt('');
      setEditingId(null);
      
      await load();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || '❌ Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setId(blog.id);
    setTitle(blog.title);
    setDescription(blog.description);
    setContent(blog.content || '');
    setPreviewTab(false);
    setDate(blog.date || '');
    setCreatedAt(blog.createdAt || '');
    
    if (blog.imageUrl === '/blog-loops.png') {
      setImageType('loops');
      setCustomImageUrl('');
    } else if (blog.imageUrl === '/blog-collab.png') {
      setImageType('collab');
      setCustomImageUrl('');
    } else if (blog.imageUrl === '/blog-editor.png') {
      setImageType('editor');
      setCustomImageUrl('');
    } else {
      setImageType('custom');
      setCustomImageUrl(blog.imageUrl || '');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await adminDeleteBlogPost(courseId, blogId);
      setMessage('✓ Blog post deleted successfully!');
      await load();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to delete blog post.');
    }
  };

  return (
    <div className="admin-blog-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={s.card}>
        <div style={s.cardTitle}>{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</div>
        <form onSubmit={handleSave}>
          <label style={s.label}>Blog Title</label>
          <input
            type="text"
            style={s.input}
            placeholder="e.g. A New Generation Studies AI"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <label style={s.label}>Blog Description / Summary</label>
          <textarea
            style={{ ...s.textarea, minHeight: '60px' }}
            placeholder="Type short summary or content snippet for the preview card..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '0.3rem' }}>
            <label style={s.label}>Whole Blog Content</label>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                style={{ 
                  ...s.tab, 
                  padding: '0.2rem 0.6rem', 
                  fontSize: '0.75rem', 
                  borderBottom: !previewTab ? '2.5px solid var(--primary)' : '2.5px solid transparent', 
                  color: !previewTab ? 'var(--primary)' : 'var(--muted-foreground)' 
                }}
                onClick={() => setPreviewTab(false)}
              >
                Write
              </button>
              <button
                type="button"
                style={{ 
                  ...s.tab, 
                  padding: '0.2rem 0.6rem', 
                  fontSize: '0.75rem', 
                  borderBottom: previewTab ? '2.5px solid var(--primary)' : '2.5px solid transparent', 
                  color: previewTab ? 'var(--primary)' : 'var(--muted-foreground)' 
                }}
                onClick={() => setPreviewTab(true)}
              >
                Preview
              </button>
            </div>
          </div>

          {!previewTab ? (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '0.35rem', 
                background: 'var(--muted)', 
                border: '1.5px solid var(--border)', 
                borderBottom: 'none', 
                borderRadius: '8px 8px 0 0', 
                padding: '0.4rem',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  title="Bold"
                  style={{ ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 'bold' }}
                  onClick={() => insertTag('**', '**')}
                >
                  B
                </button>
                <button
                  type="button"
                  title="Italic"
                  style={{ ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontStyle: 'italic' }}
                  onClick={() => insertTag('*', '*')}
                >
                  I
                </button>
                <button
                  type="button"
                  title="Heading 2"
                  style={{ ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}
                  onClick={() => insertTag('## ', '')}
                >
                  H2
                </button>
                <button
                  type="button"
                  title="Link"
                  style={{ ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => insertTag('[', '](url)')}
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  title="Add Photo"
                  style={{ ...s.btnSecondary, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={handleAddPhoto}
                >
                  📷 Add Photo
                </button>
              </div>
              
              <textarea
                id="blog-content-editor"
                style={{ 
                  ...s.textarea, 
                  minHeight: '200px', 
                  borderRadius: '0 0 8px 8px', 
                  marginTop: 0,
                  borderTop: 'none',
                  marginBottom: 0
                }}
                placeholder="Write the full blog post content here in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          ) : (
            <div style={{
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              padding: '1rem',
              minHeight: '240px',
              maxHeight: '350px',
              overflowY: 'auto',
              background: 'var(--background)',
              marginBottom: '1rem'
            }} dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
          )}

          <label style={s.label}>Blog Slug / ID (Unique)</label>
          <input
            type="text"
            style={s.input}
            placeholder="e.g. a-new-generation-studies-ai"
            value={id}
            onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
            disabled={!!editingId}
            required
          />

          <div style={s.grid2} className="admin-grid2">
            <div>
              <label style={s.label}>Card Image</label>
              <select
                style={s.input}
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
              >
                <option value="loops">3 Key Loops (/blog-loops.png)</option>
                <option value="collab">Global Collaboration (/blog-collab.png)</option>
                <option value="editor">AI Code Editor (/blog-editor.png)</option>
                <option value="custom">Custom Image URL...</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Publish Date (Optional)</label>
              <input
                type="text"
                style={s.input}
                placeholder="e.g. Jun 26, 2026 (blank for today)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {imageType === 'custom' && (
            <div>
              <label style={s.label}>Custom Image URL</label>
              <input
                type="text"
                style={s.input}
                placeholder="https://example.com/image.png"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" style={s.btn} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Post' : 'Save Post'}
            </button>
            {editingId && (
              <button
                type="button"
                style={s.btnSecondary}
                onClick={() => {
                  setEditingId(null);
                  setId('');
                  setTitle('');
                  setDescription('');
                  setContent('');
                  setPreviewTab(false);
                  setImageType('loops');
                  setCustomImageUrl('');
                  setDate('');
                  setCreatedAt('');
                  setMessage('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {message && <div style={s.message}>{message}</div>}
        </form>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Created Blog Posts</div>
        {loading && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Loading blogs...</p>}
        {!loading && displayBlogs.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>No blog posts created yet.</p>
        )}
        {!loading && displayBlogs.length > 0 && (
          <div className="responsive-table-container">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: '120px' }}>Date</th>
                  <th style={s.th}>Title</th>
                  <th style={{ ...s.th, textAlign: 'right', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td style={s.td}>{blog.date}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {blog.title}
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{ ...s.btn, padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginRight: '0.35rem' }}
                        onClick={() => handleEdit(blog)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// PM Gym Tab
function GymTab({ courseId }) {
  const [gymQuestions, setGymQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form states
  const [date, setDate] = useState('');
  const [type, setType] = useState('quiz');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  // Editing state
  const [editingDate, setEditingDate] = useState(null);

  const loadGymQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetWeeks(courseId);
      setGymQuestions(data.gymQuestions || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load gym questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGymQuestions();
  }, [courseId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) {
      setMessage('Date is required');
      return;
    }
    const questionData = {
      date,
      type,
      text,
      explanation,
      options: type === 'quiz' ? options : null,
      correctIndex: type === 'quiz' ? correctIndex : null,
      correctAnswer: type === 'text' ? correctAnswer : null,
    };
    try {
      await adminSaveGymQuestion(courseId, questionData);
      setMessage('Saved question successfully');
      // Reset form
      setDate('');
      setText('');
      setExplanation('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      setCorrectAnswer('');
      setEditingDate(null);
      loadGymQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Failed to save question');
    }
  };

  const handleDelete = async (targetDate) => {
    if (!window.confirm(`Delete question for ${targetDate}?`)) return;
    try {
      await adminDeleteGymQuestion(courseId, targetDate);
      setMessage('Deleted question successfully');
      loadGymQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete question');
    }
  };

  const handleEdit = (q) => {
    setEditingDate(q.date);
    setDate(q.date);
    setType(q.type);
    setText(q.text);
    setExplanation(q.explanation || '');
    if (q.type === 'quiz') {
      setOptions(q.options || ['', '', '', '']);
      setCorrectIndex(q.correctIndex !== null ? q.correctIndex : 0);
      setCorrectAnswer('');
    } else {
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      setCorrectAnswer(q.correctAnswer || '');
    }
  };

  const handleOptionChange = (idx, val) => {
    const nextOpts = [...options];
    nextOpts[idx] = val;
    setOptions(nextOpts);
  };

  return (
    <div className="admin-gym-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={s.card}>
        <div style={s.cardTitle}>{editingDate ? 'Edit Question' : 'Schedule New Question'}</div>
        <form onSubmit={handleSave}>
          <div style={s.grid2} className="admin-grid2">
            <div>
              <label style={s.label}>Date</label>
              <input
                type="date"
                style={s.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!!editingDate}
                required
              />
            </div>
            <div>
              <label style={s.label}>Question Type</label>
              <select
                style={s.input}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="quiz">Quiz (Multiple Choice)</option>
                <option value="text">Text Response</option>
              </select>
            </div>
          </div>

          <label style={s.label}>Question Prompt</label>
          <textarea
            style={s.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type question prompt here..."
            required
          />

          {type === 'quiz' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={s.label}>Options & Correct Answer</label>
              {options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    type="radio"
                    name="correct_option"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                  />
                  <input
                    type="text"
                    style={{ ...s.input, marginBottom: 0 }}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {type === 'text' && (
            <div>
              <label style={s.label}>Model / Correct Answer Statement</label>
              <textarea
                style={s.textarea}
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Describe what a correct/ideal answer should contain..."
                required
              />
            </div>
          )}

          <label style={s.label}>Explanation</label>
          <textarea
            style={s.textarea}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Type answer explanation here..."
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={s.btn}>
              {editingDate ? 'Update Question' : 'Save Question'}
            </button>
            {editingDate && (
              <button
                type="button"
                style={s.btnSecondary}
                onClick={() => {
                  setEditingDate(null);
                  setDate('');
                  setText('');
                  setExplanation('');
                  setOptions(['', '', '', '']);
                  setCorrectIndex(0);
                  setCorrectAnswer('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {message && <div style={s.message}>{message}</div>}
        </form>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Scheduled Daily Questions</div>
        {loading && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Loading questions...</p>}
        {!loading && gymQuestions.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>No daily questions scheduled.</p>
        )}
        {!loading && gymQuestions.length > 0 && (
          <div className="responsive-table-container">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: '90px' }}>Date</th>
                  <th style={{ ...s.th, width: '60px' }}>Type</th>
                  <th style={s.th}>Question</th>
                  <th style={{ ...s.th, textAlign: 'right', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gymQuestions.map((q) => (
                  <tr key={q.date}>
                    <td style={s.td}>{q.date}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, ...(q.type === 'quiz' ? s.badgeSuccess : s.badgeInfo) }}>
                        {q.type}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {q.text}
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{ ...s.btn, padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginRight: '0.35rem' }}
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={{ ...s.btn, ...s.btnDanger, padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleDelete(q.date)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EventsTab({ courseId }) {
  const LOCAL_STORAGE_EVENTS_KEY = 'pmx_custom_events';

  const DEMO_EVENTS = [
    {
      id: "product-masterclass-iit-kanpur-2026",
      title: "Product Masterclass for Students",
      dateStr: "2026-07-27",
      dateDisplay: "Monday, Jul 27",
      time: "8:00 PM IST",
      format: "IIT Kanpur",
      description: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews.",
      aboutText: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews.",
      registerUrl: "https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD",
      attendeeCount: 124,
      moments: []
    },
    {
      id: "product-masterclass-2026",
      title: "Product Masterclass for Students",
      dateStr: "2026-07-24",
      dateDisplay: "Friday, Jul 24",
      time: "8:00 PM IST",
      format: "IIT Roorkee",
      description: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews.",
      aboutText: "Get real insights from PMs on what it takes to become a Product Manager from skills to strategies to cracking interviews.",
      registerUrl: "https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD",
      attendeeCount: 124,
      moments: []
    }
  ];

  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEMO_EVENTS;
  });

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [dateDisplay, setDateDisplay] = useState('');
  const [time, setTime] = useState('8:00 PM IST');
  const [format, setFormat] = useState('IIT Kanpur');
  const [description, setDescription] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [registerUrl, setRegisterUrl] = useState('https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD');
  const [attendeeCount, setAttendeeCount] = useState(120);
  const [moments, setMoments] = useState([]);
  const [pastedUrl, setPastedUrl] = useState('');
  const [message, setMessage] = useState('');

  const saveToStorage = (newList) => {
    setEvents(newList);
    try {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(newList));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('pmx_events_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDateStr('');
    setDateDisplay('');
    setTime('8:00 PM IST');
    setFormat('IIT Kanpur');
    setDescription('');
    setAboutText('');
    setRegisterUrl('https://chat.whatsapp.com/BwmKS1htgjW8Tkt9v4fMwD');
    setAttendeeCount(120);
    setMoments([]);
    setPastedUrl('');
  };

  const handleEdit = (ev) => {
    setEditingId(ev.id);
    setTitle(ev.title || '');
    setDateStr(ev.dateStr || '');
    setDateDisplay(ev.dateDisplay || '');
    setTime(ev.time || '8:00 PM IST');
    setFormat(ev.format || '');
    setDescription(ev.description || '');
    setAboutText(ev.aboutText || '');
    setRegisterUrl(ev.registerUrl || '');
    setAttendeeCount(ev.attendeeCount || 120);
    setMoments(ev.moments || []);
    setPastedUrl('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this event?')) return;
    const updated = events.filter(e => e.id !== id);
    saveToStorage(updated);
    setMessage('Event deleted successfully.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) {
      setMessage('Title and Date are required.');
      return;
    }

    let updated = [];
    if (editingId) {
      updated = events.map(ev => ev.id === editingId ? {
        ...ev,
        title,
        dateStr,
        dateDisplay: dateDisplay || dateStr,
        time,
        format,
        description,
        aboutText,
        registerUrl,
        attendeeCount: Number(attendeeCount),
        moments
      } : ev);
    } else {
      const newEv = {
        id: `event-${Date.now()}`,
        title,
        dateStr,
        dateDisplay: dateDisplay || dateStr,
        time,
        format,
        description,
        aboutText,
        registerUrl,
        attendeeCount: Number(attendeeCount),
        moments,
        tags: ["PRODUCT MASTERCLASS FOR STUDENTS", "VIRTUAL", "FREE"],
        hosts: [
          { name: "Sanket Katore", rating: 5.0, reviews: 42, role: "Product Manager at Mastercard", avatar: "/mentor-sanket.webp" },
          { name: "Pankaj Sharma", rating: 5.0, reviews: 28, role: "Product Manager at Shopdeck", avatar: "/mentor-pankaj.webp" },
          { name: "Ankit Surkar", rating: 5.0, reviews: 54, role: "Product Manager at Microsoft", avatar: "/mentor-ankit.webp" }
        ]
      };
      updated = [newEv, ...events];
    }

    saveToStorage(updated);
    setMessage(editingId ? 'Event updated successfully!' : 'Event created successfully!');
    resetForm();
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setMoments(prev => [...prev, evt.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddScreenshotToEventDirect = (eventId, file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const updated = events.map(ev => {
          if (ev.id === eventId) {
            return { ...ev, moments: [...(ev.moments || []), evt.target.result] };
          }
          return ev;
        });
        saveToStorage(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = () => {
    if (!pastedUrl.trim()) return;
    setMoments(prev => [...prev, pastedUrl.trim()]);
    setPastedUrl('');
  };

  const handleRemoveMoment = (idx) => {
    setMoments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Create / Edit Form */}
      <div style={s.card}>
        <div style={s.cardTitle}>{editingId ? 'Edit Event' : 'Create New Event'}</div>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Event Title *</label>
          <input
            type="text"
            style={s.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product Masterclass for Students"
            required
          />

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Venue / Campus *</label>
              <input
                type="text"
                style={s.input}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="e.g. IIT Kanpur"
                required
              />
            </div>
            <div>
              <label style={s.label}>Date *</label>
              <input
                type="date"
                style={s.input}
                value={dateStr}
                onChange={(e) => {
                  setDateStr(e.target.value);
                  if (e.target.value) {
                    const d = new Date(e.target.value);
                    setDateDisplay(d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
                  }
                }}
                required
              />
            </div>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Display Date String</label>
              <input
                type="text"
                style={s.input}
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                placeholder="e.g. Monday, Jul 27"
              />
            </div>
            <div>
              <label style={s.label}>Time</label>
              <input
                type="text"
                style={s.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 8:00 PM IST"
              />
            </div>
          </div>

          <label style={s.label}>WhatsApp / Registration Link</label>
          <input
            type="url"
            style={s.input}
            value={registerUrl}
            onChange={(e) => setRegisterUrl(e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
          />

          <label style={s.label}>Short Summary Description</label>
          <textarea
            style={{ ...s.textarea, height: '70px' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of session..."
          />

          <label style={s.label}>Detailed Agenda / Overview (Markdown)</label>
          <textarea
            style={{ ...s.textarea, height: '110px' }}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Detailed session breakdown..."
          />

          {/* Screenshot Uploader */}
          <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--muted, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px' }}>
            <label style={{ ...s.label, marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>
              📸 Session Screenshots ({moments.length})
            </label>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="url"
                style={{ ...s.input, marginBottom: 0, fontSize: '0.8rem' }}
                placeholder="Paste image URL..."
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
              />
              <button
                type="button"
                style={{ ...s.btnSecondary, padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                onClick={handleAddUrl}
              >
                Add URL
              </button>
              <label style={{ ...s.btn, padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
                Upload File
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {moments.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {moments.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveMoment(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(220,38,38,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={s.btn}>
              {editingId ? 'Update Event' : 'Create Event'}
            </button>
            {editingId && (
              <button type="button" style={s.btnSecondary} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
          {message && <div style={s.message}>{message}</div>}
        </form>
      </div>

      {/* Events List */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={s.cardTitle}>Manage Masterclass & Live Events ({events.length})</div>
        </div>

        {events.length === 0 ? (
          <p style={{ color: 'var(--muted-foreground)' }}>No events created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((ev) => {
              const isEnded = new Date(ev.dateStr) < new Date(new Date().setHours(0,0,0,0));
              return (
                <div key={ev.id} style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ ...s.badge, ...(isEnded ? s.badgeMuted : s.badgeSuccess), fontSize: '0.7rem' }}>
                          {isEnded ? 'Past Session (Ended)' : 'Upcoming Live'}
                        </span>
                        <span style={{ ...s.badge, ...s.badgeInfo, fontSize: '0.7rem' }}>
                          {ev.format || 'IIT Campus'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                        📅 {ev.dateDisplay || ev.dateStr} | ⏰ {ev.time}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        style={{ ...s.btn, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleEdit(ev)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={{ ...s.btn, ...s.btnDanger, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleDelete(ev.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Quick Screenshot Upload */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                        📸 Screenshots ({ev.moments?.length || 0})
                      </span>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        + Add Screenshot
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleAddScreenshotToEventDirect(ev.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {ev.moments && ev.moments.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
                        {ev.moments.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = events.map(item => item.id === ev.id ? {
                                  ...item, moments: (item.moments || []).filter((_, i) => i !== idx)
                                } : item);
                                saveToStorage(updated);
                              }}
                              style={{ position: 'absolute', top: '1px', right: '1px', background: 'rgba(220,38,38,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '14px', height: '14px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
  const [supplementalSubSection, setSupplementalSubSection] = useState('all');
  const [openSubmenus, setOpenSubmenus] = useState({ supplemental: true, submissions: true });

  const [currentCourseId, setCurrentCourseId] = useState(() => {
    return localStorage.getItem('admin_selected_course_id') || 'course-001';
  });

  const [coursesList, setCoursesList] = useState([
    { courseId: 'course-001', name: 'Batch 1 (course-001)' },
    { courseId: 'course-002', name: 'Batch 2 (course-002)' },
  ]);

  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newBatchDesc, setNewBatchDesc] = useState('');
  const [createBatchLoading, setCreateBatchLoading] = useState(false);
  const [createBatchError, setCreateBatchError] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data } = await getMyCourses();
        if (data && data.courses && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
      } catch (err) {
        console.error('Failed to load courses in AdminPage nav:', err);
      }
    }
    loadCourses();
  }, []);

  const handleCourseChange = (courseId) => {
    setCurrentCourseId(courseId);
    localStorage.setItem('admin_selected_course_id', courseId);
  };

  const handleOpenCreateBatchModal = () => {
    const nextNum = coursesList.length + 1;
    const suggestedId = `course-${String(nextNum).padStart(3, '0')}`;
    const suggestedName = `PM -X Accelerator (Batch ${nextNum})`;
    setNewCourseId(suggestedId);
    setNewBatchName(suggestedName);
    setNewBatchDesc(`Product Management Accelerator Cohort ${nextNum}`);
    setCreateBatchError('');
    setIsCreateBatchOpen(true);
  };

  const handleCreateBatchSubmit = async (e) => {
    e.preventDefault();
    if (!newBatchName.trim() || !newCourseId.trim()) {
      setCreateBatchError('Batch Name and Course ID are required.');
      return;
    }
    setCreateBatchLoading(true);
    setCreateBatchError('');
    try {
      const res = await adminCreateCourse({
        courseId: newCourseId.trim(),
        name: newBatchName.trim(),
        description: newBatchDesc.trim(),
      });
      const createdCourse = res.data?.course || {
        courseId: newCourseId.trim(),
        name: newBatchName.trim(),
        description: newBatchDesc.trim(),
      };

      setCoursesList((prev) => {
        const exists = prev.some((c) => c.courseId === createdCourse.courseId);
        if (exists) {
          return prev.map((c) => (c.courseId === createdCourse.courseId ? createdCourse : c));
        }
        return [...prev, createdCourse];
      });

      handleCourseChange(createdCourse.courseId);
      setIsCreateBatchOpen(false);
      setNewBatchName('');
      setNewCourseId('');
      setNewBatchDesc('');
    } catch (err) {
      console.error('Failed to create batch:', err);
      setCreateBatchError(err.response?.data?.message || err.message || 'Failed to create batch.');
    } finally {
      setCreateBatchLoading(false);
    }
  };

  const navItems = [
    { id: 'weeks', label: 'Manage Weeks', icon: '📅' },
    { 
      id: 'supplemental', 
      label: 'Supplemental Content', 
      icon: '📚',
      subItems: [
        { id: 'supplemental-all', label: 'All Content', icon: '📋', subSection: 'all' },
        { id: 'supplemental-assignments', label: 'Assignments Page', icon: '📝', subSection: 'assignments' },
        { id: 'supplemental-resources', label: 'Resources & Docs Page', icon: '📂', subSection: 'resources' },
      ]
    },
    { id: 'reminders', label: 'Weekly Reminder', icon: '🔔' },
    { id: 'pm-gym', label: 'PM Gym', icon: '🏋️' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { 
      id: 'submissions', 
      label: 'Submissions', 
      icon: '📝',
      subItems: [
        { id: 'submissions', label: 'Project Submissions', icon: '📄' },
        { id: 'gym-submissions', label: 'PM Gym Responses', icon: '💬' },
      ]
    },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'blogs', label: 'Blogs', icon: '✍️' },
    { id: 'events', label: 'Events', icon: '🎟️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '270px',
        minWidth: '270px',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 10,
        boxShadow: '4px 0 16px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.15rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            StepSmart Admin
          </div>
          <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            ← Student View
          </Link>
        </div>

        {/* Batch Selection & Create Batch */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
            ACTIVE BATCH
          </div>
          <select 
            value={currentCourseId} 
            onChange={(e) => handleCourseChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              outline: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {coursesList.map((c) => (
              <option key={c.courseId} value={c.courseId} style={{ color: '#0f172a' }}>
                {c.name ? `${c.name} (${c.courseId})` : `Batch (${c.courseId})`}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleOpenCreateBatchModal}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'hsl(198, 93%, 60%)',
              color: '#0f172a',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            + Create New Batch
          </button>
        </div>

        {/* Tab Links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', paddingLeft: '0.5rem', marginBottom: '0.4rem' }}>
            MANAGEMENT NAV
          </div>
          {navItems.map((t) => {
            const isParentActive = tab === t.id || (t.id === 'supplemental' && tab === 'supplemental') || (t.id === 'submissions' && (tab === 'submissions' || tab === 'gym-submissions'));
            const hasSub = t.subItems && t.subItems.length > 0;
            const isOpen = openSubmenus[t.id];

            return (
              <div key={t.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    if (hasSub) {
                      setOpenSubmenus(prev => ({ ...prev, [t.id]: !prev[t.id] }));
                      if (t.id === 'supplemental') {
                        setTab('supplemental');
                      } else if (t.id === 'submissions') {
                        setTab('submissions');
                      }
                    } else {
                      setTab(t.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: isParentActive ? 700 : 500,
                    fontSize: '0.85rem',
                    color: isParentActive ? '#ffffff' : '#94a3b8',
                    background: isParentActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    boxShadow: isParentActive ? 'inset 3px 0 0 0 hsl(198, 93%, 60%)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                  {hasSub && (
                    <span style={{ fontSize: '0.7rem', color: '#64748b', transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ▶
                    </span>
                  )}
                </button>

                {hasSub && isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '1.75rem', marginTop: '0.2rem', marginBottom: '0.2rem' }}>
                    {t.subItems.map((sub) => {
                      let isSubActive = false;
                      if (t.id === 'supplemental') {
                        isSubActive = tab === 'supplemental' && supplementalSubSection === sub.subSection;
                      } else {
                        isSubActive = tab === sub.id;
                      }

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            if (t.id === 'supplemental') {
                              setTab('supplemental');
                              setSupplementalSubSection(sub.subSection);
                            } else {
                              setTab(sub.id);
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: isSubActive ? 700 : 500,
                            fontSize: '0.8rem',
                            color: isSubActive ? 'hsl(198, 93%, 60%)' : '#94a3b8',
                            background: isSubActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '0.85rem' }}>{sub.icon}</span>
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {tab === 'weeks' && <WeeksTab courseId={currentCourseId} />}
          {tab === 'supplemental' && <SupplementalContentTab courseId={currentCourseId} subSection={supplementalSubSection} />}
          {tab === 'reminders' && <RemindersTab courseId={currentCourseId} />}
          {tab === 'pm-gym' && <GymTab courseId={currentCourseId} />}
          {tab === 'students' && <StudentsTab courseId={currentCourseId} />}
          {tab === 'progress' && <ProgressTab courseId={currentCourseId} />}
          {tab === 'submissions' && <SubmissionsTab courseId={currentCourseId} />}
          {tab === 'gym-submissions' && <GymSubmissionsTab courseId={currentCourseId} />}
          {tab === 'leads' && <LeadsTab />}
          {tab === 'blogs' && <BlogsTab courseId={currentCourseId} />}
          {tab === 'events' && <EventsTab courseId={currentCourseId} />}
        </div>
      </main>

      {isCreateBatchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--card, #ffffff)',
            borderRadius: '16px',
            padding: '1.75rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border, #e2e8f0)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border, #e2e8f0)',
              paddingBottom: '0.75rem',
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>Create New Batch</h3>
              <button 
                type="button" 
                onClick={() => setIsCreateBatchOpen(false)} 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {createBatchError && (
                <div style={{ padding: '0.6rem 0.8rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem' }}>
                  {createBatchError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Batch Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PM -X Accelerator (Batch 3)"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontWeight: 500,
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
                  Enter a display name for this new batch (e.g. Batch 3, PM Cohort 2026).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Course ID (Unique Key) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. course-003"
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                  Must follow format course-xxx (e.g. course-003)
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Product Management Accelerator Cohort 3"
                  value={newBatchDesc}
                  onChange={(e) => setNewBatchDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateBatchOpen(false)}
                  disabled={createBatchLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBatchLoading}
                  style={{
                    padding: '0.5rem 1.2rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'hsl(198, 93%, 45%)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: createBatchLoading ? 'not-allowed' : 'pointer',
                    opacity: createBatchLoading ? 0.7 : 1,
                  }}
                >
                  {createBatchLoading ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
