/**
 * JobSpy Product Management Automated Dashboard Logic
 * Loads data/jobs.json (418 daily scraped jobs across LinkedIn, Naukri, Instahyre, Glassdoor, Indeed)
 */

let allJobs = [];
let filteredJobs = [];
let activeTab = 'all';
let siteFilter = 'ALL';
let currentView = 'table'; // Default primary display is Table View

document.addEventListener('DOMContentLoaded', () => {
  initJobSpyApp();
});

async function initJobSpyApp() {
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
  setView('table'); // Explicitly initialize table view panel
  await loadJobsData();
  checkAutomationStatus();
}

async function checkAutomationStatus() {
  const label = document.getElementById('syncStatusText');
  if (!label) return;
  try {
    const res = await fetch('/api/jobspy_status', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      label.textContent = data.message || `Automated Daily Scraper Active (${data.jobs || allJobs.length} live jobs)`;
    } else {
      label.textContent = `Daily Automated Pipeline Active (${allJobs.length} live jobs)`;
    }
  } catch (_) {
    label.textContent = `Daily Automated Pipeline Active (${allJobs.length} live jobs)`;
  }
}

function setupEventListeners() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.tab-btn');
      targetBtn.classList.add('active');
      activeTab = targetBtn.getAttribute('data-tab');
      applyFilters();
    });
  });

  // Search & Filter Dropdowns
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  const seniorityFilter = document.getElementById('seniorityFilter');
  if (seniorityFilter) seniorityFilter.addEventListener('change', applyFilters);

  const dateFilter = document.getElementById('dateFilter');
  if (dateFilter) dateFilter.addEventListener('change', applyFilters);

  const siteFilterEl = document.getElementById('siteFilter');
  if (siteFilterEl) siteFilterEl.addEventListener('change', (e) => {
    siteFilter = e.target.value;
    applyFilters();
  });

  const locationFilter = document.getElementById('locationFilter');
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);

  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);

  // View switchers (Grid vs Table)
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  if (viewGridBtn && viewTableBtn) {
    viewGridBtn.addEventListener('click', () => setView('grid'));
    viewTableBtn.addEventListener('click', () => setView('table'));
  }

  // Modal Controls
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
  const detailModal = document.getElementById('detailModal');
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target.id === 'detailModal') closeModal();
    });
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCsv);
}

function setView(viewMode) {
  currentView = viewMode;
  const gridBtn = document.getElementById('viewGridBtn');
  const tableBtn = document.getElementById('viewTableBtn');
  const jobsGrid = document.getElementById('jobsGrid');
  const tableViewContainer = document.getElementById('tableViewContainer');

  if (viewMode === 'table') {
    if (gridBtn) gridBtn.classList.remove('active');
    if (tableBtn) tableBtn.classList.add('active');
    if (jobsGrid) jobsGrid.classList.add('hidden');
    if (tableViewContainer) tableViewContainer.classList.remove('hidden');
  } else {
    if (gridBtn) gridBtn.classList.add('active');
    if (tableBtn) tableBtn.classList.remove('active');
    if (jobsGrid) jobsGrid.classList.remove('hidden');
    if (tableViewContainer) tableViewContainer.classList.add('hidden');
  }
  if (allJobs.length > 0) {
    renderJobs();
  }
}

async function loadJobsData() {
  try {
    const res = await fetch('data/jobs.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      allJobs = await res.json();
    } else {
      allJobs = [];
    }
  } catch (err) {
    console.error('Failed to fetch data/jobs.json', err);
    allJobs = [];
  }
  
  updateTabCounts();
  updateStats();
  applyFilters();
}

