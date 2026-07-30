import type { MediaItem, DataScope } from "@/born/types";

function youtubeSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " trailer")}`;
}

function film(
  title: string,
  creator: string,
  year: number,
  region: string,
  scope: DataScope,
): MediaItem {
  return {
    title,
    artistOrCreator: creator,
    year,
    region,
    scope,
    youtubeUrl: youtubeSearch(title),
    spotifyUrl: undefined,
  };
}

type FilmBucket = { from: number; to: number; films: { title: string; artistOrCreator: string }[] };

const REGIONAL_FILMS: Record<string, FilmBucket[]> = {
  IN: [
    {
      from: 1990, to: 1999,
      films: [
        { title: "Dilwale Dulhania Le Jayenge", artistOrCreator: "Aditya Chopra" },
        { title: "Kuch Kuch Hota Hai", artistOrCreator: "Karan Johar" },
        { title: "Satya", artistOrCreator: "Ram Gopal Varma" },
      ],
    },
    {
      from: 2000, to: 2009,
      films: [
        { title: "Lagaan", artistOrCreator: "Ashutosh Gowariker" },
        { title: "3 Idiots", artistOrCreator: "Rajkumar Hirani" },
        { title: "Rang De Basanti", artistOrCreator: "Rakeysh Omprakash Mehra" },
      ],
    },
    {
      from: 2010, to: 2019,
      films: [
        { title: "Baahubali: The Beginning", artistOrCreator: "S.S. Rajamouli" },
        { title: "Dangal", artistOrCreator: "Nitesh Tiwari" },
        { title: "Gully Boy", artistOrCreator: "Zoya Akhtar" },
      ],
    },
    {
      from: 2020, to: 2026,
      films: [
        { title: "RRR", artistOrCreator: "S.S. Rajamouli" },
        { title: "Pathaan", artistOrCreator: "Siddharth Anand" },
        { title: "Jawan", artistOrCreator: "Atlee" },
      ],
    },
  ],
  US: [
    {
      from: 1990, to: 1999,
      films: [
        { title: "Titanic", artistOrCreator: "James Cameron" },
        { title: "The Matrix", artistOrCreator: "The Wachowskis" },
        { title: "Forrest Gump", artistOrCreator: "Robert Zemeckis" },
      ],
    },
    {
      from: 2000, to: 2009,
      films: [
        { title: "The Lord of the Rings: The Fellowship of the Ring", artistOrCreator: "Peter Jackson" },
        { title: "The Dark Knight", artistOrCreator: "Christopher Nolan" },
        { title: "Avatar", artistOrCreator: "James Cameron" },
      ],
    },
    {
      from: 2010, to: 2019,
      films: [
        { title: "Inception", artistOrCreator: "Christopher Nolan" },
        { title: "Black Panther", artistOrCreator: "Ryan Coogler" },
        { title: "Avengers: Endgame", artistOrCreator: "Anthony & Joe Russo" },
      ],
    },
    {
      from: 2020, to: 2026,
      films: [
        { title: "Oppenheimer", artistOrCreator: "Christopher Nolan" },
        { title: "Everything Everywhere All at Once", artistOrCreator: "Daniels" },
        { title: "Dune", artistOrCreator: "Denis Villeneuve" },
      ],
    },
  ],
  JP: [
    {
      from: 1990, to: 2026,
      films: [
        { title: "Spirited Away", artistOrCreator: "Hayao Miyazaki" },
        { title: "Your Name", artistOrCreator: "Makoto Shinkai" },
        { title: "Parasite", artistOrCreator: "Bong Joon-ho" },
      ],
    },
  ],
  KR: [
    {
      from: 2000, to: 2026,
      films: [
        { title: "Oldboy", artistOrCreator: "Park Chan-wook" },
        { title: "Parasite", artistOrCreator: "Bong Joon-ho" },
        { title: "Train to Busan", artistOrCreator: "Yeon Sang-ho" },
      ],
    },
  ],
  GB: [
    {
      from: 1990, to: 2026,
      films: [
        { title: "Trainspotting", artistOrCreator: "Danny Boyle" },
        { title: "Harry Potter and the Philosopher's Stone", artistOrCreator: "Chris Columbus" },
        { title: "Skyfall", artistOrCreator: "Sam Mendes" },
      ],
    },
  ],
  BR: [
    {
      from: 1990, to: 2026,
      films: [
        { title: "City of God", artistOrCreator: "Fernando Meirelles" },
        { title: "Central Station", artistOrCreator: "Walter Salles" },
      ],
    },
  ],
};

const GLOBAL_FILMS: FilmBucket[] = REGIONAL_FILMS.US;

const STATE_FILMS: Record<string, FilmBucket[]> = {
  telangana: [
    {
      from: 1990, to: 2026,
      films: [
        { title: "Baahubali: The Beginning", artistOrCreator: "S.S. Rajamouli" },
        { title: "RRR", artistOrCreator: "S.S. Rajamouli" },
        { title: "Pushpa: The Rise", artistOrCreator: "Sukumar" },
      ],
    },
  ],
  "andhra pradesh": [
    {
      from: 1990, to: 2026,
      films: [
        { title: "Baahubali: The Beginning", artistOrCreator: "S.S. Rajamouli" },
        { title: "RRR", artistOrCreator: "S.S. Rajamouli" },
        { title: "Ala Vaikunthapurramuloo", artistOrCreator: "Trivikram Srinivas" },
      ],
    },
  ],
  "tamil nadu": [
    {
      from: 1990, to: 2026,
      films: [
        { title: "Enthiran", artistOrCreator: "S. Shankar" },
        { title: "Vikram", artistOrCreator: "Lokesh Kanagaraj" },
        { title: "Jailer", artistOrCreator: "Nelson Dilipkumar" },
      ],
    },
  ],
};

function fromBuckets(
  buckets: FilmBucket[],
  year: number,
  region: string,
  scope: DataScope,
): MediaItem[] {
  const bucket = buckets.find((b) => year >= b.from && year <= b.to) ?? buckets[buckets.length - 1];
  if (!bucket) return [];
  return bucket.films.map((f) => film(f.title, f.artistOrCreator, year, region, scope));
}

export function getRegionalFilms(opts: {
  countryCode: string;
  state?: string;
  year: number;
}): { regional: MediaItem[]; national: MediaItem[]; global: MediaItem[]; note?: string } {
  const cc = opts.countryCode.toUpperCase();
  const stateKey = opts.state?.toLowerCase() ?? "";
  const stateBuckets = STATE_FILMS[stateKey];
  const nationalBuckets = REGIONAL_FILMS[cc];

  const regional = stateBuckets
    ? fromBuckets(stateBuckets, opts.year, opts.state ?? cc, "regional")
    : nationalBuckets
      ? fromBuckets(nationalBuckets, opts.year, cc, "national")
      : [];
  const national = nationalBuckets
    ? fromBuckets(nationalBuckets, opts.year, cc, "national")
    : [];
  const global = fromBuckets(GLOBAL_FILMS, opts.year, "Global", "global");

  let note: string | undefined;
  if (!nationalBuckets) {
    note = `Regional cinema archives for ${cc} are expanding. Showing global era releases with trailer links.`;
  }

  return { regional: regional.length ? regional : national, national, global, note };
}
