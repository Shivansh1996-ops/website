import type { MediaItem, DataScope } from "@/born/types";

function spotifySearch(q: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}
function youtubeSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

function track(
  title: string,
  artist: string,
  year: number,
  region: string,
  scope: DataScope,
  genre?: string,
): MediaItem {
  const q = `${title} ${artist}`;
  return {
    title,
    artistOrCreator: artist,
    year,
    region,
    scope,
    genre,
    spotifyUrl: spotifySearch(q),
    youtubeUrl: youtubeSearch(q),
  };
}

/** Decade-bucketed regional charts — historical, not stereotyped */
type ChartBucket = { from: number; to: number; songs: Omit<MediaItem, "spotifyUrl" | "youtubeUrl" | "scope" | "year" | "region">[] };

const REGIONAL_CHARTS: Record<string, ChartBucket[]> = {
  IN: [
    {
      from: 1990, to: 1999,
      songs: [
        { title: "Tujhe Dekha To", artistOrCreator: "Lata Mangeshkar & Kumar Sanu", genre: "Filmi" },
        { title: "Chaiyya Chaiyya", artistOrCreator: "Sukhwinder Singh", genre: "Filmi" },
        { title: "Dil To Pagal Hai", artistOrCreator: "Lata Mangeshkar & Udit Narayan", genre: "Filmi" },
        { title: "Mundian To Bach Ke", artistOrCreator: "Panjabi MC", genre: "Bhangra" },
      ],
    },
    {
      from: 2000, to: 2009,
      songs: [
        { title: "Kal Ho Naa Ho", artistOrCreator: "Sonu Nigam", genre: "Filmi" },
        { title: "Kajra Re", artistOrCreator: "Alisha Chinai, Shankar Mahadevan & Javed Ali", genre: "Filmi" },
        { title: "Yun Hi Chala Chal", artistOrCreator: "Udit Narayan, Hariharan & Kailash Kher", genre: "Filmi" },
        { title: "Jai Ho", artistOrCreator: "A.R. Rahman & Sukhwinder Singh", genre: "Filmi" },
      ],
    },
    {
      from: 2010, to: 2019,
      songs: [
        { title: "Why This Kolaveri Di", artistOrCreator: "Dhanush", genre: "Tamil pop" },
        { title: "Tum Hi Ho", artistOrCreator: "Arijit Singh", genre: "Filmi" },
        { title: "Badtameez Dil", artistOrCreator: "Benny Dayal & Shefali Alvares", genre: "Filmi" },
        { title: "Ghungroo", artistOrCreator: "Arijit Singh & Shilpa Rao", genre: "Filmi" },
      ],
    },
    {
      from: 2020, to: 2026,
      songs: [
        { title: "Kesariya", artistOrCreator: "Arijit Singh", genre: "Filmi" },
        { title: "Naatu Naatu", artistOrCreator: "Rahul Sipligunj & Kaala Bhairava", genre: "Telugu" },
        { title: "Pasoori", artistOrCreator: "Ali Sethi & Shae Gill", genre: "Punjabi" },
        { title: "What Jhumka?", artistOrCreator: "Pritam, Arijit Singh & Jonita Gandhi", genre: "Filmi" },
      ],
    },
  ],
  US: [
    {
      from: 1990, to: 1999,
      songs: [
        { title: "Smells Like Teen Spirit", artistOrCreator: "Nirvana", genre: "Grunge" },
        { title: "I Will Always Love You", artistOrCreator: "Whitney Houston", genre: "Pop" },
        { title: "Wannabe", artistOrCreator: "Spice Girls", genre: "Pop" },
        { title: "...Baby One More Time", artistOrCreator: "Britney Spears", genre: "Pop" },
      ],
    },
    {
      from: 2000, to: 2009,
      songs: [
        { title: "Crazy in Love", artistOrCreator: "Beyoncé", genre: "R&B" },
        { title: "Hey Ya!", artistOrCreator: "OutKast", genre: "Hip-hop" },
        { title: "Umbrella", artistOrCreator: "Rihanna", genre: "Pop" },
        { title: "I Gotta Feeling", artistOrCreator: "Black Eyed Peas", genre: "Pop" },
      ],
    },
    {
      from: 2010, to: 2019,
      songs: [
        { title: "Rolling in the Deep", artistOrCreator: "Adele", genre: "Pop" },
        { title: "Uptown Funk", artistOrCreator: "Mark Ronson ft. Bruno Mars", genre: "Funk" },
        { title: "Old Town Road", artistOrCreator: "Lil Nas X", genre: "Country-rap" },
        { title: "Blinding Lights", artistOrCreator: "The Weeknd", genre: "Synth-pop" },
      ],
    },
    {
      from: 2020, to: 2026,
      songs: [
        { title: "drivers license", artistOrCreator: "Olivia Rodrigo", genre: "Pop" },
        { title: "As It Was", artistOrCreator: "Harry Styles", genre: "Pop" },
        { title: "Flowers", artistOrCreator: "Miley Cyrus", genre: "Pop" },
        { title: "Espresso", artistOrCreator: "Sabrina Carpenter", genre: "Pop" },
      ],
    },
  ],
  GB: [
    {
      from: 1990, to: 1999,
      songs: [
        { title: "Wonderwall", artistOrCreator: "Oasis", genre: "Britpop" },
        { title: "Angels", artistOrCreator: "Robbie Williams", genre: "Pop" },
        { title: "Wannabe", artistOrCreator: "Spice Girls", genre: "Pop" },
        { title: "Bittersweet Symphony", artistOrCreator: "The Verve", genre: "Rock" },
      ],
    },
    {
      from: 2000, to: 2009,
      songs: [
        { title: "Crazy", artistOrCreator: "Gnarls Barkley", genre: "Soul" },
        { title: "Rehab", artistOrCreator: "Amy Winehouse", genre: "Soul" },
        { title: "Viva la Vida", artistOrCreator: "Coldplay", genre: "Alt-rock" },
        { title: "Poker Face", artistOrCreator: "Lady Gaga", genre: "Pop" },
      ],
    },
    {
      from: 2010, to: 2019,
      songs: [
        { title: "Somebody That I Used to Know", artistOrCreator: "Gotye", genre: "Indie" },
        { title: "Happy", artistOrCreator: "Pharrell Williams", genre: "Pop" },
        { title: "Shape of You", artistOrCreator: "Ed Sheeran", genre: "Pop" },
        { title: "Dance Monkey", artistOrCreator: "Tones and I", genre: "Pop" },
      ],
    },
    {
      from: 2020, to: 2026,
      songs: [
        { title: "Watermelon Sugar", artistOrCreator: "Harry Styles", genre: "Pop" },
        { title: "Easy On Me", artistOrCreator: "Adele", genre: "Pop" },
        { title: "As It Was", artistOrCreator: "Harry Styles", genre: "Pop" },
        { title: "Stick Season", artistOrCreator: "Noah Kahan", genre: "Folk" },
      ],
    },
  ],
  JP: [
    {
      from: 1990, to: 1999,
      songs: [
        { title: "Automatic", artistOrCreator: "Utada Hikaru", genre: "J-pop" },
        { title: "Love Machine", artistOrCreator: "Morning Musume", genre: "J-pop" },
        { title: "Can You Keep A Secret?", artistOrCreator: "Utada Hikaru", genre: "J-pop" },
      ],
    },
    {
      from: 2000, to: 2009,
      songs: [
        { title: "Heavy Rotation", artistOrCreator: "AKB48", genre: "Idol" },
        { title: "Butterfly", artistOrCreator: "Kumi Koda", genre: "J-pop" },
        { title: "Polygamy", artistOrCreator: "Orange Range", genre: "Rock" },
      ],
    },
    {
      from: 2010, to: 2019,
      songs: [
        { title: "PPAP", artistOrCreator: "Pikotaro", genre: "Viral" },
        { title: "Lemon", artistOrCreator: "Kenshi Yonezu", genre: "J-pop" },
        { title: "Pretender", artistOrCreator: "Official Hige Dandism", genre: "J-pop" },
      ],
    },
    {
      from: 2020, to: 2026,
      songs: [
        { title: "Kick Back", artistOrCreator: "Kenshi Yonezu", genre: "J-pop" },
        { title: "Idol", artistOrCreator: "YOASOBI", genre: "J-pop" },
        { title: "Specialz", artistOrCreator: "King Gnu", genre: "Rock" },
      ],
    },
  ],
  BR: [
    {
      from: 1990, to: 2009,
      songs: [
        { title: "Aquarela do Brasil", artistOrCreator: "Gal Costa", genre: "MPB" },
        { title: "Ai Se Eu Te Pego", artistOrCreator: "Michel Teló", genre: "Sertanejo" },
        { title: "Mas Que Nada", artistOrCreator: "Sérgio Mendes", genre: "Bossa" },
      ],
    },
    {
      from: 2010, to: 2026,
      songs: [
        { title: "Lean On", artistOrCreator: "Major Lazer & DJ Snake", genre: "EDM" },
        { title: "Despacito", artistOrCreator: "Luis Fonsi", genre: "Latin" },
        { title: "Envolver", artistOrCreator: "Anitta", genre: "Funk carioca" },
      ],
    },
  ],
  KR: [
    {
      from: 2000, to: 2015,
      songs: [
        { title: "Gee", artistOrCreator: "Girls' Generation", genre: "K-pop" },
        { title: "Fantastic Baby", artistOrCreator: "BIGBANG", genre: "K-pop" },
        { title: "Gangnam Style", artistOrCreator: "PSY", genre: "K-pop" },
      ],
    },
    {
      from: 2016, to: 2026,
      songs: [
        { title: "Dynamite", artistOrCreator: "BTS", genre: "K-pop" },
        { title: "Butter", artistOrCreator: "BTS", genre: "K-pop" },
        { title: "Pink Venom", artistOrCreator: "BLACKPINK", genre: "K-pop" },
      ],
    },
  ],
  NG: [
    {
      from: 2005, to: 2026,
      songs: [
        { title: "Ye", artistOrCreator: "Burna Boy", genre: "Afrobeats" },
        { title: "Essence", artistOrCreator: "Wizkid ft. Tems", genre: "Afrobeats" },
        { title: "Calm Down", artistOrCreator: "Rema", genre: "Afrobeats" },
        { title: "Love Nwantiti", artistOrCreator: "CKay", genre: "Afrobeats" },
      ],
    },
  ],
};

