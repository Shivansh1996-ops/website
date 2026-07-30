import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { encodeShareParams } from "@/lib/born/capsule/store";
import type { CapsuleData, CertificateTheme } from "@/lib/born/types";
import { StarMap } from "./StarMap";

const THEME_STYLES: Record<CertificateTheme, string> = {
  archive: "bg-[#f4efe4] text-[#2a2418] border-[#c4a574]",
  cosmos: "bg-[#0c1220] text-[#e8e2d4] border-[hsl(var(--brass))]",
  origin: "bg-[#111111] text-[#f5f5f0] border-[#888]",
  earth: "bg-[#122018] text-[#e7efe8] border-[#6a8f6a]",
  time: "bg-[#101820] text-[#dce8f0] border-[#5a8aa8]",
};

export function CertificateView({
  capsule,
  variant = "desktop",
  forExport = false,
}: {
  capsule: CapsuleData;
  variant?: "desktop" | "mobile" | "social";
  forExport?: boolean;
}) {
  const { input, place, weather, astronomy, music, cinema, population, certificate } = capsule;
  const [qr, setQr] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${capsule.publicId}?p=${encodeURIComponent(encodeShareParams(capsule))}`
      : `https://born.app/c/${capsule.publicId}`;

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 160,
      color: {
        dark: certificate.theme === "archive" ? "#2a2418" : "#e8e2d4",
        light: certificate.theme === "archive" ? "#f4efe4" : "#0c1220",
      },
    }).then(setQr);
  }, [shareUrl, certificate.theme]);

  const aspect =
    variant === "mobile" || variant === "social"
      ? "aspect-[9/16] max-w-md"
      : "aspect-[1.414/1] max-w-4xl";

  return (
    <div
      ref={ref}
      id="born-certificate"
      className={`${aspect} w-full mx-auto overflow-hidden rounded-sm border-2 ${THEME_STYLES[certificate.theme]} ${forExport ? "" : "shadow-2xl"}`}
    >
      <div className="relative flex h-full flex-col p-6 md:p-10">
        <div className="pointer-events-none absolute inset-3 border border-current/20" />
        <header className="relative z-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] opacity-70">BORN</p>
          <h1 className="mt-2 font-display text-2xl md:text-4xl">The BORN Certificate</h1>
          <p className="mt-2 text-xs opacity-70">
            A commemorative digital certificate — not an official government document.
          </p>
        </header>

        <div className="relative z-10 mt-6 flex-1 space-y-4 text-center">
          <p className="text-sm opacity-80">This certifies the beginning of</p>
          <p className="font-display text-3xl md:text-5xl">{input.name}</p>
          <p className="text-sm">
            Born on <span className="text-brass font-medium">{input.birthDate}</span>
            {certificate.showBirthTime && input.birthTime ? (
              <>
                {" "}at <span className="font-medium">{input.birthTime}</span>
              </>
            ) : null}
          </p>
          <p className="text-sm">
            In {place.city}
            {place.state ? `, ${place.state}` : ""}, {place.country}
          </p>

          <div className="mx-auto grid max-w-2xl gap-4 pt-2 text-left text-xs md:grid-cols-2 md:text-sm">
            <div className="space-y-1 border border-current/15 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">Your World</p>
              <p>Timezone: {place.timezone}</p>
              <p>
                Weather: {weather.condition}
                {weather.temperatureC != null ? ` · ${weather.temperatureC}°C` : ""}
              </p>
              <p>
                Sun: {astronomy.sunrise} → {astronomy.sunset}
              </p>
              <p>Moon: {astronomy.moonPhase}</p>
            </div>
            <div className="space-y-1 border border-current/15 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">Your Era</p>
              <p>World pop: {population.world?.value}</p>
              <p>Music: {music.global[0]?.title ?? "—"}</p>
              <p>Film: {cinema.global[0]?.title ?? "—"}</p>
              <p>Day: {new Date(input.birthDate + "T12:00:00").toLocaleDateString("en", { weekday: "long" })}</p>
            </div>
          </div>

          {variant === "desktop" && (
            <div className="mx-auto max-w-md scale-90 opacity-90">
              <StarMap place={place} astronomy={astronomy} birthDate={input.birthDate} />
            </div>
          )}

          <p className="font-display text-lg italic opacity-90">“{certificate.quote}”</p>
        </div>

        <footer className="relative z-10 mt-4 flex items-end justify-between gap-4">
          <div className="text-left font-mono text-[10px] uppercase tracking-wider opacity-70">
            <p>{certificate.certificateNumber}</p>
            {certificate.showCoordinates && (
              <p>
                {place.lat.toFixed(4)}°, {place.lon.toFixed(4)}°
              </p>
            )}
            <p>Verify: /verify/{certificate.publicToken}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            {qr && <img src={qr} alt="Capsule QR" className="h-16 w-16 md:h-20 md:w-20" />}
            <div className="rounded-full border border-current/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em]">
              BORN · The day your story began
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
