import type { CultureSnapshot, GeographicPlace, PopulationSnapshot, PriceItem, SportsSnapshot, TechSnapshot } from "../types";

/** Scalable region packs keyed by country / region — not stereotypes; era-aware cultural context. */
export function buildCulture(place: GeographicPlace, year: number): CultureSnapshot {
  const cc = place.countryCode;
  const state = (place.state ?? "").toLowerCase();

  if (cc === "IN") {
    const south = ["telangana", "andhra", "tamil", "karnataka", "kerala"].some((s) => state.includes(s));
    return {
      languages: place.languages,
      festivals: south
        ? year < 2000
          ? ["Sankranti", "Ugadi", "Diwali", "Eid"]
          : ["Sankranti", "Ugadi", "Bathukamma (Telangana)", "Diwali", "Eid", "Christmas"]
        : ["Diwali", "Holi", "Eid", "Christmas", "Regional harvest festivals"],
      foods: south
        ? ["Rice-based meals", "Biryani traditions", "Dosa / idli culture", "Seasonal mango"]
        : ["Regional thali traditions", "Street food culture", "Festival sweets"],
      fashionTrends: year < 2005
        ? ["Local textile traditions", "Cinema-influenced style", "Rising ready-to-wear"]
        : ["Cinema fashion cycles", "Mobile-era youth style", "Fusion ethnic wear"],
      culturalMovements: south
        ? ["Regional cinema boom", "Classical & folk music continuity", "Language pride movements"]
        : ["Bollywood mainstream culture", "Cricket as shared ritual", "Cable TV expansion era"],
      television: year < 2000
        ? ["Doordarshan era programs", "Regional language channels emerging"]
        : year < 2010
          ? ["Satellite TV boom", "Regional entertainment channels"]
          : ["Streaming transition beginning", "Reality TV & cricket broadcasts"],
      confidence: "regional",
      note: `Cultural context for ${place.state || place.country} around ${year}. Not a stereotype of individuals — era and place trends.`,
    };
  }

  if (cc === "JP") {
    return {
      languages: place.languages,
      festivals: ["New Year (Shōgatsu)", "Obon", "Local matsuri"],
      foods: ["Seasonal washoku", "Convenience-store food culture", "Regional specialties"],
      fashionTrends: year < 2005 ? ["Street fashion districts", "Anime-adjacent youth style"] : ["Fast fashion era", "Minimal / techwear currents"],
      culturalMovements: ["Pop idol cycles", "Anime global export", "Local festival continuity"],
      television: ["Variety shows", "Morning dramas (asadora)", "Anime broadcast slots"],
      confidence: "national",
      note: `National-era cultural markers for Japan around ${year}.`,
    };
  }

  if (cc === "BR") {
    return {
      languages: place.languages,
      festivals: ["Carnival", "Festa Junina", "Local patron saint festivals"],
      foods: ["Regional Brazilian cuisine", "Street food", "Football match snacks"],
      fashionTrends: ["Beach / tropical casual", "Music-scene style"],
      culturalMovements: ["Samba & regional music", "Football culture", "TV novela influence"],
      television: ["Novelas", "Football broadcasts"],
      confidence: "national",
      note: `National cultural markers for Brazil around ${year}.`,
    };
  }

  return {
    languages: place.languages,
    festivals: ["Local & national holidays (see regional calendar)"],
    foods: ["Local cuisine traditions for this country"],
    fashionTrends: [`Fashion cycles of the ${Math.floor(year / 10) * 10}s`],
    culturalMovements: ["Regional arts", "National media culture"],
    television: ["Dominant national broadcasters of the era"],
    confidence: "national",
    note: `Detailed city-level cultural archives for ${place.city} are limited — showing national-era context.`,
  };
}

