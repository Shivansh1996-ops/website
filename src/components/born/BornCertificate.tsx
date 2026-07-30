import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CertificatePayload, CertificateTheme } from "@/lib/born";
import { capsuleUrl, THEME_META } from "@/lib/born";

const themeStyles: Record<CertificateTheme, string> = {
  archive: "bg-[#f6f1e7] text-[#1c1814] border-[#c4b49a]",
  cosmos: "bg-[#0b1426] text-[#e8eef7] border-[#6b7c99]",
  origin: "bg-white text-[#14213d] border-[#14213d]",
  earth: "bg-[#eef3ef] text-[#1a2f23] border-[#5b7c6a]",
  time: "bg-[#111827] text-[#f3f4f6] border-[#22d3ee]/50",
};

export const BornCertificate = forwardRef<HTMLDivElement, {
  payload: CertificatePayload;
  format?: "desktop" | "mobile" | "social";
}>(function BornCertificate({ payload, format = "desktop" }, ref) {
  const theme = payload.theme;
  const verifyPath = capsuleUrl(payload.publicToken);
  const aspect =
    format === "mobile" || format === "social"
      ? "aspect-[9/16] max-w-md"
      : "aspect-[1.414/1] max-w-4xl";

  return (
    <div
      ref={ref}
      data-theme={theme}
      className={`relative mx-auto w-full overflow-hidden border-2 p-6 shadow-sm md:p-10 ${themeStyles[theme]} ${aspect}`}
    >
      <div className="pointer-events-none absolute inset-3 border border-current/20" />
      <div className="pointer-events-none absolute inset-5 border border-current/10" />

      <div className="relative flex h-full flex-col justify-between">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">
              {THEME_META[theme].label} edition
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[0.06em] md:text-4xl">
              THE BORN CERTIFICATE
            </h2>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed opacity-70">
              A commemorative digital certificate — not an official government document.
            </p>
          </div>
          <BornSeal theme={theme} />
        </header>

        <div className="my-6 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">This certifies the beginning of</p>
          <p className="font-display text-4xl md:text-5xl">{payload.name}</p>
          <p className="text-sm opacity-80">
            Born on <strong>{formatDate(payload.birthDate)}</strong>
            {payload.birthTime ? <> at <strong>{payload.birthTime}</strong></> : null}
          </p>
          <p className="text-sm opacity-80">
            In <strong>{payload.city}</strong>
            {payload.region ? <>, {payload.region}</> : null}, <strong>{payload.country}</strong>
          </p>
        </div>

        <div className="grid gap-6 text-xs md:grid-cols-2 md:text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">Your world</p>
            <ul className="mt-2 space-y-1 opacity-90">
              <li>Birthplace: {payload.city}</li>
              <li>Region: {payload.region || "—"}</li>
              <li>Country: {payload.country}</li>
              <li>Timezone: {payload.timezone}</li>
              <li>Weather: {payload.weatherSummary}</li>
              <li>Sunrise / Sunset: {payload.sunrise || "—"} / {payload.sunset || "—"}</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">Your era</p>
            <ul className="mt-2 space-y-1 opacity-90">
              <li>World population: {payload.worldPopulation || "—"}</li>
              <li>Major event: {payload.majorEvent || "—"}</li>
              <li>Technology: {payload.majorTech || "—"}</li>
              <li>Music: {payload.popularMusic || "—"}</li>
              <li>Film: {payload.majorMovie || "—"}</li>
              <li>Moon: {payload.moonPhase}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-current/15 pt-4">
          <div className="space-y-1 text-[11px] opacity-75">
            <p>{payload.dayOfWeek} · {payload.season}</p>
            <p>
              Sky map: {payload.exactSky ? "Exact birth time" : "Approximate sky for this date"}
            </p>
            {payload.showCoordinates && payload.coordinates && (
              <p>
                Birth coordinates: {payload.coordinates.lat.toFixed(4)}, {payload.coordinates.lon.toFixed(4)}
              </p>
            )}
            <p className="font-semibold tracking-[0.14em]">{payload.certificateNumber}</p>
          </div>
          <div className="flex items-end gap-3">
            <div className={`rounded-sm bg-white p-2 ${theme === "cosmos" || theme === "time" ? "" : ""}`}>
              <QRCodeSVG value={verifyPath} size={72} level="M" includeMargin={false} />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-display text-lg italic opacity-80 md:text-xl">
          “{payload.quote}”
        </p>
      </div>
    </div>
  );
});

function BornSeal({ theme }: { theme: CertificateTheme }) {
  const light = theme === "archive" || theme === "origin" || theme === "earth";
  return (
    <div
      className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2 text-center ${
        light ? "border-copper text-copper" : "border-[#d4a574] text-[#d4a574]"
      }`}
    >
      <span className="font-display text-sm font-bold tracking-[0.2em]">BORN</span>
      <span className="mt-0.5 px-1 text-[7px] uppercase leading-tight tracking-wider opacity-80">
        The day your story began
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${iso}T12:00:00`));
  } catch {
    return iso;
  }
}