const GLOBAL_CHARTS: ChartBucket[] = [
  {
    from: 1990, to: 1999,
    songs: [
      { title: "My Heart Will Go On", artistOrCreator: "Celine Dion", genre: "Pop" },
      { title: "Candle in the Wind 1997", artistOrCreator: "Elton John", genre: "Pop" },
      { title: "Macarena", artistOrCreator: "Los del Río", genre: "Dance" },
    ],
  },
  {
    from: 2000, to: 2009,
    songs: [
      { title: "Billie Jean", artistOrCreator: "Michael Jackson", genre: "Pop" },
      { title: "Hips Don't Lie", artistOrCreator: "Shakira", genre: "Latin" },
      { title: "Single Ladies", artistOrCreator: "Beyoncé", genre: "R&B" },
    ],
  },
  {
    from: 2010, to: 2019,
    songs: [
      { title: "Despacito", artistOrCreator: "Luis Fonsi & Daddy Yankee", genre: "Latin" },
      { title: "Shape of You", artistOrCreator: "Ed Sheeran", genre: "Pop" },
      { title: "See You Again", artistOrCreator: "Wiz Khalifa ft. Charlie Puth", genre: "Hip-hop" },
    ],
  },
  {
    from: 2020, to: 2026,
    songs: [
      { title: "Blinding Lights", artistOrCreator: "The Weeknd", genre: "Synth-pop" },
      { title: "As It Was", artistOrCreator: "Harry Styles", genre: "Pop" },
      { title: "Flowers", artistOrCreator: "Miley Cyrus", genre: "Pop" },
    ],
  },
];

