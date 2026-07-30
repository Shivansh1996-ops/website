import type { DataScope, GeoHierarchy, MusicTrack } from "./types";

interface ChartSeed {
  title: string;
  artist: string;
  yearFrom: number;
  yearTo: number;
  countries?: string[]; // ISO codes; empty = global
  regions?: string[]; // state/region lowercase match
  scope: DataScope;
  chartNote?: string;
}

/**
 * Curated historical chart seeds spanning decades & regions.
 * Links resolve to Spotify / YouTube search so users can listen immediately.
 * Not invented "facts" — labeled as era-defining / chart-associated tracks.
 */
const CHART_SEEDS: ChartSeed[] = [
  // Global classics by era
  { title: "Billie Jean", artist: "Michael Jackson", yearFrom: 1983, yearTo: 1984, scope: "global", chartNote: "Global chart phenomenon" },
  { title: "Like a Prayer", artist: "Madonna", yearFrom: 1989, yearTo: 1990, scope: "global" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", yearFrom: 1991, yearTo: 1992, scope: "global" },
  { title: "Wonderwall", artist: "Oasis", yearFrom: 1995, yearTo: 1996, scope: "global" },
  { title: "Wannabe", artist: "Spice Girls", yearFrom: 1996, yearTo: 1997, scope: "global" },
  { title: "My Heart Will Go On", artist: "Celine Dion", yearFrom: 1997, yearTo: 1998, scope: "global" },
  { title: "...Baby One More Time", artist: "Britney Spears", yearFrom: 1998, yearTo: 1999, scope: "global" },
  { title: "Smooth", artist: "Santana ft. Rob Thomas", yearFrom: 1999, yearTo: 2000, scope: "global" },
  { title: "Beautiful Day", artist: "U2", yearFrom: 2000, yearTo: 2001, scope: "global" },
  { title: "Stan", artist: "Eminem", yearFrom: 2000, yearTo: 2001, scope: "global" },
  { title: "Crazy in Love", artist: "Beyoncé", yearFrom: 2003, yearTo: 2004, scope: "global" },
  { title: "Hey Ya!", artist: "OutKast", yearFrom: 2003, yearTo: 2004, scope: "global" },
  { title: "Mr. Brightside", artist: "The Killers", yearFrom: 2004, yearTo: 2005, scope: "global" },
  { title: "Rehab", artist: "Amy Winehouse", yearFrom: 2006, yearTo: 2007, scope: "global" },
  { title: "Umbrella", artist: "Rihanna", yearFrom: 2007, yearTo: 2008, scope: "global" },
  { title: "Viva La Vida", artist: "Coldplay", yearFrom: 2008, yearTo: 2009, scope: "global" },
  { title: "Poker Face", artist: "Lady Gaga", yearFrom: 2008, yearTo: 2009, scope: "global" },
  { title: "Rolling in the Deep", artist: "Adele", yearFrom: 2010, yearTo: 2011, scope: "global" },
  { title: "Somebody That I Used to Know", artist: "Gotye", yearFrom: 2011, yearTo: 2012, scope: "global" },
  { title: "Get Lucky", artist: "Daft Punk", yearFrom: 2013, yearTo: 2014, scope: "global" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", yearFrom: 2014, yearTo: 2015, scope: "global" },
  { title: "Shape of You", artist: "Ed Sheeran", yearFrom: 2017, yearTo: 2018, scope: "global" },
  { title: "Old Town Road", artist: "Lil Nas X", yearFrom: 2019, yearTo: 2019, scope: "global" },
  { title: "Blinding Lights", artist: "The Weeknd", yearFrom: 2019, yearTo: 2021, scope: "global" },
  { title: "As It Was", artist: "Harry Styles", yearFrom: 2022, yearTo: 2023, scope: "global" },

  // India — national / film music eras
  { title: "Pehla Nasha", artist: "Udit Narayan", yearFrom: 1991, yearTo: 1993, countries: ["IN"], scope: "national", chartNote: "Hindi film era defining track" },
  { title: "Tujhe Dekha To", artist: "Lata Mangeshkar & Kumar Sanu", yearFrom: 1995, yearTo: 1996, countries: ["IN"], scope: "national" },
  { title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", yearFrom: 1998, yearTo: 1999, countries: ["IN"], scope: "national" },
  { title: "Kal Ho Naa Ho", artist: "Sonu Nigam", yearFrom: 2003, yearTo: 2004, countries: ["IN"], scope: "national" },
  { title: "Kajra Re", artist: "Alisha Chinai, Shankar Mahadevan & Javed Ali", yearFrom: 2005, yearTo: 2006, countries: ["IN"], scope: "national" },
  { title: "Jai Ho", artist: "A.R. Rahman", yearFrom: 2008, yearTo: 2009, countries: ["IN"], scope: "national" },
  { title: "Why This Kolaveri Di", artist: "Dhanush", yearFrom: 2011, yearTo: 2012, countries: ["IN"], scope: "national" },
  { title: "Tum Hi Ho", artist: "Arijit Singh", yearFrom: 2013, yearTo: 2014, countries: ["IN"], scope: "national" },
  { title: "Gerua", artist: "Arijit Singh & Antara Mitra", yearFrom: 2015, yearTo: 2016, countries: ["IN"], scope: "national" },
  { title: "Kesariya", artist: "Arijit Singh", yearFrom: 2022, yearTo: 2023, countries: ["IN"], scope: "national" },

  // Telugu / Hyderabad / Telangana / Andhra
  { title: "Pillaa Raa", artist: "Anurag Kulkarni", yearFrom: 2019, yearTo: 2020, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional", chartNote: "Telugu film chart favorite" },
  { title: "Samajavaragamana", artist: "Sid Sriram", yearFrom: 2019, yearTo: 2020, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Butta Bomma", artist: "Armaan Malik", yearFrom: 2020, yearTo: 2021, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Inkem Inkem Inkem Kaavaale", artist: "Sid Sriram", yearFrom: 2018, yearTo: 2019, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Vachindu", artist: "Devi Sri Prasad", yearFrom: 2005, yearTo: 2007, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Nuvvostanante Nenoddantana", artist: "Devi Sri Prasad", yearFrom: 2005, yearTo: 2006, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Ayyayo", artist: "G. V. Prakash Kumar", yearFrom: 2010, yearTo: 2011, countries: ["IN"], regions: ["telangana", "andhra", "tamil"], scope: "regional" },
  { title: "Oo Antava Oo Oo Antava", artist: "Indravathi Chauhan", yearFrom: 2021, yearTo: 2022, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Chuttamalle", artist: "Shilpa Rao", yearFrom: 2023, yearTo: 2024, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Anaganaga", artist: "S. P. Balasubrahmanyam", yearFrom: 1990, yearTo: 1995, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional", chartNote: "Classic Telugu film melody era" },

  // Tamil
  { title: "Munbe Vaa", artist: "Shreya Ghoshal & Naresh Iyer", yearFrom: 2006, yearTo: 2007, countries: ["IN"], regions: ["tamil"], scope: "regional" },
  { title: "Why This Kolaveri Di", artist: "Dhanush", yearFrom: 2011, yearTo: 2012, countries: ["IN"], regions: ["tamil"], scope: "regional" },
  { title: "Rowdy Baby", artist: "Dhanush & Dhee", yearFrom: 2018, yearTo: 2019, countries: ["IN"], regions: ["tamil"], scope: "regional" },

  // Punjabi / North
  { title: "Tunak Tunak Tun", artist: "Daler Mehndi", yearFrom: 1998, yearTo: 1999, countries: ["IN"], regions: ["punjab", "delhi", "haryana"], scope: "regional" },
  { title: "3 Peg", artist: "Sharry Mann", yearFrom: 2016, yearTo: 2017, countries: ["IN"], regions: ["punjab"], scope: "regional" },

  // US
  { title: "I Will Always Love You", artist: "Whitney Houston", yearFrom: 1992, yearTo: 1993, countries: ["US"], scope: "national" },
  { title: "Yeah!", artist: "Usher", yearFrom: 2004, yearTo: 2005, countries: ["US"], scope: "national" },
  { title: "God's Plan", artist: "Drake", yearFrom: 2018, yearTo: 2018, countries: ["US", "CA"], scope: "national" },

  // UK
  { title: "Don't Look Back in Anger", artist: "Oasis", yearFrom: 1995, yearTo: 1996, countries: ["GB"], scope: "national" },
  { title: "Feel Good Inc.", artist: "Gorillaz", yearFrom: 2005, yearTo: 2006, countries: ["GB"], scope: "national" },

  // Brazil
  { title: "Ai Se Eu Te Pego", artist: "Michel Teló", yearFrom: 2011, yearTo: 2012, countries: ["BR"], scope: "national" },
  { title: "Mas Que Nada", artist: "Sérgio Mendes", yearFrom: 2005, yearTo: 2007, countries: ["BR"], scope: "national" },

  // Japan
  { title: "Pretender", artist: "Official髭男dism", yearFrom: 2019, yearTo: 2020, countries: ["JP"], scope: "national" },
  { title: "Lemon", artist: "Kenshi Yonezu", yearFrom: 2018, yearTo: 2019, countries: ["JP"], scope: "national" },
  { title: "Sakura", artist: "Ikimono-gakari", yearFrom: 2005, yearTo: 2006, countries: ["JP"], scope: "national" },

  // Korea
  { title: "Gangnam Style", artist: "PSY", yearFrom: 2012, yearTo: 2013, countries: ["KR"], scope: "national" },
  { title: "Dynamite", artist: "BTS", yearFrom: 2020, yearTo: 2021, countries: ["KR"], scope: "national" },

  // Nigeria / Afrobeats
  { title: "Essence", artist: "Wizkid ft. Tems", yearFrom: 2020, yearTo: 2021, countries: ["NG"], scope: "national" },
  { title: "Fall", artist: "Davido", yearFrom: 2017, yearTo: 2018, countries: ["NG"], scope: "national" },

  // Mexico / LatAm
  { title: "Despacito", artist: "Luis Fonsi", yearFrom: 2017, yearTo: 2018, countries: ["MX", "PR", "ES", "CO"], scope: "national" },
  { title: "Gasolina", artist: "Daddy Yankee", yearFrom: 2004, yearTo: 2005, countries: ["MX", "PR", "CO", "ES"], scope: "national" },

  // France
  { title: "Alors On Danse", artist: "Stromae", yearFrom: 2009, yearTo: 2011, countries: ["FR", "BE"], scope: "national" },

  // Germany
  { title: "Atemlos durch die Nacht", artist: "Helene Fischer", yearFrom: 2013, yearTo: 2014, countries: ["DE"], scope: "national" },
];

function listenLinks(title: string, artist: string) {
  const q = encodeURIComponent(`${title} ${artist}`);
  return {
    spotifyUrl: `https://open.spotify.com/search/${q}`,
    youtubeUrl: `https://www.youtube.com/results?search_query=${q}`,
  };
}

function regionLabel(scope: DataScope, geo: GeoHierarchy): string {
  if (scope === "local" || scope === "regional") {
    return geo.state ? `${geo.state}, ${geo.country}` : geo.country;
  }
  if (scope === "national") return geo.country;
  return "Global";
}

function matchesRegion(seed: ChartSeed, geo: GeoHierarchy): boolean {
  if (!seed.countries || seed.countries.length === 0) return seed.scope === "global";
  if (!seed.countries.includes(geo.countryCode)) return false;
  if (!seed.regions || seed.regions.length === 0) return true;
  const hay = `${geo.state ?? ""} ${geo.district ?? ""} ${geo.city}`.toLowerCase();
  return seed.regions.some((r) => hay.includes(r));
}

export function getMusicForPlace(geo: GeoHierarchy, year: number): {
  regional: MusicTrack[];
  national: MusicTrack[];
  global: MusicTrack[];
} {
  const toTrack = (seed: ChartSeed): MusicTrack => {
    const links = listenLinks(seed.title, seed.artist);
    return {
      title: seed.title,
      artist: seed.artist,
      year: Math.min(Math.max(year, seed.yearFrom), seed.yearTo),
      regionLabel: regionLabel(seed.scope, geo),
      scope: seed.scope,
      spotifyUrl: links.spotifyUrl,
      youtubeUrl: links.youtubeUrl,
      chartNote: seed.chartNote,
    };
  };

  const inWindow = (s: ChartSeed) => year >= s.yearFrom - 1 && year <= s.yearTo + 2;

  const regional = CHART_SEEDS
    .filter((s) => (s.scope === "regional" || s.scope === "local") && matchesRegion(s, geo) && inWindow(s))
    .map(toTrack);

  const national = CHART_SEEDS
    .filter((s) => s.scope === "national" && matchesRegion(s, geo) && inWindow(s))
    .map(toTrack);

  const global = CHART_SEEDS
    .filter((s) => s.scope === "global" && inWindow(s))
    .map(toTrack);

  // Graceful fallback: nearest year global/national if empty
  const broaden = (scope: DataScope) =>
    CHART_SEEDS
      .filter((s) => s.scope === scope && (scope === "global" || matchesRegion(s, geo)))
      .sort((a, b) => Math.abs(a.yearFrom - year) - Math.abs(b.yearFrom - year))
      .slice(0, 4)
      .map(toTrack);

  return {
    regional: regional.length ? regional.slice(0, 5) : [],
    national: national.length ? national.slice(0, 5) : broaden("national"),
    global: global.length ? global.slice(0, 5) : broaden("global"),
  };
}

/** Optional live enrichment via MusicBrainz recording search (no key). */
export async function enrichWithMusicBrainz(
  tracks: MusicTrack[],
): Promise<MusicTrack[]> {
  // Keep network light — verify first track exists; don't block UX on failures
  try {
    if (!tracks[0]) return tracks;
    const q = encodeURIComponent(`"${tracks[0].title}" AND artist:"${tracks[0].artist}"`);
    const res = await fetch(
      `https://musicbrainz.org/ws/2/recording?query=${q}&fmt=json&limit=1`,
      { headers: { Accept: "application/json", "User-Agent": "BORN-Capsule/1.0 (birth-capsule)" } },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.count > 0) {
        return tracks.map((t, i) =>
          i === 0
            ? { ...t, chartNote: (t.chartNote ? t.chartNote + " · " : "") + "Verified via MusicBrainz catalog" }
            : t,
        );
      }
    }
  } catch {
    // ignore
  }
  return tracks;
}
