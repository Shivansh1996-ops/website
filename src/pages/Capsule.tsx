import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BornNav } from "@/components/born/BornNav";
import { ModeToggle } from "@/components/born/ModeToggle";
import {
  BirthMomentMap,
  RegionalSnapshot,
  WeatherSection,
  SkySection,
  NewsSection,
  CultureExtras,
  TechSection,
  CostsSection,
  SportsSection,
  TimelineSection,
  NarrativeSection,
  MusicSection,
} from "@/components/born/CapsuleSections";
import { CertificateReveal } from "@/components/born/CertificateReveal";
import {
  createCapsule,
  loadCapsule,
  saveCapsule,
  decodeSharePayload,
  type CapsuleData,
  type CapsuleMode,
  type CertificateTheme,
} from "@/lib/born";

export default function CapsulePage() {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const fresh = Boolean((location.state as { fresh?: boolean } | null)?.fresh);

  const [capsule, setCapsule] = useState<CapsuleData | null>(null);
  const [mode, setMode] = useState<CapsuleMode>("my-world");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const existing = loadCapsule(token);
        if (existing) {
          if (!cancelled) setCapsule(existing);
          return;
        }
        const seed = decodeSharePayload(params.get("s") || "");
        if (seed && seed.token === token) {
          const rebuilt = await createCapsule(seed.input, {
            token: seed.token,
            certificateNumber: seed.certificateNumber,
            createdAt: seed.createdAt,
            privacy: seed.privacy,
          });
          saveCapsule(rebuilt);
          if (!cancelled) setCapsule(rebuilt);
          return;
        }
        if (!cancelled) setError("This capsule could not be found. Create a new one to begin.");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load capsule.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token, params]);

  function setTheme(theme: CertificateTheme) {
    if (!capsule) return;
    const next = {
      ...capsule,
      input: { ...capsule.input, certificateTheme: theme },
    };
    setCapsule(next);
    saveCapsule(next);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-display text-2xl text-ink animate-pulse">Gathering your world…</p>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen">
        <BornNav solid />
        <div className="mx-auto max-w-lg px-5 pt-32 text-center">
          <h1 className="born-title">Capsule unavailable</h1>
          <p className="born-lede mx-auto">{error}</p>
          <Link to="/create" className="mt-8 inline-block rounded-sm bg-sea px-5 py-3 text-sm text-primary-foreground">
            Create a capsule
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <BornNav solid />
      <div className="pt-16">
        <header className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
          <p className="born-kicker">Your birth</p>
          <h1 className="born-title">
            {capsule.input.name}
          </h1>
          <p className="born-lede">
            {capsule.dayOfWeek}, {capsule.input.birthDate}
            {capsule.input.birthTime ? ` · ${capsule.input.birthTime}` : ""} · {capsule.geo.city},{" "}
            {capsule.geo.country}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Capsule {capsule.publicToken} · {capsule.certificateNumber}
          </p>
          {fresh && (
            <p className="mt-4 text-sm text-sea">
              Welcome. Scroll the journey — local and global — then preserve it as your certificate.
            </p>
          )}
        </header>

        <ModeToggle mode={mode} onChange={setMode} geo={capsule.geo} />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <BirthMomentMap capsule={capsule} />
            <RegionalSnapshot capsule={capsule} mode={mode} />
            <MusicSection
              tracks={capsule.culture.music}
              mode={mode}
              city={capsule.geo.city}
              country={capsule.geo.country}
            />
            {mode === "my-world" && <WeatherSection capsule={capsule} />}
            <SkySection capsule={capsule} />
            <NewsSection capsule={capsule} mode={mode} />
            <CultureExtras capsule={capsule} mode={mode} />
            <TechSection capsule={capsule} mode={mode} />
            {mode === "my-world" && <CostsSection capsule={capsule} />}
            <SportsSection capsule={capsule} />
            <TimelineSection capsule={capsule} />
            <NarrativeSection capsule={capsule} />
          </motion.div>
        </AnimatePresence>

        {!showCert ? (
          <div className="born-section text-center">
            <p className="born-kicker">Your certificate</p>
            <h2 className="born-title">Ready to preserve the moment?</h2>
            <button
              type="button"
              onClick={() => {
                setShowCert(true);
                setTimeout(() => {
                  document.getElementById("certificate-anchor")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="mt-8 rounded-sm bg-copper px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Reveal certificate
            </button>
          </div>
        ) : (
          <div id="certificate-anchor">
            <CertificateReveal capsule={capsule} onThemeChange={setTheme} />
          </div>
        )}
      </div>
    </div>
  );
}