/** Telangana / Andhra / South India overlays for Hyderabad-class births */
const STATE_MUSIC: Record<string, ChartBucket[]> = {
  telangana: [
    {
      from: 1990, to: 2026,
      songs: [
        { title: "Naatu Naatu", artistOrCreator: "Rahul Sipligunj & Kaala Bhairava", genre: "Telugu" },
        { title: "Butta Bomma", artistOrCreator: "Armaan Malik", genre: "Telugu" },
        { title: "Samajavaragamana", artistOrCreator: "Sid Sriram", genre: "Telugu" },
        { title: "Inkem Inkem", artistOrCreator: "Sid Sriram", genre: "Telugu" },
      ],
    },
  ],
  "andhra pradesh": [
    {
      from: 1990, to: 2026,
      songs: [
        { title: "Naatu Naatu", artistOrCreator: "Rahul Sipligunj & Kaala Bhairava", genre: "Telugu" },
        { title: "Butta Bomma", artistOrCreator: "Armaan Malik", genre: "Telugu" },
        { title: "Vachinde", artistOrCreator: "Madhu Priya", genre: "Telugu" },
      ],
    },
  ],
  "tamil nadu": [
    {
      from: 1990, to: 2026,
      songs: [
        { title: "Why This Kolaveri Di", artistOrCreator: "Dhanush", genre: "Tamil" },
        { title: "Rowdy Baby", artistOrCreator: "Dhanush & Dhee", genre: "Tamil" },
        { title: "Arabic Kuthu", artistOrCreator: "Anirudh Ravichander", genre: "Tamil" },
      ],
    },
  ],
  maharashtra: [
    {
      from: 1990, to: 2026,
      songs: [
        { title: "Zingaat", artistOrCreator: "Ajay-Atul", genre: "Marathi" },
        { title: "Apsara Aali", artistOrCreator: "Ajay-Atul", genre: "Marathi" },
      ],
    },
  ],
};

