import type { TechSnapshot, SportsSnapshot, PriceItem, PopulationContext, TimelineEvent } from "@/born/types";

export function buildTechSnapshot(countryCode: string, year: number): TechSnapshot {
  const decade = Math.floor(year / 10) * 10;
  const globalPhones: Record<number, string[]> = {
    1990: ["Nokia 3310 era approaching", "Motorola starTAC", "Landlines dominant"],
    2000: ["Nokia & Sony Ericsson feature phones", "Early BlackBerry", "Camera phones emerging"],
    2010: ["iPhone & Android smartphones", "3G/4G rollout", "App stores"],
    2020: ["5G beginnings", "Foldable phones", "Always-connected wearables"],
  };
  const regionPhones = { ...globalPhones };

  // Region-aware overlays
  const cc = countryCode.toUpperCase();
  let internet = "Rising consumer internet access";
  let network = decade <= 1990 ? "2G beginnings" : decade <= 2000 ? "2G/early 3G" : decade <= 2010 ? "3G/4G" : "4G/5G";
  let sites = ["Email portals", "Early search engines", "News sites"];
  let companies: string[] = [];

  if (cc === "IN") {
    companies = ["Infosys", "TCS", "Wipro", decade >= 2010 ? "Flipkart" : "NASSCOM ecosystem"].filter(Boolean);
    internet = decade < 2000 ? "Very limited consumer internet" : decade < 2010 ? "Cybercafé & broadband growth" : "Mobile-first internet boom";
    sites = decade < 2010 ? ["Rediff", "Yahoo", "Orkut"] : ["WhatsApp", "YouTube", "Flipkart", "IRCTC"];
    if (decade >= 2010) regionPhones[2010] = ["Nokia Asha / feature phones still common", "Android value smartphones", "Reliance Jio later reshaped access"];
  } else if (cc === "US" || cc === "GB") {
    companies = ["Apple", "Google", "Microsoft", "Amazon"];
    sites = decade < 2010 ? ["Google", "Yahoo", "MySpace", "Facebook"] : ["Google", "YouTube", "Facebook", "Twitter"];
    internet = decade < 2000 ? "Dial-up mainstreaming" : "Broadband mainstream";
  } else if (cc === "JP" || cc === "KR") {
    companies = cc === "KR" ? ["Samsung", "LG"] : ["Sony", "Nintendo", "SoftBank"];
    internet = "Advanced mobile internet relative to global average";
    network = decade >= 2000 ? "Early mobile data leadership" : network;
  } else if (cc === "NG") {
    companies = ["MTN", "Airtel Africa"];
    internet = decade < 2010 ? "Limited fixed broadband; mobile leapfrogging" : "Mobile internet expansion";
  }

  const gPhones = globalPhones[decade] ?? globalPhones[2020];
  const rPhones = regionPhones[decade] ?? gPhones;

  return {
    region: {
      phones: rPhones,
      internetPenetration: internet,
      networkGeneration: network,
      popularSites: sites,
      localCompanies: companies,
    },
    global: {
      phones: gPhones,
      launches: decade <= 2000
        ? ["World Wide Web expansion", "Google founding era", "Early social networks"]
        : decade <= 2010
          ? ["iPhone (2007)", "Android", "App economy"]
          : ["Streaming wars", "AI assistants", "Cloud computing default"],
      operatingSystems: decade < 2000 ? ["Windows 95/98", "Mac OS"] : decade < 2010 ? ["Windows XP/Vista", "Mac OS X"] : ["iOS", "Android", "Windows"],
    },
    scope: companies.length ? "national" : "global",
  };
}

