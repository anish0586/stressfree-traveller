import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const result = await jwtVerify<SessionUser>(token, secret);
    return result.payload;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  const db = await getDb();
  return db.collection('users').findOne({ _id: new ObjectId(id) });
}
