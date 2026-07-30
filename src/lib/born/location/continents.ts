/** ISO 3166-1 alpha-2 → continent. Scalable lookup, not city hardcoding. */
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
  HN: "North America", HK: "Asia", HU: "Europe", IS: "Europe", IN: "Asia", ID: "Asia",
  IR: "Asia", IQ: "Asia", IE: "Europe", IL: "Asia", IT: "Europe", JM: "North America",
  JP: "Asia", JO: "Asia", KZ: "Asia", KE: "Africa", KI: "Oceania", KP: "Asia", KR: "Asia",
  KW: "Asia", KG: "Asia", LA: "Asia", LV: "Europe", LB: "Asia", LS: "Africa", LR: "Africa",
  LY: "Africa", LI: "Europe", LT: "Europe", LU: "Europe", MO: "Asia", MG: "Africa",
  MW: "Africa", MY: "Asia", MV: "Asia", ML: "Africa", MT: "Europe", MH: "Oceania",
  MR: "Africa", MU: "Africa", MX: "North America", FM: "Oceania", MD: "Europe", MC: "Europe",
  MN: "Asia", ME: "Europe", MA: "Africa", MZ: "Africa", MM: "Asia", NA: "Africa",
  NR: "Oceania", NP: "Asia", NL: "Europe", NZ: "Oceania", NI: "North America", NE: "Africa",
  NG: "Africa", MK: "Europe", NO: "Europe", OM: "Asia", PK: "Asia", PW: "Oceania",
  PS: "Asia", PA: "North America", PG: "Oceania", PY: "South America", PE: "South America",
  PH: "Asia", PL: "Europe", PT: "Europe", QA: "Asia", RO: "Europe", RU: "Europe",
  RW: "Africa", KN: "North America", LC: "North America", VC: "North America", WS: "Oceania",
  SM: "Europe", ST: "Africa", SA: "Asia", SN: "Africa", RS: "Europe", SC: "Africa",
  SL: "Africa", SG: "Asia", SK: "Europe", SI: "Europe", SB: "Oceania", SO: "Africa",
  ZA: "Africa", SS: "Africa", ES: "Europe", LK: "Asia", SD: "Africa", SR: "South America",
  SE: "Europe", CH: "Europe", SY: "Asia", TW: "Asia", TJ: "Asia", TZ: "Africa", TH: "Asia",
  TL: "Asia", TG: "Africa", TO: "Oceania", TT: "North America", TN: "Africa", TR: "Asia",
  TM: "Asia", TV: "Oceania", UG: "Africa", UA: "Europe", AE: "Asia", GB: "Europe",
  US: "North America", UY: "South America", UZ: "Asia", VU: "Oceania", VA: "Europe",
  VE: "South America", VN: "Asia", YE: "Asia", ZM: "Africa", ZW: "Africa", XK: "Europe",
};

export function continentFromCountryCode(code?: string): string {
  if (!code) return "Unknown";
  return CONTINENT_BY_CC[code.toUpperCase()] ?? "Unknown";
}

/** Common regional languages by country / major state — suggestions only, never auto-forced. */
export const LANGUAGE_SUGGESTIONS: Record<string, string[]> = {
  IN: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
  "IN-TG": ["English", "Telugu", "Hindi"],
  "IN-AP": ["English", "Telugu", "Hindi"],
  "IN-TN": ["English", "Tamil"],
  "IN-KA": ["English", "Kannada", "Hindi"],
  "IN-MH": ["English", "Marathi", "Hindi"],
  "IN-WB": ["English", "Bengali", "Hindi"],
  JP: ["English", "日本語"],
  BR: ["English", "Português"],
  MX: ["English", "Español"],
  ES: ["English", "Español"],
  FR: ["English", "Français"],
  DE: ["English", "Deutsch"],
  KR: ["English", "한국어"],
  CN: ["English", "中文"],
  NG: ["English", "Yoruba", "Hausa", "Igbo"],
  ZA: ["English", "Afrikaans", "Zulu", "Xhosa"],
};

export function suggestLanguages(countryCode: string, state?: string): string[] {
  const cc = countryCode.toUpperCase();
  if (state) {
    const key = `${cc}-${state.slice(0, 2).toUpperCase()}`;
    // India state codes often come as full names — try fuzzy
    const stateMap: Record<string, string> = {
      telangana: "IN-TG",
      "andhra pradesh": "IN-AP",
      "tamil nadu": "IN-TN",
      karnataka: "IN-KA",
      maharashtra: "IN-MH",
      "west bengal": "IN-WB",
    };
    const mapped = stateMap[state.toLowerCase()];
    if (mapped && LANGUAGE_SUGGESTIONS[mapped]) return LANGUAGE_SUGGESTIONS[mapped];
    if (LANGUAGE_SUGGESTIONS[key]) return LANGUAGE_SUGGESTIONS[key];
  }
  return LANGUAGE_SUGGESTIONS[cc] ?? ["English"];
}

export const CURRENCY_BY_CC: Record<string, string> = {
  IN: "INR", US: "USD", GB: "GBP", JP: "JPY", EU: "EUR", DE: "EUR", FR: "EUR",
  BR: "BRL", AU: "AUD", CA: "CAD", CN: "CNY", KR: "KRW", MX: "MXN", NG: "NGN",
  ZA: "ZAR", AE: "AED", SG: "SGD", ID: "IDR", PK: "PKR", BD: "BDT", RU: "RUB",
};

export function currencyFromCountryCode(code?: string): string | undefined {
  if (!code) return undefined;
  return CURRENCY_BY_CC[code.toUpperCase()];
}