function updateTabCounts() {
  const totalCount = allJobs.length;
  const apmCount = allJobs.filter(j => 
    (j.seniority_fit === '0-2y' || 
     (j.title && /associate|apm|intern|analyst/i.test(j.title)) ||
     (j.seniority && /associate|apm/i.test(j.seniority)))
  ).length;

  const seniorCount = allJobs.filter(j => 
    (j.title && /senior|lead|principal|director|head|vp/i.test(j.title)) ||
    (j.seniority && /senior|lead/i.test(j.seniority))
  ).length;

  const emailCount = allJobs.filter(j => j.has_email || (j.email && j.email.length > 0)).length;

  if (document.getElementById('countAll')) document.getElementById('countAll').textContent = totalCount;
  if (document.getElementById('countAPM')) document.getElementById('countAPM').textContent = apmCount;
  if (document.getElementById('countSenior')) document.getElementById('countSenior').textContent = seniorCount;
  if (document.getElementById('countEmail')) document.getElementById('countEmail').textContent = emailCount;
}

function updateStats() {
  const totalEl = document.getElementById('statTotalJobs');
  if (totalEl) totalEl.textContent = allJobs.length;
  
  // Count by site
  const siteCounts = {};
  allJobs.forEach(j => {
    const s = (j.site || j.source || 'OTHER').toUpperCase();
    siteCounts[s] = (siteCounts[s] || 0) + 1;
  });

  const linkedinCount = siteCounts['LINKEDIN'] || 0;
  const naukriCount = siteCounts['NAUKRI'] || 0;
  const instahyreCount = siteCounts['INSTAHYRE'] || 0;
  const glassdoorCount = siteCounts['GLASSDOOR'] || 0;
  const indeedCount = siteCounts['INDEED'] || 0;

  if (document.getElementById('statLinkedinCount')) document.getElementById('statLinkedinCount').textContent = linkedinCount;
  if (document.getElementById('statNaukriCount')) document.getElementById('statNaukriCount').textContent = naukriCount;
  if (document.getElementById('statInstahyreCount')) document.getElementById('statInstahyreCount').textContent = instahyreCount;
  if (document.getElementById('statGlassdoorCount')) document.getElementById('statGlassdoorCount').textContent = glassdoorCount;
  if (document.getElementById('statIndeedCount')) document.getElementById('statIndeedCount').textContent = indeedCount;
}

function applyFilters() {
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const seniorityVal = document.getElementById('seniorityFilter')?.value || 'ALL';
  const dateVal = document.getElementById('dateFilter')?.value || 'ALL';
  const siteVal = document.getElementById('siteFilter')?.value || 'ALL';
  const locationVal = document.getElementById('locationFilter')?.value || 'ALL';

  const nowMs = Date.now();

  filteredJobs = allJobs.filter(job => {
    const title = (job.title || job.role_title || '').toLowerCase();
    const company = (job.company || job.company_name || '').toLowerCase();
    const loc = (job.clean_location || job.location || '').toLowerCase();
    const site = (job.site || job.source || '').toUpperCase();
    const desc = (job.job_description || job.text || '').toLowerCase();
    const dateStr = job.date_posted || job.posted_at || '';

    // Calculate age in days if possible
    let ageDays = 0;
    const parsedDate = Date.parse(dateStr);
    if (Number.isFinite(parsedDate)) {
      ageDays = Math.max(0, (nowMs - parsedDate) / 86400000);
    }

    // 1. Tab filter
    const isAPM = job.seniority_fit === '0-2y' || /associate|apm|intern|analyst/i.test(title);
    const isSenior = /senior|lead|principal|director|head|vp/i.test(title);
    const isTPM = /technical\s+product|tpm|head\s+of\s+product|vp\s+product/i.test(title);
    const hasEmail = job.has_email || (job.email && job.email.length > 0);

    if (activeTab === 'apm' && !isAPM) return false;
    if (activeTab === 'senior' && !isSenior) return false;
    if (activeTab === 'email' && !hasEmail) return false;

    // 2. Job Title filter
    if (seniorityVal !== 'ALL') {
      if (seniorityVal === 'APM' && !isAPM) return false;
      if (seniorityVal === 'Senior PM' && !isSenior) return false;
      if (seniorityVal === 'TPM' && !isTPM) return false;
      if (seniorityVal === 'Product Manager' && (isAPM || isSenior || isTPM)) return false;
    }

    // 3. Post Date filter
    if (dateVal !== 'ALL') {
      if (dateVal === '24H' && ageDays > 1.5) return false;
      if (dateVal === '3D' && ageDays > 3.5) return false;
      if (dateVal === '7D' && ageDays > 7.5) return false;
    }

    // 4. Source Portal filter
    if (siteVal !== 'ALL' && site !== siteVal) return false;

    // 5. Location select
    if (locationVal !== 'ALL') {
      if (!loc.includes(locationVal.toLowerCase())) return false;
    }

    // 6. Search text match
    if (searchVal) {
      const match = title.includes(searchVal) ||
                    company.includes(searchVal) ||
                    loc.includes(searchVal) ||
                    site.toLowerCase().includes(searchVal) ||
                    desc.includes(searchVal);
      if (!match) return false;
    }

    return true;
  });

  renderJobs();
}

