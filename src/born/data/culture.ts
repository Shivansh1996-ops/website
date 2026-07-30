import type { CultureSnapshot } from "@/born/types";
import { getRegionalMusic } from "./music";
import { getRegionalFilms } from "./movies";

interface CultureProfile {
  languages: string[];
  foods: string[];
  festivals: string[];
  sports: string[];
  fashion?: string;
  movements?: string[];
}

/** Country-level cultural profiles — factual, not stereotyped caricatures */
const COUNTRY_CULTURE: Record<string, CultureProfile> = {
  IN: {
    languages: ["Hindi", "English", "and major regional languages"],
    foods: ["Regional vegetarian & non-vegetarian cuisines", "Street food culture", "Festival sweets"],
    festivals: ["Diwali", "Holi", "Eid", "Christmas", "Regional harvest festivals"],
    sports: ["Cricket", "Hockey", "Kabaddi", "Football"],
    fashion: "Fusion of traditional textiles with contemporary urban wear",
    movements: ["Bollywood & regional cinema boom", "IT & software services expansion"],
  },
  US: {
    languages: ["English", "Spanish (widely spoken in many regions)"],
    foods: ["Regional American cuisine", "Fast-casual dining rise", "Immigrant food traditions"],
    festivals: ["Thanksgiving", "Independence Day", "Super Bowl Sunday", "Halloween"],
    sports: ["American football", "Basketball", "Baseball", "Soccer"],
    fashion: "Casual sportswear and branded street style",
    movements: ["Internet mainstreaming", "Hip-hop cultural dominance"],
  },
  GB: {
    languages: ["English"],
    foods: ["British pub classics", "South Asian British cuisine", "Tea culture"],
    festivals: ["Christmas", "Bonfire Night", "Notting Hill Carnival"],
    sports: ["Football", "Cricket", "Rugby", "Tennis"],
    fashion: "High-street fashion and football-influenced streetwear",
  },
  JP: {
    languages: ["Japanese"],
    foods: ["Regional washoku traditions", "Ramen culture", "Convenience-store food culture"],
    festivals: ["New Year (Shōgatsu)", "Obon", "Cherry blossom season"],
    sports: ["Baseball", "Sumo", "Football", "Martial arts"],
    fashion: "Harajuku street styles alongside formal kimono traditions",
  },
  BR: {
    languages: ["Portuguese"],
    foods: ["Regional Brazilian cuisines", "Churrasco", "Street snacks"],
    festivals: ["Carnival", "Festa Junina", "New Year on Copacabana"],
    sports: ["Football", "Volleyball", "Capoeira"],
  },
  KR: {
    languages: ["Korean"],
    foods: ["Korean BBQ", "Kimchi traditions", "Street snacks"],
    festivals: ["Seollal", "Chuseok"],
    sports: ["Baseball", "Football", "Esports"],
    movements: ["Hallyu (Korean Wave)"],
  },
  NG: {
    languages: ["English", "Yoruba", "Igbo", "Hausa", "and many others"],
    foods: ["Jollof rice", "Regional stews", "Street snacks"],
    festivals: ["Independence Day", "Regional cultural festivals"],
    sports: ["Football"],
    movements: ["Afrobeats global rise", "Nollywood expansion"],
  },
  AE: {
    languages: ["Arabic", "English"],
    foods: ["Gulf cuisine", "International dining hubs"],
    festivals: ["National Day", "Ramadan", "Eid"],
    sports: ["Football", "Cricket", "Motorsport"],
  },
};

const STATE_CULTURE: Record<string, Partial<CultureProfile> & { languages?: string[] }> = {
  telangana: {
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    foods: ["Hyderabadi biryani", "Haleem", "Irani chai culture"],
    festivals: ["Bathukamma", "Bonalu", "Ramzan"],
    sports: ["Cricket", "Kabaddi"],
    movements: ["Tollywood (Telugu cinema) influence", "Hyderabad IT corridor growth"],
  },
  "andhra pradesh": {
    languages: ["Telugu", "English"],
    foods: ["Andhra spicy cuisine", "Seafood along the coast"],
    festivals: ["Ugadi", "Sankranti"],
    sports: ["Cricket"],
  },
  "tamil nadu": {
    languages: ["Tamil", "English"],
    foods: ["Tamil Nadu cuisine", "Filter coffee culture"],
    festivals: ["Pongal", "Tamil New Year"],
    sports: ["Cricket", "Kabaddi"],
  },
  maharashtra: {
    languages: ["Marathi", "Hindi", "English"],
    foods: ["Vada pav", "Misal", "Coastal Konkani cuisine"],
    festivals: ["Ganesh Chaturthi", "Gudi Padwa"],
    sports: ["Cricket"],
  },
  karnataka: {
    languages: ["Kannada", "English", "Hindi"],
    foods: ["Bisi bele bath", "Filter coffee", "Coastal seafood"],
    festivals: ["Ugadi", "Dasara (Mysuru)"],
    sports: ["Cricket"],
  },
  delhi: {
    languages: ["Hindi", "English", "Punjabi", "Urdu"],
    foods: ["North Indian cuisine", "Street chaat"],
    festivals: ["Diwali", "Republic Day", "Eid"],
    sports: ["Cricket"],
  },
};

const GLOBAL_CULTURE: CultureProfile = {
  languages: ["English as a global lingua franca alongside local languages"],
  foods: ["Globalization of fast food and fusion dining"],
  festivals: ["New Year", "Olympic cycles", "World Cup cycles"],
  sports: ["Football (soccer)", "Olympics", "Cricket in Commonwealth regions"],
  fashion: "Global streetwear and digital trend cycles",
  movements: ["Internet culture", "Streaming media", "Climate awareness"],
};

export function buildCultureSnapshot(opts: {
  countryCode: string;
  state?: string;
  year: number;
  mode: "local" | "global";
}): CultureSnapshot {
  const music = getRegionalMusic({
    countryCode: opts.countryCode,
    state: opts.state,
    year: opts.year,
  });
  const films = getRegionalFilms({
    countryCode: opts.countryCode,
    state: opts.state,
    year: opts.year,
  });

  if (opts.mode === "global") {
    return {
      ...GLOBAL_CULTURE,
      music: music.global,
      films: films.global,
      note: "Global cultural snapshot for your birth year.",
    };
  }

  const country = COUNTRY_CULTURE[opts.countryCode.toUpperCase()];
  const state = opts.state ? STATE_CULTURE[opts.state.toLowerCase()] : undefined;

  if (!country && !state) {
    return {
      languages: ["Local languages of the region"],
      foods: [],
      festivals: [],
      sports: [],
      music: music.global,
      films: films.global,
      note: `Detailed cultural archives for this region are still being built. Showing global-era culture with listen/watch links. We never invent local customs.`,
    };
  }

  const base = country ?? GLOBAL_CULTURE;
  return {
    languages: state?.languages ?? base.languages,
    foods: state?.foods ?? base.foods,
    festivals: state?.festivals ?? base.festivals,
    sports: state?.sports ?? base.sports,
    fashion: state?.fashion ?? base.fashion,
    movements: state?.movements ?? base.movements,
    music: music.regional.length ? music.regional : music.national,
    films: films.regional.length ? films.regional : films.national,
    note: music.note ?? films.note,
  };
}
