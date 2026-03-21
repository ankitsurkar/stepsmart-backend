import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// REACT_APP_API_URL is set as a Vercel environment variable.
// Example: https://abc123.execute-api.us-east-1.amazonaws.com/prod
const BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attaches the Cognito ID Token to every outgoing request.
// Amplify holds tokens in memory (not localStorage) and auto-refreshes via the refresh token
// when they are within 5 minutes of expiry.
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // If there is no active session the request goes unsigned.
    // API Gateway will return 401 and the caller handles that.
  }
  return config;
});

// ─── Progress ────────────────────────────────────────────────────────────────

// Sent every 10 seconds while a video is playing.
// currentTime and duration are integers (seconds).
export const sendHeartbeat = (courseId, weekId, currentTime, duration) =>
  api.post('/progress/heartbeat', { courseId, weekId, currentTime, duration });

// Returns all watched-segment data for a student in one course.
export const getProgress = (courseId) =>
  api.get(`/progress/${courseId}`);

// ─── Courses ─────────────────────────────────────────────────────────────────

// Returns the list of courses the authenticated student is enrolled in.
export const getMyCourses = () =>
  api.get('/courses/my');

// Returns all visible weeks for a course, with quiz questions (no correctIndex for students).
export const getCourseWeeks = (courseId) =>
  api.get(`/courses/${courseId}/weeks`);

// ─── Quiz ─────────────────────────────────────────────────────────────────────

// answers is an object: { "q1": 2, "q2": 0, "q3": 1 }
// Keys are question IDs, values are the index of the option the student chose (0-based).
export const submitQuiz = (courseId, weekId, answers) =>
  api.post('/quiz/submit', { courseId, weekId, answers });

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminGetStudents = () =>
  api.get('/admin/students');

export const adminCreateStudent = (data) =>
  api.post('/admin/students', data);

export const adminGetWeeks = (courseId) =>
  api.get(`/admin/courses/${courseId}/weeks`);

export const adminCreateWeek = (courseId, weekData) =>
  api.post(`/admin/courses/${courseId}/weeks`, weekData);

export const adminUpdateWeek = (courseId, weekId, updates) =>
  api.patch(`/admin/courses/${courseId}/weeks/${weekId}`, updates);

export const adminDeleteWeek = (courseId, weekId) =>
  api.delete(`/admin/courses/${courseId}/weeks/${weekId}`);

export const adminGetAllProgress = (courseId) =>
  api.get(`/admin/courses/${courseId}/progress`);

// ─── Assignments ──────────────────────────────────────────────────────────────

export const uploadAssignment = (courseId, weekId, fileName, mimeType, fileBase64) =>
  api.post('/assignments/upload', { courseId, weekId, fileName, mimeType, fileBase64 });

export default api;
