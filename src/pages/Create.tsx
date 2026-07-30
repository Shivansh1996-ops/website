import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buildCapsule } from "@/lib/born/engine/regional-intelligence";
import { saveCapsule } from "@/lib/born/capsule/store";
import type { BirthInput, CapsulePrivacy, CertificateTheme } from "@/lib/born/types";

export default function Create() {
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
    privacy: "unlisted",
  });
  const [theme, setTheme] = useState<CertificateTheme>("cosmos");

  const update = (key: keyof BirthInput, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const capsule = await buildCapsule(
        {
          ...form,
          birthTime: form.birthTime || undefined,
          region: form.region || undefined,
        },
        theme,
      );
      saveCapsule(capsule);
      navigate(`/capsule/${capsule.publicId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong building your capsule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen born-grain">
      <nav className="container flex items-center justify-between py-6">
        <Link to="/" className="font-display text-xl">BORN</Link>
      </nav>

      <main className="container max-w-xl pb-20 pt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="born-eyebrow mb-3">Location-first</p>
          <h1 className="text-4xl md:text-5xl">Where did your story begin?</h1>
          <p className="mt-4 text-muted-foreground">
            Your birthplace shapes the entire capsule — weather, sky, music, news, and culture.
          </p>
        </motion.div>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <Field label="Your name" required>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="born-input"
              placeholder="As you want it on the certificate"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Birth date" required>
              <input
                required
                type="date"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
                className="born-input"
                max={new Date().toISOString().slice(0, 10)}
              />
            </Field>
            <Field label="Birth time (if known)">
              <input
                type="time"
                value={form.birthTime}
                onChange={(e) => update("birthTime", e.target.value)}
                className="born-input"
              />
            </Field>
          </div>

          <Field label="City" required>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="born-input"
              placeholder="e.g. Hyderabad"
            />
          </Field>

          <Field label="Region / state">
            <input
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              className="born-input"
              placeholder="e.g. Telangana"
            />
          </Field>

          <Field label="Country" required>
            <input
              required
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="born-input"
              placeholder="e.g. India"
            />
          </Field>

          <Field label="Certificate theme">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as CertificateTheme)}
              className="born-input"
            >
              <option value="cosmos">Cosmos</option>
              <option value="archive">Archive</option>
              <option value="origin">Origin</option>
              <option value="earth">Earth</option>
              <option value="time">Time</option>
            </select>
          </Field>

          <Field label="Capsule privacy">
            <select
              value={form.privacy}
              onChange={(e) => update("privacy", e.target.value as CapsulePrivacy)}
              className="born-input"
            >
              <option value="unlisted">Unlisted — shareable with link</option>
              <option value="public">Public — open capsule page</option>
              <option value="private">Private — verify shows limited info</option>
            </select>
          </Field>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={Boolean(form.showCoordinates)}
              onChange={(e) => update("showCoordinates", e.target.checked)}
            />
            Show birth coordinates on certificate
          </label>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={Boolean(form.showBirthTime)}
              onChange={(e) => update("showBirthTime", e.target.checked)}
            />
            Show birth time on certificate (if provided)
          </label>

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brass py-3.5 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {loading ? "Resolving your place in the world…" : "Open my birth capsule"}
          </button>
        </form>
      </main>

      <style>{`
        .born-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          padding: 0.75rem 1rem;
          color: hsl(var(--foreground));
          outline: none;
        }
        .born-input:focus {
          border-color: hsl(var(--brass) / 0.6);
          box-shadow: 0 0 0 3px hsl(var(--brass) / 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
