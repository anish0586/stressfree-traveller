import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { placeId } = await req.json();
  const db = await getDb();

  await db.collection('users').updateOne(
    { _id: new ObjectId(session.userId) },
    { $addToSet: { savedPlaces: placeId } }
  );

  return NextResponse.json({ ok: true });
}
