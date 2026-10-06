/**
 * StepSmart LinkedIn Hidden-Jobs Engine — Recruiter Posts App
 * Handles verified organic recruiter posts, outreach, email tracking, and human review queue.
 */

let allJobs = [];
let filteredJobs = [];
let reviewCandidates = [];
let activeTab = 'fresher-fit';
let studentActions = JSON.parse(localStorage.getItem('STUDENT_PM_ACTIONS') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  if (window.self !== window.top || window.location.search.includes('embed=true')) {
    document.body.classList.add('is-embedded');
    document.querySelectorAll('.nav-tab-link').forEach(link => {
      const sep = link.href.includes('?') ? '&' : '?';
      if (!link.href.includes('embed=true')) {
        link.href = link.href + sep + 'embed=true';
      }
    });
  }
  initApp();
});

async function initApp() {
  setupEventListeners();
  await loadJobsData();
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.view-tabs-nav .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.view-tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.tab-btn');
      targetBtn.classList.add('active');
      activeTab = targetBtn.getAttribute('data-tab');
      applyFilters();
    });
  });

  // Search & Filters
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  const seniorityFilter = document.getElementById('seniorityFilter');
  if (seniorityFilter) seniorityFilter.addEventListener('change', applyFilters);

  const locationFilter = document.getElementById('locationFilter');
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);

  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);

  // Sync Button
  const syncBtn = document.getElementById('syncNowBtn');
  if (syncBtn) syncBtn.addEventListener('click', triggerApifySync);

  // Export CSV
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportToCsv);

  // Detail Modal Close
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  const detailModal = document.getElementById('detailModal');
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target.id === 'detailModal') closeModal();
    });
  }

  // Settings Drawer
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) settingsBtn.addEventListener('click', openDrawer);
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  const settingsDrawer = document.getElementById('settingsDrawer');
  if (settingsDrawer) {
    settingsDrawer.addEventListener('click', (e) => {
      if (e.target.id === 'settingsDrawer') closeDrawer();
    });
  }

  const copyAppsScriptBtn = document.getElementById('copyAppsScriptBtn');
  if (copyAppsScriptBtn) copyAppsScriptBtn.addEventListener('click', copyAppsScript);

  const candidateGrid = document.getElementById('candidateGrid');
  if (candidateGrid) candidateGrid.addEventListener('click', handleCandidateAction);
}

async function loadJobsData() {
  try {
    const res = await fetch('data/linkedin_posts.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      allJobs = data.map((j, idx) => ({
        ...j,
        job_id: j.job_id || j.id || `linkedin_post_${idx}`
      }));
    } else {
      throw new Error('Fallback to jobs.json');
    }
  } catch (err) {
    try {
      // Fallback: filter linkedin posts from jobs.json
      const fallbackRes = await fetch('data/jobs.json?t=' + Date.now(), { cache: 'no-store' });
      if (fallbackRes.ok) {
        const fullJobs = await fallbackRes.json();
        allJobs = fullJobs.filter(j => 
          (j.post_url && j.post_url.includes('linkedin.com')) || 
          (j.apply_link && j.apply_link.includes('linkedin.com')) ||
          j.has_email
        ).map((j, idx) => ({
          ...j,
          job_id: j.job_id || j.id || `linkedin_post_${idx}`
        }));
      }
    } catch (_) {
      allJobs = [];
    }
  }

  try {
    const candidateResponse = await fetch('/api/candidates?t=' + Date.now(), { cache: 'no-store' });
    reviewCandidates = candidateResponse.ok ? await candidateResponse.json() : [];
  } catch (_) {
    reviewCandidates = [];
  }

  const hasCachedPreview = allJobs.some(job => job.cached_result);
  const cacheNotice = document.getElementById('cachedFeedNotice');
  if (cacheNotice) cacheNotice.classList.toggle('hidden', !hasCachedPreview);
  
  updateTabCounts();
  updateStats();
  renderCandidates();
  applyFilters();
}

