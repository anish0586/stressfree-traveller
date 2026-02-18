'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function CityGrid({ cities }: { cities: any[] }) {
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('');

  const filtered = useMemo(() => cities.filter((city) => {
    const matchesQuery = city.name.toLowerCase().includes(query.toLowerCase());
    const hasFilter = quickFilter ? city.tags?.includes(quickFilter) : true;
    return matchesQuery && hasFilter;
  }), [cities, query, quickFilter]);

  const filters = ['Kid-friendly', 'Less walking', 'Budget-friendly', 'Accessible', 'Food lovers'];

  return (
    <>
      <div className="search">
        <input
          aria-label="Search city"
          placeholder="Search by city name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={quickFilter === filter ? '' : 'secondary'}
            onClick={() => setQuickFilter(quickFilter === filter ? '' : filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid">
        {filtered.map((city) => (
          <Link key={city._id.toString()} className="card" href={`/cities/${city.slug}`}>
            <img src={city.heroImage} alt={city.name} style={{ height: 180, objectFit: 'cover', width: '100%' }} />
            <div className="card-body">
              <h3>{city.name}, {city.country}</h3>
              <p className="muted small">{city.shortDescription}</p>
              <div className="tags">
                {(city.tags || []).map((t: string) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
