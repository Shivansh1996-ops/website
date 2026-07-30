import type { BirthInput, CapsuleData, CertificateTheme, GeoLocation } from "@/born/types";
import { geocodeBirthplace } from "@/born/engine/geocode";
import { fetchBirthWeather } from "@/born/engine/providers/weather";
import { computeLocalSky } from "@/born/engine/providers/astronomy";
import { buildCultureSnapshot } from "@/born/data/culture";
import {
  buildTechSnapshot,
  buildSportsSnapshot,
  buildPrices,
  buildPopulation,
  buildTimeline,
} from "@/born/data/context";

const STORAGE_KEY = "born_capsules_v1";

function randomToken(len = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => alphabet[b % alphabet.length]).join("");
}

export function makeCertificateNumber(year: number): string {
  return `BORN-${year}-${randomToken(6)}`;
}

function dayOfWeek(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function seasonFor(date: string, lat: number): string {
  const month = parseInt(date.slice(5, 7), 10);
  const northern = lat >= 0;
  // meteorological seasons
  let s: string;
  if (month >= 3 && month <= 5) s = "Spring";
  else if (month >= 6 && month <= 8) s = "Summer";
  else if (month >= 9 && month <= 11) s = "Autumn";
  else s = "Winter";
  if (!northern) {
    const flip: Record<string, string> = {
      Spring: "Autumn",
      Summer: "Winter",
      Autumn: "Spring",
      Winter: "Summer",
    };
    s = flip[s];
  }
  return s;
}

function narrative(input: BirthInput, loc: GeoLocation, year: number): string {
  const place = [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
  const timeBit = input.birthTime
    ? `at ${input.birthTime} local time`
    : "on a day whose exact hour remains your family's private memory";
  return (
    `On ${formatLongDate(input.birthDate)}, ${timeBit}, ${input.name} arrived in ${place}. ` +
    `While ${loc.city} carried its own weather, languages, and rhythms, the wider world was mid-stride through ${year} — ` +
    `its charts, cinema, and technologies already in motion. This capsule holds both layers: the corner of Earth that first held you, and the planet that was waiting.`
  );
}

function quoteFor(name: string, city: string): string {
  const quotes = [
    `The world was already moving. Then ${name} arrived.`,
    `A new story began here — in ${city}.`,
    `Before the years unfolded, there was this place, this day, this sky.`,
    `Every map has a first pin. Yours is ${city}.`,
    `Not a beginning of the world — a beginning of a world that includes you.`,
  ];
  let h = 0;
  const seed = name + city;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % quotes.length;
  return quotes[h];
}

function formatLongDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function createCapsule(
  input: BirthInput,
  opts?: { privacy?: "public" | "private"; theme?: CertificateTheme },
): Promise<CapsuleData> {
  const location = await geocodeBirthplace({
    city: input.city,
    region: input.region,
    country: input.country,
  });

  const year = parseInt(input.birthDate.slice(0, 4), 10);
  const hour = input.birthTime ? parseInt(input.birthTime.slice(0, 2), 10) : undefined;

  const [weather, sky] = await Promise.all([
    fetchBirthWeather({
      latitude: location.latitude,
      longitude: location.longitude,
      date: input.birthDate,
      hour,
    }),
    Promise.resolve(
      computeLocalSky({
        date: input.birthDate,
        time: input.birthTime,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
      }),
    ),
  ]);

  // Prefer weather sunrise/sunset into sky label context
  if (weather.sunrise) {
    /* already in weather */
  }

  const culture = buildCultureSnapshot({
    countryCode: location.countryCode,
    state: location.state,
    year,
    mode: "local",
  });
  const globalCulture = buildCultureSnapshot({
    countryCode: location.countryCode,
    state: location.state,
    year,
    mode: "global",
  });

  const publicToken = randomToken(10);
  const capsule: CapsuleData = {
    id: `local_${publicToken}`,
    publicToken,
    certificateNumber: makeCertificateNumber(new Date().getFullYear()),
    createdAt: new Date().toISOString(),
    privacy: opts?.privacy ?? "public",
    input,
    location,
    weather,
    sky,
    culture,
    globalCulture,
    tech: buildTechSnapshot(location.countryCode, year),
    sports: buildSportsSnapshot(location.countryCode, location.state, year),
    prices: buildPrices(location.countryCode, year),
    timeline: buildTimeline({
      year,
      countryCode: location.countryCode,
      state: location.state,
      city: location.city,
      name: input.name,
    }),
    population: buildPopulation(location.countryCode, location.city, year),
    narrative: narrative(input, location, year),
    quote: quoteFor(input.name, location.city),
    dayOfWeek: dayOfWeek(input.birthDate),
    season: seasonFor(input.birthDate, location.latitude),
    theme: opts?.theme ?? "archive",
  };

  saveCapsule(capsule);
  return capsule;
}

export function saveCapsule(capsule: CapsuleData) {
  const all = listCapsules();
  const next = [capsule, ...all.filter((c) => c.publicToken !== capsule.publicToken)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 40)));
}

function reviveCapsule(raw: CapsuleData): CapsuleData {
  const sky = raw.sky;
  const asDate = (v: unknown): Date | null => {
    if (v == null) return null;
    if (v instanceof Date) return v;
    const d = new Date(String(v));
    return Number.isNaN(d.getTime()) ? null : d;
  };
  return {
    ...raw,
    sky: {
      ...sky,
      sunrise: asDate(sky.sunrise) ?? new Date(),
      sunset: asDate(sky.sunset) ?? new Date(),
      moonrise: asDate(sky.moonrise),
      moonset: asDate(sky.moonset),
    },
  };
}

export function listCapsules(): CapsuleData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CapsuleData[];
    return parsed.map(reviveCapsule);
  } catch {
    return [];
  }
}

export function getCapsuleByToken(token: string): CapsuleData | null {
  return listCapsules().find((c) => c.publicToken === token) ?? null;
}

export function getSharePath(capsule: CapsuleData): string {
  return `/c/${capsule.publicToken}`;
}

export function getVerifyPath(capsule: CapsuleData): string {
  return `/verify/${capsule.publicToken}`;
}

export function getPublicShareUrl(capsule: CapsuleData): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://born.app";
  return `${origin}/c/${capsule.publicToken}`;
}
