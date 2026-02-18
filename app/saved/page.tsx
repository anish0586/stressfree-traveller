export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/auth';
import { getSavedPlaces } from '@/lib/data';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';

export default async function SavedPage() {
  const session = await getSession();

  if (!session) {
    return <main className="container section"><p>Please <Link href="/login">login</Link> to view saved places.</p></main>;
  }

  const places = await getSavedPlaces(session.userId);
  const db = await getDb();
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });
  const trips = user?.savedTrips || [];

  return (
    <main className="container section">
      <h1>Saved Places</h1>
      {!places.length && <p className="muted">No saved places yet.</p>}
      <div className="grid">
        {places.map((place: any) => (
          <article key={place._id.toString()} className="card">
            <img src={place.image} alt={place.name} style={{ height: 170, objectFit: 'cover', width: '100%' }} />
            <div className="card-body">
              <h3>{place.name}</h3>
              <p className="muted small">{place.description}</p>
              <p className="small">Budget: <span className="tag">{place.budgetLevel}</span></p>
            </div>
          </article>
        ))}
      </div>

      <section className="section">
        <h2>Saved Itineraries</h2>
        {!trips.length && <p className="muted">No itineraries saved yet.</p>}
        <div className="grid">
          {trips.map((trip: any) => (
            <article key={trip.id} className="card">
              <div className="card-body">
                <h3>{trip.tripDays} Trip</h3>
                <p className="small">Places selected: {trip.placeIds?.length || 0}</p>
                <p className="muted small">Created: {new Date(trip.createdAt).toLocaleDateString()}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
