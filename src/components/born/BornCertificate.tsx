import { useMemo, useRef } from "react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { CapsuleData, CertificateTheme } from "@/born/types";
import { getPublicShareUrl } from "@/born/capsule/create";
import { starMapPoints } from "@/born/engine/providers/astronomy";
import { cn } from "@/lib/utils";

const THEME_STYLES: Record<
  CertificateTheme,
  { bg: string; ink: string; accent: string; border: string; label: string }
> = {
  archive: {
    bg: "#F4F0E6",
    ink: "#1C1812",
    accent: "#8B5A2B",
    border: "#C4B59A",
    label: "Archive",
  },
  cosmos: {
    bg: "#0E1620",
    ink: "#E8EEF2",
    accent: "#C4784A",
    border: "#2A3A4A",
    label: "Cosmos",
  },
  origin: {
    bg: "#FAFAF8",
    ink: "#15202B",
    accent: "#0D7377",
    border: "#D5D8DC",
    label: "Origin",
  },
  earth: {
    bg: "#E8EEE6",
    ink: "#1A2418",
    accent: "#3D5A3D",
    border: "#B7C4B2",
    label: "Earth",
  },
  time: {
    bg: "#E9EEF2",
    ink: "#0F1A22",
    accent: "#1F4E5F",
    border: "#A8B8C4",
    label: "Time",
  },
};

interface Props {
  capsule: CapsuleData;
  theme: CertificateTheme;
  includeCoordinates?: boolean;
  includeBirthTime?: boolean;
  variant?: "desktop" | "mobile" | "social";
  className?: string;
}

export function BornCertificate({
  capsule,
  theme,
  includeCoordinates = false,
  includeBirthTime = true,
  variant = "desktop",
  className,
}: Props) {
  const t = THEME_STYLES[theme];
  const [qr, setQr] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const shareUrl = getPublicShareUrl(capsule);
  const stars = useMemo(
    () => starMapPoints(capsule.certificateNumber, 36),
    [capsule.certificateNumber],
  );

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 128,
      color: { dark: t.ink, light: t.bg },
    }).then(setQr);
  }, [shareUrl, t.ink, t.bg]);

  const aspect =
    variant === "mobile" || variant === "social"
      ? "aspect-[9/16] max-w-sm"
      : "aspect-[1/1.25] max-w-2xl";

  return (
    <div
      ref={ref}
      id="born-certificate"
      className={cn("relative w-full overflow-hidden rounded-sm shadow-xl", aspect, className)}
      style={{ background: t.bg, color: t.ink, border: `1px solid ${t.border}` }}
    >
      <div className="absolute inset-3 border" style={{ borderColor: t.border }} />
      <div className="absolute inset-5 border opacity-50" style={{ borderColor: t.accent }} />

      {/* star map watermark */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.25} fill={t.accent} />
        ))}
      </svg>

      <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: t.accent }}>
                The Born Certificate
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">This certifies the beginning of</h2>
              <p className="mt-3 font-display text-4xl italic md:text-5xl">{capsule.input.name}</p>
            </div>
            <Seal accent={t.accent} ink={t.ink} />
          </div>

          <div className="mt-8 grid gap-3 text-sm md:grid-cols-2">
            <Field label="Born on" value={formatDate(capsule.input.birthDate)} accent={t.accent} />
            {includeBirthTime && capsule.input.birthTime && (
              <Field label="At" value={capsule.input.birthTime} accent={t.accent} />
            )}
            <Field
              label="In"
              value={[capsule.location.city, capsule.location.state, capsule.location.country]
                .filter(Boolean)
                .join(", ")}
              accent={t.accent}
            />
            <Field label="Day" value={`${capsule.dayOfWeek} · ${capsule.season}`} accent={t.accent} />
            <Field label="Moon" value={capsule.sky.moonPhaseName} accent={t.accent} />
            <Field label="Timezone" value={capsule.location.timezone} accent={t.accent} />
            {includeCoordinates && (
              <Field
                label="Birth coordinates"
                value={`${capsule.location.latitude.toFixed(3)}, ${capsule.location.longitude.toFixed(3)}`}
                accent={t.accent}
              />
            )}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
                Your world
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                {capsule.weather.temperatureC != null
                  ? `${capsule.weather.temperatureC}°C, ${capsule.weather.condition}. `
                  : `${capsule.weather.condition}. `}
                Sunrise {fmtTime(capsule.sky.sunrise)} · Sunset {fmtTime(capsule.sky.sunset)}.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
                Your era
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                World population {capsule.population.world?.value}.{" "}
                {capsule.globalCulture.music[0]
                  ? `Charting nearby: “${capsule.globalCulture.music[0].title}”.`
                  : ""}{" "}
                {capsule.globalCulture.films[0]
                  ? `Cinema: ${capsule.globalCulture.films[0].title}.`
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4 border-t pt-4" style={{ borderColor: t.border }}>
          <div>
            <p className="font-display text-xl italic">“{capsule.quote}”</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] opacity-70">
              {capsule.certificateNumber} · Theme {THEME_STYLES[theme].label}
            </p>
            <p className="mt-2 max-w-xs text-[10px] leading-relaxed opacity-60">
              A commemorative digital certificate — not an official government document.
            </p>
          </div>
          {qr && (
            <div className="shrink-0 text-center">
              <img src={qr} alt="Capsule QR" className="h-20 w-20" />
              <p className="mt-1 text-[9px] uppercase tracking-wider opacity-60">Verify</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
        {label}
      </div>
      <div className="mt-0.5 font-display text-xl">{value}</div>
    </div>
  );
}

function Seal({ accent, ink }: { accent: string; ink: string }) {
  return (
    <div
      className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2 text-center animate-seal"
      style={{ borderColor: accent, color: ink }}
    >
      <span className="font-display text-sm font-semibold tracking-wider">BORN</span>
      <span className="mt-0.5 px-1 text-[7px] uppercase leading-tight tracking-wide opacity-70">
        The day your story began
      </span>
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

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export { THEME_STYLES };
