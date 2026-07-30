import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BornNav } from "@/components/born/BornNav";
import { decodeSharePayload, loadCapsule, loadSeed, type CapsuleData } from "@/lib/born";

export default function Verify() {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "valid" | "unknown">("loading");
  const [capsule, setCapsule] = useState<CapsuleData | null>(null);
  const [meta, setMeta] = useState<{
    createdAt?: string;
    birthDate?: string;
    city?: string;
    country?: string;
    certificateNumber?: string;
    name?: string;
  }>({});

  useEffect(() => {
    const local = loadCapsule(token);
    if (local) {
      setCapsule(local);
      setMeta({
        createdAt: local.createdAt,
        birthDate: local.input.birthDate,
        city: local.geo.city,
        country: local.geo.country,
        certificateNumber: local.certificateNumber,
        name: local.privacy === "public" ? local.input.name : undefined,
      });
      setStatus("valid");
      return;
    }

    const seed = loadSeed(token) || decodeSharePayload(params.get("s") || "");
    if (seed && (seed.token === token || !seed.token)) {
      setMeta({
        createdAt: seed.createdAt,
        birthDate: seed.input.birthDate,
        city: seed.input.city,
        country: seed.input.country,
        certificateNumber: seed.certificateNumber,
        name: seed.privacy === "public" ? seed.input.name : undefined,
      });
      setStatus("valid");
      return;
    }

    setStatus("unknown");
  }, [token, params]);

  return (
    <div className="min-h-screen">
      <BornNav solid />
      <main className="mx-auto max-w-xl px-5 pb-20 pt-28 md:px-8">
        <p className="born-kicker">Verify this certificate</p>
        <h1 className="born-title">Certificate verification</h1>
        <p className="born-lede">
          Public verification only. This is a commemorative digital certificate — not an official government document.
        </p>

        <div className="mt-10 rounded-sm border border-border bg-paper p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sea">Status</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {status === "loading" ? "Checking…" : status === "valid" ? "VALID" : "NOT FOUND"}
          </p>

          {status === "valid" && (
            <dl className="mt-8 space-y-4 text-sm">
              <Row label="Certificate" value={meta.certificateNumber || "—"} />
              <Row label="Created" value={meta.createdAt ? new Date(meta.createdAt).toLocaleString() : "—"} />
              <Row label="Birth date" value={meta.birthDate || "—"} />
              <Row label="Birthplace" value={[meta.city, meta.country].filter(Boolean).join(", ") || "—"} />
              {meta.name && <Row label="Name" value={meta.name} />}
              <Row label="Public token" value={token} />
            </dl>
          )}

          {status === "unknown" && (
            <p className="mt-4 text-sm text-muted-foreground">
              No public record for this token in this browser. Capsules are stored locally and via share payload — open the original share link if you have it.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {capsule && (
            <Link to={`/c/${token}`} className="rounded-sm bg-sea px-4 py-2.5 text-sm text-primary-foreground">
              View capsule
            </Link>
          )}
          <Link to="/create" className="rounded-sm border border-border px-4 py-2.5 text-sm text-ink">
            Create your own
          </Link>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-border pt-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
