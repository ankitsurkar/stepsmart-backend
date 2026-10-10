/**
 * LinkedIn Hidden-Jobs Engine V2 - Client Dashboard Logic
 * Step 7 Views: Recent (<=7d), email, hiring manager, and archived views
 * Student Action Tracker: Emailed, Replied, Dead
 */

let allJobs = [];
let filteredJobs = [];
let reviewCandidates = [];
let activeTab = 'fresher-fit';
let studentActions = JSON.parse(localStorage.getItem('STUDENT_PM_ACTIONS') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  if (window.self !== window.top || window.location.search.includes('embed=true')) {
    document.body.classList.add('is-embedded');
    document.querySelectorAll('.nav-tab-link').forEach(link => {
      const sep = link.href.includes('?') ? '&' : '?';
      if (!link.href.includes('embed=true')) {
        link.href = link.href + sep + 'embed=true';
      }
    });
  }
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
    if (label) label.textContent = 'Start with npm start for live refresh';
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
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('seniorityFilter').addEventListener('change', applyFilters);
  document.getElementById('locationFilter').addEventListener('change', applyFilters);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

  // Top Action Buttons
  document.getElementById('syncNowBtn').addEventListener('click', triggerApifySync);
  document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);

  // Modal Controls
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeModal();
  });

  // Settings Drawer
  document.getElementById('settingsBtn').addEventListener('click', openDrawer);
  document.getElementById('closeDrawerBtn').addEventListener('click', closeDrawer);
  document.getElementById('settingsDrawer').addEventListener('click', (e) => {
    if (e.target.id === 'settingsDrawer') closeDrawer();
  });

  document.getElementById('copyAppsScriptBtn').addEventListener('click', copyAppsScript);

  document.getElementById('candidateGrid').addEventListener('click', handleCandidateAction);
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

function updateTabCounts() {
  const activeJobs = allJobs.filter(j => getJobAgeDays(j) !== null && getJobAgeDays(j) <= 7.0);
  const archivedJobs = allJobs.filter(j => getJobAgeDays(j) !== null && getJobAgeDays(j) > 7.0);

  const fresherCount = activeJobs.filter(j => j.seniority_fit === 'fresher' || j.seniority_fit === '0-2y' || !j.seniority_fit).length;
  const freshEmailCount = activeJobs.filter(j => j.has_email || (j.email && j.email.length > 0)).length;
  const founderCount = activeJobs.filter(j => j.author_type === 'founder' || j.author_type === 'hiring_manager' || j.author_is_decision_maker).length;
  
  if (document.getElementById('countFresher')) document.getElementById('countFresher').textContent = fresherCount;
  if (document.getElementById('countFreshEmail')) document.getElementById('countFreshEmail').textContent = freshEmailCount;
  if (document.getElementById('countFounder')) document.getElementById('countFounder').textContent = founderCount;
  if (document.getElementById('countAll')) document.getElementById('countAll').textContent = activeJobs.length;
  if (document.getElementById('countArchived')) document.getElementById('countArchived').textContent = archivedJobs.length;
  if (document.getElementById('countReview')) document.getElementById('countReview').textContent = reviewCandidates.filter(c => c.review_status === 'pending').length;
}

function updateStats() {
  const activeJobs = allJobs.filter(j => getJobAgeDays(j) !== null && getJobAgeDays(j) <= 7.0);
  document.getElementById('statTotalJobs').textContent = activeJobs.length;
  
  const freshEmail = activeJobs.filter(j => j.has_email || j.email).length;
  document.getElementById('statRecentJobs').textContent = freshEmail;
  document.getElementById('statApplyLinks').textContent = freshEmail;

  const decisionMakers = activeJobs.filter(j => j.author_is_decision_maker || j.author_type === 'founder' || j.author_type === 'hiring_manager').length;
  document.getElementById('statContacts').textContent = decisionMakers;
}

