import { motion } from "framer-motion";
import type { CapsuleMode } from "@/lib/born/types";
import type { GeographicPlace } from "@/lib/born/types";

interface Props {
  mode: CapsuleMode;
  onChange: (mode: CapsuleMode) => void;
  place: GeographicPlace;
}

export function WorldToggle({ mode, onChange, place }: Props) {
  return (
    <div className="sticky top-0 z-40 border-b border-border/60 bg-[hsl(var(--night)/0.85)] backdrop-blur-xl">
      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex rounded-full border border-border/80 bg-muted/40 p-1">
          <motion.div
            className="absolute inset-y-1 rounded-full bg-brass/20 border border-brass/40"
            layout
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{
              width: "calc(50% - 4px)",
              left: mode === "my_world" ? 4 : "calc(50% + 0px)",
            }}
          />
          <button
            type="button"
            onClick={() => onChange("my_world")}
            className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === "my_world" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            📍 My World
          </button>
          <button
            type="button"
            onClick={() => onChange("the_world")}
            className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === "the_world" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            🌎 The World
          </button>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {mode === "my_world" ? (
            <span>
              <span className="text-brass">{place.city}</span>
              {place.state ? ` · ${place.state}` : ""} · {place.country}
            </span>
          ) : (
            <span>
              <span className="text-aurora">Global</span> · events & trends across humanity
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
