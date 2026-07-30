import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { CapsuleData, CapsuleMode, CertificateTheme } from "@/lib/born/types";
import { WorldToggle } from "./WorldToggle";
import { ScopeBadge } from "./ScopeBadge";
import { ListenButtons } from "./ListenButtons";
import { BirthMomentMap } from "./BirthMomentMap";
import { StarMap } from "./StarMap";
import { CertificateReveal } from "./CertificateReveal";
import { saveCapsule } from "@/lib/born/capsule/store";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="born-section border-t border-border/40">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="born-eyebrow mb-3">{eyebrow}</p>
          <h2 className="mb-2 text-3xl md:text-4xl">{title}</h2>
          <div className="born-rule mb-8" />
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function CapsuleExperience({
  initial,
}: {
  initial: CapsuleData;
}) {
  const [capsule, setCapsule] = useState(initial);
  const [mode, setMode] = useState<CapsuleMode>("my_world");
  const [lang, setLang] = useState(capsule.input.preferLanguage ?? "English");

  const onThemeChange = (theme: CertificateTheme) => {
    const next = {
      ...capsule,
      certificate: { ...capsule.certificate, theme },
    };
    setCapsule(next);
    saveCapsule(next);
  };

  const musicBlock = useMemo(() => {
    if (mode === "the_world") return capsule.music.global;
    return capsule.music.regional;
  }, [mode, capsule.music]);

  const cinemaBlock = useMemo(() => {
    if (mode === "the_world") return capsule.cinema.global;
    return capsule.cinema.regional;
  }, [mode, capsule.cinema]);

  return (
    <div className="min-h-screen born-grain">
      <WorldToggle mode={mode} onChange={setMode} place={capsule.place} />

      <header className="container max-w-3xl py-16 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <p className="born-eyebrow mb-4">
              {mode === "my_world" ? "Your birth" : "Your era"}
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-6xl">
              {mode === "my_world" ? (
                <>
                  The world around{" "}
                  <span className="text-brass">{capsule.input.name}</span>
                </>
              ) : (
                <>What humanity was doing when you arrived</>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {mode === "my_world"
                ? `Here is the world that existed around ${capsule.place.city} when your story began.`
                : "Zoom out — global events, charts, and the shared human moment."}
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              {capsule.input.birthDate}
              {capsule.input.birthTime ? ` · ${capsule.input.birthTime}` : ""} · {capsule.place.timezone}
            </p>
          </motion.div>
        </AnimatePresence>
      </header>

      <BirthMomentMap place={capsule.place} revealCoords={Boolean(capsule.input.showCoordinates)} />

      <Section eyebrow="Your corner of the world" title="Regional birth snapshot">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["City", capsule.place.city],
            ["District", capsule.place.district || "—"],
            ["State / region", capsule.place.state || "—"],
            ["Country", capsule.place.country],
            ["Continent", capsule.place.continent],
            ["Timezone", capsule.place.timezone],
            ["Currency", capsule.place.currency || "—"],
            ["Languages (suggested)", capsule.place.languages.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-border/50 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
              <p className="mt-1 text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <ScopeBadge scope="local" confidence={capsule.population.city?.confidence} />
            <p className="mt-2 text-sm">{capsule.population.city?.value}</p>
          </div>
          <div>
            <ScopeBadge scope="national" confidence={capsule.population.country?.confidence} />
            <p className="mt-2 text-sm">{capsule.population.country?.value}</p>
          </div>
          <div>
            <ScopeBadge scope="global" confidence={capsule.population.world?.confidence} />
            <p className="mt-2 text-sm">{capsule.population.world?.value}</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Regional weather" title={`The air in ${capsule.place.city}`}>
        <ScopeBadge scope={capsule.weather.scope} confidence={capsule.weather.confidence} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Metric label="Condition" value={capsule.weather.condition} />
          <Metric label="Temperature" value={capsule.weather.temperatureC != null ? `${capsule.weather.temperatureC}°C` : "—"} />
          <Metric label="Humidity" value={capsule.weather.humidity != null ? `${capsule.weather.humidity}%` : "—"} />
          <Metric label="Wind" value={capsule.weather.windKmh != null ? `${capsule.weather.windKmh} km/h` : "—"} />
          <Metric label="Precipitation" value={capsule.weather.precipitationMm != null ? `${capsule.weather.precipitationMm} mm` : "—"} />
          <Metric label="Sunrise / Sunset" value={`${capsule.weather.sunrise?.slice(11, 16) || capsule.astronomy.sunrise} → ${capsule.weather.sunset?.slice(11, 16) || capsule.astronomy.sunset}`} />
        </div>
        {capsule.weather.stationNote && (
          <p className="mt-4 text-sm text-muted-foreground">{capsule.weather.stationNote}</p>
        )}
        {capsule.weather.normalComparison && (
          <p className="mt-2 text-sm text-muted-foreground">{capsule.weather.normalComparison}</p>
        )}
      </Section>

      <Section eyebrow="Local sky" title={capsule.astronomy.label}>
        <StarMap place={capsule.place} astronomy={capsule.astronomy} birthDate={capsule.input.birthDate} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Metric label="Moon phase" value={`${capsule.astronomy.moonPhase} (${capsule.astronomy.moonIllumination}%)`} />
          <Metric label="Sun altitude" value={`${capsule.astronomy.sunAltitude}°`} />
          <Metric label="Moonrise / Moonset" value={`${capsule.astronomy.moonrise ?? "—"} / ${capsule.astronomy.moonset ?? "—"}`} />
          <Metric label="Astronomical sun sign" value={capsule.astronomy.zodiacConstellation ?? "—"} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Seasonal constellations (educational): {capsule.astronomy.constellations.join(", ")}
        </p>
      </Section>

      <Section eyebrow="What your region sounded like" title="Regional culture & music">
        <div className="mb-8 space-y-4">
          {musicBlock.map((track) => (
            <div key={`${track.title}-${track.artist}`} className="border-b border-border/50 pb-4">
              <ScopeBadge scope={track.scope} />
              <p className="mt-2 font-display text-2xl">{track.title}</p>
              <p className="text-muted-foreground">{track.artist} · {track.regionLabel}</p>
              {track.note && <p className="mt-1 text-xs text-muted-foreground">{track.note}</p>}
              <div className="mt-3">
                <ListenButtons track={track} />
              </div>
            </div>
          ))}
        </div>

        {mode === "my_world" && (
          <div className="mb-8 grid gap-4 border border-border/50 p-4 md:grid-cols-3">
            <div>
              <ScopeBadge scope="regional" />
              <p className="mt-2 text-sm font-medium">{capsule.music.regional[0]?.title}</p>
            </div>
            <div>
              <ScopeBadge scope="national" />
              <p className="mt-2 text-sm font-medium">{capsule.music.national[0]?.title}</p>
            </div>
            <div>
              <ScopeBadge scope="global" />
              <p className="mt-2 text-sm font-medium">{capsule.music.global[0]?.title}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brass">Cinema</p>
            <ul className="mt-3 space-y-2">
              {cinemaBlock.map((f) => (
                <li key={f.title}>
                  <span className="font-medium">{f.title}</span>
                  <span className="text-muted-foreground"> · {f.year}</span>
                  {f.note && <p className="text-xs text-muted-foreground">{f.note}</p>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brass">Culture</p>
            <p className="mt-3 text-sm text-muted-foreground">{capsule.culture.note}</p>
            <p className="mt-3 text-sm"><span className="text-muted-foreground">Festivals:</span> {capsule.culture.festivals.join(" · ")}</p>
            <p className="mt-2 text-sm"><span className="text-muted-foreground">Foods:</span> {capsule.culture.foods.join(" · ")}</p>
            <p className="mt-2 text-sm"><span className="text-muted-foreground">TV:</span> {capsule.culture.television.join(" · ")}</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="What was happening near you?" title="Regional news hierarchy">
        <div className="space-y-6">
          {(["local", "regional", "national", "global"] as const).map((layer) => {
            const items = capsule.news.filter((n) => n.layer === layer);
            if (!items.length) return null;
            return (
              <div key={layer}>
                <ScopeBadge scope={layer === "local" ? "local" : layer === "regional" ? "regional" : layer === "national" ? "national" : "global"} />
                <ul className="mt-3 space-y-3">
                  {items.map((ev) => (
                    <li key={`${ev.year}-${ev.title}`} className="border-l border-brass/40 pl-4">
                      <p className="font-mono text-xs text-brass">{ev.year}</p>
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-sm text-muted-foreground">{ev.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Regional timeline" title="Layers of time">
        <ol className="relative space-y-0 border-l border-border/60 pl-6">
          {capsule.timeline.map((ev) => (
            <li key={`${ev.layer}-${ev.year}-${ev.title}`} className="relative pb-8">
              <span
                className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ${
                  ev.layer === "personal" ? "bg-brass shadow-[0_0_16px_hsl(var(--brass))]" : "bg-aurora/70"
                }`}
              />
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {ev.layer} · {ev.year}
              </p>
              <p className="mt-1 text-lg font-medium">{ev.title}</p>
              <p className="text-sm text-muted-foreground">{ev.summary}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Local cost of living" title="Your region — then & today">
        <div className="space-y-4">
          {capsule.prices.map((p) => (
            <div key={p.category} className="grid gap-2 border-b border-border/40 py-4 md:grid-cols-3">
              <div>
                <p className="font-medium">{p.category}</p>
                <ScopeBadge scope="regional" confidence={p.confidence} />
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">{p.thenLabel}</p>
                <p>{p.thenValue ?? "Unavailable — not invented"}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">{p.todayLabel}</p>
                <p>{p.todayValue ?? "—"}</p>
                {p.globalBenchmark && <p className="mt-1 text-xs text-muted-foreground">Global: {p.globalBenchmark}</p>}
              </div>
              {p.note && <p className="text-xs text-muted-foreground md:col-span-3">{p.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Regional technology" title="What technology looked like around you">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-border/50 p-5">
            <ScopeBadge scope="regional" />
            <p className="mt-3 text-sm">Mobile era: {capsule.technology.region.mobileEra}</p>
            <p className="mt-2 text-sm">Network: {capsule.technology.region.networkGeneration}</p>
            <p className="mt-2 text-sm">Internet: {capsule.technology.region.internetPenetration}</p>
            <p className="mt-2 text-sm">Devices: {capsule.technology.region.popularDevices.join(" · ")}</p>
          </div>
          <div className="border border-border/50 p-5">
            <ScopeBadge scope="global" />
            <p className="mt-3 text-sm">Major launch: {capsule.technology.global.majorLaunch}</p>
            <p className="mt-2 text-sm">OS: {capsule.technology.global.popularOs.join(" · ")}</p>
            <p className="mt-2 text-sm">Web: {capsule.technology.global.websites.join(" · ")}</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Regional sports" title="What people watched & played">
        <p className="text-sm text-muted-foreground mb-4">{capsule.sports.note}</p>
        <p className="text-sm"><span className="text-muted-foreground">Popular:</span> {capsule.sports.popularSports.join(" · ")}</p>
        <p className="mt-2 text-sm"><span className="text-muted-foreground">Local:</span> {capsule.sports.localTeams.join(" · ")}</p>
        <p className="mt-2 text-sm"><span className="text-muted-foreground">Around birth:</span> {capsule.sports.eventsAroundBirth.join(" · ")}</p>
      </Section>

      <Section eyebrow="Language" title="Want to experience your capsule in a regional language?">
        <p className="mb-4 text-sm text-muted-foreground">
          We never assume your preferred language from birthplace alone. Choose what feels right.
        </p>
        <div className="flex flex-wrap gap-2">
          {capsule.place.languages.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full border px-4 py-2 text-sm ${
                lang === l ? "border-brass bg-brass/15 text-brass" : "border-border text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Selected: <span className="text-foreground">{lang}</span>
          {lang !== "English" && " — full regional UI translations expand as language packs are added."}
        </p>
      </Section>

      <CertificateReveal capsule={capsule} onThemeChange={onThemeChange} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/40 py-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
