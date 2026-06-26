const BASE_URL = process.env.API_URL || 'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod';

/**
 * Builds a query string from a key-value object, filtering out null/undefined values.
 */
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Core fetch function to call backend Lambda APIs from the Next.js server.
 * This runs strictly in the server context.
 * 
 * @param {string} path API endpoint path
 * @param {string} token Cognito ID token
 * @param {object} options fetch options overrides
 */
async function serverFetch(path, token, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    cache: 'no-store', // Default to no-store for real-time student progress accuracy
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch (_) {}
    throw new Error(`API Request to ${path} failed with status ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

// ─── STUDENT APIS ────────────────────────────────────────────────────────────

/**
 * Retrieves the courses enrolled by the logged-in student.
 */
export const getMyCourses = (token) => 
  serverFetch('/courses/my', token);

/**
 * Retrieves the weeks, content, and quiz metadata for a specific course.
 */
export const getCourseWeeks = (token, courseId) => 
  serverFetch(`/courses/${courseId}/weeks`, token);

/**
 * Retrieves progress and ranking data for the student.
 * Params typically include: { includeLeaderboard: boolean, clientDate: string }
 */
export const getProgress = (token, courseId, params = {}) => 
  serverFetch(`/progress/${courseId}${buildQueryString(params)}`, token);

/**
 * Retrieves Q&A question/answer items for a specific course and week.
 */
export const getQAQuestions = (token, courseId, weekId) =>
  serverFetch(`/courses/${courseId}/weeks/${weekId}/qa`, token);

// ─── ADMIN APIS ─────────────────────────────────────────────────────────────

/**
 * Admin view of enrolled students.
 */
export const adminGetStudents = (token, courseId) =>
  serverFetch(`/admin/students${buildQueryString({ courseId })}`, token);

/**
 * Admin view of weeks.
 */
export const adminGetWeeks = (token, courseId) =>
  serverFetch(`/admin/courses/${courseId}/weeks`, token);

/**
 * Admin view of all student progress metrics.
 */
export const adminGetAllProgress = (token, courseId) =>
  serverFetch(`/admin/courses/${courseId}/progress`, token);

/**
 * Admin view of all project/assignment submissions.
 */
export const adminGetAllSubmissions = (token, courseId) =>
  serverFetch(`/admin/courses/${courseId}/submissions`, token);

/**
 * Admin view of all marketing/contact leads.
 */
export const adminGetLeads = (token) =>
  serverFetch('/admin/leads', token);
