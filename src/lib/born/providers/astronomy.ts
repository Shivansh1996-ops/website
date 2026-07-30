import * as SunCalc from "suncalc";
import type { AstronomySnapshot, GeographicPlace } from "../types";

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

/** Rough tropical zodiac for date labeling — clearly astronomical calendar, not personality. */
function sunZodiac(date: Date): string {
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const md = m * 100 + d;
  if (md >= 321 && md <= 419) return "Aries (sun position)";
  if (md >= 420 && md <= 520) return "Taurus (sun position)";
  if (md >= 521 && md <= 620) return "Gemini (sun position)";
  if (md >= 621 && md <= 722) return "Cancer (sun position)";
  if (md >= 723 && md <= 822) return "Leo (sun position)";
  if (md >= 823 && md <= 922) return "Virgo (sun position)";
  if (md >= 923 && md <= 1022) return "Libra (sun position)";
  if (md >= 1023 && md <= 1121) return "Scorpio (sun position)";
  if (md >= 1122 && md <= 1221) return "Sagittarius (sun position)";
  if (md >= 1222 || md <= 119) return "Capricorn (sun position)";
  if (md >= 120 && md <= 218) return "Aquarius (sun position)";
  return "Pisces (sun position)";
}

function fmtLocal(date: Date | null | undefined, timeZone: string): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone.startsWith("UTC") ? "UTC" : timeZone,
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

const PLANETS = ["mercury", "venus", "mars", "jupiter", "saturn"] as const;

export function computeLocalSky(
  place: GeographicPlace,
  birthDate: string,
  birthTime?: string,
): AstronomySnapshot {
  const [y, m, d] = birthDate.split("-").map(Number);
  const exactTimeUsed = Boolean(birthTime);
  let hour = 12;
  let minute = 0;
  if (birthTime) {
    const [hh, mm] = birthTime.split(":").map(Number);
    hour = hh;
    minute = mm || 0;
  }

  // Interpret birth clock in local timezone approximately via UTC offset heuristic
  // when IANA timezone available, Date constructed then adjusted via Intl is complex;
  // use noon/local components as civil time at coordinates.
  const date = new Date(Date.UTC(y, m - 1, d, hour, minute, 0));

  const moon = SunCalc.getMoonIllumination(date);
  const moonPos = SunCalc.getMoonPosition(date, place.lat, place.lon);
  const sunPos = SunCalc.getPosition(date, place.lat, place.lon);
  const times = SunCalc.getTimes(date, place.lat, place.lon);
  const moonTimes = SunCalc.getMoonTimes(date, place.lat, place.lon);

  const visiblePlanets: string[] = [];
  // SunCalc doesn't include planets — mark night-sky context instead of inventing positions
  if (sunPos.altitude < 0) {
    visiblePlanets.push("Night sky conditions (planet ephemerides require specialized tables)");
  } else {
    visiblePlanets.push("Daytime — planets generally not visible without specialized observation");
  }

  // Seasonal constellations (hemisphere-aware, approximate educational labels)
  const month = m;
  const north = place.lat >= 0;
  const constellations = north
    ? month <= 3
      ? ["Orion", "Taurus", "Canis Major"]
      : month <= 6
        ? ["Leo", "Virgo", "Boötes"]
        : month <= 9
          ? ["Cygnus", "Lyra", "Aquila"]
          : ["Pegasus", "Andromeda", "Cassiopeia"]
    : month <= 3
      ? ["Canopus region", "Crux (seasonal)", "Centaurus"]
      : month <= 6
        ? ["Crux", "Centaurus", "Carina"]
        : month <= 9
          ? ["Sagittarius region", "Scorpius", "Ara"]
          : ["Achernar region", "Phoenix", "Tucana"];

  return {
    moonPhase: moonPhaseName(moon.phase),
    moonIllumination: Math.round(moon.fraction * 100),
    moonAltitude: Math.round((moonPos.altitude * 180) / Math.PI),
    sunAltitude: Math.round((sunPos.altitude * 180) / Math.PI),
    sunrise: fmtLocal(times.sunrise, place.timezone) ?? "—",
    sunset: fmtLocal(times.sunset, place.timezone) ?? "—",
    moonrise: fmtLocal(moonTimes.rise, place.timezone),
    moonset: fmtLocal(moonTimes.set, place.timezone),
    twilight: fmtLocal(times.dusk, place.timezone),
    visiblePlanets,
    constellations,
    zodiacConstellation: sunZodiac(date),
    exactTimeUsed,
    label: exactTimeUsed
      ? `The sky above ${place.city} when you arrived`
      : `Approximate sky above ${place.city} for this date (noon local estimate — birth time not provided)`,
  };
}

// silence unused PLANETS lint if tree-shaken differently
void PLANETS;