export function buildSportsSnapshot(countryCode: string, state: string | undefined, year: number): SportsSnapshot {
  const cc = countryCode.toUpperCase();
  const profiles: Record<string, SportsSnapshot> = {
    IN: {
      popularSports: ["Cricket", "Hockey", "Kabaddi", "Football"],
      localTeams: state?.toLowerCase().includes("telangana") || state?.toLowerCase().includes("andhra")
        ? ["Sunrisers Hyderabad (IPL era)", "Hyderabad football clubs"]
        : ["National cricket team", "IPL franchises (from 2008)"],
      athletes: year < 2005 ? ["Sachin Tendulkar", "Leander Paes"] : ["Virat Kohli", "P.V. Sindhu", "Mary Kom"],
      events: year >= 2007 && year <= 2008 ? ["IPL inaugural season (2008)", "T20 World Cup era"] : ["Cricket World Cups", "Olympic cycles", "Asian Games"],
      scope: "national",
    },
    US: {
      popularSports: ["American football", "Basketball", "Baseball", "Soccer"],
      localTeams: ["NFL / NBA / MLB franchises by city"],
      athletes: ["Michael Jordan era fading into LeBron / Tiger Woods era"],
      events: ["Super Bowl", "World Series", "NBA Finals"],
      scope: "national",
    },
    GB: {
      popularSports: ["Football", "Cricket", "Rugby", "Tennis"],
      localTeams: ["Premier League clubs"],
      athletes: ["David Beckham era", "Andy Murray"],
      events: ["Premier League", "Wimbledon", "Ashes"],
      scope: "national",
    },
    BR: {
      popularSports: ["Football", "Volleyball"],
      localTeams: ["Flamengo", "Corinthians", "São Paulo FC"],
      athletes: ["Ronaldo", "Ronaldinho", "Neymar"],
      events: ["Copa do Brasil", "World Cup cycles"],
      scope: "national",
    },
    NG: {
      popularSports: ["Football"],
      localTeams: ["Super Eagles"],
      athletes: ["Jay-Jay Okocha", "Kanu"],
      events: ["AFCON", "World Cup qualifying"],
      scope: "national",
    },
  };

  return profiles[cc] ?? {
    popularSports: ["Football (soccer)", "Olympic sports"],
    localTeams: [],
    athletes: [],
    events: ["Olympic Games", "FIFA World Cup cycles"],
    scope: "global",
  };
}

export function buildPrices(countryCode: string, year: number): PriceItem[] {
  const cc = countryCode.toUpperCase();
  // Only include historically plausible, labeled estimates — never invent fake exact prices
  const items: PriceItem[] = [
    {
      category: "Movie ticket",
      thenLabel: `Around ${year}`,
      thenValue: cc === "IN" ? (year < 2005 ? "~₹50–100 (city cinema)" : "~₹100–250") : cc === "US" ? "~$5–10" : "Varies by city",
      todayLabel: "Today (approx.)",
      todayValue: cc === "IN" ? "~₹200–500+" : cc === "US" ? "~$12–20" : "Higher in most cities",
      globalBenchmark: "Cinema prices rose faster than general inflation in many markets",
      available: true,
      note: "Indicative city ranges from published historical reporting — not an exact receipt.",
    },
    {
      category: "Fuel (petrol)",
      thenLabel: `Around ${year}`,
      thenValue: cc === "IN" ? (year < 2005 ? "~₹30–45/L" : "~₹50–80/L") : "See national archives",
      todayLabel: "Today (approx.)",
      todayValue: cc === "IN" ? "~₹100+/L (varies by state)" : "Check local pumps",
      globalBenchmark: "Oil shocks and taxes dominate fuel price history",
      available: cc === "IN" || cc === "US",
      note: cc === "IN" ? "India fuel prices vary by state taxes." : "Exact historical pump prices require local archives.",
    },
    {
      category: "Public transport",
      thenLabel: `Around ${year}`,
      thenValue: cc === "IN" ? "City bus / local train fares in single digits to low tens of rupees" : "City-dependent",
      todayLabel: "Today",
      todayValue: "Higher nominal fares; passes and apps common",
      available: true,
      note: "Transport fares are highly city-specific; treat as context, not a quote.",
    },
    {
      category: "Mobile phone",
      thenLabel: `Around ${year}`,
      thenValue: year < 2005 ? "Feature phone — weeks of wages for many households" : year < 2015 ? "Early smartphones — luxury for many" : "Wide price ladder from budget to flagship",
      todayLabel: "Today",
      todayValue: "Smartphones from entry-level to premium across most markets",
      globalBenchmark: "Device capability per dollar rose dramatically",
      available: true,
    },
    {
      category: "Gold",
      thenLabel: `Global context ~${year}`,
      thenValue: "See World Gold Council historical series",
      todayLabel: "Today",
      todayValue: "Markedly higher nominal USD/oz vs most 1990s–2000s years",
      available: false,
      note: "Exact gold prices are not invented here — consult World Gold Council for verified series.",
    },
  ];
  return items;
}

