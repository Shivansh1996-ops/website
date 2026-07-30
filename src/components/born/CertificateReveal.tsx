import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { CapsuleData, CertificateTheme } from "@/lib/born/types";
import { CertificateView } from "./CertificateView";
import { encodeShareParams } from "@/lib/born/capsule/store";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const THEMES: { id: CertificateTheme; label: string }[] = [
  { id: "archive", label: "Archive" },
  { id: "cosmos", label: "Cosmos" },
  { id: "origin", label: "Origin" },
  { id: "earth", label: "Earth" },
  { id: "time", label: "Time" },
];

export function CertificateReveal({
  capsule,
  onThemeChange,
}: {
  capsule: CapsuleData;
  onThemeChange: (theme: CertificateTheme) => void;
}) {
  const [phase, setPhase] = useState(0);
  const lines = [
    "You have explored your world.",
    "You have explored the world around it.",
    "Now let’s preserve the moment.",
  ];

  const downloadPdf = async () => {
    const el = document.getElementById("born-certificate");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, "PNG", 20, 20, w - 40, h - 40);
    pdf.save(`${capsule.certificate.certificateNumber}.pdf`);
  };

  const downloadImage = async () => {
    const el = document.getElementById("born-certificate");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${capsule.certificate.certificateNumber}.png`;
    a.click();
  };

  const share = async () => {
    const payload = encodeShareParams(capsule);
    const url = `${window.location.origin}/c/${capsule.publicId}?p=${encodeURIComponent(payload)}`;
    if (navigator.share) {
      await navigator.share({
        title: `BORN — ${capsule.input.name}`,
        text: `The day ${capsule.input.name}'s story began.`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Capsule link copied.");
    }
  };

  return (
    <section className="born-section">
      <div className="container max-w-4xl">
        <AnimatePresence mode="wait">
          {phase < lines.length ? (
            <motion.button
              key={phase}
              type="button"
              className="mx-auto block w-full py-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              onClick={() => setPhase((p) => p + 1)}
            >
              <p className="font-display text-3xl md:text-5xl">{lines[phase]}</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Tap to continue
              </p>
            </motion.button>
          ) : (
            <motion.div
              key="cert"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="born-eyebrow">Final reveal</p>
                  <h2 className="text-3xl">The BORN Certificate</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onThemeChange(t.id)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        capsule.certificate.theme === t.id
                          ? "border-brass bg-brass/15 text-brass"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <CertificateView capsule={capsule} />
                <motion.div
                  className="pointer-events-none absolute -right-2 top-8 md:right-6"
                  initial={{ opacity: 0, scale: 1.4, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.9 }}
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brass/70 bg-night/80 text-center font-mono text-[9px] uppercase leading-tight tracking-widest text-brass">
                    BORN
                    <br />
                    seal
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={downloadPdf} className="rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">
                  Download PDF
                </button>
                <button type="button" onClick={downloadImage} className="rounded-full border border-border px-5 py-2.5 text-sm">
                  Social image
                </button>
                <button type="button" onClick={share} className="rounded-full border border-border px-5 py-2.5 text-sm">
                  Share
                </button>
                <Link to={`/c/${capsule.publicId}`} className="rounded-full border border-aurora/50 px-5 py-2.5 text-sm text-aurora">
                  View capsule
                </Link>
                <Link to="/create" className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground">
                  Create another
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
