import type { CapsuleData, CertificatePayload, CertificateTheme } from "./types";

const QUOTES = [
  "A new story began here.",
  "The world was already moving. Then you arrived.",
  "One quiet coordinate. One unfinished map. One beginning.",
  "Before your first memory, the sky already knew your date.",
  "History kept going — and made room for you.",
  "Not a statistic. A starting point.",
  "The local morning and the global century met in one arrival.",
];

export function pickCertificateQuote(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return QUOTES[h % QUOTES.length];
}

export function generateCertificateNumber(birthYear: number, token: string): string {
  const suffix = token.replace(/[^A-Z0-9]/gi, "").slice(0, 6).toUpperCase().padEnd(6, "X");
  return `BORN-${birthYear}-${suffix}`;
}

export function generatePublicToken(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

export function toCertificatePayload(capsule: CapsuleData): CertificatePayload {
  const music = capsule.culture.music.find((m) => m.scope === "regional")
    ?? capsule.culture.music.find((m) => m.scope === "national")
    ?? capsule.culture.music[0];
  const movie = capsule.culture.films.find((f) => f.scope === "regional")
    ?? capsule.culture.films.find((f) => f.scope === "national")
    ?? capsule.culture.films[0];
  const majorEvent = capsule.timeline.find((t) => t.layer === "global" && !t.isBirth)
    ?? capsule.timeline.find((t) => !t.isBirth);

  return {
    certificateNumber: capsule.certificateNumber,
    publicToken: capsule.publicToken,
    name: capsule.input.name,
    birthDate: capsule.input.birthDate,
    birthTime: capsule.input.showBirthTime ? capsule.input.birthTime : undefined,
    city: capsule.geo.city,
    region: capsule.geo.state,
    country: capsule.geo.country,
    timezone: capsule.geo.timezone,
    weatherSummary: capsule.weather.temperatureC != null
      ? `${capsule.weather.condition}, ${capsule.weather.temperatureC}°C`
      : capsule.weather.condition,
    sunrise: capsule.weather.sunrise || capsule.sky.sunrise,
    sunset: capsule.weather.sunset || capsule.sky.sunset,
    moonPhase: capsule.sky.moonPhase,
    worldPopulation: capsule.population.world?.value,
    majorEvent: majorEvent ? `${majorEvent.year}: ${majorEvent.title}` : undefined,
    majorTech: capsule.tech.global.launches[0],
    popularMusic: music ? `${music.title} — ${music.artist}` : undefined,
    majorMovie: movie ? `${movie.title} (${movie.year})` : undefined,
    quote: capsule.certificateQuote,
    dayOfWeek: capsule.dayOfWeek,
    season: capsule.season,
    showCoordinates: Boolean(capsule.input.showCoordinates),
    coordinates: capsule.input.showCoordinates
      ? { lat: capsule.geo.latitude, lon: capsule.geo.longitude }
      : undefined,
    theme: capsule.input.certificateTheme ?? "archive",
    createdAt: capsule.createdAt,
    exactSky: capsule.sky.exactTime,
  };
}

export const THEME_META: Record<CertificateTheme, { label: string; blurb: string }> = {
  archive: { label: "Archive", blurb: "Classic historical document" },
  cosmos: { label: "Cosmos", blurb: "Astronomy-inspired" },
  origin: { label: "Origin", blurb: "Minimal premium" },
  earth: { label: "Earth", blurb: "Geographic / cartographic" },
  time: { label: "Time", blurb: "Futuristic timeline" },
};

export function verificationUrl(publicToken: string, origin = typeof window !== "undefined" ? window.location.origin : "https://born.app"): string {
  return `${origin}/verify/${publicToken}`;
}

export function capsuleUrl(publicToken: string, origin = typeof window !== "undefined" ? window.location.origin : "https://born.app"): string {
  return `${origin}/c/${publicToken}`;
}