function resetFilters() {
  if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
  if (document.getElementById('seniorityFilter')) document.getElementById('seniorityFilter').value = 'ALL';
  if (document.getElementById('dateFilter')) document.getElementById('dateFilter').value = 'ALL';
  if (document.getElementById('siteFilter')) document.getElementById('siteFilter').value = 'ALL';
  if (document.getElementById('locationFilter')) document.getElementById('locationFilter').value = 'ALL';
  activeTab = 'all';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="all"]')?.classList.add('active');
  applyFilters();
}

function renderJobs() {
  const container = document.getElementById('jobsGrid');
  const tableBody = document.getElementById('jobTableBody');
  const noResults = document.getElementById('noResultsState');

  if (filteredJobs.length === 0) {
    if (container) container.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    return;
  }

  if (noResults) noResults.classList.add('hidden');

  if (currentView === 'table') {
    if (tableBody) {
      tableBody.innerHTML = filteredJobs.map((job, idx) => createTableRowHTML(job, idx + 1)).join('');
      attachTableListeners();
    }
  } else {
    if (container) {
      container.innerHTML = filteredJobs.map((job, idx) => createJobCardHTML(job, idx)).join('');
      attachCardListeners();
    }
  }
}

function getSiteBadgeClass(site) {
  const s = (site || '').toUpperCase();
  if (s.includes('LINKEDIN')) return 'badge-linkedin';
  if (s.includes('NAUKRI')) return 'badge-naukri';
  if (s.includes('INSTAHYRE')) return 'badge-instahyre';
  if (s.includes('GLASSDOOR')) return 'badge-glassdoor';
  if (s.includes('INDEED')) return 'badge-indeed';
  return 'badge-site';
}

function createTableRowHTML(job, index) {
  const title = job.title || job.role_title || 'Product Manager';
  const company = job.company || job.company_name || 'Verified Company';
  const location = job.clean_location || job.location || 'India';
  const site = (job.site || job.source || 'JOB BOARD').toUpperCase();
  const applyUrl = job.apply_url || job.job_url || job.post_url || '#';
  const datePosted = job.date_posted || job.posted_at || 'Recent';
  const siteBadgeClass = getSiteBadgeClass(site);

  return `
    <tr>
      <td style="color: var(--text-muted); text-align: center; font-weight: 600;">${index}</td>
      <td class="company-cell">${escapeHtml(company)}</td>
      <td class="title-cell">${escapeHtml(title)}</td>
      <td>${escapeHtml(location)}</td>
      <td><span class="badge ${siteBadgeClass}">${escapeHtml(site)}</span></td>
      <td class="date-cell">${escapeHtml(datePosted)}</td>
      <td>
        <a href="${escapeHtml(applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="padding: 5px 12px; font-size: 12px;">
          Apply ➔
        </a>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm read-more-btn" data-index="${index - 1}" style="padding: 5px 10px; font-size: 12px;">
          Details
        </button>
      </td>
    </tr>
  `;
}

