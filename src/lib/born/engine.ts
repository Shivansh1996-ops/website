import { resolveBirthplace, suggestedLanguages } from "./geo";
import { fetchLocalWeather } from "./weather";
import { computeLocalSky } from "./astronomy";
import { buildCulture } from "./culture";
import { buildTimeline, buildRegionalNews } from "./timeline";
import { buildCostOfLiving, buildTech, buildPopulation, buildSports, landmarksFor } from "./economics";
import { enrichWithMusicBrainz } from "./music";
import { fetchTmdbYearHighlights } from "./movies";
import {
  generateCertificateNumber,
  generatePublicToken,
  pickCertificateQuote,
} from "./certificate";
import type { BirthInput, CapsuleData } from "./types";

function dayOfWeek(date: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(
      new Date(`${date}T12:00:00`),
    );
  } catch {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(`${date}T12:00:00Z`));
  }
}

function seasonFor(date: string, latitude: number): string {
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const md = month * 100 + day;
  const north = latitude >= 0;
  let season: "Spring" | "Summer" | "Autumn" | "Winter";
  if (md >= 320 && md < 621) season = "Spring";
  else if (md >= 621 && md < 922) season = "Summer";
  else if (md >= 922 && md < 1221) season = "Autumn";
  else season = "Winter";
  if (!north) {
    const flip: Record<typeof season, typeof season> = {
      Spring: "Autumn",
      Summer: "Winter",
      Autumn: "Spring",
      Winter: "Summer",
    };
    season = flip[season];
  }
  return season;
}

function buildNarrative(capsule: Omit<CapsuleData, "narrative" | "certificateQuote">): string {
  const first = capsule.input.name.split(" ")[0] || "You";
  const music = capsule.culture.music.find((m) => m.scope === "regional")
    ?? capsule.culture.music.find((m) => m.scope === "national")
    ?? capsule.culture.music[0];
  const weatherBit =
    capsule.weather.temperatureC != null
      ? `The air around ${capsule.geo.city} held about ${capsule.weather.temperatureC}°C — ${capsule.weather.condition.toLowerCase()}.`
      : `Local weather archives for that exact day were limited, so we mark what we cannot know.`;

  return (
    `${first} arrived on a ${capsule.dayOfWeek} in ${capsule.season.toLowerCase()}, ` +
    `in ${capsule.geo.city}${capsule.geo.state ? `, ${capsule.geo.state}` : ""}, ${capsule.geo.country} — ` +
    `a single point on ${capsule.geo.continent}. ${weatherBit} ` +
    `Above, the moon was ${capsule.sky.moonPhase.toLowerCase()}. ` +
    (music
      ? `Nearby, the era sounded like “${music.title}” by ${music.artist}. `
      : "") +
    `Far beyond the city, the world counted roughly ${capsule.population.world?.value ?? "billions of lives"}. ` +
    `This capsule holds both rooms at once: your corner, and the wider human weather you were born into.`
  );
}

export async function createCapsule(
  input: BirthInput,
  options?: { privacy?: "public" | "private"; token?: string; certificateNumber?: string; createdAt?: string },
): Promise<CapsuleData> {
  const geo = await resolveBirthplace(input.city, input.region, input.country);
  const year = Number(input.birthDate.slice(0, 4));

  const [weather, tmdbGlobal, tmdbNational] = await Promise.all([
    fetchLocalWeather(geo, input.birthDate, input.birthTime),
    fetchTmdbYearHighlights(year),
    fetchTmdbYearHighlights(year, geo.countryCode),
  ]);

  const sky = computeLocalSky(geo, input.birthDate, input.birthTime);
  let culture = buildCulture(geo, year);

  // Merge live TMDB when available
  if (tmdbNational.length) {
    culture = {
      ...culture,
      films: [
        ...culture.films.filter((f) => f.scope === "regional"),
        ...tmdbNational.map((f) => ({ ...f, scope: "national" as const, regionLabel: geo.country })),
        ...culture.films.filter((f) => f.scope === "global"),
      ],
    };
  }
  if (tmdbGlobal.length) {
    const regionalAndNational = culture.films.filter((f) => f.scope !== "global");
    culture = {
      ...culture,
      films: [...regionalAndNational, ...tmdbGlobal],
    };
  }

  culture.music = await enrichWithMusicBrainz(culture.music);

  const token = options?.token ?? generatePublicToken();
  const createdAt = options?.createdAt ?? new Date().toISOString();
  const certificateNumber =
    options?.certificateNumber ?? generateCertificateNumber(year, token);

  const partial = {
    id: `capsule_${token}`,
    publicToken: token,
    certificateNumber,
    createdAt,
    input: {
      ...input,
      preferredLanguage: input.preferredLanguage ?? "English",
      certificateTheme: input.certificateTheme ?? "archive",
    },
    geo,
    weather,
    sky,
    culture,
    timeline: buildTimeline(geo, year, input.name),
    costs: buildCostOfLiving(geo, year),
    tech: buildTech(geo, year),
    sports: buildSports(geo, year),
    population: buildPopulation(geo, year),
    landmarks: landmarksFor(geo),
    regionalNews: buildRegionalNews(geo, year),
    dayOfWeek: dayOfWeek(input.birthDate, geo.timezone),
    season: seasonFor(input.birthDate, geo.latitude),
    privacy: options?.privacy ?? "public",
  };

  const certificateQuote = pickCertificateQuote(`${input.name}-${input.birthDate}-${geo.city}`);
  const narrative = buildNarrative(partial);

  return { ...partial, narrative, certificateQuote };
}

export { suggestedLanguages };
