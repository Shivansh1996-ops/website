import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BornNav } from "@/components/born/BornNav";

export default function Index() {
  return (
    <div className="min-h-screen">
      <BornNav />
      <main>
        <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0">
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15,58,74,0.15), rgba(247,245,242,0.92) 55%, rgba(247,245,242,1)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-6xl font-semibold tracking-[0.12em] text-ink md:text-8xl"
            >
              BORN
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-4 max-w-xl font-display text-3xl leading-tight text-ink md:text-4xl"
            >
              The world that existed when your story began.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-4 max-w-md text-base text-muted-foreground md:text-lg"
            >
              A geographically personal birth capsule — your place, your sky, your charts — then a commemorative certificate.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/create"
                className="rounded-sm bg-sea px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Create your capsule
              </Link>
              <a
                href="#how"
                className="rounded-sm border border-border bg-paper/80 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                How it works
              </a>
            </motion.div>
          </div>
        </section>

        <section id="how" className="born-section">
          <p className="born-kicker">Two worlds at once</p>
          <h2 className="born-title">My World · The World</h2>
          <p className="born-lede">
            Every capsule is location-first. Hyderabad is not “generic India.” Your weather, sky, music, and news resolve from your birthplace outward — then meet the global layer.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              ["Local → Global", "City, region, country, and humanity — always labeled by scope."],
              ["Listen instantly", "Regional & global era tracks open on Spotify or YouTube."],
              ["Born Certificate", "A collectible commemorative artifact with QR verification."],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-border pt-5"
              >
                <p className="font-display text-2xl text-ink">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border px-5 py-10 text-center text-sm text-muted-foreground md:px-8">
          <p className="font-display text-xl tracking-[0.16em] text-ink">BORN</p>
          <p className="mt-2">The day your story began.</p>
        </footer>
      </main>
    </div>
  );
}
