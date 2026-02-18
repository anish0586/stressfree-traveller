import { MongoClient } from 'mongodb';
import slugify from 'slugify';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'stressfree_traveller';

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

await db.collection('cities').deleteMany({});
await db.collection('places').deleteMany({});

const cities = [
  {
    name: 'San Diego', country: 'USA', heroImage: 'https://images.unsplash.com/photo-1682685797337-1eec2fa8f806?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Sunny beaches, family attractions, and laid-back neighborhoods.',
    bestTimeToVisit: 'Spring and fall offer warm weather with fewer crowds.',
    idealMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct'], peakSeason: 'Jun–Aug', budgetSeason: 'Nov–Feb', lat: 32.7157, lon: -117.1611
  },
  {
    name: 'Lisbon', country: 'Portugal', heroImage: 'https://images.unsplash.com/photo-1558370781-d6196949e317?auto=format&fit=crop&w=1400&q=80',
    shortDescription: 'Colorful streets, trams, ocean views, and amazing food.',
    bestTimeToVisit: 'Late spring and early autumn are ideal for weather and prices.',
    idealMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], peakSeason: 'Jul–Aug', budgetSeason: 'Jan–Mar', lat: 38.7223, lon: -9.1393
  }
].map((c) => ({ ...c, slug: slugify(c.name, { lower: true }) }));

await db.collection('cities').insertMany(cities);

const places = [
  {
    citySlug: 'san-diego', name: 'Balboa Park', category: 'Must Visit', description: 'Huge urban cultural park with museums and gardens.', whyRecommended: 'Great mix of nature and culture for all ages.',
    image: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&w=1200&q=80', estimatedTime: '2-3 hours',
    walkingLevel: 'Moderate', kidFriendly: true, wheelchairAccessible: true, accessibilityScore: 5, budgetLevel: '$', rating: 4.6, ratingsCount: 11, mapLink: 'https://maps.google.com/?q=Balboa+Park'
  },
  {
    citySlug: 'san-diego', name: 'La Jolla Cove', category: 'Nice to See', description: 'Scenic cove with seals and clear blue water.', whyRecommended: 'Iconic coastal views with minimal planning.',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80', estimatedTime: '1-2 hours',
    walkingLevel: 'Low', kidFriendly: true, wheelchairAccessible: false, accessibilityScore: 3, budgetLevel: '$', rating: 4.7, ratingsCount: 22, mapLink: 'https://maps.google.com/?q=La+Jolla+Cove'
  },
  {
    citySlug: 'lisbon', name: 'Time Out Market', category: 'Food', description: 'Food hall featuring top local chefs and vendors.', whyRecommended: 'Taste many local dishes in one place.',
    image: 'https://images.unsplash.com/photo-1555992336-cbfdb1987f6f?auto=format&fit=crop&w=1200&q=80', estimatedTime: '1-2 hours',
    walkingLevel: 'Low', kidFriendly: true, wheelchairAccessible: true, accessibilityScore: 4, budgetLevel: '$$', rating: 4.5, ratingsCount: 35, mapLink: 'https://maps.google.com/?q=Time+Out+Market+Lisbon'
  },
  {
    citySlug: 'lisbon', name: 'Oceanário de Lisboa', category: 'Kids', description: 'One of Europe’s largest indoor aquariums.', whyRecommended: 'Perfect family stop and weather-proof.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80', estimatedTime: '2 hours',
    walkingLevel: 'Low', kidFriendly: true, wheelchairAccessible: true, accessibilityScore: 5, budgetLevel: '$$', rating: 4.8, ratingsCount: 40, mapLink: 'https://maps.google.com/?q=Oceanario+de+Lisboa'
  }
];

await db.collection('places').insertMany(places);

console.log('Seed complete');
await client.close();
