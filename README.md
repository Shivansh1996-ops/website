# BORN

**The day your story began.**

A geographically personalized birth capsule. Enter your birth date, time, and place — then explore two worlds at once:

- **My World** — what was happening around your birthplace
- **The World** — what was happening globally

Finish with **The Born Certificate**, a commemorative digital artifact (not an official government document).

## Features

- Location-first geocoding (Open-Meteo + Nominatim fallback)
- Local historical weather (Open-Meteo archive)
- Local sky / moon calculations (SunCalc + lat/lon/timezone)
- Regional → national → global music with Spotify & YouTube listen links
- Regional cinema highlights (+ optional TMDB when `VITE_TMDB_API_KEY` is set)
- Hierarchical news & timeline layers
- Sharable capsules (`/c/:token`) with compressed seed payloads
- Certificate themes, PDF/image export, QR → public capsule, `/verify/:token`

## Development

```bash
npm install
npm run dev
```

```bash
npm run test
npm run build
```

Optional:

```bash
# .env
VITE_TMDB_API_KEY=your_tmdb_key
```

## Product philosophy

BORN should never feel like “facts about your birthday.”

It should feel like: **here is the world that existed around you when your story began.**

## Stack

React · TypeScript · Vite · Tailwind · Framer Motion · shadcn/ui
