import type { CostItem, DataConfidence, GeoHierarchy, PopulationSnapshot, SourcedFact, TechSnapshot } from "./types";

/** Historical prices — only documented approximate ranges; never invent exact unknown figures. */
export function buildCostOfLiving(geo: GeoHierarchy, year: number): CostItem[] {
  const items: CostItem[] = [];
  const code = geo.countryCode;

  if (code === "IN") {
    items.push(
      cost("Fuel (petrol)", approxInrPetrol(year), "₹~100–110/L (varies by city)", "Global crude benchmark era-dependent", year < 2005 ? "estimated" : "national", "India national/city pump averages — not an exact birthplace receipt."),
      cost("Movie ticket", year < 2005 ? "₹~30–80 (single screen era)" : year < 2015 ? "₹~100–250 multiplex" : "₹~150–400 multiplex", "₹~200–500+", "Varies widely by market", "regional", "Urban multiplex vs single-screen ranges."),
      cost("Public transport", year < 2010 ? "₹~5–15 city bus" : "₹~10–40 bus / metro where available", "₹~20–60+", "—", "regional"),
      cost("Mobile phone", year < 2005 ? "Feature phones; handsets often ₹5k–20k+" : "Feature → early smartphones", "Smartphones span huge ranges", "Nokia/Motorola global era → smartphone era", "national"),
      cost("Currency", "Indian Rupee (INR)", "Indian Rupee (INR)", "USD / EUR benchmarks", "exact"),
    );
  } else if (code === "US") {
    items.push(
      cost("Fuel (gas)", year < 2005 ? "~$1–2/gal typical era range" : year < 2015 ? "~$2–4/gal era range" : "~$2–5/gal era range", "Varies by state", "Global oil markets", "national", "U.S. EIA-era ranges — not a specific station."),
      cost("Movie ticket", "~$5–10 era average", "~$10–18", "—", "national"),
      cost("Currency", "US Dollar (USD)", "US Dollar (USD)", "—", "exact"),
    );
  } else if (code === "GB") {
    items.push(
      cost("Fuel (petrol)", "UK pump prices of the era (pence/litre)", "Current UK pumps", "European averages", "national"),
      cost("Currency", "Pound Sterling (GBP)", "Pound Sterling (GBP)", "—", "exact"),
    );
  } else {
    items.push(
      cost(
        "Local currency",
        `National currency of ${geo.country}`,
        `Still ${geo.country}'s currency (verify local unit)`,
        "USD global reserve benchmark",
        "national",
        "Exact historical price tables for this city/year are not bundled — we refuse to invent numbers.",
      ),
      cost(
        "Everyday goods",
        "Historical local prices require city statistical archives",
        "Current local CPI baskets",
        "World Bank PPP benchmarks",
        "unavailable",
        "Unavailable at city precision in this build — labeled honestly.",
      ),
    );
  }

  // Gold as a more globally documentable series (approximate)
  items.push(
    cost(
      "Gold (global reference)",
      approxGold(year),
      "Market price today (spot)",
      "London / global spot",
      "global",
      "Approximate annual average USD/oz — global context, not local jewellery retail.",
    ),
  );

  return items;
}

function cost(
  category: string,
  thenValue: string,
  todayValue: string,
  globalBenchmark: string | undefined,
  confidence: DataConfidence,
  note?: string,
): CostItem {
  return {
    category,
    thenLabel: "Your region — then",
    thenValue,
    todayLabel: "Your region — today",
    todayValue,
    globalBenchmark,
    confidence,
    note,
  };
}

function approxInrPetrol(year: number): string {
  if (year < 2000) return "₹~20–30/L (national urban era range)";
  if (year < 2005) return "₹~30–45/L (national urban era range)";
  if (year < 2010) return "₹~40–55/L (national urban era range)";
  if (year < 2015) return "₹~55–75/L (national urban era range)";
  if (year < 2020) return "₹~65–85/L (national urban era range)";
  return "₹~90–110/L (national urban era range)";
}

function approxGold(year: number): string {
  const table: Record<number, string> = {
    1995: "~$385/oz avg",
    1998: "~$295/oz avg",
    2000: "~$280/oz avg",
    2005: "~$445/oz avg",
    2008: "~$870/oz avg",
    2010: "~$1,225/oz avg",
    2015: "~$1,160/oz avg",
    2018: "~$1,270/oz avg",
    2020: "~$1,770/oz avg",
    2022: "~$1,800/oz avg",
    2024: "~$2,300/oz avg",
  };
  const years = Object.keys(table).map(Number).sort((a, b) => a - b);
  let best = years[0];
  for (const y of years) {
    if (Math.abs(y - year) < Math.abs(best - year)) best = y;
  }
  return `${table[best]} (nearest documented year ${best})`;
}

