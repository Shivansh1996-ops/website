import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CapsuleExperience } from "@/components/born/CapsuleExperience";
import { getCapsuleByPublicId } from "@/lib/born/capsule/store";
import type { CapsuleData } from "@/lib/born/types";

export default function Capsule() {
  const { publicId } = useParams();
  const [capsule, setCapsule] = useState<CapsuleData | null>(null);

  useEffect(() => {
    if (!publicId) return;
    setCapsule(getCapsuleByPublicId(publicId));
  }, [publicId]);

  if (!capsule) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center text-center">
        <p className="born-eyebrow mb-3">Capsule</p>
        <h1 className="text-3xl">This capsule isn’t on this device</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Capsules are stored locally for privacy. Open a shared link from{" "}
          <code className="text-brass">/c/…</code> or create a new one.
        </p>
        <Link to="/create" className="mt-8 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink">
          Create capsule
        </Link>
      </div>
    );
  }

  return <CapsuleExperience initial={capsule} />;
}
