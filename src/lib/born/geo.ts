import type { GeoHierarchy } from "./types";

const CONTINENT_BY_COUNTRY: Record<string, string> = {
  AF: "Asia", AL: "Europe", DZ: "Africa", AS: "Oceania", AD: "Europe", AO: "Africa",
  AR: "South America", AM: "Asia", AU: "Oceania", AT: "Europe", AZ: "Asia", BS: "North America",
  BH: "Asia", BD: "Asia", BB: "North America", BY: "Europe", BE: "Europe", BZ: "North America",
  BJ: "Africa", BT: "Asia", BO: "South America", BA: "Europe", BW: "Africa", BR: "South America",
  BN: "Asia", BG: "Europe", BF: "Africa", BI: "Africa", CV: "Africa", KH: "Asia", CM: "Africa",
  CA: "North America", CF: "Africa", TD: "Africa", CL: "South America", CN: "Asia", CO: "South America",
  KM: "Africa", CG: "Africa", CD: "Africa", CR: "North America", CI: "Africa", HR: "Europe",
  CU: "North America", CY: "Asia", CZ: "Europe", DK: "Europe", DJ: "Africa", DM: "North America",
  DO: "North America", EC: "South America", EG: "Africa", SV: "North America", GQ: "Africa",
  ER: "Africa", EE: "Europe", SZ: "Africa", ET: "Africa", FJ: "Oceania", FI: "Europe",
  FR: "Europe", GA: "Africa", GM: "Africa", GE: "Asia", DE: "Europe", GH: "Africa",
  GR: "Europe", GD: "North America", GT: "North America", GN: "Africa", GW: "Africa",
  GY: "South America", HT: "North America", HN: "North America", HU: "Europe", IS: "Europe",
  IN: "Asia", ID: "Asia", IR: "Asia", IQ: "Asia", IE: "Europe", IL: "Asia", IT: "Europe",
  JM: "North America", JP: "Asia", JO: "Asia", KZ: "Asia", KE: "Africa", KI: "Oceania",
  KP: "Asia", KR: "Asia", KW: "Asia", KG: "Asia", LA: "Asia", LV: "Europe", LB: "Asia",
  LS: "Africa", LR: "Africa", LY: "Africa", LI: "Europe", LT: "Europe", LU: "Europe",
  MG: "Africa", MW: "Africa", MY: "Asia", MV: "Asia", ML: "Africa", MT: "Europe",
  MH: "Oceania", MR: "Africa", MU: "Africa", MX: "North America", FM: "Oceania", MD: "Europe",
  MC: "Europe", MN: "Asia", ME: "Europe", MA: "Africa", MZ: "Africa", MM: "Asia", NA: "Africa",
  NR: "Oceania", NP: "Asia", NL: "Europe", NZ: "Oceania", NI: "North America", NE: "Africa",
  NG: "Africa", MK: "Europe", NO: "Europe", OM: "Asia", PK: "Asia", PW: "Oceania", PA: "North America",
  PG: "Oceania", PY: "South America", PE: "South America", PH: "Asia", PL: "Europe", PT: "Europe",
  QA: "Asia", RO: "Europe", RU: "Europe", RW: "Africa", KN: "North America", LC: "North America",
  VC: "North America", WS: "Oceania", SM: "Europe", ST: "Africa", SA: "Asia", SN: "Africa",
  RS: "Europe", SC: "Africa", SL: "Africa", SG: "Asia", SK: "Europe", SI: "Europe", SB: "Oceania",
  SO: "Africa", ZA: "Africa", SS: "Africa", ES: "Europe", LK: "Asia", SD: "Africa", SR: "South America",
  SE: "Europe", CH: "Europe", SY: "Asia", TW: "Asia", TJ: "Asia", TZ: "Africa", TH: "Asia",
  TL: "Asia", TG: "Africa", TO: "Oceania", TT: "North America", TN: "Africa", TR: "Asia",
  TM: "Asia", TV: "Oceania", UG: "Africa", UA: "Europe", AE: "Asia", GB: "Europe", US: "North America",
  UY: "South America", UZ: "Asia", VU: "Oceania", VA: "Europe", VE: "South America", VN: "Asia",
  YE: "Asia", ZM: "Africa", ZW: "Africa", XK: "Europe", PS: "Asia", HK: "Asia", MO: "Asia",
};

function continentFor(code: string): string {
  return CONTINENT_BY_COUNTRY[code.toUpperCase()] ?? "Unknown";
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state_district?: string;
    state?: string;
    region?: string;
    country?: string;
    country_code?: string;
  };
}

interface OpenMeteoGeoResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    admin2?: string;
    timezone: string;
  }>;
}

