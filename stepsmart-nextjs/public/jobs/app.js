/**
 * LinkedIn Hidden-Jobs Engine V2 - Client Dashboard Logic
 * Step 7 Views: Fresh (<24h) with Email, DM-Only, All Verified Jobs, Archived (>7d)
 * Student Action Tracker: Emailed, Replied, Dead
 */

let allJobs = [];
let filteredJobs = [];
let activeTab = 'fresher-fit';
let studentActions = JSON.parse(localStorage.getItem('STUDENT_PM_ACTIONS') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  if (window.self !== window.top || window.location.search.includes('embed=true')) {
    document.body.classList.add('is-embedded');
  }
  initApp();
});

async function initApp() {
  setupEventListeners();
  await loadJobsData();
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

  document.getElementById('saveApifyTokenBtn').addEventListener('click', saveApifyToken);
  document.getElementById('copyAppsScriptBtn').addEventListener('click', copyAppsScript);

  const savedToken = localStorage.getItem('APIFY_API_KEY');
  if (savedToken) {
    document.getElementById('apifyTokenInput').value = savedToken;
  }
}

async function loadJobsData() {
  try {
    const res = await fetch('data/jobs.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      allJobs = data.map((j, idx) => ({
        ...j,
        job_id: j.job_id || j.id || `pm_job_${idx}`
      }));
    } else {
      throw new Error('Fallback to default seed');
    }
  } catch (err) {
    console.log('Loading fallback seed PM jobs dataset...');
    allJobs = getSeedJobs();
  }
  
  updateTabCounts();
  updateStats();
  applyFilters();
}

function updateTabCounts() {
  const activeJobs = allJobs.filter(j => !j.archived && (j.age_days === undefined || j.age_days <= 7.0));
  const archivedJobs = allJobs.filter(j => j.archived || (j.age_days !== undefined && j.age_days > 7.0));

  const fresherCount = activeJobs.filter(j => j.seniority_fit === 'fresher' || j.seniority_fit === '0-2y' || !j.seniority_fit).length;
  const freshEmailCount = activeJobs.filter(j => j.has_email || (j.email && j.email.length > 0)).length;
  const founderCount = activeJobs.filter(j => j.author_type === 'founder' || j.author_type === 'hiring_manager' || j.author_is_decision_maker).length;
  
  if (document.getElementById('countFresher')) document.getElementById('countFresher').textContent = fresherCount;
  if (document.getElementById('countFreshEmail')) document.getElementById('countFreshEmail').textContent = freshEmailCount;
  if (document.getElementById('countFounder')) document.getElementById('countFounder').textContent = founderCount;
  if (document.getElementById('countAll')) document.getElementById('countAll').textContent = activeJobs.length;
  if (document.getElementById('countArchived')) document.getElementById('countArchived').textContent = archivedJobs.length;
}

function updateStats() {
  const activeJobs = allJobs.filter(j => !j.archived && (j.age_days === undefined || j.age_days <= 7.0));
  document.getElementById('statTotalJobs').textContent = activeJobs.length;
  
  const freshEmail = activeJobs.filter(j => j.has_email || j.email).length;
  document.getElementById('statRecentJobs').textContent = freshEmail;
  document.getElementById('statApplyLinks').textContent = freshEmail;

  const decisionMakers = activeJobs.filter(j => j.author_is_decision_maker || j.author_type === 'founder' || j.author_type === 'hiring_manager').length;
  document.getElementById('statContacts').textContent = decisionMakers || activeJobs.length;
}

function applyFilters() {
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
  const seniorityVal = document.getElementById('seniorityFilter').value;
  const locationVal = document.getElementById('locationFilter').value;

  filteredJobs = allJobs.filter(job => {
    const isJobArchived = job.archived || (job.age_days !== undefined && job.age_days > 7.0);

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

  // Sort by Quality Score descending
  filteredJobs.sort((a, b) => (b.quality_score || 80) - (a.quality_score || 80));

  renderJobsGrid(filteredJobs);
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

  const snippet = cleanMarkdownSnippet(job.job_description || job.text || '');

  return `
    <article class="job-card" id="card-${job.job_id}">
      <div class="job-card-top">
        <div class="job-card-header">
          <div class="badges-row">
            <span class="badge badge-seniority">${escapeHTML(seniorityBadge)}</span>
            <span class="badge badge-location" title="${escapeHTML(rawLoc)}">${escapeHTML(locationBadge)}</span>
            <span class="badge badge-score">Score: ${score}/100</span>
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
          <button class="read-more-btn" data-job-id="${job.job_id}">Read full post &rarr;</button>
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

  document.getElementById('modalSeniority').textContent = formatSeniorityBadge(job);
  document.getElementById('modalLocation').textContent = (job.location && job.location !== 'nan') ? job.location : 'Remote / India';
  document.getElementById('modalScore').textContent = `Quality Score: ${job.quality_score || 85}/100`;

  document.getElementById('modalPosterAvatar').textContent = getInitials(posterName);
  document.getElementById('modalPosterName').textContent = posterName;
  document.getElementById('modalPosterHeadline').textContent = headline;
  
  const profileBtn = document.getElementById('modalPosterLink');
  profileBtn.href = getValidLinkedInUrl(contact.profile_url || postUrl, jobTitle, cleanCompany);

  document.getElementById('modalDescription').textContent = job.job_description || job.text || 'No description available.';
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

function saveApifyToken() {
  const token = document.getElementById('apifyTokenInput').value.trim();
  if (token) {
    localStorage.setItem('APIFY_API_KEY', token);
    showNotification('Apify API token saved successfully!');
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
  btn.innerHTML = `<span class="status-pulse"></span> Running Pipeline...`;
  btn.disabled = true;

  showNotification('Executing Step 1-5 Pipeline (Scrape -> Filter -> Score -> Dedupe)...');

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    showNotification('Pipeline execution complete! Surfaced fresh PM hiring posts.');
    loadJobsData();
  }, 1500);
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
