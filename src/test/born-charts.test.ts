import { describe, expect, it } from "vitest";
import { resolveCinema, resolveMusicCharts } from "@/lib/born/data/charts";
import { pickCertificateQuote } from "@/lib/born/certificate/quotes";
import { createCertificateNumber } from "@/lib/born/engine/ids";

describe("regional music charts", () => {
  it("returns regional south-india tracks for Hyderabad context", () => {
    const music = resolveMusicCharts({
      year: 2022,
      countryCode: "IN",
      state: "Telangana",
      city: "Hyderabad",
    });
    expect(music.regional.length).toBeGreaterThan(0);
    expect(music.regional[0].spotifySearchUrl).toContain("open.spotify.com");
    expect(music.regional[0].youtubeSearchUrl).toContain("youtube.com");
    expect(music.global.length).toBeGreaterThan(0);
  });

  it("labels fallbacks when regional data is missing", () => {
    const music = resolveMusicCharts({
      year: 1991,
      countryCode: "IS",
      city: "Reykjavik",
    });
    expect(music.regional[0].note?.toLowerCase()).toMatch(/fallback|unavailable/);
  });
});

describe("cinema layers", () => {
  it("prefers regional telugu cinema when applicable", () => {
    const cinema = resolveCinema({ year: 2022, countryCode: "IN", state: "Telangana" });
    expect(cinema.regional.some((f) => /RRR|Telugu/i.test(f.title + f.regionLabel))).toBe(true);
  });
});

describe("certificate identity", () => {
  it("creates non-db certificate numbers", () => {
    const n = createCertificateNumber(2026);
    expect(n).toMatch(/^BORN-2026-[A-Z0-9]{6}$/);
  });

  it("picks stable quotes for a seed", () => {
    expect(pickCertificateQuote("a")).toEqual(pickCertificateQuote("a"));
  });
});
