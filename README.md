# Stressfree Traveller (Next.js + MongoDB)

Modern mobile-first travel website with curated city guides, filters, saved places, itineraries, ratings, weather, and SEO-friendly city pages.

## Tech Stack
- Next.js 14 (App Router)
- MongoDB (native driver)
- Custom JWT auth (email/password)

## Pages
- `/` Homepage with hero, city search, city grid, quick filters
- `/cities/[slug]` Dynamic city detail page with category sections, filters, weather, best-time-to-visit, save and rate actions
- `/login` and `/signup` User account flows
- `/saved` Saved places + saved itineraries

## Database Collections
### `cities`
- `name`, `country`, `slug`, `heroImage`, `shortDescription`
- `bestTimeToVisit`, `idealMonths[]`, `peakSeason`, `budgetSeason`
- `lat`, `lon`

### `places`
- `name`, `citySlug`, `category`
- `description`, `whyRecommended`, `image`
- `estimatedTime`, `walkingLevel`
- `kidFriendly`, `wheelchairAccessible`, `accessibilityScore`
- `budgetLevel`, `rating`, `ratingsCount`, `mapLink`

### `users`
- `name`, `email`, `password`
- `savedPlaces[]` (place id relation)
- `savedTrips[]` (itinerary objects with place relations)

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy env file and update values:
   ```bash
   cp .env.example .env.local
   ```
3. Seed sample data:
   ```bash
   node scripts/seed.mjs
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## SEO
- Dynamic title and description in city page metadata
- Friendly URLs `/cities/<slug>`
- Semantic heading structure
