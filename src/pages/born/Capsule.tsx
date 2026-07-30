import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BornNav } from "@/components/born/BornNav";
import { WorldModeToggle } from "@/components/born/WorldModeToggle";
import { BirthMomentMap } from "@/components/born/BirthMomentMap";
import { RegionalSnapshot } from "@/components/born/RegionalSnapshot";
import { MusicSection } from "@/components/born/MusicSection";
import { CultureSection } from "@/components/born/CultureSection";
import { LocalSky } from "@/components/born/LocalSky";
import { RegionalTimeline } from "@/components/born/RegionalTimeline";
import { TechSection, SportsSection, PricesSection } from "@/components/born/EraSections";
import { CertificateReveal } from "@/components/born/CertificateReveal";
import { getCapsuleByToken } from "@/born/capsule/create";
import type { CapsuleMode } from "@/born/types";
import { getRegionalMusic } from "@/born/data/music";

export default function CapsulePage() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const capsule = useMemo(() => (token ? getCapsuleByToken(token) : null), [token]);
  const [mode, setMode] = useState<CapsuleMode>("local");
  const [showCert, setShowCert] = useState(params.get("reveal") === "1");

  if (!capsule) {
    return (
      <div className="min-h-screen">
        <BornNav />
        <main className="container py-24 text-center">
          <h1 className="font-display text-4xl">Capsule not found</h1>
          <p className="mt-3 text-muted-foreground">
            This link may be private, expired, or from another browser.
          </p>
          <Link to="/create" className="mt-8 inline-block text-teal underline">
            Create your own
          </Link>
        </main>
      </div>
    );
  }

  if (capsule.privacy === "private" && !params.get("owner")) {
    return (
      <div className="min-h-screen">
        <BornNav />
        <main className="container py-24 text-center">
          <h1 className="font-display text-4xl">This capsule is private</h1>
          <p className="mt-3 text-muted-foreground">The QR and share link do not expose private details.</p>
        </main>
      </div>
    );
  }

  const year = parseInt(capsule.input.birthDate.slice(0, 4), 10);
  const music = getRegionalMusic({
    countryCode: capsule.location.countryCode,
    state: capsule.location.state,
    year,
  });

  const culture = mode === "local" ? capsule.culture : capsule.globalCulture;
  const musicItems = mode === "local" ? culture.music : capsule.globalCulture.music;

  return (
    <div className="min-h-screen pb-24">
      <BornNav />
      <main className="container space-y-20 py-10 md:py-16">
        {/* Opening */}
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Your birth</p>
          <h1 className="mt-2 font-display text-5xl text-ink md:text-7xl">{capsule.input.name}</h1>
          <p className="mt-4 font-display text-2xl italic text-ink/80 md:text-3xl">
            {formatDate(capsule.input.birthDate)}
            {capsule.input.birthTime ? ` · ${capsule.input.birthTime}` : ""}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{capsule.narrative}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="rounded-sm border border-border px-2 py-1">{capsule.dayOfWeek}</span>
            <span className="rounded-sm border border-border px-2 py-1">{capsule.season}</span>
            <span className="rounded-sm border border-border px-2 py-1">{capsule.certificateNumber}</span>
          </div>
        </header>

        <WorldModeToggle mode={mode} onChange={setMode} location={capsule.location} />

        <BirthMomentMap location={capsule.location} />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "local" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-20"
          >
            <RegionalSnapshot capsule={capsule} mode={mode} />

            <MusicSection
              title={mode === "local" ? "What your region sounded like" : "What the world sounded like"}
              subtitle={
                mode === "local"
                  ? `Top regional & national songs around ${year} — open them on Spotify or YouTube.`
                  : `Global era hits around ${year}.`
              }
              items={musicItems}
              national={mode === "local" ? music.national : undefined}
              global={mode === "local" ? music.global : undefined}
              note={mode === "local" ? music.note ?? culture.note : undefined}
              mode={mode}
            />

            <CultureSection capsule={capsule} mode={mode} />

            {mode === "local" && <LocalSky capsule={capsule} />}

            <RegionalTimeline capsule={capsule} mode={mode} />

            <TechSection capsule={capsule} mode={mode} />

            {mode === "local" && (
              <>
                <SportsSection capsule={capsule} />
                <PricesSection capsule={capsule} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Story close */}
        <section className="rounded-sm border border-border bg-card/50 p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Your story</p>
          <p className="mt-4 font-display text-3xl italic text-ink md:text-4xl">“{capsule.quote}”</p>
          <button
            type="button"
            onClick={() => setShowCert(true)}
            className="mt-8 rounded-sm bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground"
          >
            Preserve this moment
          </button>
        </section>

        {showCert && (
          <CertificateReveal capsule={capsule} onDone={() => setShowCert(false)} />
        )}
      </main>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
