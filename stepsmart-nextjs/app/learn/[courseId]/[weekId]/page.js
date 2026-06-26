import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { getCourseWeeks, getProgress, getQAQuestions } from '@/lib/api-client';
import LearnClient from './LearnClient';

export const dynamic = 'force-dynamic';

export default async function LearnPage({ params }) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const { courseId, weekId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value;

  // weeksData holds the FULL response object (not just .weeks array),
  // because LearnClient reads .modules, .weeks, .liveWeeks, .supplementalContent
  let weeksData = {};
  let progressMap = {};
  let qaQuestions = [];

  // Fetch all necessary lesson, progress, and Q&A details in parallel server-side
  const [weeksRes, progressRes, qaRes] = await Promise.allSettled([
    getCourseWeeks(token, courseId),
    getProgress(token, courseId),
    getQAQuestions(token, courseId, weekId),
  ]);

  if (weeksRes.status === 'fulfilled') {
    // Pass the complete response object so LearnClient can find modules, liveWeeks, supplementalContent
    weeksData = weeksRes.value || {};
  } else {
    console.error(`LearnPage SSR: Failed to fetch weeks for ${courseId}:`, weeksRes.reason);
  }

  if (progressRes.status === 'fulfilled') {
    const progressData = progressRes.value || {};
    for (const p of (progressData.progress || [])) {
      progressMap[p.weekId] = p;
    }
  } else {
    console.error(`LearnPage SSR: Failed to fetch progress for ${courseId}:`, progressRes.reason);
  }

  if (qaRes.status === 'fulfilled') {
    qaQuestions = qaRes.value.questions || [];
  } else {
    console.error(`LearnPage SSR: Failed to fetch Q&A questions for ${courseId}/${weekId}:`, qaRes.reason);
  }

  return (
    <Suspense>
      <LearnClient
        user={session}
        courseId={courseId}
        weekId={weekId}
        initialWeeks={weeksData}
        initialProgressMap={progressMap}
        initialQAQuestions={qaQuestions}
      />
    </Suspense>
  );
}
