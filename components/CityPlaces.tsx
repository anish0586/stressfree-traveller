'use client';

import { useMemo, useState } from 'react';

const categoryOrder = ['Must Visit', 'Nice to See', 'Food', 'Kids', 'Less Walking'];

export default function CityPlaces({ places, userId }: { places: any[]; userId?: string }) {
  const [filters, setFilters] = useState({ kid: false, lessWalking: false, budget: false, access: false, rated: false });
  const [selectedForTrip, setSelectedForTrip] = useState<string[]>([]);
  const [tripDays, setTripDays] = useState('1-day');

  const filtered = useMemo(() => places.filter((p) => {
    if (filters.kid && !p.kidFriendly) return false;
    if (filters.lessWalking && p.walkingLevel !== 'Low') return false;
    if (filters.budget && p.budgetLevel === '$$$') return false;
    if (filters.access && p.accessibilityScore < 4) return false;
    if (filters.rated && p.rating < 4.5) return false;
    return true;
  }), [places, filters]);

  const grouped = categoryOrder.map((cat) => ({ cat, items: filtered.filter((p) => p.category === cat) })).filter((g) => g.items.length > 0);

  async function savePlace(placeId: string) {
    if (!userId) return alert('Please login to save places.');
    await fetch('/api/places/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ placeId }) });
    alert('Saved!');
  }

  async function rate(placeId: string, rating: number) {
    await fetch(`/api/places/${placeId}/rate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating }) });
    alert('Rating submitted. Refresh to see updated average.');
  }

  async function saveItinerary() {
    if (!userId) return alert('Please login first.');
    await fetch('/api/itineraries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ placeIds: selectedForTrip, tripDays }) });
    alert('Itinerary saved!');
  }

  return (
    <>
      <div className="filters">
        {[
          ['kid', 'Kid-friendly'],
          ['lessWalking', 'Less walking'],
          ['budget', 'Budget'],
          ['access', 'Accessibility 4+'],
          ['rated', 'Highly rated']
        ].map(([key, label]) => (
          <button key={key} className={filters[key as keyof typeof filters] ? '' : 'secondary'} onClick={() => setFilters((f) => ({ ...f, [key]: !f[key as keyof typeof f] }))}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-body">
          <h3>Simple Itinerary Builder</h3>
          <p className="muted">Select places below and save a 1-day or 2-day trip.</p>
          <select value={tripDays} onChange={(e) => setTripDays(e.target.value)}>
            <option value="1-day">1-day</option>
            <option value="2-day">2-day</option>
          </select>
          <button style={{ marginLeft: '.5rem' }} onClick={saveItinerary}>Save itinerary ({selectedForTrip.length} places)</button>
        </div>
      </div>

      {grouped.map(({ cat, items }) => (
        <section key={cat} className="section">
          <h2>{cat === 'Must Visit' ? 'Must Visit Places' : cat === 'Nice to See' ? 'Nice to See' : cat === 'Food' ? 'Best Food Stops' : cat === 'Kids' ? 'Places for Kids' : 'Places with Less Walking'}</h2>
          <div className="grid">
            {items.map((place) => (
              <article key={place._id.toString()} className="card">
                <img src={place.image} alt={place.name} style={{ height: 170, objectFit: 'cover', width: '100%' }} />
                <div className="card-body">
                  <h3>{place.name}</h3>
                  <p className="muted small">{place.description}</p>
                  <p className="small"><strong>Why recommended:</strong> {place.whyRecommended}</p>
                  <p className="small">⏱ {place.estimatedTime} · 🚶 {place.walkingLevel} · ⭐ {place.rating.toFixed(1)}</p>
                  <p className="small">Budget: <span className="tag">{place.budgetLevel}</span></p>
                  <div className="icon-list">
                    {place.wheelchairAccessible && <span className="icon-pill">♿ Wheelchair</span>}
                    {place.kidFriendly && <span className="icon-pill">🧒 Kid-friendly</span>}
                    {place.walkingLevel === 'Low' && <span className="icon-pill">🚶 Low walking</span>}
                  </div>
                  <p className="small">Accessibility score: {place.accessibilityScore}/5</p>
                  <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                    <button className="secondary" onClick={() => savePlace(place._id.toString())}>Save</button>
                    <button className="secondary" onClick={() => setSelectedForTrip((prev) => prev.includes(place._id.toString()) ? prev.filter((id) => id !== place._id.toString()) : [...prev, place._id.toString()])}>
                      {selectedForTrip.includes(place._id.toString()) ? 'Remove from trip' : 'Add to trip'}
                    </button>
                    <button className="secondary" onClick={() => rate(place._id.toString(), 5)}>Rate 5★</button>
                    <a href={place.mapLink} target="_blank"><button className="secondary">Map</button></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