export function buildPopulation(place: GeographicPlace, year: number): PopulationSnapshot {
  // Transparent estimates from known historical bands — labeled estimated, never invented as census.
  const worldByDecade: Record<number, string> = {
    1990: "~5.3 billion",
    2000: "~6.1 billion",
    2010: "~6.9 billion",
    2020: "~7.8 billion",
  };
  const decade = Math.floor(year / 10) * 10;
  const world = worldByDecade[decade] ?? "~8 billion";

  const countryBands: Record<string, Record<number, string>> = {
    IN: { 1990: "~870 million", 2000: "~1.06 billion", 2010: "~1.23 billion", 2020: "~1.38 billion" },
    US: { 1990: "~250 million", 2000: "~282 million", 2010: "~309 million", 2020: "~331 million" },
    CN: { 1990: "~1.14 billion", 2000: "~1.26 billion", 2010: "~1.34 billion", 2020: "~1.41 billion" },
    BR: { 1990: "~150 million", 2000: "~175 million", 2010: "~196 million", 2020: "~213 million" },
    JP: { 1990: "~123 million", 2000: "~127 million", 2010: "~128 million", 2020: "~126 million" },
  };

  const countryVal = countryBands[place.countryCode]?.[decade];

  return {
    city: {
      value: `Historical city census for ${place.city} in ${year} not loaded from a live census API`,
      scope: "local",
      confidence: "unavailable",
      source: "BORN",
      label: place.city,
    },
    region: place.state
      ? {
          value: `State/region population requires official statistical yearbooks for ${place.state}`,
          scope: "regional",
          confidence: "unavailable",
          source: "BORN",
          label: place.state,
        }
      : undefined,
    country: countryVal
      ? {
          value: countryVal,
          scope: "national",
          confidence: "estimated",
          source: "UN population decade bands",
          label: place.country,
          asOf: String(decade),
        }
      : {
          value: "National population band unavailable in offline dataset",
          scope: "national",
          confidence: "unavailable",
          source: "BORN",
          label: place.country,
        },
    world: {
      value: world,
      scope: "global",
      confidence: "estimated",
      source: "UN world population decade bands",
      label: "Earth",
      asOf: String(decade),
    },
  };
}

export function buildTechnology(place: GeographicPlace, year: number): TechSnapshot {
  const mobileEra =
    year < 1995 ? "Early mobile / landline dominant" :
    year < 2001 ? "2G mobile emerging" :
    year < 2008 ? "Feature phone mainstream" :
    year < 2012 ? "Early smartphone transition" :
    year < 2018 ? "Smartphone majority (urban)" :
    "Smartphone + streaming era";

  const network =
    year < 2001 ? "2G / early digital cellular" :
    year < 2010 ? "2G–3G transition" :
    year < 2018 ? "3G–4G" :
    "4G–5G rollout (uneven by region)";

  const regionDevices =
    place.countryCode === "IN"
      ? year < 2005
        ? ["Landlines", "Basic Nokia-era handsets", "Cyber cafe PCs"]
        : year < 2012
          ? ["Nokia / Samsung feature phones", "Cyber cafes", "Early Android"]
          : ["Android smartphones", "Jio-era data (post-2016)", "WhatsApp as default chat"]
      : year < 2007
        ? ["Feature phones", "Desktop PCs", "Internet cafes"]
        : ["Smartphones", "Laptops", "Social platforms"];

  return {
    region: {
      mobileEra,
      internetPenetration: place.countryCode === "IN"
        ? year < 2005 ? "Low single-digit % online" : year < 2016 ? "Rising urban broadband / cyber cafes" : "Mobile data explosion"
        : "Varies widely — urban first",
      networkGeneration: network,
      popularDevices: regionDevices,
      localCompanies: place.countryCode === "IN"
        ? year < 2010 ? ["Infosys / TCS era visibility", "Regional ISPs"] : ["Reliance Jio (later)", "Indian IT services", "UPI ecosystem (later)"]
        : ["National telecom operators", "Local ISPs"],
      note: `Technology adoption for ${place.country} around ${year}, not a personal inventory.`,
    },
    global: {
      majorLaunch:
        year <= 1998 ? "World Wide Web mainstreaming" :
        year <= 2001 ? "Dot-com era / early Google" :
        year <= 2004 ? "Social web beginnings" :
        year <= 2007 ? "iPhone announcement era" :
        year <= 2010 ? "App store + social networks" :
        year <= 2016 ? "Streaming & smartphones default" :
        "AI assistants & short video platforms rising",
      popularOs: year < 2007 ? ["Windows", "Feature phone OS"] : year < 2015 ? ["Windows", "iOS", "Android"] : ["Android", "iOS", "Windows"],
      websites: year < 2005 ? ["Portals & search", "Email"] : year < 2012 ? ["Google", "YouTube", "Facebook"] : ["YouTube", "Social apps", "Streaming"],
      note: "Global technology context for comparison.",
    },
  };
}

