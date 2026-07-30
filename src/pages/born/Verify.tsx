import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BornNav } from "@/components/born/BornNav";
import { getCapsuleByToken } from "@/born/capsule/create";

export default function VerifyPage() {
  const { token } = useParams();
  const capsule = useMemo(() => (token ? getCapsuleByToken(token) : null), [token]);

  return (
    <div className="min-h-screen">
      <BornNav />
      <main className="container max-w-xl py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Verify this certificate</p>
        <h1 className="mt-2 font-display text-5xl text-ink">Certificate status</h1>

        {!capsule ? (
          <div className="mt-10 rounded-sm border border-border bg-card/60 p-6">
            <p className="font-display text-3xl text-copper">UNKNOWN</p>
            <p className="mt-3 text-sm text-muted-foreground">
              No matching public capsule was found in this browser for token{" "}
              <span className="font-mono">{token}</span>.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Verification currently checks locally stored public capsules. A commemorative digital
              certificate — not an official government document.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6 rounded-sm border border-border bg-card/60 p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-teal">Status</p>
              <p className="font-display text-4xl text-teal">VALID</p>
            </div>
            <dl className="grid gap-4 text-sm">
              <Row label="Certificate" value={capsule.certificateNumber} />
              <Row label="Created" value={new Date(capsule.createdAt).toLocaleString()} />
              <Row
                label="Birth date"
                value={new Date(capsule.input.birthDate + "T12:00:00").toLocaleDateString()}
              />
              <Row
                label="Birthplace"
                value={`${capsule.location.city}, ${capsule.location.country}`}
              />
            </dl>
            <p className="border-t border-border pt-4 text-xs text-muted-foreground">
              A commemorative digital certificate — not an official government document. Sensitive
              private details are not shown on this page.
            </p>
            <Link to={`/c/${capsule.publicToken}`} className="inline-block text-sm text-teal underline">
              View public capsule
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 pb-3">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
