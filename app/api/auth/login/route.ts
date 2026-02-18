import { NextResponse } from 'next/server';
import { createSession, verifyPassword } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');

  const db = await getDb();
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const token = await createSession({ userId: user._id.toString(), email: user.email, name: user.name });
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return response;
}