export function buildPopulation(countryCode: string, city: string, year: number): PopulationContext {
  // Approximate published UN / census ballparks — labeled as approximate
  const worldByDecade: Record<number, string> = {
    1990: "~5.3 billion",
    2000: "~6.1 billion",
    2010: "~6.9 billion",
    2020: "~7.8 billion",
  };
  const decade = Math.floor(year / 10) * 10;
  const countryPop: Record<string, Record<number, string>> = {
    IN: { 1990: "~870 million", 2000: "~1.05 billion", 2010: "~1.23 billion", 2020: "~1.38 billion" },
    US: { 1990: "~250 million", 2000: "~280 million", 2010: "~310 million", 2020: "~330 million" },
    GB: { 1990: "~57 million", 2000: "~59 million", 2010: "~63 million", 2020: "~67 million" },
    JP: { 1990: "~123 million", 2000: "~127 million", 2010: "~128 million", 2020: "~126 million" },
    BR: { 1990: "~150 million", 2000: "~175 million", 2010: "~196 million", 2020: "~213 million" },
    NG: { 1990: "~95 million", 2000: "~120 million", 2010: "~160 million", 2020: "~200 million+" },
  };
  const cityNotes: Record<string, string> = {
    hyderabad: "Hyderabad metro grew rapidly through the IT decades (exact census year varies).",
    mumbai: "Mumbai has long been among India's largest urban agglomerations.",
    delhi: "Delhi NCR is among the world's largest urban regions.",
    "new york": "New York City metro remains one of the world's largest.",
    tokyo: "Tokyo metro is consistently among the world's largest urban areas.",
    london: "London has remained a global megacity throughout the modern era.",
  };

  const cc = countryCode.toUpperCase();
  const cKey = city.toLowerCase();

  return {
    city: {
      label: city,
      value: cityNotes[cKey] ?? "City population figures vary by metro definition and census year.",
      scope: cityNotes[cKey] ? "regional" : "unavailable",
      note: "Exact historical city populations require census tables; we avoid inventing a number.",
    },
    country: {
      label: "Country",
      value: countryPop[cc]?.[decade] ?? "See UN World Population Prospects",
      scope: countryPop[cc] ? "national" : "unavailable",
      source: "UN / national census ballpark by decade",
    },
    world: {
      label: "World",
      value: worldByDecade[decade] ?? "~8 billion (2020s)",
      scope: "global",
      source: "UN World Population Prospects (approx.)",
    },
  };
}

export function buildTimeline(opts: {
  year: number;
  countryCode: string;
  state?: string;
  city: string;
  name: string;
}): TimelineEvent[] {
  const { year, countryCode, state, city, name } = opts;
  const cc = countryCode.toUpperCase();
  const events: TimelineEvent[] = [];

  // Personal / birth
  events.push({
    year,
    title: `${name} was born`,
    description: `Your story began in ${city}.`,
    layer: "personal",
    isBirth: true,
  });

  // Local / regional
  if (cc === "IN") {
    if (state?.toLowerCase().includes("telangana") || city.toLowerCase() === "hyderabad") {
      events.push({
        year: 2014,
        title: "Telangana statehood",
        description: "Telangana became India's 29th state; Hyderabad as capital.",
        layer: "regional",
      });
      events.push({
        year: 1998,
        title: "Hyderabad IT expansion",
        description: "HITEC City and Cyberabad years accelerated the city's tech identity.",
        layer: "local",
      });
    }
    events.push({
      year: 1991,
      title: "Economic liberalisation",
      description: "India opened major sectors of its economy — reshaping urban life for decades.",
      layer: "national",
    });
    events.push({
      year: 2008,
      title: "IPL begins",
      description: "The Indian Premier League transformed cricket into a year-round cultural event.",
      layer: "national",
    });
  }

  // Global anchors near birth year
  const globalAnchors: TimelineEvent[] = [
    { year: 1991, title: "World Wide Web goes public", description: "The web became openly available beyond research labs.", layer: "global" },
    { year: 1997, title: "Deep Blue defeats Kasparov", description: "A machine beat the world chess champion in a full match.", layer: "global" },
    { year: 2001, title: "Wikipedia launches", description: "A free encyclopedia anyone could edit entered the world.", layer: "global" },
    { year: 2004, title: "Facebook launches", description: "Social networking began its path to global scale.", layer: "global" },
    { year: 2007, title: "iPhone announced", description: "Smartphones redefined daily life worldwide.", layer: "global" },
    { year: 2008, title: "Global financial crisis", description: "Markets convulsed; ordinary lives felt the aftershocks.", layer: "global" },
    { year: 2010, title: "Arab Spring begins", description: "A wave of protests reshaped politics across multiple countries.", layer: "global" },
    { year: 2016, title: "AlphaGo defeats Lee Sedol", description: "AI shocked the world of Go — a milestone in machine learning.", layer: "global" },
    { year: 2020, title: "COVID-19 pandemic", description: "A global health crisis paused ordinary life everywhere.", layer: "global" },
  ];

  for (const g of globalAnchors) {
    if (Math.abs(g.year - year) <= 8) events.push(g);
  }

  // Ensure a few global events always exist
  if (!events.some((e) => e.layer === "global")) {
    events.push(...globalAnchors.filter((g) => g.year <= year).slice(-2));
  }

  return events.sort((a, b) => a.year - b.year || (a.isBirth ? 1 : 0) - (b.isBirth ? 1 : 0));
}
