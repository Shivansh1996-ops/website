import * as SunCalc from "suncalc";
import type { GeoHierarchy, SkySnapshot } from "./types";

function moonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

function formatLocalTime(date: Date | null | undefined, timeZone: string): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

/** Rough season-based constellation hints by hemisphere — labeled as approximate. */
function constellationHints(lat: number, month: number): string[] {
  const north = lat >= 0;
  if (north) {
    const map: Record<number, string[]> = {
      1: ["Orion", "Taurus", "Canis Major"],
      2: ["Orion", "Gemini", "Canis Minor"],
      3: ["Leo", "Ursa Major", "Cancer"],
      4: ["Leo", "Virgo", "Ursa Major"],
      5: ["Virgo", "Boötes", "Ursa Major"],
      6: ["Scorpius", "Libra", "Hercules"],
      7: ["Scorpius", "Sagittarius", "Lyra"],
      8: ["Lyra", "Cygnus", "Aquila"],
      9: ["Cygnus", "Pegasus", "Aquila"],
      10: ["Pegasus", "Andromeda", "Aries"],
      11: ["Pegasus", "Taurus", "Cassiopeia"],
      12: ["Orion", "Taurus", "Cassiopeia"],
    };
    return map[month] ?? ["Ursa Major", "Orion"];
  }
  const map: Record<number, string[]> = {
    1: ["Crux", "Centaurus", "Canis Major"],
    2: ["Crux", "Carina", "Vela"],
    3: ["Crux", "Centaurus", "Vela"],
    4: ["Centaurus", "Crux", "Carina"],
    5: ["Centaurus", "Crux", "Scorpius"],
    6: ["Scorpius", "Crux", "Sagittarius"],
    7: ["Sagittarius", "Scorpius", "Crux"],
    8: ["Sagittarius", "Aquarius", "Piscis Austrinus"],
    9: ["Grus", "Piscis Austrinus", "Aquarius"],
    10: ["Grus", "Phoenix", "Tucana"],
    11: ["Eridanus", "Phoenix", "Horologium"],
    12: ["Canis Major", "Puppis", "Carina"],
  };
  return map[month] ?? ["Crux", "Centaurus"];
}

function visiblePlanets(date: Date, lat: number, lon: number): string[] {
  // SunCalc gives moon/sun; planet positions need full ephemeris.
  // We report planets that are commonly evening/morning visible by rough elongation heuristics.
  const planets = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  const moon = SunCalc.getMoonPosition(date, lat, lon);
  const sun = SunCalc.getPosition(date, lat, lon);
  const visible: string[] = [];

  // Keep only scientifically modest claims: list planets as "often visible around this season"
  // and include Moon if above horizon.
  if (moon.altitude > 0.05) visible.push("Moon");
  if (sun.altitude < -0.1) {
    // Night — all naked-eye planets potentially observable; filter to seasonal note
    const month = date.getUTCMonth() + 1;
    // Simplified seasonal prominence (not precise ephemeris)
    if ([1, 2, 3, 10, 11, 12].includes(month)) visible.push("Jupiter");
    if ([3, 4, 5, 6, 7, 8].includes(month)) visible.push("Saturn");
    if ([1, 2, 8, 9, 10, 11, 12].includes(month)) visible.push("Venus");
    if ([1, 2, 3, 10, 11, 12].includes(month)) visible.push("Mars");
  } else {
    // Daytime — Venus sometimes
    visible.push("Venus (occasionally near dawn/dusk)");
  }

  // Deduplicate preserving order
  return [...new Set(visible.length ? visible : planets.slice(0, 2))];
}

export function computeLocalSky(
  geo: GeoHierarchy,
  birthDate: string,
  birthTime?: string,
): SkySnapshot {
  const exactTime = Boolean(birthTime);
  const timePart = birthTime ? `${birthTime}:00` : "12:00:00";
  // Interpret as local wall time in the birthplace timezone by constructing via Intl offset
  const date = localDateInZone(birthDate, timePart, geo.timezone);

  const moonIllum = SunCalc.getMoonIllumination(date);
  const moonPos = SunCalc.getMoonPosition(date, geo.latitude, geo.longitude);
  const sunPos = SunCalc.getPosition(date, geo.latitude, geo.longitude);
  const times = SunCalc.getTimes(date, geo.latitude, geo.longitude);
  const moonTimes = SunCalc.getMoonTimes(date, geo.latitude, geo.longitude);

  const month = parseInt(birthDate.slice(5, 7), 10);

  return {
    moonPhase: moonPhaseName(moonIllum.phase),
    moonIllumination: Math.round(moonIllum.fraction * 100),
    moonAltitude: Math.round((moonPos.altitude * 180) / Math.PI),
    sunAltitude: Math.round((sunPos.altitude * 180) / Math.PI),
    sunrise: formatLocalTime(times.sunrise, geo.timezone),
    sunset: formatLocalTime(times.sunset, geo.timezone),
    moonrise: formatLocalTime(moonTimes.rise ?? null, geo.timezone),
    moonset: formatLocalTime(moonTimes.set ?? null, geo.timezone),
    twilight: formatLocalTime(times.dusk, geo.timezone),
    visiblePlanets: visiblePlanets(date, geo.latitude, geo.longitude),
    constellations: constellationHints(geo.latitude, month),
    exactTime,
    label: exactTime
      ? `The sky above ${geo.city} when you arrived.`
      : `Approximate sky above ${geo.city} for this date (noon local — birth time not provided).`,
  };
}

function localDateInZone(date: string, time: string, timeZone: string): Date {
  // Build a Date that represents the given local wall time in timeZone
  const asUtcGuess = new Date(`${date}T${time}Z`);
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // Binary search offset
    let guess = asUtcGuess.getTime();
    for (let i = 0; i < 3; i++) {
      const parts = Object.fromEntries(
        fmt.formatToParts(new Date(guess)).map((p) => [p.type, p.value]),
      );
      const asLocal = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour === "24" ? "0" : parts.hour),
        Number(parts.minute),
        Number(parts.second),
      );
      const target = Date.UTC(
        Number(date.slice(0, 4)),
        Number(date.slice(5, 7)) - 1,
        Number(date.slice(8, 10)),
        Number(time.slice(0, 2)),
        Number(time.slice(3, 5)),
        Number(time.slice(6, 8) || "0"),
      );
      guess += target - asLocal;
    }
    return new Date(guess);
  } catch {
    return asUtcGuess;
  }
}
