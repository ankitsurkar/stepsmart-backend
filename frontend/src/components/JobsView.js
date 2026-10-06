import React, { useState, useEffect, useMemo } from 'react';
import { Search, Mail, Copy, Check, ExternalLink, X, Briefcase, MapPin, Sparkles, Clock, User, Filter, RotateCcw, CheckCircle2 } from 'lucide-react';
import initialJobsData from '../data/jobs.json';

function sanitizeCompanyName(company, email) {
  if (company && typeof company === 'string') {
    const trimmed = company.trim();
    if (trimmed && !['nan', 'none', 'null', 'undefined', 'n/a'].includes(trimmed.toLowerCase())) {
      return trimmed;
    }
  }
  if (email && typeof email === 'string' && email.includes('@')) {
    const domain = email.split('@')[1].split('.')[0];
    if (domain && !['gmail', 'yahoo', 'outlook', 'hotmail', 'protonmail', 'icloud'].includes(domain.toLowerCase())) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }
  return '';
}

function formatDateLabel(dateStr) {
  if (!dateStr) return 'Recent';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (m >= 1 && m <= 12 && !isNaN(d)) {
      return `${months[m - 1]} ${d}`;
    }
  }
  const dt = new Date(dateStr);
  if (!isNaN(dt.getTime())) {
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return String(dateStr);
}

function cleanMarkdownSnippet(text, maxLength = 170) {
  if (!text) return '';
  let clean = String(text)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`{1,3}.*?`{1,3}/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength).trim() + '...';
  }
  return clean;
}

function formatSeniorityBadge(job) {
  const s = (job.seniority || job.seniority_fit || '').trim();
  if (!s || s.toLowerCase() === 'all' || s.toLowerCase() === 'nan') return 'PRODUCT';
  if (s.toLowerCase().includes('apm') || s.toLowerCase().includes('associate')) return 'APM / 0-2Y';
  if (s.toLowerCase().includes('senior')) return 'SENIOR PM';
  if (s.toLowerCase().includes('fresher')) return 'FRESHER FIT';
  return s.toUpperCase();
}

function getInitials(name) {
  if (!name) return 'PM';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getValidLinkedInUrl(url, role, company) {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }
  const q = encodeURIComponent(`"${role || 'Associate Product Manager'}" ${company || 'India'} hiring`);
  return `https://www.linkedin.com/search/results/content/?keywords=${q}&sortBy=%22date_posted%22`;
}