export async function resolveBirthplace(
  city: string,
  region: string | undefined,
  country: string,
): Promise<GeoHierarchy> {
  const query = [city, region, country].filter(Boolean).join(", ");

  // Prefer Open-Meteo geocoding (timezone included, no key)
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (res.ok) {
      const data = (await res.json()) as OpenMeteoGeoResult;
      const results = data.results ?? [];
      const countryLower = country.toLowerCase();
      const regionLower = (region ?? "").toLowerCase();

      const match =
        results.find((r) => {
          const countryHit =
            r.country?.toLowerCase() === countryLower ||
            r.country_code?.toLowerCase() === countryLower;
          const regionHit = !regionLower ||
            r.admin1?.toLowerCase().includes(regionLower) ||
            r.admin2?.toLowerCase().includes(regionLower);
          return countryHit && regionHit;
        }) ??
        results.find((r) =>
          r.country?.toLowerCase() === countryLower ||
          r.country_code?.toLowerCase() === countryLower,
        ) ??
        results[0];

      if (match) {
        return {
          latitude: match.latitude,
          longitude: match.longitude,
          timezone: match.timezone,
          city: match.name || city,
          district: match.admin2,
          state: match.admin1 || region,
          country: match.country || country,
          countryCode: (match.country_code || "").toUpperCase(),
          continent: continentFor(match.country_code || ""),
          displayName: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
          historicalContext: buildHistoricalContext(match.name, match.admin1, match.country),
        };
      }
    }
  } catch {
    // fall through
  }

  // Nominatim fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "BORN-Capsule/1.0" },
    });
    if (res.ok) {
      const data = (await res.json()) as NominatimResult[];
      if (data[0]) {
        const a = data[0].address ?? {};
        const code = (a.country_code || "").toUpperCase();
        const resolvedCity = a.city || a.town || a.village || a.municipality || city;
        const state = a.state || a.region || region;
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          timezone: await guessTimezone(parseFloat(data[0].lat), parseFloat(data[0].lon)),
          city: resolvedCity,
          district: a.county || a.state_district,
          state,
          country: a.country || country,
          countryCode: code,
          continent: continentFor(code),
          displayName: data[0].display_name,
          historicalContext: buildHistoricalContext(resolvedCity, state, a.country || country),
        };
      }
    }
  } catch {
    // fall through
  }

  throw new Error(
    `Could not resolve birthplace “${query}”. Try a clearer city, region, and country.`,
  );
}

async function guessTimezone(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.timezone) return data.timezone as string;
    }
  } catch {
    // ignore
  }
  // crude offset estimate
  const offsetHours = Math.round(lon / 15);
  const sign = offsetHours >= 0 ? "+" : "-";
  const abs = Math.abs(offsetHours).toString().padStart(2, "0");
  return `Etc/GMT${sign === "+" ? "-" : "+"}${abs}`; // Etc/GMT sign inverted
}

function buildHistoricalContext(city?: string, state?: string, country?: string): string {
  const place = [city, state, country].filter(Boolean).join(", ");
  return `Geographic context resolved for ${place}. Local, regional, and national layers are assembled from this place — not a generic country page.`;
}

/** Suggest regional UI languages without auto-switching. */
export function suggestedLanguages(countryCode: string, state?: string): string[] {
  const code = countryCode.toUpperCase();
  const stateLower = (state ?? "").toLowerCase();

  if (code === "IN") {
    const byState: Record<string, string[]> = {
      telangana: ["English", "Telugu", "Hindi"],
      "andhra pradesh": ["English", "Telugu", "Hindi"],
      maharashtra: ["English", "Marathi", "Hindi"],
      "tamil nadu": ["English", "Tamil"],
      karnataka: ["English", "Kannada", "Hindi"],
      kerala: ["English", "Malayalam"],
      "west bengal": ["English", "Bengali", "Hindi"],
      gujarat: ["English", "Gujarati", "Hindi"],
      punjab: ["English", "Punjabi", "Hindi"],
      rajasthan: ["English", "Hindi"],
      delhi: ["English", "Hindi"],
      goa: ["English", "Konkani", "Hindi"],
    };
    for (const [key, langs] of Object.entries(byState)) {
      if (stateLower.includes(key)) return langs;
    }
    return ["English", "Hindi"];
  }

  const map: Record<string, string[]> = {
    JP: ["English", "日本語"],
    KR: ["English", "한국어"],
    CN: ["English", "中文"],
    BR: ["English", "Português"],
    MX: ["English", "Español"],
    ES: ["English", "Español"],
    FR: ["English", "Français"],
    DE: ["English", "Deutsch"],
    IT: ["English", "Italiano"],
    PT: ["English", "Português"],
    RU: ["English", "Русский"],
    SA: ["English", "العربية"],
    AE: ["English", "العربية"],
    EG: ["English", "العربية"],
    TR: ["English", "Türkçe"],
    TH: ["English", "ภาษาไทย"],
    VN: ["English", "Tiếng Việt"],
    ID: ["English", "Bahasa Indonesia"],
    PH: ["English", "Filipino"],
    NG: ["English", "Hausa", "Yoruba", "Igbo"],
    ZA: ["English", "Afrikaans", "Zulu", "Xhosa"],
    US: ["English", "Español"],
    CA: ["English", "Français"],
    GB: ["English"],
    AU: ["English"],
  };

  return map[code] ?? ["English"];
}
