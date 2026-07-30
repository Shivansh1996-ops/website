import type { DataScope, MediaItem, MusicTrack } from "../types";

function listenLinks(title: string, artist: string) {
  const q = encodeURIComponent(`${title} ${artist}`);
  return {
    spotifySearchUrl: `https://open.spotify.com/search/${q}`,
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${q}`,
  };
}

type ChartEntry = { title: string; artist: string; year: number; genre?: string };

/** Curated landmark charts by region key — used when live charts APIs are unavailable.
 * Keys: ISO country, or region tags like IN-SOUTH, GLOBAL. Years are representative.
 * Never presented as exact Billboard rank without source label.
 */
const GLOBAL_BY_YEAR: Record<number, ChartEntry[]> = {
  1990: [{ title: "Nothing Compares 2 U", artist: "Sinéad O'Connor", year: 1990 }],
  1991: [{ title: "(Everything I Do) I Do It for You", artist: "Bryan Adams", year: 1991 }],
  1992: [{ title: "I Will Always Love You", artist: "Whitney Houston", year: 1992 }],
  1993: [{ title: "I'd Do Anything for Love", artist: "Meat Loaf", year: 1993 }],
  1994: [{ title: "The Sign", artist: "Ace of Base", year: 1994 }],
  1995: [{ title: "Gangsta's Paradise", artist: "Coolio", year: 1995 }],
  1996: [{ title: "Macarena", artist: "Los Del Rio", year: 1996 }],
  1997: [{ title: "Candle in the Wind 1997", artist: "Elton John", year: 1997 }],
  1998: [{ title: "My Heart Will Go On", artist: "Celine Dion", year: 1998 }],
  1999: [{ title: "...Baby One More Time", artist: "Britney Spears", year: 1999 }],
  2000: [{ title: "Breathe", artist: "Faith Hill", year: 2000 }],
  2001: [{ title: "Hanging by a Moment", artist: "Lifehouse", year: 2001 }],
  2002: [{ title: "How You Remind Me", artist: "Nickelback", year: 2002 }],
  2003: [{ title: "In da Club", artist: "50 Cent", year: 2003 }],
  2004: [{ title: "Yeah!", artist: "Usher", year: 2004 }],
  2005: [{ title: "We Belong Together", artist: "Mariah Carey", year: 2005 }],
  2006: [{ title: "Bad Day", artist: "Daniel Powter", year: 2006 }],
  2007: [{ title: "Irreplaceable", artist: "Beyoncé", year: 2007 }],
  2008: [{ title: "Low", artist: "Flo Rida", year: 2008 }],
  2009: [{ title: "Boom Boom Pow", artist: "The Black Eyed Peas", year: 2009 }],
  2010: [{ title: "Tik Tok", artist: "Kesha", year: 2010 }],
  2011: [{ title: "Rolling in the Deep", artist: "Adele", year: 2011 }],
  2012: [{ title: "Somebody That I Used to Know", artist: "Gotye", year: 2012 }],
  2013: [{ title: "Thrift Shop", artist: "Macklemore & Ryan Lewis", year: 2013 }],
  2014: [{ title: "Happy", artist: "Pharrell Williams", year: 2014 }],
  2015: [{ title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", year: 2015 }],
  2016: [{ title: "Love Yourself", artist: "Justin Bieber", year: 2016 }],
  2017: [{ title: "Shape of You", artist: "Ed Sheeran", year: 2017 }],
  2018: [{ title: "God's Plan", artist: "Drake", year: 2018 }],
  2019: [{ title: "Old Town Road", artist: "Lil Nas X", year: 2019 }],
  2020: [{ title: "Blinding Lights", artist: "The Weeknd", year: 2020 }],
  2021: [{ title: "drivers license", artist: "Olivia Rodrigo", year: 2021 }],
  2022: [{ title: "As It Was", artist: "Harry Styles", year: 2022 }],
  2023: [{ title: "Last Night", artist: "Morgan Wallen", year: 2023 }],
  2024: [{ title: "Espresso", artist: "Sabrina Carpenter", year: 2024 }],
};

const REGIONAL: Record<string, Record<number, ChartEntry[]>> = {
  IN: {
    1995: [
      { title: "Tujhe Dekha To", artist: "Lata Mangeshkar & Kumar Sanu", year: 1995, genre: "Filmi" },
      { title: "Ho Gaya Hai Tujhko", artist: "Lata Mangeshkar & Udit Narayan", year: 1995, genre: "Filmi" },
    ],
    1998: [
      { title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh & Sapna Awasthi", year: 1998, genre: "Filmi" },
    ],
    2001: [
      { title: "Mitwa", artist: "Shankar Mahadevan et al.", year: 2001, genre: "Filmi" },
      { title: "Koi Kahe Kehta Rahe", artist: "Shaan / KK / Vasundhara Das", year: 2001, genre: "Filmi" },
    ],
    2003: [
      { title: "Kal Ho Naa Ho", artist: "Sonu Nigam", year: 2003, genre: "Filmi" },
    ],
    2007: [
      { title: "Mauja Hi Mauja", artist: "Mika Singh", year: 2007, genre: "Filmi" },
    ],
    2009: [
      { title: "All Izz Well", artist: "Sonu Nigam / Shaan / Swanand Kirkire", year: 2009, genre: "Filmi" },
    ],
    2011: [
      { title: "Chammak Challo", artist: "Akon & Hamsika Iyer", year: 2011, genre: "Filmi" },
    ],
    2013: [
      { title: "Tum Hi Ho", artist: "Arijit Singh", year: 2013, genre: "Filmi" },
    ],
    2015: [
      { title: "Gerua", artist: "Arijit Singh & Antara Mitra", year: 2015, genre: "Filmi" },
    ],
    2017: [
      { title: "Shape of You", artist: "Ed Sheeran", year: 2017 },
      { title: "Nashe Si Chadh Gayi", artist: "Arijit Singh", year: 2017, genre: "Filmi" },
    ],
    2019: [
      { title: "Ghungroo", artist: "Arijit Singh & Shilpa Rao", year: 2019, genre: "Filmi" },
    ],
    2020: [
      { title: "Dil Bechara", artist: "A.R. Rahman", year: 2020, genre: "Filmi" },
    ],
    2022: [
      { title: "Kesariya", artist: "Arijit Singh", year: 2022, genre: "Filmi" },
    ],
    2023: [
      { title: "What Jhumka?", artist: "Arijit Singh / Jonita Gandhi", year: 2023, genre: "Filmi" },
    ],
  },
  "IN-SOUTH": {
    2003: [
      { title: "Oy Oy", artist: "R.P. Patnaik", year: 2003, genre: "Telugu" },
    ],
    2007: [
      { title: "Now You are My Kuljeet", artist: "Devi Sri Prasad", year: 2007, genre: "Telugu" },
    ],
    2010: [
      { title: "Why This Kolaveri Di", artist: "Dhanush", year: 2011, genre: "Tamil" },
    ],
    2015: [
      { title: "Fit sit", artist: "Devi Sri Prasad", year: 2015, genre: "Telugu" },
    ],
    2017: [
      { title: "Maahi Ve", artist: "A.R. Rahman", year: 2017, genre: "Tamil/Hindi" },
    ],
    2018: [
      { title: "Rowdy Baby", artist: "Dhanush & Dhee", year: 2018, genre: "Tamil" },
    ],
    2020: [
      { title: "Butta Bomma", artist: "Armaan Malik", year: 2020, genre: "Telugu" },
    ],
    2021: [
      { title: "Oo Antava Oo Oo Antava", artist: "Indravathi Chauhan", year: 2021, genre: "Telugu" },
    ],
    2022: [
      { title: "Naatu Naatu", artist: "Rahul Sipligunj & Kaala Bhairava", year: 2022, genre: "Telugu" },
    ],
    2023: [
      { title: "Chaleya", artist: "Arijit Singh & Shilpa Rao", year: 2023, genre: "Hindi" },
    ],
  },
  US: {
    2000: [{ title: "Music", artist: "Madonna", year: 2000 }],
    2005: [{ title: "Hollaback Girl", artist: "Gwen Stefani", year: 2005 }],
    2010: [{ title: "OMG", artist: "Usher ft. will.i.am", year: 2010 }],
    2015: [{ title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", year: 2015 }],
    2020: [{ title: "The Box", artist: "Roddy Ricch", year: 2020 }],
  },
  GB: {
    1997: [{ title: "I'll Be Missing You", artist: "Puff Daddy", year: 1997 }],
    2005: [{ title: "You're Beautiful", artist: "James Blunt", year: 2005 }],
    2010: [{ title: "Love the Way You Lie", artist: "Eminem ft. Rihanna", year: 2010 }],
    2017: [{ title: "Shape of You", artist: "Ed Sheeran", year: 2017 }],
  },
  JP: {
    2000: [{ title: "Tsunami", artist: "Southern All Stars", year: 2000 }],
    2007: [{ title: "Flavor of Life", artist: "Utada Hikaru", year: 2007 }],
    2016: [{ title: "PPAP", artist: "Pikotaro", year: 2016 }],
    2019: [{ title: "Pretender", artist: "Official髭男dism", year: 2019 }],
  },
  BR: {
    2000: [{ title: "A Lua Q Eu Te Dei", artist: "Ivete Sangalo", year: 2000 }],
    2010: [{ title: "Ai Se Eu Te Pego", artist: "Michel Teló", year: 2011 }],
    2017: [{ title: "Vai Malandra", artist: "Anitta", year: 2017 }],
  },
  KR: {
    2012: [{ title: "Gangnam Style", artist: "PSY", year: 2012 }],
    2018: [{ title: "IDOL", artist: "BTS", year: 2018 }],
    2020: [{ title: "Dynamite", artist: "BTS", year: 2020 }],
  },
  NG: {
    2010: [{ title: "Yahooze", artist: "Olamide", year: 2010 }],
    2016: [{ title: "Panda", artist: "Desiigner", year: 2016 }],
    2019: [{ title: "Fall", artist: "Davido", year: 2019 }],
    2022: [{ title: "Calm Down", artist: "Rema", year: 2022 }],
  },
};

const FILMS_GLOBAL: Record<number, MediaItem[]> = {
  1997: [{ title: "Titanic", year: 1997, type: "film", regionLabel: "Global", scope: "global" }],
  1999: [{ title: "The Matrix", year: 1999, type: "film", regionLabel: "Global", scope: "global" }],
  2001: [{ title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, type: "film", regionLabel: "Global", scope: "global" }],
  2003: [{ title: "Finding Nemo", year: 2003, type: "film", regionLabel: "Global", scope: "global" }],
  2008: [{ title: "The Dark Knight", year: 2008, type: "film", regionLabel: "Global", scope: "global" }],
  2009: [{ title: "Avatar", year: 2009, type: "film", regionLabel: "Global", scope: "global" }],
  2012: [{ title: "The Avengers", year: 2012, type: "film", regionLabel: "Global", scope: "global" }],
  2015: [{ title: "Star Wars: The Force Awakens", year: 2015, type: "film", regionLabel: "Global", scope: "global" }],
  2018: [{ title: "Black Panther", year: 2018, type: "film", regionLabel: "Global", scope: "global" }],
  2019: [{ title: "Avengers: Endgame", year: 2019, type: "film", regionLabel: "Global", scope: "global" }],
  2020: [{ title: "Parasite (global awards era)", year: 2019, type: "film", regionLabel: "Global", scope: "global" }],
  2022: [{ title: "Avatar: The Way of Water", year: 2022, type: "film", regionLabel: "Global", scope: "global" }],
  2023: [{ title: "Barbie / Oppenheimer", year: 2023, type: "film", regionLabel: "Global", scope: "global" }],
};

const FILMS_REGIONAL: Record<string, Record<number, MediaItem[]>> = {
  IN: {
    1995: [{ title: "Dilwale Dulhania Le Jayenge", year: 1995, type: "film", regionLabel: "India", scope: "national" }],
    2001: [{ title: "Lagaan", year: 2001, type: "film", regionLabel: "India", scope: "national" }],
    2003: [{ title: "Kal Ho Naa Ho", year: 2003, type: "film", regionLabel: "India", scope: "national" }],
    2009: [{ title: "3 Idiots", year: 2009, type: "film", regionLabel: "India", scope: "national" }],
    2013: [{ title: "Chennai Express", year: 2013, type: "film", regionLabel: "India", scope: "national" }],
    2016: [{ title: "Dangal", year: 2016, type: "film", regionLabel: "India", scope: "national" }],
    2018: [{ title: "Baahubali 2: The Conclusion", year: 2017, type: "film", regionLabel: "India", scope: "national" }],
    2022: [{ title: "RRR", year: 2022, type: "film", regionLabel: "India", scope: "national" }],
    2023: [{ title: "Jawan", year: 2023, type: "film", regionLabel: "India", scope: "national" }],
  },
  "IN-SOUTH": {
    2003: [{ title: "Okkadu", year: 2003, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2009: [{ title: "Magadheera", year: 2009, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2015: [{ title: "Baahubali: The Beginning", year: 2015, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2018: [{ title: "Mahanati", year: 2018, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2021: [{ title: "Pushpa: The Rise", year: 2021, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2022: [{ title: "RRR", year: 2022, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
    2023: [{ title: "Dasara", year: 2023, type: "film", regionLabel: "Telugu cinema", scope: "regional" }],
  },
  JP: {
    2001: [{ title: "Spirited Away", year: 2001, type: "film", regionLabel: "Japan", scope: "national" }],
    2016: [{ title: "Your Name", year: 2016, type: "film", regionLabel: "Japan", scope: "national" }],
  },
  KR: {
    2019: [{ title: "Parasite", year: 2019, type: "film", regionLabel: "South Korea", scope: "national" }],
    2021: [{ title: "Squid Game (TV)", year: 2021, type: "tv", regionLabel: "South Korea", scope: "national" }],
  },
  BR: {
    2002: [{ title: "City of God", year: 2002, type: "film", regionLabel: "Brazil", scope: "national" }],
  },
};

function nearestYearEntries<T>(map: Record<number, T[]>, year: number, window = 3): { year: number; items: T[] } | null {
  if (map[year]) return { year, items: map[year] };
  for (let d = 1; d <= window; d++) {
    if (map[year - d]) return { year: year - d, items: map[year - d] };
    if (map[year + d]) return { year: year + d, items: map[year + d] };
  }
  const years = Object.keys(map).map(Number).sort((a, b) => Math.abs(a - year) - Math.abs(b - year));
  if (!years.length) return null;
  return { year: years[0], items: map[years[0]] };
}

function toTracks(
  entries: ChartEntry[],
  regionLabel: string,
  scope: DataScope,
  note?: string,
): MusicTrack[] {
  return entries.map((e) => ({
    ...e,
    regionLabel,
    scope,
    note,
    ...listenLinks(e.title, e.artist),
  }));
}

function isSouthIndia(state?: string): boolean {
  if (!state) return false;
  const s = state.toLowerCase();
  return ["telangana", "andhra", "tamil nadu", "karnataka", "kerala", "puducherry"].some((x) => s.includes(x));
}

export function resolveMusicCharts(opts: {
  year: number;
  countryCode: string;
  state?: string;
  city: string;
}): { regional: MusicTrack[]; national: MusicTrack[]; global: MusicTrack[] } {
  const { year, countryCode, state, city } = opts;
  const cc = countryCode.toUpperCase();

  const globalHit = nearestYearEntries(GLOBAL_BY_YEAR, year, 2);
  const global = globalHit
    ? toTracks(globalHit.items, "Global charts", "global", globalHit.year !== year ? `Closest chart year: ${globalHit.year}` : "Year-defining global hit (curated landmark chart)")
    : [];

  const nationalHit = nearestYearEntries(REGIONAL[cc] ?? {}, year, 4);
  const national = nationalHit
    ? toTracks(nationalHit.items, `${cc} national`, "national", nationalHit.year !== year ? `Closest available national chart year: ${nationalHit.year}` : "National landmark track for this era")
    : [];

  let regional: MusicTrack[] = [];
  if (cc === "IN" && isSouthIndia(state)) {
    const south = nearestYearEntries(REGIONAL["IN-SOUTH"], year, 4);
    if (south) {
      regional = toTracks(
        south.items,
        `${state || "South India"} / regional cinema music`,
        "regional",
        south.year !== year
          ? `Closest regional chart year: ${south.year}. Exact city chart for ${city} unavailable — showing regional cinema hits.`
          : `Regional cinema hits around ${city}. Exact city radio charts unavailable.`,
      );
    }
  }

  if (!regional.length && national.length) {
    regional = national.map((t) => ({
      ...t,
      scope: "regional" as const,
      regionLabel: `${city} region (national fallback)`,
      note: `Exact city charts for ${city} unavailable. Showing national-era tracks as the closest reliable layer.`,
    }));
  }

  if (!regional.length) {
    regional = global.map((t) => ({
      ...t,
      scope: "regional" as const,
      regionLabel: `${city} (global fallback)`,
      note: `Regional chart data unavailable for ${city}. Showing global context instead — clearly labeled.`,
    }));
  }

  return { regional, national: national.length ? national : global.slice(0, 1), global };
}

export function resolveCinema(opts: {
  year: number;
  countryCode: string;
  state?: string;
}): { regional: MediaItem[]; national: MediaItem[]; global: MediaItem[] } {
  const { year, countryCode, state } = opts;
  const cc = countryCode.toUpperCase();
  const globalHit = nearestYearEntries(FILMS_GLOBAL, year, 3);
  const global = globalHit?.items.map((f) => ({
    ...f,
    note: globalHit.year !== year ? `Closest film year: ${globalHit.year}` : undefined,
  })) ?? [];

  const nationalHit = nearestYearEntries(FILMS_REGIONAL[cc] ?? {}, year, 4);
  const national = nationalHit?.items.map((f) => ({
    ...f,
    note: nationalHit.year !== year ? `Closest national film year: ${nationalHit.year}` : undefined,
  })) ?? [];

  let regional: MediaItem[] = [];
  if (cc === "IN" && isSouthIndia(state)) {
    const south = nearestYearEntries(FILMS_REGIONAL["IN-SOUTH"], year, 4);
    regional = south?.items.map((f) => ({
      ...f,
      note: south.year !== year ? `Closest regional film year: ${south.year}` : "Regional cinema landmark",
    })) ?? [];
  }
  if (!regional.length) {
    regional = national.length
      ? national.map((f) => ({ ...f, scope: "regional" as const, note: "Regional list unavailable — national cinema fallback." }))
      : global.map((f) => ({ ...f, scope: "regional" as const, note: "Regional cinema data unavailable — global fallback." }));
  }

  return { regional, national: national.length ? national : global, global };
}
