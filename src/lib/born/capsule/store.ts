import type { CapsuleData } from "../types";

const STORAGE_KEY = "born.capsules.v1";
const LAST_KEY = "born.lastCapsuleId";

function readAll(): Record<string, CapsuleData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CapsuleData>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, CapsuleData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function saveCapsule(capsule: CapsuleData): void {
  const map = readAll();
  map[capsule.publicId] = capsule;
  // also index by verify token
  map[`verify:${capsule.certificate.publicToken}`] = capsule;
  writeAll(map);
  localStorage.setItem(LAST_KEY, capsule.publicId);
}

export function getCapsuleByPublicId(publicId: string): CapsuleData | null {
  const map = readAll();
  return map[publicId] ?? null;
}

export function getCapsuleByVerifyToken(token: string): CapsuleData | null {
  const map = readAll();
  return map[`verify:${token}`] ?? null;
}

export function getLastCapsule(): CapsuleData | null {
  const id = localStorage.getItem(LAST_KEY);
  if (!id) return null;
  return getCapsuleByPublicId(id);
}

/** Compact share payload for cross-device regeneration when localStorage isn't shared. */
export function encodeShareParams(capsule: CapsuleData): string {
  const p = {
    n: capsule.input.name,
    d: capsule.input.birthDate,
    t: capsule.input.birthTime,
    c: capsule.input.city,
    r: capsule.input.region,
    co: capsule.input.country,
    pid: capsule.publicId,
    cert: capsule.certificate.certificateNumber,
    theme: capsule.certificate.theme,
    tok: capsule.certificate.publicToken,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))));
}

export function decodeShareParams(encoded: string): {
  n: string;
  d: string;
  t?: string;
  c: string;
  r?: string;
  co: string;
  pid: string;
  cert: string;
  theme: CapsuleData["certificate"]["theme"];
  tok: string;
} | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}
