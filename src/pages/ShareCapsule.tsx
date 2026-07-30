import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CapsuleExperience } from "@/components/born/CapsuleExperience";
import {
  decodeShareParams,
  getCapsuleByPublicId,
  saveCapsule,
} from "@/lib/born/capsule/store";
import { buildCapsule } from "@/lib/born/engine/regional-intelligence";
import type { CapsuleData } from "@/lib/born/types";

export default function ShareCapsule() {
  const { publicId } = useParams();
  const [params] = useSearchParams();
  const [capsule, setCapsule] = useState<CapsuleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!publicId) return;
      const local = getCapsuleByPublicId(publicId);
      if (local) {
        if (local.privacy === "private") {
          setError("This capsule is private.");
          setLoading(false);
          return;
        }
        setCapsule(local);
        setLoading(false);
        return;
      }

      const encoded = params.get("p");
      if (!encoded) {
        setError("Capsule not found on this device. Ask the owner to reshare with a full link.");
        setLoading(false);
        return;
      }

      const decoded = decodeShareParams(encoded);
      if (!decoded) {
        setError("Invalid share payload.");
        setLoading(false);
        return;
      }

      try {
        const rebuilt = await buildCapsule(
          {
            name: decoded.n,
            birthDate: decoded.d,
            birthTime: decoded.t,
            city: decoded.c,
            region: decoded.r,
            country: decoded.co,
            privacy: "unlisted",
          },
          decoded.theme,
        );
        // Preserve shared public identifiers
        rebuilt.publicId = decoded.pid;
        rebuilt.certificate.certificateNumber = decoded.cert;
        rebuilt.certificate.publicToken = decoded.tok;
        saveCapsule(rebuilt);
        if (!cancelled) setCapsule(rebuilt);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not rebuild capsule");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [publicId, params]);

  if (loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <p className="font-display text-2xl text-brass">Opening shared capsule…</p>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-3xl">Unavailable</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Link to="/create" className="mt-8 text-brass">Create your own</Link>
      </div>
    );
  }

  return <CapsuleExperience initial={capsule} />;
}
