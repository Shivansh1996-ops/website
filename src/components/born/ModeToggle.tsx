import { motion } from "framer-motion";
import type { CapsuleMode, GeoHierarchy } from "@/lib/born";

export function ModeToggle({
  mode,
  onChange,
  geo,
}: {
  mode: CapsuleMode;
  onChange: (m: CapsuleMode) => void;
  geo: GeoHierarchy;
}) {
  return (
    <div className="sticky top-16 z-40 border-b border-border/60 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="relative inline-flex rounded-full border border-border bg-mist p-1">
          {(
            [
              { id: "my-world", label: "My World" },
              { id: "the-world", label: "The World" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === opt.id ? "text-primary-foreground" : "text-muted-foreground hover:text-ink"
              }`}
            >
              {mode === opt.id && (
                <motion.span
                  layoutId="mode-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-sea"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {opt.label}
            </button>
          ))}
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-right"
        >
          {mode === "my-world" ? (
            <>
              <p className="font-display text-xl text-ink md:text-2xl">
                {geo.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {[geo.state, geo.country].filter(Boolean).join(" · ")}
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-xl text-ink md:text-2xl">The World</p>
              <p className="text-sm text-muted-foreground">Global events and trends</p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