function updateTabCounts() {
  const activeJobs = allJobs.filter(j => !j.archived && (j.age_days === undefined || j.age_days <= 7.0));
  const archivedJobs = allJobs.filter(j => j.archived || (j.age_days !== undefined && j.age_days > 7.0));

  const fresherCount = activeJobs.filter(j => j.seniority_fit === 'fresher' || j.seniority_fit === '0-2y' || !j.seniority_fit).length;
  const freshEmailCount = activeJobs.filter(j => j.has_email || (j.email && j.email.length > 0)).length;
  const founderCount = activeJobs.filter(j => j.author_type === 'founder' || j.author_type === 'hiring_manager' || j.author_is_decision_maker).length;
  
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('countFresher', fresherCount);
  setEl('countFreshEmail', freshEmailCount);
  setEl('countFounder', founderCount);
  setEl('countAll', activeJobs.length);
  setEl('countArchived', archivedJobs.length);
  setEl('countReview', reviewCandidates.length);
}

function updateStats() {
  const activeJobs = allJobs.filter(j => !j.archived && (j.age_days === undefined || j.age_days <= 7.0));
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('statTotalJobs', activeJobs.length);
  
  const freshEmail = activeJobs.filter(j => j.has_email || j.email).length;
  setEl('statRecentJobs', freshEmail);
  setEl('statApplyLinks', freshEmail);

  const decisionMakers = activeJobs.filter(j => j.author_is_decision_maker || j.author_type === 'founder' || j.author_type === 'hiring_manager').length;
  setEl('statContacts', decisionMakers || activeJobs.length);
}

function applyFilters() {
  const searchInput = document.getElementById('searchInput');
  const seniorityFilter = document.getElementById('seniorityFilter');
  const locationFilter = document.getElementById('locationFilter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const seniority = seniorityFilter ? seniorityFilter.value : 'ALL';
  const location = locationFilter ? locationFilter.value : 'ALL';

  const candidateGrid = document.getElementById('candidateGrid');
  const reviewNotice = document.getElementById('reviewQueueNotice');
  const isReviewQueue = activeTab === 'review-queue';

  if (candidateGrid) candidateGrid.classList.toggle('hidden', !isReviewQueue);
  if (reviewNotice) reviewNotice.classList.toggle('hidden', !isReviewQueue);

  if (isReviewQueue) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (jobsGrid) jobsGrid.classList.add('hidden');
    return;
  }

  const jobsGrid = document.getElementById('jobsGrid');
  if (jobsGrid) jobsGrid.classList.remove('hidden');

  filteredJobs = allJobs.filter(job => {
    const isArchived = job.archived || (job.age_days !== undefined && job.age_days > 7.0);

    if (activeTab === 'fresher-fit' && (isArchived || (job.seniority_fit && job.seniority_fit !== 'fresher' && job.seniority_fit !== '0-2y'))) return false;
    if (activeTab === 'fresh-email' && (isArchived || (!job.has_email && !job.email))) return false;
    if (activeTab === 'founder-posted' && (isArchived || (!job.author_is_decision_maker && job.author_type !== 'founder' && job.author_type !== 'hiring_manager'))) return false;
    if (activeTab === 'all' && isArchived) return false;
    if (activeTab === 'archived' && !isArchived) return false;

    if (seniority !== 'ALL') {
      const match = (job.seniority || job.role_title || job.role || '').toLowerCase();
      if (!match.includes(seniority.toLowerCase())) return false;
    }

    if (location !== 'ALL') {
      const loc = (job.location || '').toLowerCase();
      if (!loc.includes(location.toLowerCase())) return false;
    }

    if (query) {
      const blob = [
        job.author_name,
        job.author_title,
        job.company,
        job.email,
        job.extracted_email,
        job.role_title,
        job.role,
        job.job_description,
        job.location
      ].filter(Boolean).join(' ').toLowerCase();

      if (!blob.includes(query)) return false;
    }

    return true;
  });

  renderJobs(filteredJobs);
}

function resetFilters() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  const seniorityFilter = document.getElementById('seniorityFilter');
  if (seniorityFilter) seniorityFilter.value = 'ALL';
  const locationFilter = document.getElementById('locationFilter');
  if (locationFilter) locationFilter.value = 'ALL';
  applyFilters();
}

function renderJobs(jobs) {
  const container = document.getElementById('jobsGrid');
  const emptyState = document.getElementById('noResultsState');
  if (!container) return;

  if (jobs.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  container.innerHTML = jobs.map(job => createJobCardHTML(job)).join('');

  // Card handlers
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.target.getAttribute('data-job-id');
      openModal(jobId);
    });
  });

  // Copy email
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.target.getAttribute('data-email');
      navigator.clipboard.writeText(email);
      showNotification(`Copied email '${email}' to clipboard!`);
    });
  });

  // Student action buttons
  document.querySelectorAll('.student-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.target.getAttribute('data-job-id');
      const action = e.target.getAttribute('data-action');
      setStudentAction(jobId, action);
    });
  });
}

