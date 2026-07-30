import type { CapsuleData } from "@/born/types";
import { starMapPoints } from "@/born/engine/providers/astronomy";

export function LocalSky({ capsule }: { capsule: CapsuleData }) {
  const { sky, location } = capsule;
  const stars = starMapPoints(`${capsule.input.birthDate}-${location.latitude}-${location.longitude}`);

  return (
    <section className="animate-rise overflow-hidden rounded-sm border border-border bg-[#0E1620] text-[#E8EEF2]">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[280px] p-8 md:p-10">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.35} fill="#E8EEF2" opacity={0.35 + (i % 5) * 0.1} />
            ))}
            {/* moon */}
            <circle cx="72" cy="28" r="8" fill="#D9C7A8" opacity="0.9" />
            <circle
              cx={72 + Math.cos(sky.moonPhase * Math.PI * 2) * 3}
              cy="28"
              r="8"
              fill="#0E1620"
              opacity="0.85"
            />
          </svg>
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#9BB0C0]">Local sky</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">{sky.label}</h2>
          </div>
        </div>
        <div className="border-t border-white/10 p-8 md:border-l md:border-t-0 md:p-10">
          <dl className="grid grid-cols-2 gap-6">
            <Item label="Moon phase" value={sky.moonPhaseName} />
            <Item label="Illumination" value={`${sky.moonIllumination}%`} />
            <Item label="Sun altitude" value={`${sky.sunAltitude}°`} />
            <Item label="Moon altitude" value={`${sky.moonAltitude}°`} />
            <Item label="Sunrise" value={fmt(sky.sunrise)} />
            <Item label="Sunset" value={fmt(sky.sunset)} />
            <Item label="Moonrise" value={sky.moonrise ? fmt(sky.moonrise) : "—"} />
            <Item label="Moonset" value={sky.moonset ? fmt(sky.moonset) : "—"} />
          </dl>
          <p className="mt-8 text-xs text-[#8A9AAA]">
            Calculated from latitude, longitude, date{capsule.input.birthTime ? ", and birth time" : ""}.
            {sky.approximate ? " Birth time unknown — sky shown for local noon." : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-[#8A9AAA]">{label}</dt>
      <dd className="mt-1 font-display text-2xl">{value}</dd>
    </div>
  );
}

function fmt(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
