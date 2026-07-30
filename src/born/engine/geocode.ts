import type { GeoLocation } from "@/born/types";
import { continentFromCountryCode } from "./hierarchy";

const cache = new Map<string, GeoLocation>();

interface OpenMeteoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

/** Approximate timezone from longitude (fallback when API unavailable) */
function approxTimezone(lon: number): string {
  const offset = Math.round(lon / 15);
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset).toString().padStart(2, "0");
  return `UTC${sign}${abs}:00`;
}

/**
 * Resolve birthplace into a full geographic hierarchy.
 * Prefers Open-Meteo Geocoding (CORS-friendly) with offline city fallbacks.
 */
export async function geocodeBirthplace(input: {
  city: string;
  region?: string;
  country: string;
}): Promise<GeoLocation> {
  const key = [input.city, input.region, input.country].filter(Boolean).join(", ").toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const q = [input.city, input.region, input.country].filter(Boolean).join(", ");

  let hit: OpenMeteoResult | null = null;
  try {
    const params = new URLSearchParams({
      name: input.city,
      count: "5",
      language: "en",
      format: "json",
    });
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const results = (data?.results ?? []) as OpenMeteoResult[];
      const countryNeedle = input.country.trim().toLowerCase();
      const regionNeedle = input.region?.trim().toLowerCase();
      hit =
        results.find((r) => {
          const cc = (r.country ?? "").toLowerCase();
          const code = (r.country_code ?? "").toLowerCase();
          const countryMatch =
            !countryNeedle ||
            cc.includes(countryNeedle) ||
            countryNeedle.includes(cc) ||
            code === countryNeedle;
          const regionMatch =
            !regionNeedle ||
            (r.admin1 ?? "").toLowerCase().includes(regionNeedle) ||
            (r.admin2 ?? "").toLowerCase().includes(regionNeedle);
          return countryMatch && regionMatch;
        }) ??
        results.find((r) => {
          const cc = (r.country ?? "").toLowerCase();
          return !countryNeedle || cc.includes(countryNeedle) || countryNeedle.includes(cc);
        }) ??
        results[0] ??
        null;
    }
  } catch {
    /* offline fallback */
  }

  if (!hit) {
    const fallback = offlineCityLookup(input.city, input.country);
    if (fallback) {
      cache.set(key, fallback);
      return fallback;
    }
    throw new Error(
      `Could not resolve location for "${q}". Try a clearer city and country.`,
    );
  }

  const countryCode = (hit.country_code || "XX").toUpperCase();
  const location: GeoLocation = {
    query: q,
    latitude: hit.latitude,
    longitude: hit.longitude,
    city: hit.name || input.city,
    district: hit.admin2,
    state: hit.admin1 || input.region,
    country: hit.country || input.country,
    countryCode,
    continent: continentFromCountryCode(countryCode),
    timezone: hit.timezone || approxTimezone(hit.longitude),
    displayName: [hit.name, hit.admin1, hit.country].filter(Boolean).join(", "),
    population: hit.population,
  };

  cache.set(key, location);
  return location;
}

const CITY_COORDS: Record<
  string,
  { lat: number; lon: number; state?: string; cc: string; country: string; tz: string }
> = {
  "hyderabad|india": { lat: 17.385, lon: 78.4867, state: "Telangana", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "mumbai|india": { lat: 19.076, lon: 72.8777, state: "Maharashtra", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "delhi|india": { lat: 28.6139, lon: 77.209, state: "Delhi", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "bengaluru|india": { lat: 12.9716, lon: 77.5946, state: "Karnataka", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "bangalore|india": { lat: 12.9716, lon: 77.5946, state: "Karnataka", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "chennai|india": { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "kolkata|india": { lat: 22.5726, lon: 88.3639, state: "West Bengal", cc: "IN", country: "India", tz: "Asia/Kolkata" },
  "london|united kingdom": { lat: 51.5074, lon: -0.1278, state: "England", cc: "GB", country: "United Kingdom", tz: "Europe/London" },
  "new york|united states": { lat: 40.7128, lon: -74.006, state: "New York", cc: "US", country: "United States", tz: "America/New_York" },
  "tokyo|japan": { lat: 35.6762, lon: 139.6503, cc: "JP", country: "Japan", tz: "Asia/Tokyo" },
  "são paulo|brazil": { lat: -23.5505, lon: -46.6333, state: "São Paulo", cc: "BR", country: "Brazil", tz: "America/Sao_Paulo" },
  "sao paulo|brazil": { lat: -23.5505, lon: -46.6333, state: "São Paulo", cc: "BR", country: "Brazil", tz: "America/Sao_Paulo" },
  "paris|france": { lat: 48.8566, lon: 2.3522, cc: "FR", country: "France", tz: "Europe/Paris" },
  "sydney|australia": { lat: -33.8688, lon: 151.2093, state: "New South Wales", cc: "AU", country: "Australia", tz: "Australia/Sydney" },
  "lagos|nigeria": { lat: 6.5244, lon: 3.3792, state: "Lagos", cc: "NG", country: "Nigeria", tz: "Africa/Lagos" },
  "dubai|united arab emirates": { lat: 25.2048, lon: 55.2708, cc: "AE", country: "United Arab Emirates", tz: "Asia/Dubai" },
  "singapore|singapore": { lat: 1.3521, lon: 103.8198, cc: "SG", country: "Singapore", tz: "Asia/Singapore" },
  "toronto|canada": { lat: 43.6532, lon: -79.3832, state: "Ontario", cc: "CA", country: "Canada", tz: "America/Toronto" },
  "berlin|germany": { lat: 52.52, lon: 13.405, cc: "DE", country: "Germany", tz: "Europe/Berlin" },
  "seoul|south korea": { lat: 37.5665, lon: 126.978, cc: "KR", country: "South Korea", tz: "Asia/Seoul" },
  "mexico city|mexico": { lat: 19.4326, lon: -99.1332, cc: "MX", country: "Mexico", tz: "America/Mexico_City" },
};

function offlineCityLookup(city: string, country: string): GeoLocation | null {
  const key = `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`;
  const hit =
    CITY_COORDS[key] ??
    Object.entries(CITY_COORDS).find(([k]) => k.startsWith(city.trim().toLowerCase() + "|"))?.[1];
  if (!hit) return null;
  return {
    query: `${city}, ${country}`,
    latitude: hit.lat,
    longitude: hit.lon,
    city,
    state: hit.state,
    country: hit.country,
    countryCode: hit.cc,
    continent: continentFromCountryCode(hit.cc),
    timezone: hit.tz,
    displayName: `${city}, ${hit.state ? hit.state + ", " : ""}${hit.country}`,
  };
}
