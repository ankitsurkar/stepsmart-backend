/**
 * LinkedIn Hidden-Jobs Engine V2 - Client Dashboard Logic
 * Step 7 Views: Recent (<=7d), email, hiring manager, and archived views
 * Student Action Tracker: Emailed, Replied, Dead
 */

let allJobs = [];
let filteredJobs = [];
let reviewCandidates = [];
let activeTab = 'all'; // Default to All Active Posts
let studentActions = JSON.parse(localStorage.getItem('STUDENT_PM_ACTIONS') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();
  refreshSyncStatus();
  await loadJobsData();
}

async function refreshSyncStatus() {
  try {
    const res = await fetch('/api/status', { cache: 'no-store' });
    if (!res.ok) return;
    const status = await res.json();
    const label = document.getElementById('syncStatusText');
    if (!label) return;
    if (status.running) label.textContent = 'Dashboard update in progress…';
    else if (status.error) label.textContent = `Last scrape failed: ${status.error}`;
    else if (status.message && status.message.startsWith('Brave Search discovered')) label.textContent = status.message;
    else if (status.message && status.message.startsWith('Showing ')) label.textContent = status.message;
    else if (status.last_success) label.textContent = `Last scrape: ${new Date(status.last_success).toLocaleString()} (${status.jobs ?? 0} current posts)`;
    else label.textContent = 'Live scrape ready';
  } catch (_) {
    const label = document.getElementById('syncStatusText');
    if (label) label.textContent = 'Live scrape ready';
  }
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
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

  // Top Action Buttons
  const syncNowBtn = document.getElementById('syncNowBtn');
  if (syncNowBtn) syncNowBtn.addEventListener('click', triggerApifySync);

  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCsv);

  // Modal Controls
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
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

  const candidateGrid = document.getElementById('candidateGrid');
  if (candidateGrid) candidateGrid.addEventListener('click', handleCandidateAction);
}

