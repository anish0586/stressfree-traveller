import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { placeIds, tripDays } = await req.json();
  const db = await getDb();
  const trip = { id: crypto.randomUUID(), placeIds, tripDays, createdAt: new Date().toISOString() };

  await db.collection('users').updateOne(
    { _id: new ObjectId(session.userId) },
    { $push: { savedTrips: trip } }
  );

  return NextResponse.json({ ok: true });
}
