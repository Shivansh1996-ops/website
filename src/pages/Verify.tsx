import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCapsuleByVerifyToken } from "@/lib/born/capsule/store";
import type { CapsuleData } from "@/lib/born/types";

export default function Verify() {
  const { token } = useParams();
  const [capsule, setCapsule] = useState<CapsuleData | null>(null);

  useEffect(() => {
    if (!token) return;
    setCapsule(getCapsuleByVerifyToken(token));
  }, [token]);

  return (
    <div className="min-h-screen born-grain">
      <nav className="container py-6">
        <Link to="/" className="font-display text-xl">BORN</Link>
      </nav>
      <main className="container max-w-lg py-16">
        <p className="born-eyebrow mb-3">Verify this certificate</p>
        <h1 className="text-4xl">Certificate status</h1>

        {!capsule ? (
          <div className="mt-10 border border-border/60 p-6">
            <p className="font-mono text-sm uppercase tracking-widest text-red-300">Not found on this device</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Verification looks up commemorative certificates stored with this browser’s capsule archive.
              This is never an official government document.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4 border border-brass/40 bg-card/50 p-6">
            <p className="font-mono text-sm uppercase tracking-widest text-aurora">Valid</p>
            <Row label="Certificate" value={capsule.certificate.certificateNumber} />
            <Row label="Created" value={new Date(capsule.certificate.createdAt).toLocaleString()} />
            <Row label="Birth date" value={capsule.input.birthDate} />
            <Row
              label="Birthplace"
              value={`${capsule.place.city}, ${capsule.place.country}`}
            />
            {capsule.privacy !== "private" && (
              <Row label="Name" value={capsule.input.name} />
            )}
            <p className="pt-4 text-xs text-muted-foreground">
              A commemorative digital certificate — not an official government document.
              Coordinates and private details are withheld unless the owner opted in.
            </p>
            {capsule.privacy !== "private" && (
              <Link to={`/c/${capsule.publicId}`} className="inline-block pt-2 text-sm text-brass">
                View public capsule →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/40 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