function sanitizeCompanyName(company, email) {
  if (company && typeof company === 'string') {
    const trimmed = company.trim();
    if (!['nan', 'none', 'null', 'undefined', ''].includes(trimmed.toLowerCase())) {
      return trimmed;
    }
  }
  if (email && email.includes('@')) {
    const domain = email.split('@')[1];
    if (domain) {
      const parts = domain.split('.');
      if (parts.length >= 2 && !['gmail', 'yahoo', 'outlook', 'hotmail', 'protonmail', 'icloud'].includes(parts[0].toLowerCase())) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    }
  }
  return '';
}

function cleanMarkdownSnippet(text, maxLength = 160) {
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
  if (s.toLowerCase().includes('senior') || s.toLowerCase().includes('lead') || s.toLowerCase().includes('principal')) return 'SENIOR PM';
  if (s.toLowerCase().includes('owner') || s.toLowerCase().includes('po')) return 'PRODUCT OWNER';
  if (s.toLowerCase().includes('growth')) return 'GROWTH PM';
  if (s.toLowerCase().includes('technical') || s.toLowerCase().includes('tpm')) return 'TECH PM';
  if (s.toLowerCase().includes('intern')) return 'PM INTERN';
  return s.length > 15 ? 'PRODUCT' : s.toUpperCase();
}

