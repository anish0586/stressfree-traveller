export const dynamic = 'force-dynamic';

import CityGrid from '@/components/CityGrid';
import { getCities } from '@/lib/data';

const cityTags: Record<string, string[]> = {
  'san-diego': ['Kid-friendly', 'Less walking', 'Accessible', 'Food lovers'],
  'lisbon': ['Budget-friendly', 'Food lovers', 'Less walking']
};

export default async function HomePage() {
  const cities = (await getCities()).map((city: any) => ({
    ...city,
    tags: cityTags[city.slug] || []
  }));

  return (
    <main className="container">
      <section className="hero">
        <h1>Explore Cities the Smart Way</h1>
        <p className="muted">Curated, filterable city guides for families, accessibility needs, budget travel, and food-first adventures.</p>
      </section>
      <CityGrid cities={cities} />
    </main>
  );
}
