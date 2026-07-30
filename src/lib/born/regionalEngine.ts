/**
 * Regional Intelligence Engine
 *
 * location → geographic hierarchy → regional providers → national → global
 *         → normalize → validate → cache → personalize
 *
 * Providers are swappable. Country-specific data is matched by ISO codes /
 * region strings — never by hardcoding a closed list of supported nations
 * in the orchestration layer.
 */

import { resolveBirthplace, suggestedLanguages } from "./geo";
import { fetchLocalWeather } from "./weather";
import { computeLocalSky } from "./astronomy";
import { buildCulture } from "./culture";
import { buildTimeline, buildRegionalNews } from "./timeline";
import {
  buildCostOfLiving,
  buildTech,
  buildPopulation,
  buildSports,
  landmarksFor,
} from "./economics";
import { getMusicForPlace } from "./music";
import { getFilmsForPlace, fetchTmdbYearHighlights } from "./movies";
import type { DataConfidence, DataScope, GeoHierarchy } from "./types";

export interface ProviderResult<T> {
  value: T;
  scope: DataScope;
  confidence: DataConfidence;
  source?: string;
  note?: string;
}

const cache = new Map<string, unknown>();

function cacheKey(parts: unknown[]): string {
  return JSON.stringify(parts);
}

export async function resolveGeography(
  city: string,
  region: string | undefined,
  country: string,
): Promise<GeoHierarchy> {
  const key = cacheKey(["geo", city, region, country]);
  if (cache.has(key)) return cache.get(key) as GeoHierarchy;
  const geo = await resolveBirthplace(city, region, country);
  cache.set(key, geo);
  return geo;
}

/** Prefer exact local → regional → national → global. */
export function chooseBestScope<T>(
  candidates: Array<ProviderResult<T> | null | undefined>,
): ProviderResult<T> | null {
  const order: DataScope[] = ["local", "regional", "national", "global"];
  for (const scope of order) {
    const hit = candidates.find((c) => c && c.scope === scope && c.confidence !== "unavailable");
    if (hit) return hit;
  }
  return candidates.find(Boolean) ?? null;
}

export const regionalEngine = {
  resolveGeography,
  suggestedLanguages,
  fetchLocalWeather,
  computeLocalSky,
  buildCulture,
  buildTimeline,
  buildRegionalNews,
  buildCostOfLiving,
  buildTech,
  buildPopulation,
  buildSports,
  landmarksFor,
  getMusicForPlace,
  getFilmsForPlace,
  fetchTmdbYearHighlights,
  chooseBestScope,
  clearCache: () => cache.clear(),
};

export type RegionalEngine = typeof regionalEngine;
