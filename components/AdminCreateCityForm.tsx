'use client';

import { FormEvent, useState } from 'react';

type FormState = {
  name: string;
  slug: string;
  country: string;
  heroImage: string;
  shortDescription: string;
  bestTimeToVisit: string;
  idealMonths: string;
  peakSeason: string;
  budgetSeason: string;
  lat: string;
  lon: string;
};

const initialState: FormState = {
  name: '',
  slug: '',
  country: '',
  heroImage: '',
  shortDescription: '',
  bestTimeToVisit: '',
  idealMonths: '',
  peakSeason: '',
  budgetSeason: '',
  lat: '',
  lon: ''
};

export default function AdminCreateCityForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    setMessage('Creating page...');

    const payload = {
      ...form,
      idealMonths: form.idealMonths.split(',').map((m) => m.trim()).filter(Boolean),
      lat: Number(form.lat),
      lon: Number(form.lon)
    };

    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data?.error || 'Unable to create page.');
        return;
      }

      setStatus('success');
      setMessage(`Page created! You can view it at /cities/${data.slug}.`);
      setForm(initialState);
    } catch {
      setStatus('error');
      setMessage('Network error while creating page.');
    }
  }

  return (
    <section className="section card">
      <div className="card-body">
        <h1>Create a New City Page</h1>
        <p className="muted small">This utility is temporarily open to everyone. We can lock it down to admins later.</p>

        <form onSubmit={handleSubmit} className="admin-form-grid" style={{ marginTop: '1rem' }}>
          <label>
            City name
            <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          </label>

          <label>
            URL slug
            <input
              value={form.slug}
              placeholder="auto-generated from city name if left blank"
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </label>

          <label>
            Country
            <input value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} required />
          </label>

          <label>
            Hero image URL
            <input type="url" value={form.heroImage} onChange={(e) => setForm((prev) => ({ ...prev, heroImage: e.target.value }))} required />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            Short description
            <textarea rows={3} value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} required />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            Best time to visit
            <textarea rows={3} value={form.bestTimeToVisit} onChange={(e) => setForm((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))} required />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            Ideal months (comma separated)
            <input value={form.idealMonths} placeholder="Apr, May, Jun" onChange={(e) => setForm((prev) => ({ ...prev, idealMonths: e.target.value }))} required />
          </label>

          <label>
            Peak season
            <input value={form.peakSeason} onChange={(e) => setForm((prev) => ({ ...prev, peakSeason: e.target.value }))} required />
          </label>

          <label>
            Budget season
            <input value={form.budgetSeason} onChange={(e) => setForm((prev) => ({ ...prev, budgetSeason: e.target.value }))} required />
          </label>

          <label>
            Latitude
            <input type="number" step="any" value={form.lat} onChange={(e) => setForm((prev) => ({ ...prev, lat: e.target.value }))} required />
          </label>

          <label>
            Longitude
            <input type="number" step="any" value={form.lon} onChange={(e) => setForm((prev) => ({ ...prev, lon: e.target.value }))} required />
          </label>

          <button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Creating...' : 'Create Page'}</button>
        </form>

        {message ? (
          <p className="small" style={{ marginTop: '1rem', color: status === 'error' ? '#a32222' : 'var(--accent)' }}>
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
