# BORN

The day your story began.

A geographically personalized birth capsule — local weather, sky, regional music & cinema (with Spotify / YouTube listen links), layered timelines, and a commemorative **Born Certificate**.

## Philosophy

Not “facts about your birthday.”

**Here is the world that existed around you when your story began** — continuously moving between you → place → region → country → world → universe, then back to you.

## Features

- Location-first geocoding (city → region → country → continent, timezone, coordinates)
- **My World / The World** toggle with animated transition
- Historical weather via Open-Meteo Archive (birthplace coordinates)
- Local astronomy via SunCalc (lat/lon/date/time)
- Regional music & films with Spotify / YouTube links
- Layered timeline: local → regional → national → global → personal
- Sharable capsules at `/c/:token`
- Certificate verification at `/verify/:token`
- Certificate themes: Archive, Cosmos, Origin, Earth, Time
- PDF + social image download

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Stack

React · TypeScript · Vite · Tailwind · Framer Motion · Open-Meteo · Nominatim · SunCalc · MusicBrainz (optional enrichment)

## Note

The Born Certificate is a **commemorative digital artifact — not an official government document**.
