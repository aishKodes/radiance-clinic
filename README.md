# Radiance Clinics Frontend

Premium Next.js App Router frontend for Radiance Clinics, Bhubaneswar. The site is designed to run on Vercel and fetch content from the future PHP + MySQL public API, while keeping polished local fallback content when the API is not available.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis smooth scrolling
- `react-compare-slider` before/after sliders
- Custom public API integration via `NEXT_PUBLIC_API_BASE_URL`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

All variables are optional for local fallback rendering unless noted.

```bash
NEXT_PUBLIC_SITE_URL=https://www.radianceclinics.com
NEXT_PUBLIC_API_BASE_URL=https://api.radianceclinics.com
GOOGLE_GENERATIVE_AI_API_KEY=
GEMINI_API_KEY=
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=
GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN=
GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID=
GOOGLE_BUSINESS_PROFILE_LOCATION_ID=
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
GOOGLE_BUSINESS_PROFILE_MAPS_URL=
```

- `NEXT_PUBLIC_SITE_URL`: Used for metadata, canonical URLs, and sitemap output.
- `NEXT_PUBLIC_API_BASE_URL`: Public API origin. If missing or unreachable, the frontend renders from `src/data/fallback.ts` and `src/data/seed.ts`.
- `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY`: Optional server-side Gemini key for `/api/assistant`. If missing, the assistant uses a safe rules-based fallback.
- `GOOGLE_BUSINESS_PROFILE_*`: Optional server-only OAuth credentials and account/location IDs for the complete verified-location review feed. The access token is refreshed server-side and review data is cached for one hour.
- `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`: Optional fallback for the public Google rating, count, and selected reviews when Business Profile API access is not configured.
- `GOOGLE_BUSINESS_PROFILE_MAPS_URL`: Optional direct link to the clinic's Google Maps profile. A Bhubaneswar search link is used when omitted.

Do not commit `.env`, `.env.local`, or any real secret values.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run process:media
```

`npm run process:media` processes approved local clinic media with Sharp. Raw media folders are intentionally ignored by Git.

## Media

Keep optimized frontend assets in `public/`, especially:

- `public/radiance-media-processed/`
- `public/radiance-skin-before-after-separated/`
- logo and favicon assets in `public/`

Do not commit raw source media:

- `radiance-media-raw/`
- `raw-media/`
- `public/radiance-media-raw/`
- `public/raw-media/`

The production site should not depend on raw folders. It should use optimized public media, API media URLs, or fallback data.

## Deployment On Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel as a Next.js project.
3. Set environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_API_BASE_URL` when the Hostinger API is live
   - `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY` only if Gemini responses are desired
   - The server-only `GOOGLE_BUSINESS_PROFILE_*` variables for live Google reviews, or `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` for the public fallback
4. Use the default build command:

```bash
npm run build
```

The site is safe to deploy before the backend is live. Missing API content falls back to local data, the booking form shows WhatsApp/call fallback options if the lead API is unavailable, and the assistant falls back to medically responsible rules-based replies without an AI key.

## Production Checks

Before deployment:

```bash
npm run lint
npm run build
```

The homepage, before/after sliders, chatbot, booking modal, metadata, sitemap, logo, and favicon should work without a live backend.
