import React, { useRef, useState } from 'react';
import { uploadAssignment } from '../utils/api';

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.ppt,.pptx,.odp,.odt';
const MAX_FILE_MB = 7;

const MIME_MAP = {
  'pdf':  'application/pdf',
  'doc':  'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'ppt':  'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'odp':  'application/vnd.oasis.opendocument.presentation',
  'odt':  'application/vnd.oasis.opendocument.text',
};

const FILE_ICONS = {
  pdf:  '📕',
  doc:  '📘', docx: '📘',
  ppt:  '📙', pptx: '📙',
  odp:  '📙', odt:  '📘',
};

const s = {
  section: { marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' },
  embeddedSection: { marginTop: 0, borderTop: 'none', paddingTop: 0 },
  heading: { fontSize: '1.05rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.25rem' },
  sub:     { fontSize: '0.825rem', color: 'var(--muted-foreground)', marginBottom: '1.1rem' },

  dropzone: {
    border: '2px dashed var(--border)', borderRadius: '10px',
    padding: '1.75rem 1rem', textAlign: 'center', cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    background: 'var(--background)',
  },
  embeddedDropzone: { padding: '1.25rem 0.9rem' },
  dropzoneActive: { borderColor: 'var(--primary)', background: 'var(--accent)' },
  dropzoneIcon:  { fontSize: '2rem', marginBottom: '0.4rem' },
  dropzoneLabel: { fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5 },
  dropzoneLink:  { color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' },

  filePreview: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem 1rem', background: 'var(--accent)',
    border: '1px solid var(--border)', borderRadius: '8px',
    marginTop: '0.75rem',
  },
  fileName:   { fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', flex: 1 },
  fileSize:   { fontSize: '0.78rem', color: 'var(--muted-foreground)' },
  clearBtn:   { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--muted-foreground)', padding: '0.1rem 0.3rem' },

  uploadBtn: {
    marginTop: '0.85rem', padding: '0.6rem 1.5rem',
    background: 'var(--primary)', color: 'var(--primary-foreground)',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.875rem', transition: 'background 0.15s',
  },
  embeddedUploadBtn: { width: '100%', display: 'inline-flex', justifyContent: 'center' },

  progress: {
    marginTop: '0.75rem', height: '6px', borderRadius: '99px',
    background: 'var(--border)', overflow: 'hidden',
  },
  progressBar: {
    height: '100%', borderRadius: '99px',
    background: 'var(--primary)', transition: 'width 0.3s',
  },

  error:   { marginTop: '0.65rem', fontSize: '0.825rem', color: 'var(--destructive)', fontWeight: 500 },
  success: {
    marginTop: '0.65rem', padding: '0.6rem 0.85rem',
    background: 'var(--success-light)', color: 'var(--success-fg)',
    borderRadius: '7px', fontSize: '0.825rem', fontWeight: 600,
    border: '1px solid var(--success)',
  },

};

function fileExt(name) {
  return (name.split('.').pop() || '').toLowerCase();
}

export default function AssignmentUpload({
  courseId,
  weekId,
  assignmentId,
  assignmentTitle,
  embedded = false,
  title = 'Submit Assignment',
  subtitle = `Upload your PDF, Word document, or PowerPoint (max ${MAX_FILE_MB} MB).`,
}) {
  const inputRef = useRef(null);
  const [dragging,     setDragging]     = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [error,        setError]        = useState('');
  const [successMsg,   setSuccessMsg]   = useState('');

  function validateFile(file) {
    const ext = fileExt(file.name);
    if (!MIME_MAP[ext]) return 'Unsupported file type. Please upload PDF, Word, or PowerPoint.';
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File exceeds ${MAX_FILE_MB} MB limit.`;
    return null;
  }

  function pickFile(file) {
    setError('');
    setSuccessMsg('');
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setSelectedFile(file);
  }

  function onInputChange(e) {
    if (e.target.files?.[0]) pickFile(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) pickFile(e.dataTransfer.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    setSuccessMsg('');
    setUploadPct(10);

    try {
      // Read the file as base64
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]); // strip data: prefix
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      setUploadPct(40);

      const ext      = fileExt(selectedFile.name);
      const mimeType = MIME_MAP[ext] || selectedFile.type;

      const uploadedName = selectedFile.name;
      await uploadAssignment(
        courseId,
        weekId,
        uploadedName,
        mimeType,
        fileBase64,
        assignmentId,
        assignmentTitle,
      );

      setUploadPct(100);
      setSuccessMsg(`"${uploadedName}" uploaded successfully.`);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  }

  const ext = selectedFile ? fileExt(selectedFile.name) : null;
  const sectionStyle = embedded ? { ...s.section, ...s.embeddedSection } : s.section;
  const dropzoneStyle = {
    ...s.dropzone,
    ...(embedded ? s.embeddedDropzone : {}),
    ...(dragging ? s.dropzoneActive : {}),
  };
  const uploadButtonStyle = embedded
    ? { ...s.uploadBtn, ...s.embeddedUploadBtn }
    : s.uploadBtn;

  return (
    <div style={sectionStyle}>
      {title && <div style={s.heading}>{title}</div>}
      {subtitle && <div style={s.sub}>{subtitle}</div>}

      {/* Drop zone */}
      <div
        style={dropzoneStyle}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div style={s.dropzoneIcon}>📁</div>
        <div style={s.dropzoneLabel}>
          Drag &amp; drop your file here, or{' '}
          <span style={s.dropzoneLink}>browse</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          style={{ display: 'none' }}
          onChange={onInputChange}
        />
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div style={{ ...s.filePreview, flexWrap: embedded ? 'wrap' : 'nowrap' }}>
          <span style={{ fontSize: '1.3rem' }}>{FILE_ICONS[ext] || '📄'}</span>
          <span style={s.fileName}>{selectedFile.name}</span>
          <span style={s.fileSize}>({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
          <button style={s.clearBtn} onClick={() => { setSelectedFile(null); setError(''); }}>✕</button>
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div style={s.progress}>
          <div style={{ ...s.progressBar, width: `${uploadPct}%` }} />
        </div>
      )}

      {error   && <div style={s.error}>{error}</div>}
      {successMsg && <div style={s.success}>✓ {successMsg}</div>}

      {selectedFile && !uploading && (
        <button style={uploadButtonStyle} onClick={handleUpload}>
          Upload to Drive
        </button>
      )}
    </div>
  );
}
