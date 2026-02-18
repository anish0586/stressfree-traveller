import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

type NewCityPayload = {
  name: string;
  slug: string;
  country: string;
  heroImage: string;
  shortDescription: string;
  bestTimeToVisit: string;
  idealMonths: string[];
  peakSeason: string;
  budgetSeason: string;
  lat: number;
  lon: number;
};

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function validatePayload(data: Partial<NewCityPayload>) {
  const requiredTextFields: (keyof Omit<NewCityPayload, 'idealMonths' | 'lat' | 'lon'>)[] = [
    'name',
    'slug',
    'country',
    'heroImage',
    'shortDescription',
    'bestTimeToVisit',
    'peakSeason',
    'budgetSeason'
  ];

  for (const field of requiredTextFields) {
    if (!data[field] || typeof data[field] !== 'string' || !data[field]?.trim()) {
      return `${field} is required`;
    }
  }

  if (!Array.isArray(data.idealMonths) || data.idealMonths.length === 0) {
    return 'idealMonths is required';
  }

  if (typeof data.lat !== 'number' || Number.isNaN(data.lat)) {
    return 'lat must be a number';
  }

  if (typeof data.lon !== 'number' || Number.isNaN(data.lon)) {
    return 'lon must be a number';
  }

  return null;
}

export async function POST(req: Request) {
  const payload = (await req.json()) as Partial<NewCityPayload>;

  const slug = sanitizeSlug(payload.slug || payload.name || '');
  const normalizedPayload: Partial<NewCityPayload> = {
    ...payload,
    slug,
    idealMonths: payload.idealMonths?.map((month) => month.trim()).filter(Boolean)
  };

  const validationError = validatePayload(normalizedPayload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const db = await getDb();
  const existingCity = await db.collection('cities').findOne({ slug });

  if (existingCity) {
    return NextResponse.json({ error: 'A page already exists for this slug' }, { status: 409 });
  }

  await db.collection('cities').insertOne({
    ...normalizedPayload,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, slug });
}