export default function JobsView() {
  const [jobs, setJobs] = useState(() => (Array.isArray(initialJobsData) ? initialJobsData : []));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fresher-fit');
  const [searchQuery, setSearchQuery] = useState('');
  const [seniorityFilter, setSeniorityFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [studentActions, setStudentActions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('STUDENT_PM_ACTIONS') || '{}');
    } catch {
      return {};
    }
  });
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const candidateUrls = [
      (typeof process !== 'undefined' && process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '') + '/jobs/data/jobs.json',
      '/jobs/data/jobs.json',
      '/learn/jobs/data/jobs.json',
    ].filter(Boolean);

    async function tryFetchFreshData() {
      for (const url of candidateUrls) {
        try {
          const res = await fetch(url + '?t=' + Date.now());
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0 && isMounted) {
              setJobs(data);
              return;
            }
          }
        } catch {
          // ignore and try next
        }
      }
    }

    tryFetchFreshData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyEmail = (email, e) => {
    if (e) e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail((prev) => (prev === email ? null : prev));
    }, 2000);
  };

  const handleToggleAction = (jobId, action, e) => {
    if (e) e.stopPropagation();
    setStudentActions((prev) => {
      const next = { ...prev };
      if (next[jobId] === action) {
        delete next[jobId];
      } else {
        next[jobId] = action;
      }
      try {
        localStorage.setItem('STUDENT_PM_ACTIONS', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save action:', err);
      }
      return next;
    });
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    const active = jobs.filter((j) => !j.archived && (j.age_days === undefined || j.age_days <= 7.0));
    const archived = jobs.filter((j) => j.archived || (j.age_days !== undefined && j.age_days > 7.0));
    const fresher = active.filter((j) => j.seniority_fit === 'fresher' || j.seniority_fit === '0-2y' || !j.seniority_fit);
    const email = active.filter((j) => j.has_email || (j.email && j.email.length > 0) || j.extracted_email);
    const founders = active.filter((j) => j.author_type === 'founder' || j.author_type === 'hiring_manager' || j.author_is_decision_maker);

    return {
      activeCount: active.length,
      archivedCount: archived.length,
      fresherCount: fresher.length,
      emailCount: email.length,
      foundersCount: founders.length,
    };
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return jobs.filter((job) => {
      const isArchived = job.archived || (job.age_days !== undefined && job.age_days > 7.0);

      if (activeTab === 'archived') {
        if (!isArchived) return false;
      } else {
        if (isArchived) return false;
      }

      const hasEmail = !!(job.has_email || (job.email && job.email.length > 0) || job.extracted_email);
      const isFresher = job.seniority_fit === 'fresher' || job.seniority_fit === '0-2y' || !job.seniority_fit;
      const isFounder = !!(job.author_type === 'founder' || job.author_type === 'hiring_manager' || job.author_is_decision_maker);

      if (activeTab === 'fresher-fit' && !isFresher) return false;
      if (activeTab === 'fresh-email' && !hasEmail) return false;
      if (activeTab === 'founder-posted' && !isFounder) return false;

      if (seniorityFilter !== 'ALL') {
        const sen = (job.seniority || job.role_title || '').toLowerCase();
        if (!sen.includes(seniorityFilter.toLowerCase())) return false;
      }

      if (locationFilter !== 'ALL') {
        const loc = (job.location || '').toLowerCase();
        if (!loc.includes(locationFilter.toLowerCase())) return false;
      }

      if (q) {
        const cleanCompany = sanitizeCompanyName(job.company || job.company_name, job.email || job.extracted_email).toLowerCase();
        const title = (job.title || job.role_title || job.role || '').toLowerCase();
        const author = (job.relevant_contact?.name || job.author_name || '').toLowerCase();
        const desc = (job.job_description || job.text || '').toLowerCase();
        const em = (job.email || job.extracted_email || '').toLowerCase();

        const match = title.includes(q) || cleanCompany.includes(q) || author.includes(q) || desc.includes(q) || em.includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => (b.quality_score || 80) - (a.quality_score || 80));
  }, [jobs, activeTab, searchQuery, seniorityFilter, locationFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSeniorityFilter('ALL');
    setLocationFilter('ALL');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{tabCounts.activeCount}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Active Curated Roles</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{tabCounts.emailCount}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>With Direct Recruiter Email</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{tabCounts.foundersCount}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Decision Makers / Founders</div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {[
          { id: 'fresher-fit', label: 'Fresher & 0-2y Fit', count: tabCounts.fresherCount },
          { id: 'fresh-email', label: 'With Recruiter Email', count: tabCounts.emailCount },
          { id: 'founder-posted', label: 'Founders & Leaders', count: tabCounts.foundersCount },
          { id: 'all', label: 'All Verified (<72h)', count: tabCounts.activeCount },
          { id: 'archived', label: 'Archived (>7d)', count: tabCounts.archivedCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: isActive ? '1px solid #188ab2' : '1px solid #e2e8f0',
                background: isActive ? '#188ab2' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 3px 10px rgba(24, 138, 178, 0.25)' : 'none',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search role, company, recruiter name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem 0.6rem 2.25rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.84rem',
              outline: 'none',
              color: '#0f172a',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Seniorities</option>
            <option value="Associate">Associate / APM</option>
            <option value="0-2y">0-2 Yrs Experience</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Senior">Senior PM</option>
            <option value="Lead">Lead / Principal PM</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Locations</option>
            <option value="KA">Bangalore (KA)</option>
            <option value="Delhi">Delhi NCR / Gurgaon</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Remote">Remote</option>
          </select>

          {(searchQuery || seniorityFilter !== 'ALL' || locationFilter !== 'ALL') && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#64748b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#188ab2', borderRadius: '50%', margin: '0 auto 1rem auto', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading verified PM hiring feed...</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
            No opportunities matched your active filter
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Try clearing the search query or selecting a different seniority/tab.
          </div>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '10px',
              background: '#188ab2',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredJobs.map((job) => {
            const cleanCompany = sanitizeCompanyName(job.company || job.company_name, job.email || job.extracted_email);
            const contact = job.relevant_contact || {};
            const rawPosterName = contact.name || job.author_name;
            const isPosterValid = rawPosterName && !['nan', 'none', 'null', 'undefined', 'hiring manager'].includes(String(rawPosterName).toLowerCase());
            const posterName = isPosterValid ? rawPosterName : (cleanCompany ? `${cleanCompany} Hiring Team` : 'Product Hiring Team');

            const rawHeadline = contact.headline || job.author_title;
            const isHeadlineValid = rawHeadline && !['nan', 'none', 'null', 'undefined', 'product leader'].includes(String(rawHeadline).toLowerCase());
            const headline = isHeadlineValid ? rawHeadline : (cleanCompany ? `Recruiter / Lead (${cleanCompany})` : 'Product Leader');

            const initials = getInitials(posterName);
            const email = job.email || job.extracted_email;
            const score = job.quality_score || 85;
            const currentAction = studentActions[job.job_id] || '';
            const jobTitle = job.title || job.role_title || job.role || 'Product Manager';
            const dateLabel = formatDateLabel(job.posted_at || job.date_posted);

            const postUrl = getValidLinkedInUrl(job.post_url, jobTitle, cleanCompany);
            const applyUrl = getValidLinkedInUrl(job.apply_link || job.apply_url || job.post_url, jobTitle, cleanCompany);

            const seniorityBadge = formatSeniorityBadge(job);
            const locationBadge = (job.location && job.location !== 'nan') ? job.location : 'Remote / India';
            const snippet = cleanMarkdownSnippet(job.job_description || job.text || '');

            return (
              <article
                key={job.job_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '1.35rem 1.45rem',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  {/* Top Badges & Date Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                        {seniorityBadge}
                      </span>
                      <span style={{ background: '#f0fdf4', color: '#047857', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                        {locationBadge}
                      </span>
                      <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                        Score: {score}/100
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '2px' }}>
                      {dateLabel}
                    </span>
                  </div>

                  {/* Clean Prominent Job Title */}
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.35,
                      margin: '0 0 0.85rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {jobTitle}
                  </h3>

                  {/* Recruiter Email Highlight Box */}
                  {email && (
                    <div
                      style={{
                        background: '#ecfdf5',
                        border: '1px dashed #6ee7b7',
                        borderRadius: '10px',
                        padding: '0.45rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        marginBottom: '0.85rem',
                        minWidth: 0,
                      }}
                    >
                      <span
                        title={email}
                        style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#065f46',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        ✉️ {email}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(email, e)}
                        style={{
                          background: copiedEmail === email ? '#059669' : '#10b981',
                          border: 'none',
                          color: '#ffffff',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {copiedEmail === email ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedEmail === email ? 'Copied!' : 'Copy Email'}</span>
                      </button>
                    </div>
                  )}

                  {/* Poster / Recruiter Details */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.6rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #188ab2 0%, #0284c7 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {posterName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {headline}
                      </div>
                    </div>
                  </div>

                  {/* Clean Snippet Description */}
                  <div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: '#475569',
                        lineHeight: 1.55,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {snippet}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#188ab2',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '0.35rem 0 0 0',
                      }}
                    >
                      Read full post &rarr;
                    </button>
                  </div>
                </div>

                {/* Bottom Tracker & Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  {/* Action Tracker Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleToggleAction(job.job_id, 'emailed', e)}
                      style={{
                        background: currentAction === 'emailed' ? '#dcfce7' : '#f8fafc',
                        border: currentAction === 'emailed' ? '1px solid #86efac' : '1px solid #e2e8f0',
                        color: currentAction === 'emailed' ? '#15803d' : '#64748b',
                        borderRadius: '8px',
                        padding: '0.35rem 0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentAction === 'emailed' ? '✓ Emailed' : '✉️ Emailed'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleAction(job.job_id, 'replied', e)}
                      style={{
                        background: currentAction === 'replied' ? '#e0f2fe' : '#f8fafc',
                        border: currentAction === 'replied' ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                        color: currentAction === 'replied' ? '#0369a1' : '#64748b',
                        borderRadius: '8px',
                        padding: '0.35rem 0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentAction === 'replied' ? '✓ Replied' : '💬 Replied'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleAction(job.job_id, 'dead', e)}
                      style={{
                        background: currentAction === 'dead' ? '#fee2e2' : '#f8fafc',
                        border: currentAction === 'dead' ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                        color: currentAction === 'dead' ? '#b91c1c' : '#64748b',
                        borderRadius: '8px',
                        padding: '0.35rem 0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentAction === 'dead' ? '❌ Passed' : '❌ Pass'}
                    </button>
                  </div>

                  {/* Post & Apply Links */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '0.5rem' }}>
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>LinkedIn Post</span>
                    </a>

                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#188ab2',
                        border: '1px solid #188ab2',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        boxShadow: '0 2px 6px rgba(24, 138, 178, 0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>Apply Now &rarr;</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 9999,
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {formatSeniorityBadge(selectedJob)}
                  </span>
                  <span style={{ background: '#f0fdf4', color: '#047857', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {selectedJob.location || 'Remote'}
                  </span>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 9px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                    Score: {selectedJob.quality_score || 85}/100
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                  {selectedJob.title || selectedJob.role_title || selectedJob.role}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {sanitizeCompanyName(selectedJob.company || selectedJob.company_name, selectedJob.email) || 'Product Team'} &bull; Posted {formatDateLabel(selectedJob.posted_at)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Recruiter Email Box inside Modal */}
            {(selectedJob.email || selectedJob.extracted_email) && (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px dashed #6ee7b7',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Direct Recruiter Email</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, color: '#065f46' }}>
                    {selectedJob.email || selectedJob.extracted_email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(selectedJob.email || selectedJob.extracted_email)}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Copy size={13} /> Copy Email
                </button>
              </div>
            )}

            {/* Full Description */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Job Description & Hiring Post
              </div>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-line', margin: 0 }}>
                {cleanMarkdownSnippet(selectedJob.job_description || selectedJob.text || '', 2000)}
              </p>
            </div>

            {/* Modal Bottom Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <a
                href={getValidLinkedInUrl(selectedJob.post_url, selectedJob.title, selectedJob.company)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                Open LinkedIn Post ↗
              </a>
              <a
                href={getValidLinkedInUrl(selectedJob.apply_link || selectedJob.apply_url || selectedJob.post_url, selectedJob.title, selectedJob.company)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#188ab2',
                  border: '1px solid #188ab2',
                  color: '#ffffff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 3px 10px rgba(24, 138, 178, 0.25)',
                }}
              >
                Apply Directly &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
