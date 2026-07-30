import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mapZoomSteps, buildHierarchy } from "@/born/engine/hierarchy";
import type { GeoLocation } from "@/born/types";

interface Props {
  location: GeoLocation;
}

export function BirthMomentMap({ location }: Props) {
  const hierarchy = buildHierarchy({
    city: location.city,
    state: location.state,
    district: location.district,
    country: location.country,
    countryCode: location.countryCode,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  });
  const steps = mapZoomSteps(hierarchy);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers: number[] = [];
    steps.forEach((_, i) => {
      if (i === 0) return;
      timers.push(window.setTimeout(() => setStep(i), i * 900));
    });
    return () => timers.forEach(clearTimeout);
    // Re-run cinematic zoom when birthplace changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.displayName, location.latitude, location.longitude]);

  const current = steps[step];

  return (
    <section className="relative overflow-hidden rounded-sm border border-border bg-[#15202B] text-[#EEF1F4]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${50 + location.longitude / 4}% ${50 - location.latitude / 3}%, rgba(13,115,119,0.55), transparent 40%),
            linear-gradient(160deg, #0b1219, #1a2836 50%, #0f1a22)
          `,
        }}
      />
      {/* subtle meridians */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
        {[20, 40, 60, 80].map((x) => (
          <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#9BB0C0" strokeWidth="0.5" />
        ))}
        {[25, 50, 75].map((y) => (
          <ellipse key={`h${y}`} cx="50%" cy={`${y}%`} rx="45%" ry="8%" fill="none" stroke="#9BB0C0" strokeWidth="0.5" />
        ))}
        <circle
          cx={`${50 + location.longitude / 3.6}%`}
          cy={`${50 - location.latitude / 2}%`}
          r="4"
          fill="#C4784A"
        />
      </svg>

      <div className="relative flex min-h-[320px] flex-col justify-end p-8 md:min-h-[380px] md:p-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9BB0C0]">Birth moment map</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="mt-4"
          >
            <h2 className="font-display text-5xl md:text-7xl">{current.label}</h2>
            <p className="mt-3 max-w-md text-sm text-[#C5D0D8] md:text-base">{current.detail}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Map step ${i + 1}`}
              onClick={() => setStep(i)}
              className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-copper" : "bg-white/15"}`}
            />
          ))}
        </div>
        <p className="mt-4 text-[10px] tracking-wide text-[#7A8B98]">
          Coordinates stay private unless you choose to reveal them on your certificate.
        </p>
      </div>
    </section>
  );
}
