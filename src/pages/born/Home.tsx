import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BornNav } from "@/components/born/BornNav";

export default function BornHome() {
  return (
    <div className="relative min-h-screen">
      <BornNav />
      <main>
        {/* Hero — one composition, brand first, full-bleed atmosphere */}
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-end overflow-hidden pb-16 pt-24">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 80% 50% at 70% 40%, rgba(13,115,119,0.18), transparent 55%),
                  radial-gradient(ellipse 60% 40% at 20% 80%, rgba(196,120,74,0.12), transparent 50%),
                  linear-gradient(180deg, transparent 30%, hsl(210 20% 96%) 95%)
                `,
              }}
            />
            <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden>
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M48 0H0V48" fill="none" stroke="#15202B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="68%" cy="38%" r="120" fill="none" stroke="#0D7377" strokeWidth="1" />
              <circle cx="68%" cy="38%" r="80" fill="none" stroke="#C4784A" strokeWidth="0.75" strokeDasharray="3 4" />
              <circle cx="68%" cy="38%" r="4" fill="#15202B" />
            </svg>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-[clamp(4.5rem,14vw,9rem)] font-semibold leading-[0.85] tracking-tight text-ink">
                BORN
              </h1>
              <p className="mt-6 max-w-lg font-display text-2xl italic text-ink/80 md:text-3xl">
                The world that existed around you when your story began.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Not a list of birthday facts — a geographically personal capsule of your place, your sky, and your era.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/create"
                  className="rounded-sm bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90"
                >
                  Create your capsule
                </Link>
                <a
                  href="#how"
                  className="rounded-sm border border-border bg-background/60 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition hover:border-primary"
                >
                  How it works
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how" className="container py-24">
          <div className="atlas-rule mb-16" />
          <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Two worlds at once</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl">
            Your corner of Earth — and everything beyond it.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Location first",
                d: "Birthplace resolves to coordinates, timezone, and hierarchy — city, region, country, continent.",
              },
              {
                t: "Listen where you were",
                d: "Regional charts with Spotify and YouTube links — Hyderabad sounds different from London.",
              },
              {
                t: "Preserve the moment",
                d: "A commemorative Born Certificate with QR verification — collectible, never official.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-2xl text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-20">
          <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Begin</p>
              <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
                Enter a date. Enter a place.
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                We’ll build the capsule around where you actually arrived — not a generic birthday page.
              </p>
            </div>
            <Link
              to="/create"
              className="rounded-sm bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
            >
              Start now
            </Link>
          </div>
        </section>

        <footer className="container py-10 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-display text-lg text-ink">BORN</span>
            <span>Commemorative experience · Not a legal birth certificate</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
