import { geocodeBirthplace } from "../location/geocode";
import { resolveCinema, resolveMusicCharts } from "../data/charts";
import { computeLocalSky } from "../providers/astronomy";
import {
  buildCulture,
  buildPopulation,
  buildPrices,
  buildSports,
  buildTechnology,
} from "../providers/culture";
import { buildLifeTimeline, buildRegionalNews } from "../providers/news";
import { fetchBirthWeather } from "../providers/weather";
import { pickCertificateQuote } from "../certificate/quotes";
import { cacheGet, cacheSet } from "./cache";
import { createCapsuleId, createCertificateNumber, createPublicId, createPublicToken } from "./ids";
import type { BirthInput, CapsuleData, CertificateTheme } from "../types";

/**
 * Regional Intelligence Engine
 * location → geographic hierarchy → regional providers → national → global
 * → normalize → validate → cache → personalize
 */
export async function buildCapsule(
  input: BirthInput,
  theme: CertificateTheme = "cosmos",
): Promise<CapsuleData> {
  const cacheKey = `capsule:${input.birthDate}:${input.city}:${input.region}:${input.country}:${input.birthTime ?? ""}`;
  const cached = cacheGet<CapsuleData>(cacheKey);
  if (cached && cached.input.name === input.name) {
    return { ...cached, input, certificate: { ...cached.certificate, theme } };
  }

  const place = await geocodeBirthplace({
    city: input.city,
    region: input.region,
    country: input.country,
  });

  const year = Number(input.birthDate.slice(0, 4));

  const [weather, news] = await Promise.all([
    fetchBirthWeather(place, input.birthDate, input.birthTime),
    buildRegionalNews(place, input.birthDate),
  ]);

  const astronomy = computeLocalSky(place, input.birthDate, input.birthTime);
  const music = resolveMusicCharts({
    year,
    countryCode: place.countryCode,
    state: place.state,
    city: place.city,
  });
  const cinema = resolveCinema({
    year,
    countryCode: place.countryCode,
    state: place.state,
  });

  const publicId = createPublicId();
  const certificateNumber = createCertificateNumber(new Date().getFullYear());
  const publicToken = createPublicToken();

  const capsule: CapsuleData = {
    id: createCapsuleId(),
    publicId,
    input: {
      ...input,
      city: place.city,
      region: place.state ?? input.region,
      country: place.country,
    },
    place,
    weather,
    astronomy,
    music,
    cinema,
    culture: buildCulture(place, year),
    news,
    timeline: buildLifeTimeline(place, year, news),
    prices: buildPrices(place, year),
    technology: buildTechnology(place, year),
    sports: buildSports(place, year),
    population: buildPopulation(place, year),
    certificate: {
      certificateNumber,
      publicToken,
      theme,
      quote: pickCertificateQuote(`${input.name}:${input.birthDate}:${place.city}`),
      createdAt: new Date().toISOString(),
      showCoordinates: Boolean(input.showCoordinates),
      showBirthTime: Boolean(input.showBirthTime && input.birthTime),
    },
    createdAt: new Date().toISOString(),
    privacy: input.privacy ?? "unlisted",
  };

  return cacheSet(cacheKey, capsule);
}
