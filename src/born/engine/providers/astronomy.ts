import * as SunCalc from "suncalc";
import type { SkySnapshot } from "@/born/types";

const PHASE_NAMES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];

function phaseName(phase: number): string {
  const i = Math.round(phase * 8) % 8;
  return PHASE_NAMES[i];
}

/**
 * Local sky for birth coordinates — genuinely location-specific.
 */
export function computeLocalSky(opts: {
  date: string;
  time?: string;
  latitude: number;
  longitude: number;
  city: string;
}): SkySnapshot {
  const [y, m, d] = opts.date.split("-").map(Number);
  let hours = 12;
  let minutes = 0;
  const approximate = !opts.time;
  if (opts.time) {
    const [hh, mm] = opts.time.split(":").map(Number);
    hours = hh;
    minutes = mm || 0;
  }
  const when = new Date(y, m - 1, d, hours, minutes, 0);

  const moon = SunCalc.getMoonIllumination(when);
  const moonPos = SunCalc.getMoonPosition(when, opts.latitude, opts.longitude);
  const sunPos = SunCalc.getPosition(when, opts.latitude, opts.longitude);
  const times = SunCalc.getTimes(when, opts.latitude, opts.longitude);
  const moonTimes = SunCalc.getMoonTimes(when, opts.latitude, opts.longitude);

  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  return {
    moonPhase: moon.phase,
    moonPhaseName: phaseName(moon.phase),
    moonIllumination: Math.round(moon.fraction * 100),
    sunAltitude: Math.round(toDeg(sunPos.altitude) * 10) / 10,
    moonAltitude: Math.round(toDeg(moonPos.altitude) * 10) / 10,
    sunrise: times.sunrise,
    sunset: times.sunset,
    moonrise: moonTimes.rise ?? null,
    moonset: moonTimes.set ?? null,
    approximate,
    label: approximate
      ? `Approximate sky above ${opts.city} for this date (noon local).`
      : `The sky above ${opts.city} when you arrived.`,
  };
}

/** Simple star-map projection points for certificate visualization */
export function starMapPoints(seed: string, count = 48): { x: number; y: number; r: number }[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const pts: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const x = (h % 1000) / 10;
    h = (h * 1664525 + 1013904223) >>> 0;
    const y = (h % 1000) / 10;
    h = (h * 1664525 + 1013904223) >>> 0;
    const r = 0.4 + (h % 20) / 20;
    pts.push({ x, y, r });
  }
  return pts;
}
