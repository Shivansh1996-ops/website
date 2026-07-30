import { describe, it, expect } from "vitest";
import { continentFromCountryCode, buildHierarchy, mapZoomSteps } from "@/born/engine/hierarchy";
import { getRegionalMusic } from "@/born/data/music";
import { getRegionalFilms } from "@/born/data/movies";
import { computeLocalSky } from "@/born/engine/providers/astronomy";
import { makeCertificateNumber } from "@/born/capsule/create";

describe("geographic hierarchy", () => {
  it("maps country codes to continents", () => {
    expect(continentFromCountryCode("IN")).toBe("Asia");
    expect(continentFromCountryCode("BR")).toBe("South America");
    expect(continentFromCountryCode("NG")).toBe("Africa");
  });

  it("builds zoom steps for a birthplace", () => {
    const h = buildHierarchy({
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      countryCode: "IN",
      latitude: 17.385,
      longitude: 78.4867,
      timezone: "Asia/Kolkata",
    });
    const steps = mapZoomSteps(h);
    expect(steps[0].label).toBe("EARTH");
    expect(steps[steps.length - 1].label).toBe("BIRTHPLACE");
    expect(steps.some((s) => s.label.includes("HYDERABAD"))).toBe(true);
  });
});

describe("regional music", () => {
  it("returns Telangana-relevant tracks with listen links", () => {
    const music = getRegionalMusic({ countryCode: "IN", state: "Telangana", year: 2003 });
    expect(music.regional.length).toBeGreaterThan(0);
    expect(music.regional[0].spotifyUrl).toContain("open.spotify.com");
    expect(music.regional[0].youtubeUrl).toContain("youtube.com");
    expect(music.global.length).toBeGreaterThan(0);
  });

  it("falls back gracefully for unknown countries", () => {
    const music = getRegionalMusic({ countryCode: "ZZ", year: 2010 });
    expect(music.global.length).toBeGreaterThan(0);
    expect(music.note).toBeTruthy();
  });
});

describe("regional films", () => {
  it("returns India films for a birth year", () => {
    const films = getRegionalFilms({ countryCode: "IN", state: "Telangana", year: 2001 });
    expect(films.regional.length + films.national.length).toBeGreaterThan(0);
    expect(films.regional[0]?.youtubeUrl || films.national[0]?.youtubeUrl).toContain("youtube.com");
  });
});

describe("local sky", () => {
  it("computes moon phase for Hyderabad coordinates", () => {
    const sky = computeLocalSky({
      date: "2001-06-15",
      time: "14:30",
      latitude: 17.385,
      longitude: 78.4867,
      city: "Hyderabad",
    });
    expect(sky.moonPhaseName).toBeTruthy();
    expect(sky.approximate).toBe(false);
    expect(sky.label).toContain("Hyderabad");
  });

  it("marks sky as approximate without birth time", () => {
    const sky = computeLocalSky({
      date: "2001-06-15",
      latitude: 17.385,
      longitude: 78.4867,
      city: "Hyderabad",
    });
    expect(sky.approximate).toBe(true);
  });
});

describe("certificate numbers", () => {
  it("generates non-database certificate ids", () => {
    const id = makeCertificateNumber(2026);
    expect(id).toMatch(/^BORN-2026-[A-Z0-9]{6}$/);
  });
});