function applyFilters() {
  const candidateGrid = document.getElementById('candidateGrid');
  const jobsGrid = document.getElementById('jobsGrid');
  const noResults = document.getElementById('noResultsState');
  const reviewMode = activeTab === 'review-queue';
  candidateGrid.classList.toggle('hidden', !reviewMode);
  jobsGrid.classList.toggle('hidden', reviewMode);
  noResults.classList.toggle('hidden', reviewMode || filteredJobs.length > 0);
  document.getElementById('reviewQueueNotice').classList.toggle('hidden', !reviewMode);
  if (reviewMode) return;
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
  const seniorityVal = document.getElementById('seniorityFilter').value;
  const locationVal = document.getElementById('locationFilter').value;

  filteredJobs = allJobs.filter(job => {
    const ageDays = getJobAgeDays(job);
    if (ageDays === null) return false;
    const isJobArchived = ageDays > 7.0;

    // 1. Tab View Filter
    if (activeTab === 'archived') {
      if (!isJobArchived) return false;
    } else {
      if (isJobArchived) return false; // Hide archived (>7d) jobs from active tabs
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
    const desc = (job.job_description || '').toLowerCase();
    const emailStr = (job.email || job.extracted_email || '').toLowerCase();

    const matchesSearch = !searchVal || 
      contactName.includes(searchVal) || 
      headline.includes(searchVal) || 
      desc.includes(searchVal) ||
      emailStr.includes(searchVal);

    // 3. Seniority match
    const matchesSeniority = seniorityVal === 'ALL' || (job.seniority || job.role_title) === seniorityVal;

    // 4. Location match
    const matchesLocation = locationVal === 'ALL' || (job.location && job.location.includes(locationVal));

    return matchesSearch && matchesSeniority && matchesLocation;
  });

  // Show the newest verified posts first, with quality as a tie-breaker.
  filteredJobs.sort((a, b) => getJobAgeDays(a) - getJobAgeDays(b) || (b.quality_score || 80) - (a.quality_score || 80));

  renderJobsGrid(filteredJobs);
}

function getJobAgeDays(job) {
  const posted = Date.parse(job.posted_at || job.date_posted || '');
  if (Number.isFinite(posted)) return (Date.now() - posted) / 86400000;
  const scraped = Date.parse(job.scraped_at || '');
  if (Number.isFinite(job.age_days) && Number.isFinite(scraped)) {
    return Number(job.age_days) + Math.max(0, Date.now() - scraped) / 86400000;
  }
  return null;
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('seniorityFilter').value = 'ALL';
  document.getElementById('locationFilter').value = 'ALL';
  applyFilters();
}

function renderJobsGrid(jobs) {
  const container = document.getElementById('jobsGrid');
  const emptyState = document.getElementById('noResultsState');

  if (jobs.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
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
      showNotification(`Copied email '${email}' to clipboard!`);
    });
  });

  // Attach Student Action Tracker buttons
  document.querySelectorAll('.student-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobId = e.target.getAttribute('data-job-id');
      const action = e.target.getAttribute('data-action');
      setStudentAction(jobId, action);
    });
  });
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
  const contact = job.relevant_contact || {};
  const rawPosterName = contact.name || job.author_name;
  const posterName = (rawPosterName && rawPosterName !== 'None' && rawPosterName !== 'Hiring Manager') ? rawPosterName : (job.company ? `${job.company} Hiring Team` : 'Hiring Team');
  const rawHeadline = contact.headline || job.author_title;
  const headline = (rawHeadline && rawHeadline !== 'None' && rawHeadline !== 'Product Leader') ? rawHeadline : (job.source ? `Recruiter / Hiring Lead (${job.source})` : 'Product Leader');
  const initials = getInitials(posterName);
  const email = job.email || job.extracted_email;
  const score = job.quality_score || 85;
  const currentAction = studentActions[job.job_id] || '';

  if (job.cached_result) job.job_description = 'Description not available check the original post for reference.';
  const postUrl = getValidLinkedInUrl(job.post_url, job.role_title || job.role, job.company);
  const applyUrl = getValidLinkedInUrl(job.apply_link || job.apply_url || job.post_url, job.role_title || job.role, job.company);

  const emailBoxHTML = email ? `
    <div class="email-highlight-box">
      <span class="email-address-text">✉️ ${escapeHTML(email)}</span>
      <button class="copy-email-btn" data-email="${escapeHTML(email)}">Copy Email</button>
    </div>
  ` : '';

  return `
    <article class="job-card" id="card-${job.job_id}">
      <div class="job-card-header">
        <div class="badges-row">
          <span class="badge badge-seniority">${escapeHTML(job.role_title || job.seniority || 'Associate PM')}</span>
          ${job.cached_result ? '<span class="badge badge-cached">CACHED</span>' : ''}
          <span class="badge badge-location">${escapeHTML(job.location || 'Remote')}</span>
          ${job.cached_result ? '' : `<span class="badge badge-score">Score: ${score}/100</span>`}
        </div>
        <span class="job-time">${escapeHTML(job.posted_at || 'Past 24h')}</span>
      </div>

      ${emailBoxHTML}

      <div class="poster-box">
        <div class="poster-avatar">${escapeHTML(initials)}</div>
        <div class="poster-details">
          <div class="poster-name">${escapeHTML(posterName)}</div>
          <div class="poster-headline">${escapeHTML(headline)}</div>
        </div>
      </div>

      <div class="job-body">
        <p class="job-text-snippet">${escapeHTML(job.job_description || '')}</p>
        <button class="read-more-btn" data-job-id="${job.job_id}">${job.cached_result ? 'View cached details' : 'Read full post'} &rarr;</button>
      </div>

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
        <a href="${escapeHTML(postUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          LinkedIn Post
        </a>
        <a href="${escapeHTML(applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Apply Now &rarr;
        </a>
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

  const postUrl = getValidLinkedInUrl(job.post_url, job.role_title || job.role, job.company);
  const applyUrl = getValidLinkedInUrl(job.apply_link || job.apply_url || job.post_url, job.role_title || job.role, job.company);

  document.getElementById('modalSeniority').textContent = job.role_title || job.seniority || 'Associate PM';
  document.getElementById('modalLocation').textContent = job.location || 'Remote';
  document.getElementById('modalScore').textContent = `Quality Score: ${job.quality_score || 85}/100`;

  const rawPosterName = contact.name || job.author_name;
  const posterName = (rawPosterName && rawPosterName !== 'None' && rawPosterName !== 'Hiring Manager') ? rawPosterName : (job.company ? `${job.company} Hiring Team` : 'Hiring Team');
  const rawHeadline = contact.headline || job.author_title;
  const headline = (rawHeadline && rawHeadline !== 'None' && rawHeadline !== 'Product Leader') ? rawHeadline : (job.source ? `Recruiter / Hiring Lead (${job.source})` : 'Product Leader');

  document.getElementById('modalPosterAvatar').textContent = getInitials(posterName);
  document.getElementById('modalPosterName').textContent = posterName;
  document.getElementById('modalPosterHeadline').textContent = headline;
  
  const profileBtn = document.getElementById('modalPosterLink');
  profileBtn.href = getValidLinkedInUrl(contact.profile_url || postUrl, job.role_title || job.role, job.company);

  document.getElementById('modalDescription').textContent = job.job_description;
  document.getElementById('modalLinkedInPostBtn').href = postUrl;
  document.getElementById('modalApplyBtn').href = applyUrl;

  document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

function openDrawer() {
  document.getElementById('settingsDrawer').classList.remove('hidden');
}

function closeDrawer() {
  document.getElementById('settingsDrawer').classList.add('hidden');
}

function renderCandidates() {
  const pending = reviewCandidates.filter(candidate => candidate.review_status === 'pending');
  const grid = document.getElementById('candidateGrid');
  grid.innerHTML = pending.length ? pending.map(candidate => `
    <article class="job-card review-candidate" data-candidate-id="${escapeHTML(candidate.job_id)}">
      <div class="job-card-header"><div class="badges-row"><span class="badge badge-cached">SEARCH CANDIDATE</span></div><span class="job-time">Found ${escapeHTML(new Date(candidate.discovered_at).toLocaleString())}</span></div>
      <h3>${escapeHTML(candidate.title || 'LinkedIn post')}</h3>
      <p class="job-text-snippet"><strong>Search snippet (not verified post text):</strong> ${escapeHTML(candidate.search_snippet || 'No snippet available.')}</p>
      <p><a href="${escapeHTML(candidate.post_url)}" target="_blank" rel="noopener noreferrer">Open original LinkedIn post ↗</a></p>
      <label>Original post description (paste after checking the post)</label>
      <textarea class="candidate-post-text" rows="5" placeholder="Paste the complete LinkedIn post description"></textarea>
      <label>Role title shown in the post</label>
      <input class="candidate-role" type="text" placeholder="e.g. Associate Product Manager">
      <label>Company named in the post</label>
      <input class="candidate-company" type="text" placeholder="e.g. Example company">
      <label>Location, if specified</label>
      <input class="candidate-location" type="text" placeholder="e.g. Bengaluru / Remote">
      <label>Posting date and time shown on LinkedIn</label>
      <input class="candidate-posted-at" type="datetime-local">
      <div class="candidate-review-actions"><button class="btn btn-primary" data-review-action="verify">Verify and add to feed</button><button class="btn btn-secondary" data-review-action="dismiss">Dismiss</button></div>
    </article>
  `).join('') : '<div class="empty-state"><h3>No search candidates waiting</h3><p>Add BRAVE_SEARCH_API_KEY to the local .env file, then use Update Dashboard to discover public LinkedIn post URLs.</p></div>';
}

async function handleCandidateAction(event) {
  const button = event.target.closest('[data-review-action]');
  if (!button) return;
  const card = button.closest('[data-candidate-id]');
  const action = button.dataset.reviewAction;
  const payload = { job_id: card.dataset.candidateId, action };
  if (action === 'verify') {
    payload.post_text = card.querySelector('.candidate-post-text').value;
    payload.role_title = card.querySelector('.candidate-role').value.trim();
    payload.company = card.querySelector('.candidate-company').value.trim();
    payload.location = card.querySelector('.candidate-location').value.trim();
    const localDate = card.querySelector('.candidate-posted-at').value;
    payload.posted_at = localDate ? new Date(localDate).toISOString() : '';
  }
  button.disabled = true;
  try {
    const response = await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not update candidate');
    showNotification(action === 'verify' ? 'Post verified and added to the fresh jobs feed.' : 'Candidate dismissed.');
    await loadJobsData();
  } catch (error) {
    showNotification(error.message);
    button.disabled = false;
  }
}

function copyAppsScript() {
  const scriptText = document.getElementById('appsScriptCode').innerText;
  navigator.clipboard.writeText(scriptText);
  showNotification('Google Apps Script copied to clipboard!');
}

async function triggerApifySync() {
  const btn = document.getElementById('syncNowBtn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `<span class="status-pulse"></span> Searching...`;
  btn.disabled = true;

  try {
    const started = await fetch('/api/sync', { method: 'POST' });
    if (!started.ok) throw new Error(started.status === 409 ? 'A discovery run is already running.' : 'Could not start discovery.');
    showNotification('Updating saved results or running Brave discovery if configured. Apify is not used by this button.');
    for (let i = 0; i < 180; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch('/api/status', { cache: 'no-store' });
      const status = await response.json();
      if (!status.running) {
        if (status.error) throw new Error(status.error);
        await loadJobsData();
        showNotification(status.message || 'Dashboard update complete.');
        break;
      }
      if (i === 179) showNotification('Discovery is still running. Check the sync status shortly.');
    }
  } catch (error) {
    showNotification(`Refresh failed: ${error.message}`);
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    refreshSyncStatus();
  }
}

function exportToCsv() {
  if (filteredJobs.length === 0) {
    showNotification('No jobs available to export!');
    return;
  }

  const headers = ['post_url', 'posted_at', 'scraped_at', 'company', 'role', 'location', 'email', 'contact_method', 'author', 'author_title', 'quality_score', 'status', 'seniority_fit', 'has_email'];
  
  const rows = filteredJobs.map(j => {
    const c = j.relevant_contact || {};
    return [
      `"${(j.post_url || '').replace(/"/g, '""')}"`,
      `"${(j.posted_at || '').replace(/"/g, '""')}"`,
      `"${(j.scraped_at || '').replace(/"/g, '""')}"`,
      `"${(j.company || '').replace(/"/g, '""')}"`,
      `"${(j.role_title || j.seniority || '').replace(/"/g, '""')}"`,
      `"${(j.location || '').replace(/"/g, '""')}"`,
      `"${(j.email || j.extracted_email || '').replace(/"/g, '""')}"`,
      `"${(j.contact_method || '').replace(/"/g, '""')}"`,
      `"${(j.author_name || c.name || '').replace(/"/g, '""')}"`,
      `"${(j.author_title || c.headline || '').replace(/"/g, '""')}"`,
      `"${j.quality_score || 80}"`,
      `"${j.status || 'Fresh'}"`,
      `"${j.seniority_fit || '0-2y'}"`,
      `"${j.has_email || false}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `pm_hidden_jobs_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(`Exported ${filteredJobs.length} hidden PM jobs to Google Sheets CSV!`);
}

function showNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #111827;
    border: 1px solid #38BDF8;
    color: #F9FAFB;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    z-index: 2000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function getSeedJobs() {
  return [
    {
      "job_id": "pm_google_apm_001",
      "job_description": "We are hiring for the 2026 Associate Product Manager (APM) Rotational Program at Google! Send your resume directly to apm-hiring@google.com or DM me on LinkedIn. Looking for entry-level talent (0-2y experience).",
      "relevant_contact": {
        "name": "Alex Rivera",
        "headline": "APM Program Lead @ Google",
        "profile_url": "https://www.linkedin.com/search/results/people/?keywords=Alex%20Rivera%20Google%20APM"
      },
      "author_name": "Alex Rivera",
      "author_title": "APM Program Lead @ Google",
      "author_is_decision_maker": true,
      "email": "apm-hiring@google.com",
      "extracted_email": "apm-hiring@google.com",
      "has_email": true,
      "contact_method": "email",
      "apply_link": "https://careers.google.com/",
      "post_url": "https://www.linkedin.com/search/results/content/?keywords=%22Associate%20Product%20Manager%22%20Google%20APM%20hiring&sortBy=%22date_posted%22",
      "role_title": "Associate Product Manager (APM)",
      "seniority": "Associate / APM",
      "seniority_fit": "0-2y",
      "quality_score": 95,
      "location": "Hybrid (Mountain View / NYC / London)",
      "posted_at": "1 hour ago",
      "scraped_at": "2026-10-02 08:38 UTC"
    },
    {
      "job_id": "pm_notion_analyst_004",
      "job_description": "Hiring an Entry Level Product Analyst / Junior PM at Notion! Send CV directly to product-team@notion.so. 0-2 years experience required. Remote-friendly across US/UK.",
      "relevant_contact": {
        "name": "Elena Rostova",
        "headline": "Group Product Manager @ Notion",
        "profile_url": "https://www.linkedin.com/search/results/people/?keywords=Elena%20Rostova%20Notion%20Product"
      },
      "author_name": "Elena Rostova",
      "author_title": "Group Product Manager @ Notion",
      "author_is_decision_maker": true,
      "email": "product-team@notion.so",
      "extracted_email": "product-team@notion.so",
      "has_email": true,
      "contact_method": "email",
      "apply_link": "https://www.notion.so/careers",
      "post_url": "https://www.linkedin.com/search/results/content/?keywords=%22Product%20Analyst%22%20OR%20%22Junior%20PM%22%20Notion%20hiring&sortBy=%22date_posted%22",
      "role_title": "Product Analyst / Junior PM",
      "seniority": "Product Analyst",
      "seniority_fit": "0-2y",
      "quality_score": 90,
      "location": "Remote",
      "posted_at": "3 hours ago",
      "scraped_at": "2026-10-02 08:38 UTC"
    }
  ];
}
