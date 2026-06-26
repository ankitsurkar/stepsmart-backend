import { redirect } from 'next/navigation';

// Root route: redirect to /dashboard (protected) or /login
export default function Home() {
  redirect('/dashboard');
}