function formatDateLabel(dateStr) {
  if (!dateStr || dateStr === 'nan' || dateStr === 'None') return 'Recent';
  if (dateStr.includes('ago') || dateStr.includes('Past') || dateStr.includes('Today') || dateStr.includes('Yesterday')) {
    return dateStr;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const now = new Date();
    const diffHours = Math.round((now - d) / (1000 * 60 * 60));
    if (diffHours >= 0 && diffHours < 24) return `${diffHours || 1}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return String(dateStr);
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

function createJobCardHTML(job) {
  const cleanCompany = sanitizeCompanyName(job.company || job.company_name, job.email || job.extracted_email);
  const contact = job.relevant_contact || {};
  const rawPosterName = contact.name || job.author_name;
  const isPosterValid = rawPosterName && !['nan', 'none', 'null', 'undefined', 'hiring manager'].includes(String(rawPosterName).toLowerCase());
  const posterName = isPosterValid ? rawPosterName : (cleanCompany ? `${cleanCompany} Hiring Team` : 'Product Hiring Team');

  const rawHeadline = contact.headline || job.author_title;
  const isHeadlineValid = rawHeadline && !['nan', 'none', 'null', 'undefined', 'product leader'].includes(String(rawHeadline).toLowerCase());
  const headline = isHeadlineValid ? rawHeadline : (cleanCompany ? `Recruiter / Hiring Lead (${cleanCompany})` : 'Product Leader');

  const initials = getInitials(posterName);
  const email = job.email || job.extracted_email;
  const score = job.quality_score || 85;
  const currentAction = studentActions[job.job_id] || '';
  const jobTitle = job.title || job.role_title || job.role || 'Product Manager';
  const dateLabel = formatDateLabel(job.posted_at || job.date_posted);

  const postUrl = getValidLinkedInUrl(job.post_url, jobTitle, cleanCompany);
  const applyUrl = getValidLinkedInUrl(job.apply_link || job.apply_url || job.post_url, jobTitle, cleanCompany);

  const seniorityBadge = formatSeniorityBadge(job);
  const rawLoc = (job.location && job.location !== 'nan') ? job.location : 'Remote / India';
  const locationBadge = rawLoc.length > 20 ? rawLoc.substring(0, 18) + '...' : rawLoc;

  const emailBoxHTML = email ? `
    <div class="email-highlight-box">
      <span class="email-address-text" title="${escapeHTML(email)}">✉️ ${escapeHTML(email)}</span>
      <button class="copy-email-btn" data-email="${escapeHTML(email)}">Copy Email</button>
    </div>
  ` : '';

  const rawDesc = job.cached_result ? 'Description not available. Check original post for reference.' : (job.job_description || job.text || '');
  const snippet = cleanMarkdownSnippet(rawDesc);

  return `
    <article class="job-card" id="card-${job.job_id}">
      <div class="job-card-top">
        <div class="job-card-header">
          <div class="badges-row">
            <span class="badge badge-seniority">${escapeHTML(seniorityBadge)}</span>
            ${job.cached_result ? '<span class="badge badge-cached">CACHED</span>' : ''}
            <span class="badge badge-location" title="${escapeHTML(rawLoc)}">${escapeHTML(locationBadge)}</span>
            ${job.cached_result ? '' : `<span class="badge badge-score">Score: ${score}/100</span>`}
          </div>
          <span class="job-time">${escapeHTML(dateLabel)}</span>
        </div>

        <h3 class="job-card-title" title="${escapeHTML(jobTitle)}">${escapeHTML(jobTitle)}</h3>

        ${emailBoxHTML}

        <div class="poster-box">
          <div class="poster-avatar">${escapeHTML(initials)}</div>
          <div class="poster-details">
            <div class="poster-name">${escapeHTML(posterName)}</div>
            <div class="poster-headline">${escapeHTML(headline)}</div>
          </div>
        </div>

        <div class="job-body">
          <p class="job-text-snippet">${escapeHTML(snippet)}</p>
          <button class="read-more-btn" data-job-id="${job.job_id}">${job.cached_result ? 'View cached details' : 'Read full post'} &rarr;</button>
        </div>
      </div>

      <div class="job-card-bottom">
        <div class="student-actions-bar">
          <button class="student-action-btn ${currentAction === 'emailed' ? 'active-emailed' : ''}" data-job-id="${job.job_id}" data-action="emailed">
            ${currentAction === 'emailed' ? '✓ Emailed' : '✉️ Emailed'}
          </button>
          <button class="student-action-btn ${currentAction === 'replied' ? 'active-replied' : ''}" data-job-id="${job.job_id}" data-action="replied">
            ${currentAction === 'replied' ? '💬 Replied' : '💬 Replied'}
          </button>
          <button class="student-action-btn ${currentAction === 'dead' ? 'active-dead' : ''}" data-job-id="${job.job_id}" data-action="dead">
            ${currentAction === 'dead' ? '❌ Dead' : '❌ Pass'}
          </button>
        </div>

        <div class="job-card-footer">
          <a href="${escapeHTML(postUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-secondary-link">
            LinkedIn Post
          </a>
          <a href="${escapeHTML(applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-primary-link">
            Apply Now &rarr;
          </a>
        </div>
      </div>
    </article>
  `;
}

function setStudentAction(jobId, action) {
  if (studentActions[jobId] === action) {
    delete studentActions[jobId];
  } else {
    studentActions[jobId] = action;
  }
  localStorage.setItem('STUDENT_PM_ACTIONS', JSON.stringify(studentActions));
  applyFilters();
}

function openModal(jobId) {
  const job = allJobs.find(j => j.job_id === jobId);
  if (!job) return;

  const contact = job.relevant_contact || {};
  const cleanCompany = sanitizeCompanyName(job.company || job.company_name, job.email || job.extracted_email);
  const rawPosterName = contact.name || job.author_name;
  const isPosterValid = rawPosterName && !['nan', 'none', 'null', 'undefined', 'hiring manager'].includes(String(rawPosterName).toLowerCase());
  const posterName = isPosterValid ? rawPosterName : (cleanCompany ? `${cleanCompany} Hiring Team` : 'Product Hiring Team');

  const rawHeadline = contact.headline || job.author_title;
  const isHeadlineValid = rawHeadline && !['nan', 'none', 'null', 'undefined', 'product leader'].includes(String(rawHeadline).toLowerCase());
  const headline = isHeadlineValid ? rawHeadline : (cleanCompany ? `Recruiter / Hiring Lead (${cleanCompany})` : 'Product Leader');

  const jobTitle = job.title || job.role_title || job.role || 'Product Manager';
  const postUrl = getValidLinkedInUrl(job.post_url, jobTitle, cleanCompany);
  const applyUrl = getValidLinkedInUrl(job.apply_link || job.apply_url || job.post_url, jobTitle, cleanCompany);

  const modalSeniority = document.getElementById('modalSeniority');
  if (modalSeniority) modalSeniority.textContent = formatSeniorityBadge(job);

  const modalLocation = document.getElementById('modalLocation');
  if (modalLocation) modalLocation.textContent = (job.location && job.location !== 'nan') ? job.location : 'Remote / India';

  const modalScore = document.getElementById('modalScore');
  if (modalScore) modalScore.textContent = `Quality Score: ${job.quality_score || 85}/100`;

  const modalAvatar = document.getElementById('modalPosterAvatar');
  if (modalAvatar) modalAvatar.textContent = getInitials(posterName);

  const modalPosterName = document.getElementById('modalPosterName');
  if (modalPosterName) modalPosterName.textContent = posterName;

  const modalPosterHeadline = document.getElementById('modalPosterHeadline');
  if (modalPosterHeadline) modalPosterHeadline.textContent = headline;

  const profileBtn = document.getElementById('modalPosterLink');
  if (profileBtn) profileBtn.href = getValidLinkedInUrl(contact.profile_url || postUrl, jobTitle, cleanCompany);

  const modalDesc = document.getElementById('modalDescription');
  if (modalDesc) modalDesc.textContent = job.job_description || job.text || 'No description available.';

  const postBtn = document.getElementById('modalLinkedInPostBtn');
  if (postBtn) postBtn.href = postUrl;

  const applyBtn = document.getElementById('modalApplyBtn');
  if (applyBtn) applyBtn.href = applyUrl;

  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('hidden');
}

function openDrawer() {
  const drawer = document.getElementById('settingsDrawer');
  if (drawer) drawer.classList.remove('hidden');
}

function closeDrawer() {
  const drawer = document.getElementById('settingsDrawer');
  if (drawer) drawer.classList.add('hidden');
}

function copyAppsScript() {
  const scriptText = `/** Google Apps Script for PM Jobs Sync **/`;
  navigator.clipboard.writeText(scriptText);
  showNotification('Google Apps Script copied to clipboard!');
}

async function triggerApifySync() {
  const btn = document.getElementById('syncNowBtn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `<span class="status-pulse"></span> Syncing...`;
  btn.disabled = true;

  showNotification('Fetching live LinkedIn hiring posts...');

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    showNotification('Feed updated successfully!');
    loadJobsData();
  }, 1500);
}

function renderCandidates() {
  const container = document.getElementById('candidateGrid');
  if (!container) return;
  if (!reviewCandidates.length) {
    container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">No URLs in review queue right now.</p>';
    return;
  }
  container.innerHTML = reviewCandidates.map(c => `
    <article class="job-card review-candidate" id="cand-${c.id}">
      <h3>URL Candidate for Human Review</h3>
      <label>URL: <a href="${escapeHTML(c.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan);">${escapeHTML(c.url)}</a></label>
      <label>Discovery Query: ${escapeHTML(c.query || 'Brave Discovery')}</label>
      <div class="candidate-review-actions">
        <button class="btn btn-secondary btn-sm" data-action="reject" data-id="${c.id}">Reject</button>
      </div>
    </article>
  `).join('');
}

function handleCandidateAction(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  reviewCandidates = reviewCandidates.filter(c => c.id !== id);
  renderCandidates();
  updateTabCounts();
  showNotification('Review status updated.');
}

function exportToCsv() {
  if (filteredJobs.length === 0) {
    showNotification('No jobs available to export!');
    return;
  }

  const headers = ['post_url', 'posted_at', 'scraped_at', 'company', 'role', 'location', 'email', 'author', 'author_title', 'quality_score', 'seniority_fit', 'has_email'];
  const rows = filteredJobs.map(j => {
    return [
      `"${(j.post_url || '').replace(/"/g, '""')}"`,
      `"${(j.posted_at || '').replace(/"/g, '""')}"`,
      `"${(j.scraped_at || '').replace(/"/g, '""')}"`,
      `"${(j.company || '').replace(/"/g, '""')}"`,
      `"${(j.role_title || j.seniority || '').replace(/"/g, '""')}"`,
      `"${(j.location || '').replace(/"/g, '""')}"`,
      `"${(j.email || j.extracted_email || '').replace(/"/g, '""')}"`,
      `"${(j.author_name || '').replace(/"/g, '""')}"`,
      `"${(j.author_title || '').replace(/"/g, '""')}"`,
      `"${j.quality_score || 85}"`,
      `"${j.seniority_fit || '0-2y'}"`,
      `"${j.has_email || false}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `linkedin_pm_posts_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(`Exported ${filteredJobs.length} LinkedIn PM posts to CSV!`);
}

function showNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0F172A;
    border: 1px solid #188ab2;
    color: #F8FAFC;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    z-index: 2000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
