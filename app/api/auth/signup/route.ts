import { NextResponse } from 'next/server';
import { createSession, hashPassword } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');

  const db = await getDb();
  const existing = await db.collection('users').findOne({ email });
  if (existing) return NextResponse.redirect(new URL('/login', req.url));

  const hashed = await hashPassword(password);
  const result = await db.collection('users').insertOne({
    name,
    email,
    password: hashed,
    savedPlaces: [],
    savedTrips: []
  });

  const token = await createSession({ userId: result.insertedId.toString(), email, name });
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return response;
}