export function buildTech(geo: GeoHierarchy, year: number): TechSnapshot {
  const globalPhones =
    year < 2000 ? ["Nokia feature phones", "Motorola StarTAC era"] :
    year < 2007 ? ["Nokia / Sony Ericsson feature phones", "Early BlackBerry"] :
    year < 2012 ? ["iPhone early generations", "Android arrives"] :
    year < 2017 ? ["Touchscreen smartphones mainstream", "4G rollout"] :
    ["Flagship smartphones", "5G begins in leading markets"];

  const globalLaunches =
    year < 2000 ? ["Dial-up internet homes", "Windows 95/98 PCs"] :
    year < 2007 ? ["Broadband expansion", "Google / early social web"] :
    year < 2015 ? ["App stores", "Social mobile"] :
    ["Streaming everywhere", "Cloud-native consumer life"];

  let regionPhones = globalPhones;
  let internet: string | undefined;
  let network: string | undefined;
  let computers: string | undefined;
  let localCompanies: string[] | undefined;
  let websites: string[] | undefined;
  let confidence: DataConfidence = "national";
  let note: string | undefined;

  if (geo.countryCode === "IN") {
    regionPhones =
      year < 2003 ? ["Early mobile adoption; Nokia dominance emerging"] :
      year < 2010 ? ["Nokia / Samsung feature phones widely sold"] :
      year < 2016 ? ["Android boom; affordable smartphones"] :
      ["Jio-era data + affordable 4G smartphones"];
    internet =
      year < 2005 ? "Low single-digit internet penetration nationally" :
      year < 2012 ? "Rising cybercafé + home broadband in metros" :
      year < 2017 ? "Mobile internet accelerating" :
      "Cheap mobile data transforms access";
    network =
      year < 2005 ? "2G GSM expansion" :
      year < 2012 ? "2G widespread; 3G beginning" :
      year < 2017 ? "3G/4G transition" :
      "4G mass market; 5G launching in major cities";
    computers = year < 2010 ? "Desktop PCs in offices & middle-class homes" : "Laptops + smartphones as primary screens";
    localCompanies = ["Infosys", "TCS", "Wipro", geo.state?.toLowerCase().includes("telangana") || geo.city.toLowerCase().includes("hyderabad") ? "Hyderabad IT / Cyberabad campuses" : "Indian IT services"].filter(Boolean) as string[];
    websites =
      year < 2005 ? ["Rediff", "Sify", "Yahoo"] :
      year < 2015 ? ["Google", "Orkut → Facebook", "IRCTC"] :
      ["WhatsApp", "YouTube", "Hotstar / regional OTT"];
    if (/hyderabad|telangana|andhra/i.test(`${geo.city} ${geo.state}`)) {
      confidence = "regional";
      note = "Technology framed for Hyderabad / Telugu states’ IT corridor — compared with global launches.";
    }
  } else if (geo.countryCode === "US") {
    internet = year < 2005 ? "Broadband overtaking dial-up in many metros" : "High broadband + mobile data";
    network = year < 2008 ? "2G/3G" : year < 2019 ? "3G/4G" : "4G/5G";
    localCompanies = ["Apple", "Microsoft", "Google", "Amazon"];
    websites = year < 2005 ? ["Yahoo", "AOL", "Google", "Amazon"] : ["Google", "Facebook", "YouTube", "Amazon"];
  } else {
    note = "Regional tech adoption approximated at country level; city-precise penetration series not always available.";
    confidence = "national";
  }

  return {
    region: {
      phones: regionPhones,
      internetPenetration: internet,
      networkGen: network,
      computers,
      localCompanies,
      websites,
    },
    global: {
      phones: globalPhones,
      launches: globalLaunches,
      os: year < 2007 ? ["Windows", "Symbian / feature OS"] : year < 2015 ? ["iOS", "Android", "Windows"] : ["iOS", "Android"],
      gaming: year < 2006 ? ["PlayStation 2 / early consoles"] : year < 2014 ? ["Xbox 360 / PS3 era"] : ["PS4/Xbox One → next-gen", "Mobile gaming surge"],
    },
    confidence,
    note,
  };
}

export function buildPopulation(geo: GeoHierarchy, year: number): PopulationSnapshot {
  const world = worldPop(year);
  const country = countryPop(geo.countryCode, year);
  const city = cityPop(geo, year);

  return {
    city: city,
    region: geo.state
      ? fact(`${geo.state} — regional estimates vary by census year`, "regional", "estimated", "Census-derived; may be nearest census year")
      : undefined,
    country,
    world,
  };
}

function fact(value: string, scope: SourcedFact<string>["scope"], confidence: SourcedFact<string>["confidence"], note?: string): SourcedFact<string> {
  return { value, scope, confidence, note, source: "Historical demographic series (approximated)" };
}

