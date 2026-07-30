import type { CultureSnapshot, GeoHierarchy } from "./types";
import { getMusicForPlace } from "./music";
import { getFilmsForPlace } from "./movies";

interface RegionCulture {
  match: (geo: GeoHierarchy) => boolean;
  languages: string[];
  sports: string[];
  festivals: (year: number) => string[];
  foods: string[];
  fashion?: string;
  movements?: string[];
  television?: string[];
}

const CULTURES: RegionCulture[] = [
  {
    match: (g) =>
      g.countryCode === "IN" &&
      /telangana|andhra|hyderabad|secunderabad/i.test(`${g.state} ${g.city}`),
    languages: ["Telugu", "English", "Hindi", "Urdu"],
    sports: ["Cricket", "Kabaddi", "Badminton"],
    festivals: (y) => [
      `Bathukamma & Dasara season around ${y}`,
      "Sankranti / Pongal harvest celebrations",
      "Ramzan & Diwali city observances in Hyderabad",
    ],
    foods: ["Hyderabadi biryani", "Irani chai & Osmania biscuits", "Sarva pindi", "Double ka meetha"],
    fashion: "South Indian festive wear alongside emerging IT-city casual styles",
    movements: ["Tollywood film culture", "Growing IT / HITEC City identity"],
    television: ["Regional Telugu channels", "Doordarshan & satellite cable era programming"],
  },
  {
    match: (g) => g.countryCode === "IN" && /tamil/i.test(`${g.state}`),
    languages: ["Tamil", "English"],
    sports: ["Cricket", "Kabaddi", "Hockey"],
    festivals: () => ["Pongal", "Tamil New Year", "Deepavali"],
    foods: ["Idli & sambar", "Filter coffee", "Chettinad cuisine"],
    movements: ["Kollywood cinema"],
    television: ["Sun TV era regional programming"],
  },
  {
    match: (g) => g.countryCode === "IN",
    languages: ["Hindi", "English", "Regional languages"],
    sports: ["Cricket", "Hockey", "Football"],
    festivals: () => ["Diwali", "Holi", "Eid", "Christmas (widely celebrated in cities)"],
    foods: ["Regional thalis", "Street chaat", "Festival sweets"],
    television: ["Hindi general entertainment & cricket broadcasts"],
  },
  {
    match: (g) => g.countryCode === "JP",
    languages: ["Japanese"],
    sports: ["Baseball", "Sumo", "Football"],
    festivals: () => ["Hanami (cherry blossom)", "Obon", "New Year (Shōgatsu)"],
    foods: ["Seasonal washoku", "Ramen regional styles", "Convenience-store food culture"],
    television: ["NHK & commercial networks", "Anime broadcast culture"],
  },
  {
    match: (g) => g.countryCode === "BR",
    languages: ["Portuguese"],
    sports: ["Football", "Volleyball", "Capoeira"],
    festivals: () => ["Carnival", "Festa Junina", "New Year on the coast"],
    foods: ["Feijoada", "Regional street foods", "Cafézinho"],
    television: ["Novelas", "Football broadcasts"],
  },
  {
    match: (g) => g.countryCode === "US",
    languages: ["English", "Spanish (many regions)"],
    sports: ["American football", "Basketball", "Baseball"],
    festivals: () => ["Independence Day", "Thanksgiving", "Halloween"],
    foods: ["Regional American staples", "Fast-casual dining rise"],
    television: ["Network primetime", "Early cable / streaming transition by era"],
  },
  {
    match: (g) => g.countryCode === "GB",
    languages: ["English"],
    sports: ["Football", "Cricket", "Rugby"],
    festivals: () => ["Christmas", "Bonfire Night", "Bank holidays"],
    foods: ["Sunday roast", "Regional pubs & curry house culture"],
    television: ["BBC & ITV", "Premier League broadcasts"],
  },
  {
    match: (g) => g.countryCode === "NG",
    languages: ["English", "Hausa", "Yoruba", "Igbo"],
    sports: ["Football"],
    festivals: () => ["Independence Day", "Regional cultural festivals"],
    foods: ["Jollof rice", "Pounded yam", "Suya"],
    movements: ["Afrobeats & Nollywood"],
    television: ["Nollywood & local broadcast"],
  },
];

const DEFAULT: RegionCulture = {
  match: () => true,
  languages: ["Local languages", "English (often as lingua franca)"],
  sports: ["Football (soccer)", "Regional sports"],
  festivals: (y) => [`Major national holidays around ${y}`, "Local seasonal celebrations"],
  foods: ["Regional cuisine of the birthplace"],
  television: ["National broadcast television of the era"],
};

export function buildCulture(geo: GeoHierarchy, year: number): CultureSnapshot {
  const profile = CULTURES.find((c) => c.match(geo)) ?? DEFAULT;
  const music = getMusicForPlace(geo, year);
  const films = getFilmsForPlace(geo, year);

  const limitations: string[] = [];
  if (!music.regional.length) {
    limitations.push(
      "Detailed city-level chart archives are limited for this place/year — showing national and global layers with clear labels.",
    );
  }
  if (!films.regional.length) {
    limitations.push(
      "Regional cinema highlights may be incomplete for this year; national/global releases are listed separately.",
    );
  }

  return {
    languages: profile.languages,
    music: [...music.regional, ...music.national, ...music.global],
    films: [...films.regional, ...films.national, ...films.global],
    sports: profile.sports,
    festivals: profile.festivals(year),
    foods: profile.foods,
    fashion: profile.fashion,
    movements: profile.movements,
    television: profile.television,
    limitations: limitations.length ? limitations.join(" ") : undefined,
  };
}
