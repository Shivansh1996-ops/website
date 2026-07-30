import { motion } from "framer-motion";
import type { GeographicPlace } from "@/lib/born/types";

const STEPS = ["Earth", "Continent", "Country", "Region", "City", "Birthplace"] as const;

export function BirthMomentMap({ place, revealCoords }: { place: GeographicPlace; revealCoords: boolean }) {
  return (
    <section className="born-section born-map-grid overflow-hidden">
      <div className="container max-w-3xl">
        <p className="born-eyebrow mb-3">Birth moment map</p>
        <h2 className="mb-2 text-3xl md:text-4xl">This is where your story began.</h2>
        <div className="born-rule mb-10" />

        <div className="relative mx-auto aspect-square max-w-md">
          <motion.div
            className="absolute inset-0 rounded-full border border-brass/20"
            initial={{ scale: 0.35, opacity: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-[12%] rounded-full border border-aurora/30"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 1.6 }}
          />
          <motion.div
            className="absolute inset-[28%] rounded-full border border-brass/40 bg-brass/5"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 1.4 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass shadow-[0_0_24px_hsl(var(--brass))]"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, type: "spring" }}
          />
        </div>

        <ol className="mt-10 space-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {STEPS.map((step, i) => {
            const value =
              step === "Earth" ? "Planet Earth" :
              step === "Continent" ? place.continent :
              step === "Country" ? place.country :
              step === "Region" ? place.state || place.district || "—" :
              step === "City" ? place.city :
              place.district || place.city;
            return (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-baseline justify-between gap-4 border-b border-border/40 py-2"
              >
                <span className="text-brass/80">{step}</span>
                <span className="text-right text-foreground/90 normal-case tracking-normal font-sans text-sm">
                  {value}
                </span>
              </motion.li>
            );
          })}
        </ol>

        {!revealCoords && (
          <p className="mt-6 text-sm text-muted-foreground">
            Exact coordinates stay private unless you choose to display them on your certificate.
          </p>
        )}
        {revealCoords && (
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            {place.lat.toFixed(4)}°, {place.lon.toFixed(4)}° · {place.timezone}
          </p>
        )}
      </div>
    </section>
  );
}