export function buildSports(place: GeographicPlace, year: number): SportsSnapshot {
  if (place.countryCode === "IN") {
    const south = ["telangana", "andhra", "tamil", "karnataka", "kerala"].some((s) =>
      (place.state ?? "").toLowerCase().includes(s),
    );
    return {
      popularSports: south ? ["Cricket", "Kabaddi", "Badminton", "Football (local)"] : ["Cricket", "Hockey heritage", "Badminton", "Football"],
      localTeams: south
        ? ["Regional Ranji cricket sides", "Later IPL franchises (post-2008)"]
        : ["State cricket associations", "National cricket team fandom"],
      nationalContext: ["Indian cricket calendar", "Asian Games cycles", "Olympic participation"],
      eventsAroundBirth:
        year === 2011 ? ["India Cricket World Cup win (2011)"] :
        year >= 2007 && year <= 2009 ? ["IPL inaugural era (2008)"] :
        year === 1983 ? ["India Cricket World Cup (1983)"] :
        ["Follow national sporting calendar for this year"],
      athletes: ["Sachin Tendulkar era (1990s–2010s)", "Regional cinema-sports crossover icons"],
      confidence: "regional",
      note: `Sports culture around ${place.city} / ${place.state || place.country} in ${year}.`,
    };
  }

  if (place.countryCode === "BR") {
    return {
      popularSports: ["Football", "Volleyball", "Motorsport"],
      localTeams: ["State football clubs", "National team"],
      nationalContext: ["Campeonato Brasileiro", "Copa América cycles"],
      eventsAroundBirth: ["Football calendar around birth year"],
      athletes: ["National football icons of the era"],
      confidence: "national",
      note: "National sports context for Brazil.",
    };
  }

  if (place.countryCode === "US") {
    return {
      popularSports: ["American football", "Basketball", "Baseball", "Soccer (rising)"],
      localTeams: ["City / state franchises where applicable"],
      nationalContext: ["Super Bowl", "NBA Finals", "World Series"],
      eventsAroundBirth: ["Major US league seasons for birth year"],
      athletes: ["Era-defining US athletes"],
      confidence: "national",
      note: "National US sports context.",
    };
  }

  return {
    popularSports: ["National popular sports for this country"],
    localTeams: ["Local clubs — detailed roster requires regional sports archives"],
    nationalContext: ["National team competitions"],
    eventsAroundBirth: ["Major tournaments in birth year (see national sports history)"],
    athletes: [],
    confidence: "national",
    note: `Detailed local sports archives for ${place.city} unavailable — national layer shown.`,
  };
}

export function buildPrices(place: GeographicPlace, year: number): PriceItem[] {
  const cc = place.countryCode;
  // Only include historically plausible labeled estimates; unavailable stays null.
  const items: PriceItem[] = [];

  if (cc === "IN") {
    items.push(
      {
        category: "Petrol (approx. national)",
        thenLabel: `${year}`,
        thenValue: year <= 2002 ? "~₹30/L era (varies by state)" : year <= 2010 ? "~₹50–60/L era" : year <= 2018 ? "~₹70–80/L era" : "See state oil company archives",
        todayLabel: "Today",
        todayValue: "Check local pump rates",
        globalBenchmark: "Global crude & FX drive local pump prices",
        confidence: "estimated",
        note: "State-regulated; Hyderabad/Telangana rates differ from national averages. Not an exact receipt.",
      },
      {
        category: "Movie ticket (single screen / multiplex)",
        thenLabel: `${year}`,
        thenValue: year <= 2005 ? "Often under ₹100 in many cities" : year <= 2015 ? "₹100–250 common multiplex range" : "₹150–400+ depending on city",
        todayLabel: "Today",
        todayValue: "City multiplex dynamic pricing",
        confidence: "estimated",
        note: "City and theatre class vary widely.",
      },
      {
        category: "Public transport (city bus token)",
        thenLabel: `${year}`,
        thenValue: "Low single-digit to tens of rupees depending on decade",
        todayLabel: "Today",
        todayValue: "City transit authority fare table",
        confidence: "estimated",
      },
    );
  } else {
    items.push({
      category: "Local prices",
      thenLabel: `${year}`,
      thenValue: null,
      todayLabel: "Today",
      todayValue: null,
      globalBenchmark: "Use national statistical offices for CPI series",
      confidence: "unavailable",
      note: `Exact historical prices for ${place.city} are not invented. Connect a prices API or national CPI dataset for this country.`,
    });
  }

  items.push({
    category: "Currency",
    thenLabel: `${year}`,
    thenValue: place.currency ?? "Local currency",
    todayLabel: "Today",
    todayValue: place.currency ?? "Local currency",
    globalBenchmark: "USD as common FX benchmark",
    confidence: "exact",
    note: "Currency code from country — not a historical FX quote.",
  });

  return items;
}
