import { continentFromCountryCode, currencyFromCountryCode, suggestLanguages } from "./continents";
import { fetchJson } from "../engine/http";
import type { GeographicPlace } from "../types";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    county?: string;
    state_district?: string;
    state?: string;
    region?: string;
    country?: string;
    country_code?: string;
  };
}

async function resolveTimezone(lat: number, lon: number): Promise<string> {
  try {
    const data = await fetchJson<{ timeZone?: string }>([
      `/api/geotimezone/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`,
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`,
    ]);
    if (data?.timeZone) return data.timeZone;
  } catch {
    /* fall through */
  }
  // Approximate offset from longitude as last resort (clearly not IANA)
  const offsetHours = Math.round(lon / 15);
  const sign = offsetHours >= 0 ? "+" : "-";
  return `UTC${sign}${Math.abs(offsetHours)}`;
}

function pickCity(addr: NominatimResult["address"], fallback: string): string {
  return (
    addr?.city ||
    addr?.town ||
    addr?.village ||
    addr?.municipality ||
    addr?.suburb ||
    fallback
  );
}

export async function geocodeBirthplace(input: {
  city: string;
  region?: string;
  country: string;
}): Promise<GeographicPlace> {
  const q = [input.city, input.region, input.country].filter(Boolean).join(", ");
  const query = `format=json&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`;

  let results: NominatimResult[] = [];
  try {
    results = await fetchJson<NominatimResult[]>([
      `/api/nominatim/search?${query}`,
      `https://nominatim.openstreetmap.org/search?${query}`,
    ], { headers: { Accept: "application/json" } });
  } catch {
    throw new Error("Unable to resolve birthplace. Please check city and country.");
  }

  if (!results?.length) {
    throw new Error(`No location found for “${q}”. Try a nearby city or clearer spelling.`);
  }

  const hit = results[0];
  const lat = parseFloat(hit.lat);
  const lon = parseFloat(hit.lon);
  const addr = hit.address ?? {};
  const countryCode = (addr.country_code ?? "").toUpperCase();
  const state = addr.state || addr.region || input.region;
  const city = pickCity(addr, input.city);
  const district = addr.county || addr.state_district || addr.suburb;
  const country = addr.country || input.country;
  const timezone = await resolveTimezone(lat, lon);

  return {
    lat,
    lon,
    displayName: hit.display_name,
    city,
    district,
    state,
    country,
    countryCode,
    continent: continentFromCountryCode(countryCode),
    timezone,
    currency: currencyFromCountryCode(countryCode),
    languages: suggestLanguages(countryCode, state),
    historicalContext: `${city}${state ? `, ${state}` : ""}, ${country} — ${continentFromCountryCode(countryCode)}`,
  };
}
