import type { DataScope, GeoHierarchy, MovieRelease } from "./types";

interface FilmSeed {
  title: string;
  year: number;
  countries?: string[];
  regions?: string[];
  scope: DataScope;
  overview?: string;
}

const FILM_SEEDS: FilmSeed[] = [
  { title: "Titanic", year: 1997, scope: "global", overview: "Global box-office landmark." },
  { title: "The Matrix", year: 1999, scope: "global" },
  { title: "Gladiator", year: 2000, scope: "global" },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, scope: "global" },
  { title: "Finding Nemo", year: 2003, scope: "global" },
  { title: "The Dark Knight", year: 2008, scope: "global" },
  { title: "Avatar", year: 2009, scope: "global" },
  { title: "Inception", year: 2010, scope: "global" },
  { title: "Frozen", year: 2013, scope: "global" },
  { title: "Parasite", year: 2019, scope: "global" },
  { title: "Everything Everywhere All at Once", year: 2022, scope: "global" },

  { title: "Dilwale Dulhania Le Jayenge", year: 1995, countries: ["IN"], scope: "national" },
  { title: "Kuch Kuch Hota Hai", year: 1998, countries: ["IN"], scope: "national" },
  { title: "Lagaan", year: 2001, countries: ["IN"], scope: "national" },
  { title: "3 Idiots", year: 2009, countries: ["IN"], scope: "national" },
  { title: "Dangal", year: 2016, countries: ["IN"], scope: "national" },
  { title: "RRR", year: 2022, countries: ["IN"], scope: "national", overview: "Telugu epic with global reach." },

  { title: "Pokiri", year: 2006, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Magadheera", year: 2009, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Baahubali: The Beginning", year: 2015, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Baahubali 2: The Conclusion", year: 2017, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Pushpa: The Rise", year: 2021, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Ala Vaikunthapurramuloo", year: 2020, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },
  { title: "Sye Raa Narasimha Reddy", year: 2019, countries: ["IN"], regions: ["telangana", "andhra"], scope: "regional" },

  { title: "Enthiran", year: 2010, countries: ["IN"], regions: ["tamil"], scope: "regional" },
  { title: "Vikram", year: 2022, countries: ["IN"], regions: ["tamil"], scope: "regional" },

  { title: "Spirited Away", year: 2001, countries: ["JP"], scope: "national" },
  { title: "Your Name", year: 2016, countries: ["JP"], scope: "national" },
  { title: "City of God", year: 2002, countries: ["BR"], scope: "national" },
  { title: "Amélie", year: 2001, countries: ["FR"], scope: "national" },
  { title: "Crouching Tiger, Hidden Dragon", year: 2000, countries: ["CN", "TW", "HK"], scope: "national" },
];

function matches(seed: FilmSeed, geo: GeoHierarchy): boolean {
  if (!seed.countries?.length) return seed.scope === "global";
  if (!seed.countries.includes(geo.countryCode)) return false;
  if (!seed.regions?.length) return true;
  const hay = `${geo.state ?? ""} ${geo.city}`.toLowerCase();
  return seed.regions.some((r) => hay.includes(r));
}

function toRelease(seed: FilmSeed, geo: GeoHierarchy): MovieRelease {
  const q = encodeURIComponent(seed.title);
  return {
    title: seed.title,
    year: seed.year,
    regionLabel:
      seed.scope === "regional"
        ? geo.state || geo.country
        : seed.scope === "national"
          ? geo.country
          : "Global",
    scope: seed.scope,
    overview: seed.overview,
    tmdbUrl: `https://www.themoviedb.org/search?query=${q}`,
  };
}

export function getFilmsForPlace(geo: GeoHierarchy, year: number): {
  regional: MovieRelease[];
  national: MovieRelease[];
  global: MovieRelease[];
} {
  const near = (y: number) => (s: FilmSeed) => Math.abs(s.year - y) <= 3;

  const regional = FILM_SEEDS.filter((s) => s.scope === "regional" && matches(s, geo) && near(year)(s))
    .map((s) => toRelease(s, geo));
  const national = FILM_SEEDS.filter((s) => s.scope === "national" && matches(s, geo) && near(year)(s))
    .map((s) => toRelease(s, geo));
  const global = FILM_SEEDS.filter((s) => s.scope === "global" && near(year)(s))
    .map((s) => toRelease(s, geo));

  const nearest = (scope: DataScope) =>
    FILM_SEEDS
      .filter((s) => s.scope === scope && (scope === "global" || matches(s, geo)))
      .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))
      .slice(0, 4)
      .map((s) => toRelease(s, geo));

  return {
    regional: regional.length ? regional.slice(0, 4) : [],
    national: national.length ? national.slice(0, 4) : nearest("national"),
    global: global.length ? global.slice(0, 4) : nearest("global"),
  };
}

/** Live TMDB discover when VITE_TMDB_API_KEY is present. */
export async function fetchTmdbYearHighlights(
  year: number,
  regionCode?: string,
): Promise<MovieRelease[]> {
  const key = (typeof import.meta !== "undefined" && import.meta.env?.VITE_TMDB_API_KEY) || undefined;
  if (!key) return [];

  try {
    const region = regionCode ? `&region=${regionCode}` : "";
    const url =
      `https://api.themoviedb.org/3/discover/movie?api_key=${key}` +
      `&primary_release_year=${year}&sort_by=popularity.desc&language=en-US${region}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 6).map((m: {
      title: string;
      release_date?: string;
      overview?: string;
      poster_path?: string;
      id: number;
    }) => ({
      title: m.title,
      year: Number((m.release_date || `${year}-01-01`).slice(0, 4)),
      regionLabel: regionCode || "Global",
      scope: (regionCode ? "national" : "global") as DataScope,
      overview: m.overview,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
      tmdbUrl: `https://www.themoviedb.org/movie/${m.id}`,
    }));
  } catch {
    return [];
  }
}