async function loadJobsData() {
  try {
    const res = await fetch('data/linkedin_posts.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      allJobs = await res.json();
    } else {
      allJobs = [];
    }
  } catch (err) {
    console.error('Could not load the live LinkedIn-post feed.', err);
    allJobs = [];
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

function getJobAgeDays(job) {
  if (job.age_days !== undefined && job.age_days !== null && Number.isFinite(Number(job.age_days))) {
    return Number(job.age_days);
  }
  const posted = Date.parse(job.posted_at || job.date_posted || '');
  if (Number.isFinite(posted)) {
    return Math.max(0, (Date.now() - posted) / 86400000);
  }
  return 1.0;
}

function updateTabCounts() {
  const activeJobs = allJobs.filter(j => getJobAgeDays(j) !== null && getJobAgeDays(j) <= 7.0);
  const archivedJobs = allJobs.filter(j => getJobAgeDays(j) !== null && getJobAgeDays(j) > 7.0);

  const fresherCount = activeJobs.filter(j => j.seniority_fit === 'fresher' || j.seniority_fit === '0-2y' || !j.seniority_fit).length;
  const freshEmailCount = activeJobs.filter(j => j.has_email || (j.email && j.email.length > 0)).length;
  const founderCount = activeJobs.filter(j => j.author_type === 'founder' || j.author_type === 'hiring_manager' || j.author_is_decision_maker).length;
  
  if (document.getElementById('countFresher')) document.getElementById('countFresher').textContent = fresherCount;
  if (document.getElementById('countFreshEmail')) document.getElementById('countFreshEmail').textContent = freshEmailCount;
  if (document.getElementById('countFounder')) document.getElementById('countFounder').textContent = founderCount;
  if (document.getElementById('countAll')) document.getElementById('countAll').textContent = activeJobs.length || allJobs.length;
  if (document.getElementById('countArchived')) document.getElementById('countArchived').textContent = archivedJobs.length;
  if (document.getElementById('countReview')) document.getElementById('countReview').textContent = reviewCandidates.filter(c => c.review_status === 'pending').length;
}

function updateStats() {
  const totalEl = document.getElementById('statTotalJobs');
  if (totalEl) totalEl.textContent = allJobs.length;
  
  const freshEmail = allJobs.filter(j => j.has_email || j.email).length;
  if (document.getElementById('statRecentJobs')) document.getElementById('statRecentJobs').textContent = freshEmail;
  if (document.getElementById('statApplyLinks')) document.getElementById('statApplyLinks').textContent = freshEmail;

  const decisionMakers = allJobs.filter(j => j.author_is_decision_maker || j.author_type === 'founder' || j.author_type === 'hiring_manager').length;
  if (document.getElementById('statContacts')) document.getElementById('statContacts').textContent = decisionMakers;
}

function applyFilters() {
  const candidateGrid = document.getElementById('candidateGrid');
  const jobsGrid = document.getElementById('jobsGrid');
  const noResults = document.getElementById('noResultsState');
  const reviewMode = activeTab === 'review-queue';
  
  if (candidateGrid) candidateGrid.classList.toggle('hidden', !reviewMode);
  if (jobsGrid) jobsGrid.classList.toggle('hidden', reviewMode);
  
  const reviewNotice = document.getElementById('reviewQueueNotice');
  if (reviewNotice) reviewNotice.classList.toggle('hidden', !reviewMode);
  
  if (reviewMode) return;

  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const seniorityVal = document.getElementById('seniorityFilter')?.value || 'ALL';
  const locationVal = document.getElementById('locationFilter')?.value || 'ALL';

  filteredJobs = allJobs.filter(job => {
    const ageDays = getJobAgeDays(job);
    const isJobArchived = ageDays > 7.0;

    // 1. Tab View Filter
    if (activeTab === 'archived') {
      if (!isJobArchived) return false;
    } else if (activeTab !== 'all') {
      if (isJobArchived) return false;
    }

    const hasEmail = job.has_email || (job.email && job.email.length > 0);
    const isFresher = job.seniority_fit === 'fresher' || job.seniority_fit === '0-2y' || !job.seniority_fit;
    const isFounder = job.author_type === 'founder' || job.author_type === 'hiring_manager' || job.author_is_decision_maker;
    
    if (activeTab === 'fresher-fit' && !isFresher) return false;
    if (activeTab === 'fresh-email' && !hasEmail) return false;
    if (activeTab === 'founder-posted' && !isFounder) return false;

    // 2. Search match
    const contactName = (job.relevant_contact?.name || job.author_name || job.author || '').toLowerCase();
    const headline = (job.relevant_contact?.headline || job.author_title || '').toLowerCase();
    const desc = (job.job_description || job.text || '').toLowerCase();
    const emailStr = (job.email || job.extracted_email || '').toLowerCase();

    const matchesSearch = !searchVal || 
      contactName.includes(searchVal) || 
      headline.includes(searchVal) || 
      desc.includes(searchVal) ||
      emailStr.includes(searchVal);

    // 3. Seniority match
    const matchesSeniority = seniorityVal === 'ALL' || (job.seniority || job.role_title) === seniorityVal;

    // 4. Location match (allow match if location not captured)
    const locStr = (job.location || '').toLowerCase();
    const matchesLocation = locationVal === 'ALL' || locStr.includes(locationVal.toLowerCase()) || locStr.includes('not captured');

    return matchesSearch && matchesSeniority && matchesLocation;
  });

  if (noResults) noResults.classList.toggle('hidden', filteredJobs.length > 0);

  // Show newest posts first
  filteredJobs.sort((a, b) => getJobAgeDays(a) - getJobAgeDays(b) || (b.quality_score || 80) - (a.quality_score || 80));

  renderJobsGrid(filteredJobs);
}

function resetFilters() {
  if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
  if (document.getElementById('seniorityFilter')) document.getElementById('seniorityFilter').value = 'ALL';
  if (document.getElementById('locationFilter')) document.getElementById('locationFilter').value = 'ALL';
  activeTab = 'all';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="all"]')?.classList.add('active');
  applyFilters();
}

function renderJobsGrid(jobs) {
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

  // Attach card click handlers
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.target.getAttribute('data-job-id');
      openModal(jobId);
    });
  });

  // Attach Copy Email buttons
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const email = e.target.getAttribute('data-email');
      navigator.clipboard.writeText(email);
      alert(`Copied email '${email}' to clipboard!`);
    });
  });

  // Student Action Tracker buttons
  document.querySelectorAll('.student-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.target.getAttribute('data-job-id');
      const action = e.target.getAttribute('data-action');
      studentActions[jobId] = action;
      localStorage.setItem('STUDENT_PM_ACTIONS', JSON.stringify(studentActions));
      applyFilters();
    });
  });
}

