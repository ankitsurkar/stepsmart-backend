import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('id_token');
    cookieStore.delete('refresh_token');
    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout API error:', error);
    return Response.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
