import LZString from "lz-string";
import type { BirthInput, CapsuleData } from "./types";

const CAPSULE_PREFIX = "born:capsule:";
const INDEX_KEY = "born:index";

export interface CapsuleSeed {
  v: 1;
  token: string;
  input: BirthInput;
  privacy: "public" | "private";
  createdAt: string;
  certificateNumber: string;
}

export function saveCapsule(capsule: CapsuleData): void {
  localStorage.setItem(CAPSULE_PREFIX + capsule.publicToken, JSON.stringify(capsule));
  const index = listTokens();
  if (!index.includes(capsule.publicToken)) {
    localStorage.setItem(INDEX_KEY, JSON.stringify([capsule.publicToken, ...index].slice(0, 50)));
  }
  // Also persist compressible seed for share URLs
  localStorage.setItem(
    CAPSULE_PREFIX + capsule.publicToken + ":seed",
    JSON.stringify(toSeed(capsule)),
  );
}

export function loadCapsule(token: string): CapsuleData | null {
  const raw = localStorage.getItem(CAPSULE_PREFIX + token);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CapsuleData;
  } catch {
    return null;
  }
}

export function loadSeed(token: string): CapsuleSeed | null {
  const raw = localStorage.getItem(CAPSULE_PREFIX + token + ":seed");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CapsuleSeed;
  } catch {
    return null;
  }
}

export function listTokens(): string[] {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function toSeed(capsule: CapsuleData): CapsuleSeed {
  return {
    v: 1,
    token: capsule.publicToken,
    input: capsule.input,
    privacy: capsule.privacy,
    createdAt: capsule.createdAt,
    certificateNumber: capsule.certificateNumber,
  };
}

/** Encode regeneratable seed into URL-safe compressed string */
export function encodeSharePayload(seed: CapsuleSeed): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(seed));
}

export function decodeSharePayload(payload: string): CapsuleSeed | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    return JSON.parse(json) as CapsuleSeed;
  } catch {
    return null;
  }
}

export function publicCapsuleView(capsule: CapsuleData): Partial<CapsuleData> {
  if (capsule.privacy === "public") return capsule;
  // Private: strip sensitive fields for any accidental exposure
  return {
    publicToken: capsule.publicToken,
    certificateNumber: capsule.certificateNumber,
    createdAt: capsule.createdAt,
    privacy: "private",
    input: {
      name: capsule.input.name.split(" ").map((p, i) => (i === 0 ? p : p[0] + ".")).join(" "),
      birthDate: capsule.input.birthDate.slice(0, 4) + "-01-01",
      city: capsule.geo.city,
      country: capsule.geo.country,
    },
    geo: {
      ...capsule.geo,
      latitude: Math.round(capsule.geo.latitude),
      longitude: Math.round(capsule.geo.longitude),
    },
  } as CapsuleData;
}
