import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { rating } = await req.json();
  const db = await getDb();
  const place = await db.collection('places').findOne({ _id: new ObjectId(params.id) });

  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ratingsCount = (place.ratingsCount || 0) + 1;
  const newRating = (((place.rating || 0) * (place.ratingsCount || 0)) + rating) / ratingsCount;

  await db.collection('places').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { rating: Number(newRating.toFixed(2)), ratingsCount } }
  );

  return NextResponse.json({ ok: true });
}
