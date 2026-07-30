import { describe, expect, it } from "vitest";
import { getMusicForPlace } from "@/lib/born/music";
import { getFilmsForPlace } from "@/lib/born/movies";
import { computeLocalSky } from "@/lib/born/astronomy";
import { generateCertificateNumber, pickCertificateQuote, generatePublicToken } from "@/lib/born/certificate";
import { encodeSharePayload, decodeSharePayload } from "@/lib/born/storage";
import type { GeoHierarchy } from "@/lib/born/types";

const hyderabad: GeoHierarchy = {
  latitude: 17.385,
  longitude: 78.4867,
  timezone: "Asia/Kolkata",
  city: "Hyderabad",
  state: "Telangana",
  country: "India",
  countryCode: "IN",
  continent: "Asia",
  displayName: "Hyderabad, Telangana, India",
};

describe("regional music", () => {
  it("returns Telugu regional tracks for Hyderabad", () => {
    const music = getMusicForPlace(hyderabad, 2005);
    expect(music.regional.length).toBeGreaterThan(0);
    expect(music.global.length).toBeGreaterThan(0);
    expect(music.regional[0].spotifyUrl).toContain("spotify.com");
    expect(music.regional[0].youtubeUrl).toContain("youtube.com");
  });
});

describe("films", () => {
  it("prioritizes regional cinema for Telangana", () => {
    const films = getFilmsForPlace(hyderabad, 2015);
    expect(films.regional.some((f) => /baahubali/i.test(f.title))).toBe(true);
  });
});

describe("astronomy", () => {
  it("labels approximate sky when time missing", () => {
    const sky = computeLocalSky(hyderabad, "2005-06-15");
    expect(sky.exactTime).toBe(false);
    expect(sky.label).toMatch(/Approximate/);
    expect(sky.moonPhase.length).toBeGreaterThan(0);
  });

  it("uses exact time when provided", () => {
    const sky = computeLocalSky(hyderabad, "2005-06-15", "14:30");
    expect(sky.exactTime).toBe(true);
  });
});

describe("certificate helpers", () => {
  it("builds non-db certificate numbers", () => {
    const n = generateCertificateNumber(2005, "ABC123XY");
    expect(n).toMatch(/^BORN-2005-[A-Z0-9]{6}$/);
  });

  it("returns deterministic quotes", () => {
    expect(pickCertificateQuote("a")).toEqual(pickCertificateQuote("a"));
  });

  it("generates public tokens", () => {
    expect(generatePublicToken()).toHaveLength(8);
  });
});

describe("share payload", () => {
  it("round-trips compressed seeds", () => {
    const seed = {
      v: 1 as const,
      token: "TESTTOKEN",
      input: {
        name: "Ada",
        birthDate: "2005-01-01",
        city: "Hyderabad",
        country: "India",
      },
      privacy: "public" as const,
      createdAt: "2026-01-01T00:00:00.000Z",
      certificateNumber: "BORN-2005-TESTTO",
    };
    const encoded = encodeSharePayload(seed);
    expect(decodeSharePayload(encoded)).toEqual(seed);
  });
});
