import type { GeoHierarchy, TimelineEvent } from "./types";

interface EventSeed {
  year: number;
  title: string;
  description: string;
  layer: TimelineEvent["layer"];
  countries?: string[];
  regions?: string[];
}

const EVENTS: EventSeed[] = [
  // Global
  { year: 1989, title: "Fall of the Berlin Wall", description: "A geopolitical turning point felt worldwide.", layer: "global" },
  { year: 1991, title: "World Wide Web goes public", description: "The internet begins its public life.", layer: "global" },
  { year: 1995, title: "Windows 95 era", description: "Personal computing enters mainstream homes.", layer: "global" },
  { year: 1997, title: "Deep Blue defeats Kasparov", description: "A landmark moment in AI vs human chess.", layer: "global" },
  { year: 1998, title: "Google founded", description: "Search begins reshaping how humanity finds knowledge.", layer: "global" },
  { year: 1999, title: "Euro currency introduced", description: "A new monetary chapter for Europe.", layer: "global" },
  { year: 2001, title: "Wikipedia launches", description: "Collaborative knowledge goes global.", layer: "global" },
  { year: 2004, title: "Facebook launches", description: "Social networking enters a new scale.", layer: "global" },
  { year: 2007, title: "iPhone introduced", description: "Smartphones redefine daily life.", layer: "global" },
  { year: 2008, title: "Global financial crisis", description: "Markets and households worldwide feel the shock.", layer: "global" },
  { year: 2010, title: "Instagram launches", description: "Visual social media accelerates.", layer: "global" },
  { year: 2012, title: "Curiosity lands on Mars", description: "A new chapter in planetary exploration.", layer: "global" },
  { year: 2016, title: "AlphaGo defeats Lee Sedol", description: "AI milestones capture world attention.", layer: "global" },
  { year: 2020, title: "COVID-19 pandemic", description: "A shared global disruption of daily life.", layer: "global" },
  { year: 2022, title: "James Webb Space Telescope images", description: "Humanity sees deeper into cosmic history.", layer: "global" },

  // India national
  { year: 1991, title: "Economic liberalisation in India", description: "India opens major sectors of its economy.", layer: "national", countries: ["IN"] },
  { year: 1998, title: "Pokhran-II nuclear tests", description: "India conducts nuclear tests at Pokhran.", layer: "national", countries: ["IN"] },
  { year: 1999, title: "Kargil War", description: "Conflict along the Line of Control dominates national attention.", layer: "national", countries: ["IN"] },
  { year: 2000, title: "Bill Clinton visits India", description: "A high-profile diplomatic moment.", layer: "national", countries: ["IN"] },
  { year: 2007, title: "First Indian woman President", description: "Pratibha Patil elected President of India.", layer: "national", countries: ["IN"] },
  { year: 2008, title: "Chandrayaan-1 launched", description: "India’s first lunar probe begins its journey.", layer: "national", countries: ["IN"] },
  { year: 2010, title: "Commonwealth Games in Delhi", description: "India hosts a major multi-sport event.", layer: "national", countries: ["IN"] },
  { year: 2014, title: "Mars Orbiter Mission succeeds", description: "India reaches Mars orbit on its first attempt.", layer: "national", countries: ["IN"] },
  { year: 2016, title: "Demonetisation announced", description: "High-value banknotes withdrawn overnight.", layer: "national", countries: ["IN"] },
  { year: 2019, title: "Chandrayaan-2 mission", description: "India attempts a soft lunar landing.", layer: "national", countries: ["IN"] },
  { year: 2023, title: "Chandrayaan-3 lands on the Moon", description: "Successful soft landing near the lunar south pole.", layer: "national", countries: ["IN"] },

  // Telangana / Hyderabad regional & local
  { year: 1998, title: "HITEC City inaugurated", description: "Hyderabad’s IT landmark opens — shaping the city’s modern identity.", layer: "local", countries: ["IN"], regions: ["telangana", "andhra", "hyderabad"] },
  { year: 2001, title: "Cyberabad growth years", description: "IT campuses expand around Madhapur / Gachibowli.", layer: "regional", countries: ["IN"], regions: ["telangana", "andhra", "hyderabad"] },
  { year: 2007, title: "Hyderabad International Airport opens", description: "RGIA begins operations, reshaping regional connectivity.", layer: "local", countries: ["IN"], regions: ["telangana", "hyderabad", "andhra"] },
  { year: 2009, title: "Telangana movement intensifies", description: "Statehood protests and political negotiations dominate regional life.", layer: "regional", countries: ["IN"], regions: ["telangana", "andhra", "hyderabad"] },
  { year: 2014, title: "Telangana state formed", description: "India’s 29th state is created with Hyderabad as capital.", layer: "regional", countries: ["IN"], regions: ["telangana", "andhra", "hyderabad"] },
  { year: 2017, title: "Hyderabad Metro opens", description: "The city’s modern metro rail begins passenger service.", layer: "local", countries: ["IN"], regions: ["telangana", "hyderabad"] },
  { year: 2019, title: "KCR / state politics era continues", description: "Telangana’s early statehood years reshape regional governance.", layer: "regional", countries: ["IN"], regions: ["telangana"] },

  // US
  { year: 2001, title: "September 11 attacks", description: "A defining national trauma with global consequences.", layer: "national", countries: ["US"] },
  { year: 2008, title: "Barack Obama elected", description: "A historic U.S. presidential election.", layer: "national", countries: ["US"] },

  // UK
  { year: 1997, title: "Labour returns to power", description: "Tony Blair becomes Prime Minister.", layer: "national", countries: ["GB"] },
  { year: 2012, title: "London Olympics", description: "Britain hosts the Summer Games.", layer: "national", countries: ["GB"] },
  { year: 2016, title: "Brexit referendum", description: "UK votes to leave the European Union.", layer: "national", countries: ["GB"] },

  // Japan
  { year: 2011, title: "Tōhoku earthquake & tsunami", description: "A national disaster reshaping Japan’s decade.", layer: "national", countries: ["JP"] },
];

