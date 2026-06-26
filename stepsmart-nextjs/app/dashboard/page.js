export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { getMyCourses, getCourseWeeks, getProgress } from '@/lib/api-client';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value;

  let courses = [];
  let activeCourse = null;
  let weeks = [];
  let progressMap = {};
  let leaderboard = [];

  try {
    const coursesData = await getMyCourses(token);
    courses = coursesData.courses || [];
    activeCourse = courses[0] || null;
  } catch (error) {
    console.error('SSR: Failed to fetch courses list:', error);
  }

  // Fallback path: If courses is empty, try default course-001 so student is not blocked
  const activeCourseId = activeCourse?.courseId || 'course-001';
  const today = new Date().toISOString().split('T')[0];

  const [weeksRes, progressRes] = await Promise.allSettled([
    getCourseWeeks(token, activeCourseId),
    getProgress(token, activeCourseId, {
      includeLeaderboard: true,
      clientDate: today,
    }),
  ]);

  if (weeksRes.status === 'fulfilled') {
    weeks = weeksRes.value.weeks || [];
  } else {
    console.error(`SSR: Failed to fetch weeks for ${activeCourseId}:`, weeksRes.reason);
  }

  if (progressRes.status === 'fulfilled') {
    const progressData = progressRes.value || {};
    for (const p of (progressData.progress || [])) {
      progressMap[p.weekId] = p;
    }
    leaderboard = progressData.leaderboard || [];
  } else {
    console.error(`SSR: Failed to fetch progress for ${activeCourseId}:`, progressRes.reason);
  }

  return (
    <Suspense>
      <DashboardClient
        user={session}
        initialCourses={courses}
        initialActiveCourse={activeCourse}
        initialWeeks={weeks}
        initialProgressMap={progressMap}
        initialLeaderboard={leaderboard}
      />
    </Suspense>
  );
}
