'use client';

import { useEffect, useState } from 'react';

export default function WeatherWidget({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => null);
  }, [lat, lon]);

  if (!weather?.current) return <p className="muted">Loading weather…</p>;

  return (
    <p className="small">Current weather: {weather.current.temperature_2m}°C · code {weather.current.weather_code}</p>
  );
}
