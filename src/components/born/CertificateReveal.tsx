import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import type { CapsuleData, CertificateTheme } from "@/lib/born";
import { toCertificatePayload, THEME_META } from "@/lib/born";
import { BornCertificate } from "./BornCertificate";

const BEATS = [
  "You have explored your world.",
  "You have explored the world around it.",
  "Now let's preserve the moment.",
];

export function CertificateReveal({
  capsule,
  onThemeChange,
}: {
  capsule: CapsuleData;
  onThemeChange: (theme: CertificateTheme) => void;
}) {
  const [beat, setBeat] = useState(0);
  const [showCert, setShowCert] = useState(false);
  const [format, setFormat] = useState<"desktop" | "mobile" | "social">("desktop");
  const certRef = useRef<HTMLDivElement>(null);
  const payload = toCertificatePayload(capsule);

  useEffect(() => {
    if (showCert) return;
    if (beat >= BEATS.length) {
      const t = setTimeout(() => setShowCert(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBeat((b) => b + 1), 1600);
    return () => clearTimeout(t);
  }, [beat, showCert]);

  async function downloadImage() {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: null });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${payload.certificateNumber}-${format}.png`;
    a.click();
  }

  async function downloadPdf() {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: format === "desktop" ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    pdf.addImage(img, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
    pdf.save(`${payload.certificateNumber}.pdf`);
  }

  async function share() {
    const url = `${window.location.origin}/c/${capsule.publicToken}`;
    if (navigator.share) {
      await navigator.share({
        title: `BORN — ${capsule.input.name}`,
        text: "My Born Certificate",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Capsule link copied.");
    }
  }

  return (
    <section className="born-section min-h-[80vh]">
      <AnimatePresence mode="wait">
        {!showCert ? (
          <motion.div
            key={beat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-[50vh] items-center justify-center"
          >
            <p className="max-w-xl text-center font-display text-3xl text-ink md:text-5xl">
              {BEATS[Math.min(beat, BEATS.length - 1)]}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="cert"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="born-kicker">Your certificate</p>
                <h2 className="born-title">The Born Certificate</h2>
                <p className="born-lede">
                  A commemorative digital artifact — not an official government document.
                </p>
              </div>
              <motion.div
                initial={{ scale: 1.4, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="rounded-full border-2 border-copper px-4 py-3 text-center text-copper"
              >
                <p className="font-display text-sm font-bold tracking-[0.2em]">BORN</p>
                <p className="text-[9px] uppercase tracking-wider">Seal affixed</p>
              </motion.div>
            </div>

            <div className="no-print mb-6 flex flex-wrap gap-2">
              {(Object.keys(THEME_META) as CertificateTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onThemeChange(t)}
                  className={`rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider ${
                    capsule.input.certificateTheme === t
                      ? "border-sea bg-sea text-primary-foreground"
                      : "border-border bg-paper text-muted-foreground hover:text-ink"
                  }`}
                >
                  {THEME_META[t].label}
                </button>
              ))}
            </div>

            <div className="no-print mb-4 flex flex-wrap gap-2">
              {(["desktop", "mobile", "social"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider ${
                    format === f ? "bg-ink text-paper" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {f === "desktop" ? "A4 / Desktop" : f === "mobile" ? "Mobile 9:16" : "Social"}
                </button>
              ))}
            </div>

            <BornCertificate ref={certRef} payload={payload} format={format} />

            <div className="no-print mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={downloadPdf} className="rounded-sm bg-sea px-5 py-3 text-sm font-semibold text-primary-foreground">
                Download PDF
              </button>
              <button type="button" onClick={downloadImage} className="rounded-sm border border-border bg-paper px-5 py-3 text-sm font-semibold text-ink">
                Download image
              </button>
              <button type="button" onClick={share} className="rounded-sm border border-border bg-paper px-5 py-3 text-sm font-semibold text-ink">
                Share
              </button>
              <Link to={`/c/${capsule.publicToken}`} className="rounded-sm border border-border bg-paper px-5 py-3 text-sm font-semibold text-ink">
                View capsule
              </Link>
              <Link to="/create" className="rounded-sm px-5 py-3 text-sm font-semibold text-sea underline-offset-2 hover:underline">
                Create another
              </Link>
              <Link to={`/verify/${capsule.publicToken}`} className="rounded-sm px-5 py-3 text-sm text-muted-foreground hover:text-ink">
                Verify certificate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