function createJobCardHTML(job, idx) {
  const title = job.title || job.role_title || 'Product Manager';
  const company = job.company || job.company_name || 'Verified Company';
  const location = job.clean_location || job.location || 'India';
  const site = (job.site || job.source || 'JOB BOARD').toUpperCase();
  const applyUrl = job.apply_url || job.job_url || job.post_url || '#';
  const datePosted = job.date_posted || job.posted_at || 'Recent';
  const seniority = job.seniority || (job.seniority_fit === '0-2y' ? 'Associate / APM' : 'Product Manager');
  const email = job.email || job.extracted_email;

  const siteBadgeClass = getSiteBadgeClass(site);

  return `
    <div class="job-card" data-id="${job.id || job.job_id || idx}">
      <div class="card-header">
        <div class="company-info">
          <div class="company-logo-avatar">${company.charAt(0).toUpperCase()}</div>
          <div>
            <h3 class="job-title" title="${escapeHtml(title)}">${escapeHtml(title)}</h3>
            <span class="company-name">${escapeHtml(company)}</span>
          </div>
        </div>
        <span class="badge ${siteBadgeClass}">${escapeHtml(site)}</span>
      </div>

      <div class="card-body">
        <div class="meta-row">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(location)}
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${escapeHtml(datePosted)}
          </span>
        </div>

        <div class="tags-row">
          <span class="tag tag-seniority">${escapeHtml(seniority)}</span>
          ${email ? `<span class="tag tag-email">✉️ ${escapeHtml(email)}</span>` : ''}
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-secondary btn-sm read-more-btn" data-index="${idx}">
          Details
        </button>
        <a href="${escapeHtml(applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          Apply Direct ➔
        </a>
      </div>
    </div>
  `;
}

function attachCardListeners() {
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      if (!isNaN(idx) && filteredJobs[idx]) {
        openModal(filteredJobs[idx]);
      }
    });
  });
}

function attachTableListeners() {
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      if (!isNaN(idx) && filteredJobs[idx]) {
        openModal(filteredJobs[idx]);
      }
    });
  });
}

function openModal(job) {
  const modal = document.getElementById('detailModal');
  if (!modal) return;

  const title = job.title || job.role_title || 'Product Manager';
  const company = job.company || job.company_name || 'Verified Company';
  const location = job.clean_location || job.location || 'India';
  const site = (job.site || job.source || 'JOB BOARD').toUpperCase();
  const applyUrl = job.apply_url || job.job_url || job.post_url || '#';
  const datePosted = job.date_posted || job.posted_at || 'Recent';
  const desc = job.job_description || job.text || 'No description preview available. Click Apply to view full job details.';

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalCompany').textContent = company;
  document.getElementById('modalLocation').textContent = location;
  document.getElementById('modalSite').textContent = site;
  document.getElementById('modalDate').textContent = datePosted;
  document.getElementById('modalDescription').innerText = desc;
  
  const modalApplyBtn = document.getElementById('modalApplyBtn');
  if (modalApplyBtn) {
    modalApplyBtn.href = applyUrl;
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.add('hidden');
}

function exportToCsv() {
  if (!filteredJobs || filteredJobs.length === 0) return;
  
  const headers = ['#', 'Company', 'Title', 'Location', 'Source', 'Date Posted', 'Apply URL'];
  const rows = filteredJobs.map((j, i) => [
    i + 1,
    `"${(j.company || '').replace(/"/g, '""')}"`,
    `"${(j.title || '').replace(/"/g, '""')}"`,
    `"${(j.clean_location || j.location || '').replace(/"/g, '""')}"`,
    `"${(j.site || j.source || '').replace(/"/g, '""')}"`,
    `"${(j.date_posted || j.posted_at || '').replace(/"/g, '""')}"`,
    `"${(j.apply_url || j.job_url || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Verified_PM_Jobs_Table_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
