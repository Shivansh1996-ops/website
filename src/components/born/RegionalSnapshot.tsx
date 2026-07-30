import type { CapsuleData, CapsuleMode } from "@/born/types";
import { Cloud, Droplets, Sunrise, Sunset, Wind } from "lucide-react";

export function RegionalSnapshot({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const { location, weather, population, sky } = capsule;
  const isLocal = mode === "local";

  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">
        {isLocal ? "Your corner of the world" : "Humanity's scale"}
      </p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">
        {isLocal ? location.city : "The World"}
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {isLocal
          ? `Tied to ${capsule.input.birthDate} in ${[location.state, location.country].filter(Boolean).join(", ")}.`
          : "Population and era context across the planet."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLocal && (
          <>
            <Stat label="Timezone" value={location.timezone} scope="exact" />
            <Stat label="Continent" value={location.continent} scope="exact" />
            <Stat
              label="Weather"
              value={
                weather.temperatureC != null
                  ? `${weather.temperatureC}°C · ${weather.condition}`
                  : weather.condition
              }
              scope={weather.scope}
              note={weather.stationNote}
            />
            <Stat
              label="Humidity"
              value={weather.humidity != null ? `${weather.humidity}%` : "—"}
              scope={weather.scope}
            />
            <Stat
              label="Wind"
              value={weather.windKmh != null ? `${weather.windKmh} km/h` : "—"}
              scope={weather.scope}
            />
            <Stat
              label="Precipitation"
              value={weather.precipitationMm != null ? `${weather.precipitationMm} mm` : "—"}
              scope={weather.scope}
            />
          </>
        )}
        <Stat
          label={isLocal ? "Your city" : "World population"}
          value={isLocal ? population.city?.value ?? "—" : population.world?.value ?? "—"}
          scope={isLocal ? population.city?.scope ?? "unavailable" : "global"}
        />
        <Stat
          label={isLocal ? "Your country" : "Era note"}
          value={isLocal ? population.country?.value ?? "—" : `Around ${capsule.input.birthDate.slice(0, 4)}`}
          scope={isLocal ? population.country?.scope ?? "unavailable" : "global"}
        />
        {!isLocal && (
          <Stat label="World population" value={population.world?.value ?? "—"} scope="global" />
        )}
      </div>

      {isLocal && (
        <div className="mt-6 flex flex-wrap gap-6 rounded-sm border border-border bg-card/50 px-5 py-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-copper" />
            Sunrise {formatTime(sky.sunrise)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Sunset className="h-4 w-4 text-copper" />
            Sunset {formatTime(sky.sunset)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Cloud className="h-4 w-4 text-teal" />
            {weather.condition}
          </span>
          <span className="inline-flex items-center gap-2">
            <Droplets className="h-4 w-4 text-teal" />
            {weather.humidity != null ? `${weather.humidity}%` : "Humidity n/a"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Wind className="h-4 w-4 text-teal" />
            {weather.windKmh != null ? `${weather.windKmh} km/h` : "Wind n/a"}
          </span>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  scope,
  note,
}: {
  label: string;
  value: string;
  scope: string;
  note?: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-card/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="scope-pill">{scope}</span>
      </div>
      <div className="mt-3 font-display text-2xl leading-snug text-ink">{value}</div>
      {note && <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}

function formatTime(d: Date) {
  try {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}
