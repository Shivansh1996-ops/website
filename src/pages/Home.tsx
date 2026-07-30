import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden born-grain">
      <div className="pointer-events-none absolute inset-0 born-map-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-aurora/10 blur-3xl" />

      <nav className="relative z-10 container flex items-center justify-between py-6">
        <span className="font-display text-xl tracking-wide">BORN</span>
        <Link
          to="/create"
          className="rounded-full border border-brass/50 px-4 py-2 text-sm text-brass transition hover:bg-brass/10"
        >
          Begin
        </Link>
      </nav>

      <main className="relative z-10 container flex min-h-[calc(100vh-5rem)] flex-col justify-center pb-20 pt-8">
        <motion.p
          className="born-eyebrow mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The day your story began
        </motion.p>

        <motion.h1
          className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          BORN
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Not a list of birthday facts — the world that existed around you when you arrived.
          Your place. Your region. Your sky. Your era.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/create"
            className="rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Create your capsule
          </Link>
          <a
            href="#how"
            className="rounded-full border border-border px-7 py-3.5 text-sm text-muted-foreground transition hover:border-brass/40 hover:text-foreground"
          >
            How it works
          </a>
        </motion.div>

        <motion.div
          className="mt-20 grid max-w-3xl gap-6 border-t border-border/50 pt-10 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            ["My World", "City weather, regional music, local sky"],
            ["The World", "Global charts, events, shared culture"],
            ["Certificate", "A collectible origin artifact you can share"],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-display text-lg text-brass">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <section id="how" className="relative z-10 border-t border-border/40 py-20">
        <div className="container max-w-3xl">
          <p className="born-eyebrow mb-3">The journey</p>
          <h2 className="mb-8 text-3xl md:text-4xl">You → place → region → country → world → sky → certificate</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li>1. Enter birth date, optional time, and birthplace.</li>
            <li>2. We resolve coordinates, timezone, and geographic hierarchy.</li>
            <li>3. Explore regional and global layers — music you can open on Spotify or YouTube.</li>
            <li>4. Preserve the moment with The BORN Certificate.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