function matchesPlace(e: EventSeed, geo: GeoHierarchy): boolean {
  if (e.layer === "global") return true;
  if (e.countries && !e.countries.includes(geo.countryCode)) return false;
  if (!e.regions?.length) return true;
  const hay = `${geo.state ?? ""} ${geo.district ?? ""} ${geo.city}`.toLowerCase();
  return e.regions.some((r) => hay.includes(r));
}

export function buildTimeline(geo: GeoHierarchy, birthYear: number, name: string): TimelineEvent[] {
  const windowStart = birthYear - 8;
  const windowEnd = birthYear + 2;

  const events = EVENTS
    .filter((e) => e.year >= windowStart && e.year <= windowEnd && matchesPlace(e, geo))
    .map((e, i) => ({
      id: `evt-${e.year}-${i}`,
      year: e.year,
      title: e.title,
      description: e.description,
      layer: e.layer,
    }));

  // Ensure each layer has something near birth year when possible
  const birthEvent: TimelineEvent = {
    id: "birth",
    year: birthYear,
    title: `${name.split(" ")[0] || "You"} arrived`,
    description: `Born in ${geo.city}${geo.state ? `, ${geo.state}` : ""}, ${geo.country}.`,
    layer: "personal",
    isBirth: true,
  };

  const combined = [...events, birthEvent].sort((a, b) => a.year - b.year || (a.isBirth ? 1 : 0));
  return combined;
}

export function buildRegionalNews(geo: GeoHierarchy, birthYear: number): TimelineEvent[] {
  return EVENTS
    .filter((e) => matchesPlace(e, geo) && Math.abs(e.year - birthYear) <= 2)
    .filter((e) => e.layer !== "global" || Math.abs(e.year - birthYear) === 0)
    .map((e, i) => ({
      id: `news-${i}`,
      year: e.year,
      title: e.title,
      description: e.description,
      layer: e.layer,
    }))
    .sort((a, b) => {
      const order = { local: 0, regional: 1, national: 2, global: 3, personal: 4 };
      return order[a.layer] - order[b.layer] || a.year - b.year;
    });
}
