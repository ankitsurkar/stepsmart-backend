import axios from 'axios';

/**
 * Axios instance targeting the Next.js local proxy endpoint.
 * Eliminates the need for browser-side Amplify tokens and handles CORS automatically.
 */
const api = axios.create({
  baseURL: '/api/proxy',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor to handle session expiry (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// ─── Progress ────────────────────────────────────────────────────────────────

export const sendHeartbeat = (courseId, weekId, currentTime, duration, prevTime) =>
  api.post('/progress/heartbeat', { courseId, weekId, currentTime, duration, prevTime });

export const getProgress = (courseId, params = {}) =>
  api.get(`/progress/${courseId}`, { params });

// ─── Courses ─────────────────────────────────────────────────────────────────

export const getMyCourses = () =>
  api.get('/courses/my');

export const getCourseWeeks = (courseId) =>
  api.get(`/courses/${courseId}/weeks`);

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export const submitQuiz = (courseId, weekId, answers) =>
  api.post('/quiz/submit', { courseId, weekId, answers });

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminGetStudents = (courseId) =>
  api.get('/admin/students', { params: { courseId } });

export const adminCreateStudent = (data) =>
  api.post('/admin/students', data);

export const adminGetWeeks = (courseId) =>
  api.get(`/admin/courses/${courseId}/weeks`);

export const adminCreateWeek = (courseId, weekData) =>
  api.post(`/admin/courses/${courseId}/weeks`, weekData);

export const adminUpdateWeek = (courseId, weekId, updates) =>
  api.patch(`/admin/courses/${courseId}/weeks/${weekId}`, updates);

export const adminUpdateSupplementalContent = (courseId, updates) =>
  api.patch(`/admin/courses/${courseId}/weeks/__supplemental__`, updates);

export const adminDeleteWeek = (courseId, weekId) =>
  api.delete(`/admin/courses/${courseId}/weeks/${weekId}`);

export const adminGetAllProgress = (courseId) =>
  api.get(`/admin/courses/${courseId}/progress`);

export const adminGetAllSubmissions = (courseId) =>
  api.get(`/admin/courses/${courseId}/submissions`);

export const adminGetLeads = () =>
  api.get('/admin/leads');

// ─── Assignments ──────────────────────────────────────────────────────────────

export const uploadAssignment = (
  courseId,
  weekId,
  fileName,
  mimeType,
  fileBase64,
  assignmentId,
  assignmentTitle,
) =>
  api.post('/assignments/upload', {
    courseId,
    weekId,
    fileName,
    mimeType,
    fileBase64,
    assignmentId,
    assignmentTitle,
  });

// ─── Q&A ──────────────────────────────────────────────────────────────────────

export const getQAQuestions = (courseId, weekId) =>
  api.get(`/courses/${courseId}/weeks/${weekId}/qa`);

export const postQAQuestion = (courseId, weekId, text) =>
  api.post(`/courses/${courseId}/weeks/${weekId}/qa`, { text });

// ─── PM Gym ──────────────────────────────────────────────────────────────────

export const adminSaveGymQuestion = (courseId, question) =>
  api.patch(`/admin/courses/${courseId}/weeks/__gym__`, { action: 'save', question });

export const adminDeleteGymQuestion = (courseId, date) =>
  api.patch(`/admin/courses/${courseId}/weeks/__gym__`, { action: 'delete', date });

export const submitGymAnswer = (courseId, date, answer) =>
  api.post('/quiz/submit', { courseId, weekId: 'gym', answers: { [date]: answer } });

export default api;
