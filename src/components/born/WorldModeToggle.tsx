import { motion, AnimatePresence } from "framer-motion";
import type { CapsuleMode } from "@/born/types";
import type { GeoLocation } from "@/born/types";

interface Props {
  mode: CapsuleMode;
  onChange: (mode: CapsuleMode) => void;
  location: GeoLocation;
}

export function WorldModeToggle({ mode, onChange, location }: Props) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-card/80 p-1 shadow-sm">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onChange("local")}
          className={`relative rounded-sm px-4 py-3 text-left transition ${
            mode === "local" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {mode === "local" && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 rounded-sm bg-primary"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.2em]">My World</div>
            <div className="mt-1 font-display text-xl leading-none">
              {location.city}
            </div>
            <div className="mt-1 text-xs opacity-80">
              {[location.state, location.country].filter(Boolean).join(" · ")}
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange("global")}
          className={`relative rounded-sm px-4 py-3 text-left transition ${
            mode === "global" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {mode === "global" && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 rounded-sm bg-primary"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.2em]">The World</div>
            <div className="mt-1 font-display text-xl leading-none">Global</div>
            <div className="mt-1 text-xs opacity-80">Events & trends across humanity</div>
          </div>
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="px-3 pb-2 pt-3 text-xs text-muted-foreground"
        >
          {mode === "local"
            ? `What was happening around ${location.city} when you arrived.`
            : "What was happening across humanity on your day."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
