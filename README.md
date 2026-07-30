# BORN — The Day Your Story Began

A geographically personalized birth capsule. Enter your birth date and place; explore **My World** (regional) and **The World** (global) — music you can open on Spotify or YouTube, local weather, sky, culture, news hierarchy, and a commemorative **BORN Certificate**.

> A commemorative digital experience — not an official government document.

## Product philosophy

BORN should never feel like “facts about your birthday.”

It should feel like: **here is the world that existed around you when your story began.**

`YOU → PLACE → REGION → COUNTRY → WORLD → SKY → CERTIFICATE → YOU`

## Stack

- React + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Open-Meteo (historical weather)
- OpenStreetMap Nominatim (geocoding)
- Wikimedia On This Day (events)
- SunCalc (local astronomy)
- Curated regional/global music & cinema charts with Spotify / YouTube listen links

## Develop

```bash
npm install
npm run dev
```

App runs at `http://localhost:8080`.

Vite proxies external APIs under `/api/*` (see `vite.config.ts`).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/create` | Birth details intake |
| `/capsule/:publicId` | Full capsule experience |
| `/c/:publicId` | Sharable capsule (optional `?p=` payload) |
| `/verify/:token` | Certificate verification |

## Architecture

```
src/lib/born/
  engine/regional-intelligence.ts   # location → providers → normalize → cache → personalize
  location/geocode.ts               # hierarchy + timezone
  providers/                        # weather, astronomy, news, culture…
  data/charts.ts                    # regional + global music/cinema
  capsule/store.ts                  # local shareable capsules
  certificate/                      # quotes, themes
```

Data priority for every fact: **local → regional → national → global**, with fallbacks clearly labeled.

## Scripts

```bash
npm run build
npm run test
npm run lint
```
