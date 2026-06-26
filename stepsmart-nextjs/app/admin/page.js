import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/auth';
import { getMyCourses } from '@/lib/api-client';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  // Enforce secure admin guard server-side
  if (!session.isAdmin) {
    redirect('/dashboard');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value;

  let courses = [];
  try {
    const coursesData = await getMyCourses(token);
    courses = coursesData.courses || [];
  } catch (error) {
    console.error('AdminPage SSR: Failed to load courses:', error);
  }

  return <AdminClient user={session} initialCourses={courses} />;
}
