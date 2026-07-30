import { useMemo } from "react";
import type { AstronomySnapshot, GeographicPlace } from "@/lib/born/types";

function seededStars(seed: string, count: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const stars = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const x = (h % 1000) / 10;
    h = (h * 1664525 + 1013904223) >>> 0;
    const y = (h % 1000) / 10;
    h = (h * 1664525 + 1013904223) >>> 0;
    const r = 0.4 + (h % 20) / 20;
    stars.push({ x, y, r });
  }
  return stars;
}

export function StarMap({
  place,
  astronomy,
  birthDate,
}: {
  place: GeographicPlace;
  astronomy: AstronomySnapshot;
  birthDate: string;
}) {
  const stars = useMemo(
    () => seededStars(`${place.lat}:${place.lon}:${birthDate}`, 48),
    [place.lat, place.lon, birthDate],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(ellipse_at_center,_hsl(222_40%_12%),_hsl(222_40%_5%))] p-6 md:p-8">
      <svg viewBox="0 0 100 100" className="h-56 w-full md:h-72">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="hsl(40 33% 92%)" opacity={0.35 + (i % 5) * 0.1} />
        ))}
        <circle cx={50 + astronomy.moonAltitude / 4} cy={40 - astronomy.sunAltitude / 6} r={4} fill="hsl(36 35% 70%)" opacity={0.9} />
        <text x="50" y="92" textAnchor="middle" fill="hsl(40 12% 62%)" fontSize="3.2" fontFamily="IBM Plex Mono">
          {place.city} · {birthDate}
        </text>
      </svg>
      <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
        <p>{astronomy.label}</p>
        <p>
          Moon: {astronomy.moonPhase} ({astronomy.moonIllumination}% lit)
        </p>
      </div>
    </div>
  );
}