function createJobCardHTML(job) {
  const title = job.title || job.role_title || 'Product Manager';
  const authorName = job.author_name || job.author || 'LinkedIn Recruiter';
  const authorTitle = job.author_title || job.relevant_contact?.headline || 'PM Recruiter';
  const location = job.location || 'India';
  const applyUrl = job.apply_url || job.post_url || '#';
  const datePosted = job.date_posted || job.posted_at || 'Recent';
  const email = job.email || job.extracted_email;

  const currentAction = studentActions[job.job_id || job.id];

  return `
    <div class="job-card" data-id="${job.job_id || job.id}">
      <div class="card-header">
        <div class="company-info">
          <div class="company-logo-avatar">${authorName.charAt(0).toUpperCase()}</div>
          <div>
            <h3 class="job-title">${escapeHtml(title)}</h3>
            <span class="company-name">${escapeHtml(authorName)} • ${escapeHtml(authorTitle.slice(0, 40))}</span>
          </div>
        </div>
        <span class="badge badge-linkedin">LINKEDIN POST</span>
      </div>

      <div class="card-body">
        <div class="meta-row">
          <span class="meta-item">📍 ${escapeHtml(location)}</span>
          <span class="meta-item">📅 ${escapeHtml(datePosted)}</span>
        </div>

        <div class="tags-row" style="margin-top: 8px;">
          ${email ? `<span class="tag tag-email" style="cursor:pointer;" class="copy-email-btn" data-email="${escapeHtml(email)}">✉️ ${escapeHtml(email)}</span>` : '<span class="tag">DM Outreach</span>'}
        </div>

        ${currentAction ? `<div style="margin-top: 8px; font-size: 12px; font-weight: 700; color: var(--accent-cyan);">Status: ${currentAction.toUpperCase()}</div>` : ''}
      </div>

      <div class="card-footer">
        <button class="btn btn-secondary btn-sm read-more-btn" data-job-id="${job.job_id || job.id}">
          View Details
        </button>
        <a href="${escapeHtml(applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          Open Post ➔
        </a>
      </div>
    </div>
  `;
}

function openModal(jobId) {
  const job = allJobs.find(j => (j.job_id || j.id) === jobId);
  if (!job) return;

  const modal = document.getElementById('detailModal');
  if (!modal) return;

  const title = job.title || job.role_title || 'Product Manager';
  const authorName = job.author_name || job.author || 'LinkedIn Recruiter';
  const authorTitle = job.author_title || job.relevant_contact?.headline || '';
  const location = job.location || 'India';
  const applyUrl = job.apply_url || job.post_url || '#';
  const datePosted = job.date_posted || job.posted_at || 'Recent';
  const desc = job.job_description || job.text || 'No description available.';

  if (document.getElementById('modalTitle')) document.getElementById('modalTitle').textContent = title;
  if (document.getElementById('modalPosterName')) document.getElementById('modalPosterName').textContent = authorName;
  if (document.getElementById('modalPosterHeadline')) document.getElementById('modalPosterHeadline').textContent = authorTitle;
  if (document.getElementById('modalLocation')) document.getElementById('modalLocation').textContent = location;
  if (document.getElementById('modalSeniority')) document.getElementById('modalSeniority').textContent = job.seniority || 'Product Manager';
  if (document.getElementById('modalScore')) document.getElementById('modalScore').textContent = job.quality_score || '80';
  if (document.getElementById('modalDescription')) document.getElementById('modalDescription').innerText = desc;
  
  if (document.getElementById('modalPosterAvatar')) document.getElementById('modalPosterAvatar').textContent = authorName.charAt(0).toUpperCase();

  const applyBtn = document.getElementById('modalApplyBtn');
  if (applyBtn) applyBtn.href = applyUrl;

  const postBtn = document.getElementById('modalLinkedInPostBtn');
  if (postBtn) postBtn.href = applyUrl;

  const posterLink = document.getElementById('modalPosterLink');
  if (posterLink) posterLink.href = job.relevant_contact?.profile_url || applyUrl;

  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('hidden');
}

function renderCandidates() {
  const container = document.getElementById('candidateGrid');
  if (!container) return;
  if (!reviewCandidates || reviewCandidates.length === 0) {
    container.innerHTML = '<div style="padding: 20px; color: var(--text-secondary);">No candidate URLs pending human review.</div>';
    return;
  }
  container.innerHTML = reviewCandidates.map(c => `
    <div class="job-card" style="border: 1px solid var(--border-highlight);">
      <div class="card-header">
        <h4>Candidate Post URL</h4>
      </div>
      <div class="card-body">
        <p style="font-size: 13px; word-break: break-all;"><a href="${escapeHtml(c.post_url)}" target="_blank">${escapeHtml(c.post_url)}</a></p>
      </div>
    </div>
  `).join('');
}

function handleCandidateAction(e) {}
function triggerApifySync() { alert('LinkedIn Scrape update triggered'); }
function openDrawer() { document.getElementById('settingsDrawer')?.classList.remove('hidden'); }
function closeDrawer() { document.getElementById('settingsDrawer')?.classList.add('hidden'); }
function exportToCsv() {}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
