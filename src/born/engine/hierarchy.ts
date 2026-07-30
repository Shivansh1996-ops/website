/** Geographic hierarchy helpers — scalable, not country-hardcoded */

const CONTINENT_BY_CC: Record<string, string> = {
  AF: "Asia", AL: "Europe", DZ: "Africa", AS: "Oceania", AD: "Europe", AO: "Africa",
  AG: "North America", AR: "South America", AM: "Asia", AU: "Oceania", AT: "Europe",
  AZ: "Asia", BS: "North America", BH: "Asia", BD: "Asia", BB: "North America",
  BY: "Europe", BE: "Europe", BZ: "North America", BJ: "Africa", BT: "Asia",
  BO: "South America", BA: "Europe", BW: "Africa", BR: "South America", BN: "Asia",
  BG: "Europe", BF: "Africa", BI: "Africa", KH: "Asia", CM: "Africa", CA: "North America",
  CV: "Africa", CF: "Africa", TD: "Africa", CL: "South America", CN: "Asia",
  CO: "South America", KM: "Africa", CG: "Africa", CD: "Africa", CR: "North America",
  CI: "Africa", HR: "Europe", CU: "North America", CY: "Asia", CZ: "Europe",
  DK: "Europe", DJ: "Africa", DM: "North America", DO: "North America", EC: "South America",
  EG: "Africa", SV: "North America", GQ: "Africa", ER: "Africa", EE: "Europe",
  SZ: "Africa", ET: "Africa", FJ: "Oceania", FI: "Europe", FR: "Europe", GA: "Africa",
  GM: "Africa", GE: "Asia", DE: "Europe", GH: "Africa", GR: "Europe", GD: "North America",
  GT: "North America", GN: "Africa", GW: "Africa", GY: "South America", HT: "North America",
  HN: "North America", HU: "Europe", IS: "Europe", IN: "Asia", ID: "Asia", IR: "Asia",
  IQ: "Asia", IE: "Europe", IL: "Asia", IT: "Europe", JM: "North America", JP: "Asia",
  JO: "Asia", KZ: "Asia", KE: "Africa", KI: "Oceania", KP: "Asia", KR: "Asia",
  KW: "Asia", KG: "Asia", LA: "Asia", LV: "Europe", LB: "Asia", LS: "Africa",
  LR: "Africa", LY: "Africa", LI: "Europe", LT: "Europe", LU: "Europe", MG: "Africa",
  MW: "Africa", MY: "Asia", MV: "Asia", ML: "Africa", MT: "Europe", MH: "Oceania",
  MR: "Africa", MU: "Africa", MX: "North America", FM: "Oceania", MD: "Europe",
  MC: "Europe", MN: "Asia", ME: "Europe", MA: "Africa", MZ: "Africa", MM: "Asia",
  NA: "Africa", NR: "Oceania", NP: "Asia", NL: "Europe", NZ: "Oceania", NI: "North America",
  NE: "Africa", NG: "Africa", MK: "Europe", NO: "Europe", OM: "Asia", PK: "Asia",
  PW: "Oceania", PS: "Asia", PA: "North America", PG: "Oceania", PY: "South America",
  PE: "South America", PH: "Asia", PL: "Europe", PT: "Europe", QA: "Asia", RO: "Europe",
  RU: "Europe", RW: "Africa", KN: "North America", LC: "North America", VC: "North America",
  WS: "Oceania", SM: "Europe", ST: "Africa", SA: "Asia", SN: "Africa", RS: "Europe",
  SC: "Africa", SL: "Africa", SG: "Asia", SK: "Europe", SI: "Europe", SB: "Oceania",
  SO: "Africa", ZA: "Africa", SS: "Africa", ES: "Europe", LK: "Asia", SD: "Africa",
  SR: "South America", SE: "Europe", CH: "Europe", SY: "Asia", TW: "Asia", TJ: "Asia",
  TZ: "Africa", TH: "Asia", TL: "Asia", TG: "Africa", TO: "Oceania", TT: "North America",
  TN: "Africa", TR: "Asia", TM: "Asia", TV: "Oceania", UG: "Africa", UA: "Europe",
  AE: "Asia", GB: "Europe", US: "North America", UY: "South America", UZ: "Asia",
  VU: "Oceania", VA: "Europe", VE: "South America", VN: "Asia", YE: "Asia", ZM: "Africa",
  ZW: "Africa", XK: "Europe",
};

export function continentFromCountryCode(cc: string): string {
  return CONTINENT_BY_CC[cc.toUpperCase()] ?? "Unknown";
}

export interface GeographicHierarchy {
  continent: string;
  country: string;
  countryCode: string;
  state?: string;
  district?: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export function buildHierarchy(parts: {
  city: string;
  state?: string;
  district?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}): GeographicHierarchy {
  return {
    continent: continentFromCountryCode(parts.countryCode),
    country: parts.country,
    countryCode: parts.countryCode.toUpperCase(),
    state: parts.state,
    district: parts.district,
    city: parts.city,
    latitude: parts.latitude,
    longitude: parts.longitude,
    timezone: parts.timezone,
  };
}

/** Zoom sequence for the birth moment map */
export function mapZoomSteps(h: GeographicHierarchy) {
  return [
    { label: "EARTH", detail: "Our shared home" },
    { label: h.continent.toUpperCase(), detail: "Your continent" },
    { label: h.country.toUpperCase(), detail: "Your country" },
    { label: (h.state ?? h.country).toUpperCase(), detail: "Your region" },
    { label: h.city.toUpperCase(), detail: "Your city" },
    { label: "BIRTHPLACE", detail: "This is where your story began." },
  ];
}
