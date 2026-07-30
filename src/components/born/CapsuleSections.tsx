import { motion } from "framer-motion";
import type { CapsuleData, CapsuleMode } from "@/lib/born";
import { MusicSection } from "./MusicSection";

function ScopeNote({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{text}</p>;
}

export function BirthMomentMap({ capsule }: { capsule: CapsuleData }) {
  const steps = [
    "Earth",
    capsule.geo.continent,
    capsule.geo.country,
    capsule.geo.state || capsule.geo.country,
    capsule.geo.city,
    "Birthplace",
  ];

  return (
    <section className="born-section">
      <p className="born-kicker">Birth moment map</p>
      <h2 className="born-title">This is where your story began.</h2>
      <p className="born-lede">
        A cinematic descent from the planet to your place. Exact coordinates stay private unless you choose to show them.
      </p>
      <div className="relative mt-10 overflow-hidden rounded-sm border border-border bg-gradient-to-br from-[#0f3a4a] via-[#1a4f5c] to-[#3d2a1f] px-6 py-14 text-paper shadow-sm md:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent 40%), repeating-radial-gradient(circle at 70% 60%, transparent 0 18px, rgba(255,255,255,0.05) 18px 19px)",
          }}
        />
        <motion.div
          initial={{ scale: 0.85, opacity: 0.4 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative"
        >
          <ul className="space-y-3">
            {steps.map((step, i) => (
              <motion.li
                key={step + i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center gap-3 font-display text-2xl md:text-3xl"
              >
                <span className="text-copper opacity-70">{i === steps.length - 1 ? "•" : "↓"}</span>
                {step}
              </motion.li>
            ))}
          </ul>
          <p className="mt-8 max-w-md font-body text-sm text-paper/75">
            {capsule.geo.displayName}
            {!capsule.input.showCoordinates && " · Coordinates hidden"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function RegionalSnapshot({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const g = capsule.geo;
  const w = capsule.weather;
  const items =
    mode === "my-world"
      ? [
          { label: "Timezone", value: g.timezone },
          { label: "Local weather", value: w.temperatureC != null ? `${w.temperatureC}°C · ${w.condition}` : w.condition },
          { label: "Sunrise / Sunset", value: `${w.sunrise || capsule.sky.sunrise || "—"} / ${w.sunset || capsule.sky.sunset || "—"}` },
          { label: "City population", value: capsule.population.city?.value ?? "—" },
          { label: "Country population", value: capsule.population.country?.value ?? "—" },
          { label: "Landmarks", value: capsule.landmarks.slice(0, 3).join(" · ") },
          { label: "Currency / prices", value: capsule.costs[0]?.thenValue ?? "—" },
          { label: "Festivals", value: capsule.culture.festivals.slice(0, 2).join(" · ") },
        ]
      : [
          { label: "World population", value: capsule.population.world?.value ?? "—" },
          { label: "Global music", value: capsule.culture.music.find((m) => m.scope === "global")?.title ?? "—" },
          { label: "Global film", value: capsule.culture.films.find((f) => f.scope === "global")?.title ?? "—" },
          { label: "Technology", value: capsule.tech.global.launches[0] ?? "—" },
          { label: "Major event", value: capsule.timeline.find((t) => t.layer === "global")?.title ?? "—" },
        ];

  return (
    <section className="born-section">
      <p className="born-kicker">
        {mode === "my-world" ? "Your corner of the world" : "Humanity at large"}
      </p>
      <h2 className="born-title">
        {mode === "my-world" ? "Regional birth snapshot" : "Global birth snapshot"}
      </h2>
      <p className="born-lede">
        Everything here is tied to {capsule.input.birthDate}
        {capsule.input.birthTime ? ` at ${capsule.input.birthTime}` : ""} — and to {g.city}, not a generic country page.
      </p>
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="border-t border-border pt-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sea">{item.label}</dt>
            <dd className="mt-2 font-display text-2xl text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
      <ScopeNote text={mode === "my-world" ? w.stationNote : undefined} />
    </section>
  );
}

export function WeatherSection({ capsule }: { capsule: CapsuleData }) {
  const w = capsule.weather;
  return (
    <section className="born-section">
      <p className="born-kicker">Regional weather</p>
      <h2 className="born-title">The air above {capsule.geo.city}</h2>
      <p className="born-lede">
        Historical weather for your birthplace coordinates — not a national average.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Temperature", w.temperatureC != null ? `${w.temperatureC}°C` : "Unavailable"],
          ["Condition", w.condition],
          ["Precipitation", w.precipitationMm != null ? `${w.precipitationMm} mm` : "—"],
          ["Humidity", w.humidity != null ? `${w.humidity}%` : "—"],
          ["Wind", w.windKmh != null ? `${w.windKmh} km/h` : "—"],
          ["Confidence", w.confidence],
        ].map(([k, v]) => (
          <div key={k} className="border-t border-border pt-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{k}</p>
            <p className="mt-2 font-display text-3xl text-ink">{v}</p>
          </div>
        ))}
      </div>
      <ScopeNote text={w.comparison || w.stationNote} />
    </section>
  );
}

export function SkySection({ capsule }: { capsule: CapsuleData }) {
  const s = capsule.sky;
  return (
    <section className="born-section">
      <p className="born-kicker">Local sky</p>
      <h2 className="born-title">{s.label}</h2>
      <p className="born-lede">
        Calculated from latitude, longitude, date{capsule.input.birthTime ? ", birth time" : ""}, and timezone.
        Constellations are seasonal hemisphere hints — clearly approximate.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[280px] overflow-hidden rounded-sm border border-border bg-[#07131c]">
          <Starfield illumination={s.moonIllumination} />
          <div className="absolute bottom-4 left-4 right-4 text-paper/80">
            <p className="font-display text-2xl">{s.moonPhase}</p>
            <p className="text-sm">{s.moonIllumination}% illuminated</p>
          </div>
        </div>
        <dl className="space-y-4">
          {[
            ["Moon altitude", s.moonAltitude != null ? `${s.moonAltitude}°` : "—"],
            ["Sun altitude", s.sunAltitude != null ? `${s.sunAltitude}°` : "—"],
            ["Sunrise", s.sunrise || "—"],
            ["Sunset", s.sunset || "—"],
            ["Moonrise", s.moonrise || "—"],
            ["Moonset", s.moonset || "—"],
            ["Visible / seasonal", s.visiblePlanets.join(", ")],
            ["Constellations (approx.)", s.constellations.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-border pt-3">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-sea">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Starfield({ illumination }: { illumination: number }) {
  const stars = Array.from({ length: 48 }, (_, i) => ({
    left: ((i * 47) % 100),
    top: ((i * 29) % 100),
    size: 1 + (i % 3),
    delay: (i % 7) * 0.3,
  }));
  return (
    <div className="absolute inset-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-soft-pulse"
          style={{
            left: `${st.left}%`,
            top: `${st.top}%`,
            width: st.size,
            height: st.size,
            animationDelay: `${st.delay}s`,
            opacity: 0.35 + (i % 5) * 0.1,
          }}
        />
      ))}
      <div
        className="absolute right-[18%] top-[22%] rounded-full bg-[#f0e6c8] shadow-[0_0_40px_rgba(240,230,200,0.35)]"
        style={{ width: 28 + illumination * 0.12, height: 28 + illumination * 0.12 }}
      />
    </div>
  );
}

export function NewsSection({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const layers = mode === "my-world"
    ? (["local", "regional", "national", "global"] as const)
    : (["global", "national"] as const);

  const label: Record<string, string> = {
    local: `Your city — ${capsule.geo.city}`,
    regional: `Your state — ${capsule.geo.state || "Region"}`,
    national: `Your country — ${capsule.geo.country}`,
    global: "The world",
    personal: "Personal",
  };

  return (
    <section className="born-section">
      <p className="born-kicker">What was happening near you?</p>
      <h2 className="born-title">Regional news hierarchy</h2>
      <p className="born-lede">
        Priority runs city → district → state → country → global. Fallback layers are labeled — never presented as exact local fact.
      </p>
      <div className="mt-10 space-y-8">
        {layers.map((layer) => {
          const events = capsule.regionalNews.filter((e) => e.layer === layer);
          return (
            <div key={layer}>
              <p className="born-kicker">{label[layer]}</p>
              {events.length ? (
                <ul className="mt-3 space-y-3">
                  {events.map((e) => (
                    <li key={e.id} className="border-l-2 border-copper/70 pl-4">
                      <p className="font-display text-xl text-ink">{e.year} — {e.title}</p>
                      <p className="text-sm text-muted-foreground">{e.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No verified {layer} events bundled for this window — higher/lower layers still shown.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CultureExtras({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  return (
    <section className="born-section">
      <p className="born-kicker">Regional culture</p>
      <h2 className="born-title">
        {mode === "my-world" ? "How life felt around you" : "Global cultural weather"}
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Block title="Languages" items={capsule.culture.languages} />
        <Block title="Sports" items={capsule.culture.sports} />
        <Block title="Festivals" items={capsule.culture.festivals} />
        <Block title="Foods" items={capsule.culture.foods} />
        {capsule.culture.television && <Block title="Television" items={capsule.culture.television} />}
        {capsule.culture.movements && <Block title="Cultural movements" items={capsule.culture.movements} />}
      </div>

      <div className="mt-12">
        <p className="born-kicker">Cinema — local → national → global</p>
        <ul className="mt-4 divide-y divide-border">
          {(mode === "my-world"
            ? capsule.culture.films
            : capsule.culture.films.filter((f) => f.scope === "global")
          ).slice(0, 8).map((f) => (
            <li key={`${f.title}-${f.year}`} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
              <div>
                <p className="font-display text-xl text-ink">{f.title}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-sea">
                  {f.regionLabel} · {f.year} · {f.scope}
                </p>
              </div>
              {f.tmdbUrl && (
                <a href={f.tmdbUrl} target="_blank" rel="noreferrer" className="text-sm text-copper hover:underline">
                  Explore
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ScopeNote text={capsule.culture.limitations} />
    </section>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sea">{title}</p>
      <ul className="mt-3 space-y-1">
        {items.map((item) => (
          <li key={item} className="font-display text-xl text-ink">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function TechSection({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const side = mode === "my-world" ? capsule.tech.region : undefined;
  return (
    <section className="born-section">
      <p className="born-kicker">Regional technology</p>
      <h2 className="born-title">What technology looked like around you</h2>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <p className="born-kicker">Your region</p>
          <ul className="mt-4 space-y-2 text-ink">
            {(side?.phones ?? ["Regional phone data limited"]).map((x) => <li key={x} className="font-display text-xl">{x}</li>)}
          </ul>
          {side?.internetPenetration && <p className="mt-4 text-sm text-muted-foreground">{side.internetPenetration}</p>}
          {side?.networkGen && <p className="text-sm text-muted-foreground">{side.networkGen}</p>}
          {side?.websites && (
            <p className="mt-3 text-sm text-muted-foreground">Sites: {side.websites.join(" · ")}</p>
          )}
        </div>
        <div>
          <p className="born-kicker">Global</p>
          <ul className="mt-4 space-y-2 text-ink">
            {capsule.tech.global.launches.map((x) => <li key={x} className="font-display text-xl">{x}</li>)}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Phones: {capsule.tech.global.phones.join(" · ")}</p>
        </div>
      </div>
      <ScopeNote text={capsule.tech.note} />
    </section>
  );
}

export function CostsSection({ capsule }: { capsule: CapsuleData }) {
  return (
    <section className="born-section">
      <p className="born-kicker">Local cost of living</p>
      <h2 className="born-title">Then, now, and the world</h2>
      <p className="born-lede">
        We never invent unavailable historical prices. Unavailable rows are labeled as such.
      </p>
      <div className="mt-10 space-y-6">
        {capsule.costs.map((c) => (
          <div key={c.category} className="grid gap-3 border-t border-border pt-5 md:grid-cols-4">
            <p className="font-display text-2xl text-ink">{c.category}</p>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-sea">{c.thenLabel}</p>
              <p className="text-sm text-ink">{c.thenValue}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-sea">{c.todayLabel}</p>
              <p className="text-sm text-ink">{c.todayValue}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-sea">Global context</p>
              <p className="text-sm text-ink">{c.globalBenchmark || "—"}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{c.confidence}{c.note ? ` · ${c.note}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SportsSection({ capsule }: { capsule: CapsuleData }) {
  const s = capsule.sports;
  return (
    <section className="born-section">
      <p className="born-kicker">Regional sports</p>
      <h2 className="born-title">What people watched and played</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Block title="Popular sports" items={s.popularSports} />
        <Block title="Local / national sides" items={s.localTeams} />
        <Block title="Athletes" items={s.athletes} />
        <Block title="Events around your year" items={s.events} />
      </div>
      <ScopeNote text={s.note} />
    </section>
  );
}

export function TimelineSection({ capsule }: { capsule: CapsuleData }) {
  const layerColor: Record<string, string> = {
    global: "bg-sea",
    national: "bg-copper",
    regional: "bg-gold",
    local: "bg-ink",
    personal: "bg-copper",
  };

  return (
    <section className="born-section">
      <p className="born-kicker">Regional timeline</p>
      <h2 className="born-title">Layers of the years around you</h2>
      <p className="born-lede">Global · National · Regional · Local · Personal</p>
      <ol className="relative mt-12 space-y-0 border-l border-border ml-3">
        {capsule.timeline.map((e) => (
          <li key={e.id} className="relative py-5 pl-8">
            <span className={`absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full ${layerColor[e.layer]} ${e.isBirth ? "ring-4 ring-copper/30" : ""}`} />
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {e.year} · {e.layer}{e.isBirth ? " · you arrived" : ""}
            </p>
            <p className={`mt-1 font-display text-2xl ${e.isBirth ? "text-copper" : "text-ink"}`}>{e.title}</p>
            <p className="text-sm text-muted-foreground">{e.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function NarrativeSection({ capsule }: { capsule: CapsuleData }) {
  return (
    <section className="born-section">
      <p className="born-kicker">Your story</p>
      <h2 className="born-title">A short telling of the moment</h2>
      <blockquote className="mt-8 max-w-3xl border-l-2 border-copper pl-6 font-display text-2xl leading-snug text-ink md:text-3xl">
        {capsule.narrative}
      </blockquote>
    </section>
  );
}

export { MusicSection };
