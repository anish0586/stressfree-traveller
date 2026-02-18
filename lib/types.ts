export type City = {
  _id: string;
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

export type Place = {
  _id: string;
  name: string;
  citySlug: string;
  category: 'Must Visit' | 'Nice to See' | 'Food' | 'Kids' | 'Less Walking';
  description: string;
  whyRecommended: string;
  image: string;
  estimatedTime: string;
  walkingLevel: 'Low' | 'Moderate' | 'High';
  kidFriendly: boolean;
  wheelchairAccessible: boolean;
  accessibilityScore: number;
  budgetLevel: '$' | '$$' | '$$$';
  rating: number;
  ratingsCount: number;
  mapLink: string;
};