function fromBuckets(
  buckets: ChartBucket[],
  year: number,
  region: string,
  scope: DataScope,
): MediaItem[] {
  const bucket = buckets.find((b) => year >= b.from && year <= b.to) ?? buckets[buckets.length - 1];
  if (!bucket) return [];
  return bucket.songs.map((s) =>
    track(s.title, s.artistOrCreator ?? "Unknown", year, region, scope, s.genre),
  );
}

export function getRegionalMusic(opts: {
  countryCode: string;
  state?: string;
  year: number;
}): { regional: MediaItem[]; national: MediaItem[]; global: MediaItem[]; note?: string } {
  const { countryCode, state, year } = opts;
  const cc = countryCode.toUpperCase();
  const nationalBuckets = REGIONAL_CHARTS[cc];
  const stateKey = state?.toLowerCase() ?? "";
  const stateBuckets = STATE_MUSIC[stateKey];

  const regional = stateBuckets
    ? fromBuckets(stateBuckets, year, state ?? cc, "regional")
    : nationalBuckets
      ? fromBuckets(nationalBuckets, year, cc, "national")
      : [];

  const national = nationalBuckets
    ? fromBuckets(nationalBuckets, year, cc, "national")
    : [];

  const global = fromBuckets(GLOBAL_CHARTS, year, "Global", "global");

  let note: string | undefined;
  if (!nationalBuckets) {
    note = `Detailed chart archives for ${cc} are still being expanded. Showing global era hits with listen links — regional coverage improves continuously.`;
  } else if (!stateBuckets && state) {
    note = `State-level charts for ${state} are limited; showing national charts for ${cc} with listen links.`;
  }

  return { regional: regional.length ? regional : national, national, global, note };
}

/** Enrich via MusicBrainz recording search when online */
export async function enrichTrackMeta(title: string, artist: string): Promise<{ mbid?: string } | null> {
  try {
    const q = `recording:"${title}" AND artist:"${artist}"`;
    const url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(q)}&fmt=json&limit=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const id = data?.recordings?.[0]?.id;
    return id ? { mbid: id } : null;
  } catch {
    return null;
  }
}
