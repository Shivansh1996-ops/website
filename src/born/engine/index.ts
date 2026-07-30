/**
 * Regional Intelligence Engine
 * location → hierarchy → providers → national → global → normalize → cache → personalize
 */
import type { BirthInput, CapsuleData } from "@/born/types";
import { createCapsule } from "@/born/capsule/create";
import { buildHierarchy, mapZoomSteps } from "./hierarchy";
import { geocodeBirthplace } from "./geocode";

export async function resolveAndPersonalize(input: BirthInput): Promise<CapsuleData> {
  return createCapsule(input);
}

export async function previewLocation(input: Pick<BirthInput, "city" | "region" | "country">) {
  const loc = await geocodeBirthplace(input);
  const hierarchy = buildHierarchy({
    city: loc.city,
    state: loc.state,
    district: loc.district,
    country: loc.country,
    countryCode: loc.countryCode,
    latitude: loc.latitude,
    longitude: loc.longitude,
    timezone: loc.timezone,
  });
  return { location: loc, hierarchy, mapSteps: mapZoomSteps(hierarchy) };
}

export { buildHierarchy, mapZoomSteps, geocodeBirthplace };