function worldPop(year: number): SourcedFact<string> {
  // UN-rough milestones
  const milestones: [number, string][] = [
    [1990, "~5.3 billion"],
    [1995, "~5.7 billion"],
    [2000, "~6.1 billion"],
    [2005, "~6.5 billion"],
    [2010, "~6.9 billion"],
    [2015, "~7.3 billion"],
    [2020, "~7.8 billion"],
    [2024, "~8.1 billion"],
  ];
  let best = milestones[0];
  for (const m of milestones) {
    if (Math.abs(m[0] - year) < Math.abs(best[0] - year)) best = m;
  }
  return fact(`${best[1]} (nearest UN-era milestone ${best[0]})`, "global", "estimated");
}

function countryPop(code: string, year: number): SourcedFact<string> | undefined {
  if (code === "IN") {
    if (year < 2001) return fact("~1.0 billion (2001 census era)", "national", "estimated");
    if (year < 2011) return fact("~1.2 billion (2011 census era)", "national", "estimated");
    return fact("~1.4 billion (2020s estimates)", "national", "estimated");
  }
  if (code === "US") return fact(year < 2010 ? "~280–310 million era" : "~310–330 million era", "national", "estimated");
  if (code === "CN") return fact("~1.3–1.4 billion era", "national", "estimated");
  return fact(`National population of the era for this country`, "national", "unavailable", "Exact figure not bundled — see national statistics office.");
}

function cityPop(geo: GeoHierarchy, year: number): SourcedFact<string> | undefined {
  const city = geo.city.toLowerCase();
  if (city.includes("hyderabad")) {
    if (year < 2001) return fact("Hyderabad UA ~5–6 million (2001 census era)", "local", "estimated", "Urban agglomeration census-era figure");
    if (year < 2011) return fact("Hyderabad UA ~6.8–7.7 million (2011 census era)", "local", "estimated");
    return fact("Hyderabad metro region ~10M+ (2020s estimates)", "local", "estimated");
  }
  return fact(
    `${geo.city} population — consult census for exact year`,
    "local",
    "unavailable",
    "City-precise historical population not available in bundled data; country/world figures still shown.",
  );
}

export function buildSports(geo: GeoHierarchy, year: number) {
  const code = geo.countryCode;
  if (code === "IN") {
    const local =
      /hyderabad|telangana|andhra/i.test(`${geo.city} ${geo.state}`)
        ? {
            popularSports: ["Cricket", "Badminton", "Kabaddi"],
            localTeams: ["Deccan Chargers / Sunrisers Hyderabad (IPL eras)", "Local Ranji sides"],
            athletes: ["P. V. Sindhu (later prominence)", "Sania Mirza (Hyderabad)", "V. V. S. Laxman"],
            events: year >= 2008 && year <= 2012 ? ["IPL launches 2008 — cricket fever nationwide"] : ["Ranji Trophy domestic season", "International cricket tours in India"],
            confidence: "regional" as const,
            note: "Sports emphasis follows Hyderabad / Indian cricket culture of the era.",
          }
        : {
            popularSports: ["Cricket", "Hockey", "Football"],
            localTeams: ["Local Ranji / ISL / I-League sides by city"],
            athletes: ["National cricket icons of the era"],
            events: ["International cricket", "National Games cycles"],
            confidence: "national" as const,
            note: undefined,
          };
    return local;
  }
  if (code === "BR") {
    return {
      popularSports: ["Football"],
      localTeams: ["State derby clubs"],
      athletes: ["National squad icons of the era"],
      events: year === 2014 ? ["FIFA World Cup in Brazil"] : ["Campeonato Brasileiro season"],
      confidence: "national" as const,
      note: undefined,
    };
  }
  if (code === "US") {
    return {
      popularSports: ["American football", "Basketball", "Baseball"],
      localTeams: ["Local NFL/NBA/MLB franchises by city"],
      athletes: ["League MVPs of the season"],
      events: ["Super Bowl", "NBA Finals", "World Series"],
      confidence: "national" as const,
      note: undefined,
    };
  }
  return {
    popularSports: ["Football (soccer)", "Regional sports"],
    localTeams: ["Local clubs of the birthplace"],
    athletes: ["National athletes of the era"],
    events: ["Major tournaments of the birth year"],
    confidence: "national" as const,
    note: "Detailed club archives vary by country — shown at national relevance unless local data exists.",
  };
}

export function landmarksFor(geo: GeoHierarchy): string[] {
  if (/hyderabad/i.test(geo.city)) {
    return ["Charminar", "Golconda Fort", "Hussain Sagar", "Chowmahalla Palace", "HITEC City"];
  }
  if (geo.countryCode === "IN") {
    return [`Major landmarks of ${geo.city}`, `State heritage sites in ${geo.state || geo.country}`];
  }
  return [`Civic & cultural landmarks of ${geo.city}`, `Regional geography of ${geo.state || geo.country}`];
}
