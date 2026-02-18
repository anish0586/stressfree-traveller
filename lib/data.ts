import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

export async function getCities() {
  const db = await getDb();
  return db.collection('cities').find({}).sort({ name: 1 }).toArray();
}

export async function getCityBySlug(slug: string) {
  const db = await getDb();
  return db.collection('cities').findOne({ slug });
}

export async function getPlacesByCity(slug: string) {
  const db = await getDb();
  return db.collection('places').find({ citySlug: slug }).toArray();
}

export async function getSavedPlaces(userId: string) {
  const db = await getDb();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  const savedIds = user?.savedPlaces || [];
  if (!savedIds.length) return [];
  return db.collection('places').find({ _id: { $in: savedIds.map((id: string) => new ObjectId(id)) } }).toArray();
}
