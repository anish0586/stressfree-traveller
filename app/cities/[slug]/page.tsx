export const dynamic = 'force-dynamic';

import CityPlaces from '@/components/CityPlaces';
import WeatherWidget from '@/components/WeatherWidget';
import { getCityBySlug, getPlacesByCity } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const city = await getCityBySlug(params.slug);
  if (!city) return {};
  return {
    title: `${city.name} Travel Guide | Stressfree Traveller`,
    description: city.shortDescription
  };
}

export default async function CityDetailPage({ params }: { params: { slug: string } }) {
  const city = await getCityBySlug(params.slug);
  if (!city) return notFound();

  const places = await getPlacesByCity(params.slug);
  const session = await getSession();

  return (
    <main className="container section">
      <h1>{city.name}, {city.country}</h1>
      <p className="muted">{city.shortDescription}</p>
      <img className="card" src={city.heroImage} alt={city.name} style={{ width: '100%', height: 320, objectFit: 'cover' }} />

      <section className="section card">
        <div className="card-body">
          <h2>Best Time to Visit</h2>
          <p>{city.bestTimeToVisit}</p>
          <div className="tags">
            {city.idealMonths.map((m: string) => <span key={m} className="tag">{m}</span>)}
          </div>
          <p className="small"><strong>Peak season:</strong> {city.peakSeason}</p>
          <p className="small"><strong>Budget season:</strong> {city.budgetSeason}</p>
          <WeatherWidget lat={city.lat} lon={city.lon} />
        </div>
      </section>

      <CityPlaces places={places} userId={session?.userId} />
    </main>
  );
}
