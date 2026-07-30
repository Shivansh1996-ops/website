import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BornNav } from "@/components/born/BornNav";
import { createCapsule } from "@/born/capsule/create";
import type { BirthInput } from "@/born/types";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "pt", label: "Português" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "es", label: "Español" },
];

export default function CreateCapsule() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BirthInput>({
    name: "",
    birthDate: "",
    birthTime: "",
    city: "",
    region: "",
    country: "",
    showCoordinates: false,
    showBirthTime: true,
    preferredLanguage: "en",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const capsule = await createCapsule({
        ...form,
        birthTime: form.birthTime || undefined,
        region: form.region || undefined,
      });
      navigate(`/c/${capsule.publicToken}?reveal=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create capsule");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof BirthInput, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen">
      <BornNav />
      <main className="container max-w-2xl py-12 md:py-20">
        <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Create</p>
        <h1 className="mt-2 font-display text-5xl text-ink">Your birth details</h1>
        <p className="mt-3 text-muted-foreground">
          City and country shape the entire capsule — weather, sky, music, and culture.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <Field label="Your name" required>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="field"
              placeholder="As you want it on the certificate"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Birth date" required>
              <input
                required
                type="date"
                value={form.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
                className="field"
              />
            </Field>
            <Field label="Birth time (if known)">
              <input
                type="time"
                value={form.birthTime}
                onChange={(e) => set("birthTime", e.target.value)}
                className="field"
              />
            </Field>
          </div>

          <Field label="City" required>
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="field"
              placeholder="e.g. Hyderabad"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Region / State">
              <input
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className="field"
                placeholder="e.g. Telangana"
              />
            </Field>
            <Field label="Country" required>
              <input
                required
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                className="field"
                placeholder="e.g. India"
              />
            </Field>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-5">
            <p className="text-sm text-foreground">Want to experience your birth capsule in a regional language?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              We never assume preference from birthplace alone — you choose.
            </p>
            <select
              className="field mt-3"
              value={form.preferredLanguage}
              onChange={(e) => set("preferredLanguage", e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form.showCoordinates}
                onChange={(e) => set("showCoordinates", e.target.checked)}
              />
              Allow coordinates on my certificate
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.showBirthTime !== false}
                onChange={(e) => set("showBirthTime", e.target.checked)}
              />
              Show birth time on certificate (if provided)
            </label>
          </div>

          {error && (
            <p className="rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-primary py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Resolving your place…" : "Open my capsule"}
          </button>
        </form>
      </main>

      <style>{`
        .field {
          width: 100%;
          margin-top: 0.4rem;
          border-radius: 0.15rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          padding: 0.7rem 0.85rem;
          font-size: 0.95rem;
          outline: none;
        }
        .field:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
