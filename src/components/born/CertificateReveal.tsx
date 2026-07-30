import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CapsuleData, CertificateTheme } from "@/born/types";
import { BornCertificate, THEME_STYLES } from "./BornCertificate";
import { getSharePath, getVerifyPath, saveCapsule } from "@/born/capsule/create";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const THEMES = Object.keys(THEME_STYLES) as CertificateTheme[];

export function CertificateReveal({
  capsule,
  onDone,
}: {
  capsule: CapsuleData;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const [theme, setTheme] = useState<CertificateTheme>(capsule.theme);
  const [showCoords, setShowCoords] = useState(!!capsule.input.showCoordinates);
  const [showTime, setShowTime] = useState(capsule.input.showBirthTime !== false);
  const [busy, setBusy] = useState(false);

  const lines = [
    "You have explored your world.",
    "You have explored the world around it.",
    "Now let's preserve the moment.",
  ];

  const advance = () => {
    if (phase < lines.length) setPhase((p) => p + 1);
  };

  const downloadPdf = async () => {
    const el = document.getElementById("born-certificate");
    if (!el) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / canvas.width, pageH / canvas.height) * 0.9;
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      pdf.addImage(img, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`${capsule.certificateNumber}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const downloadImage = async () => {
    const el = document.getElementById("born-certificate");
    if (!el) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${capsule.certificateNumber}-social.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  const applyTheme = (th: CertificateTheme) => {
    setTheme(th);
    const next = { ...capsule, theme: th };
    saveCapsule(next);
  };

  if (phase < lines.length) {
    return (
      <div
        className="flex min-h-[60vh] cursor-pointer flex-col items-center justify-center px-6 text-center"
        onClick={advance}
        onKeyDown={(e) => e.key === "Enter" && advance()}
        role="button"
        tabIndex={0}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="font-display text-3xl text-ink md:text-5xl"
          >
            {lines[phase]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Tap to continue</p>
        <button
          type="button"
          className="mt-4 text-xs text-teal underline"
          onClick={(e) => {
            e.stopPropagation();
            setPhase(lines.length);
          }}
        >
          Skip to certificate
        </button>
      </div>
    );
  }

  return (
    <div className="animate-rise space-y-8">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Final reveal</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">The Born Certificate</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A commemorative digital certificate — not an official government document.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {THEMES.map((th) => (
          <button
            key={th}
            type="button"
            onClick={() => applyTheme(th)}
            className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition ${
              theme === th ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
            }`}
          >
            {THEME_STYLES[th].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} />
          Show coordinates
        </label>
        {capsule.input.birthTime && (
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showTime} onChange={(e) => setShowTime(e.target.checked)} />
            Show birth time
          </label>
        )}
      </div>

      <div className="flex justify-center">
        <BornCertificate
          capsule={capsule}
          theme={theme}
          includeCoordinates={showCoords}
          includeBirthTime={showTime}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={downloadPdf}
          className="rounded-sm bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground"
        >
          Download PDF
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={downloadImage}
          className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
        >
          Share image
        </button>
        <Link
          to={getSharePath(capsule)}
          className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
        >
          View capsule
        </Link>
        <Link
          to={getVerifyPath(capsule)}
          className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
        >
          Verify
        </Link>
        <Link
          to="/create"
          className="rounded-sm border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]"
          onClick={onDone}
        >
          Create another
        </Link>
      </div>
    </div>
  );
}
