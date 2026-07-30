import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BornNav } from "@/components/born/BornNav";
import { createCapsule, saveCapsule, encodeSharePayload, toSeed, suggestedLanguages, type BirthInput, type CertificateTheme } from "@/lib/born";
import { THEME_META } from "@/lib/born";

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
    preferredLanguage: "English",
    certificateTheme: "archive",
  });

  const langOptions = useMemo(() => {
    // optimistic suggestions from country text until geo resolves
    const guess =
      /india/i.test(form.country) ? "IN" :
      /japan/i.test(form.country) ? "JP" :
      /brazil/i.test(form.country) ? "BR" :
      /united states|usa/i.test(form.country) ? "US" :
      /united kingdom|england|uk/i.test(form.country) ? "GB" :
      "";
    return guess ? suggestedLanguages(guess, form.region) : ["English"];
  }, [form.country, form.region]);

  function update<K extends keyof BirthInput>(key: K, value: BirthInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.birthDate || !form.city || !form.country) {
      setError("Name, birth date, city, and country are required.");
      return;
    }
    setLoading(true);
    try {
      const capsule = await createCapsule({
        ...form,
        birthTime: form.birthTime || undefined,
        region: form.region || undefined,
      });
      saveCapsule(capsule);
      const share = encodeSharePayload(toSeed(capsule));
      navigate(`/c/${capsule.publicToken}?s=${share}`, { state: { fresh: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create capsule.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <BornNav solid />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-28 md:px-8">
        <p className="born-kicker">Location-first</p>
        <h1 className="born-title">Begin your birth capsule</h1>
        <p className="born-lede">
          Your birthplace shapes the entire experience — weather, sky, music, news, and certificate.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <Field label="Your name">
            <input
              className="field"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="As you want it on the certificate"
              required
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Birth date">
              <input
                type="date"
                className="field"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
                required
              />
            </Field>
            <Field label="Birth time (if known)">
              <input
                type="time"
                className="field"
                value={form.birthTime}
                onChange={(e) => update("birthTime", e.target.value)}
              />
            </Field>
          </div>

          <Field label="City">
            <input
              className="field"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. Hyderabad"
              required
            />
          </Field>

          <Field label="Region / State">
            <input
              className="field"
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              placeholder="e.g. Telangana"
            />
          </Field>

          <Field label="Country">
            <input
              className="field"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. India"
              required
            />
          </Field>

          <div className="rounded-sm border border-border bg-paper/70 p-4">
            <p className="text-sm font-medium text-ink">
              Want to experience your birth capsule in a regional language?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              We never auto-switch from birthplace alone. Choose if you want.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {langOptions.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => update("preferredLanguage", lang)}
                  className={`rounded-sm border px-3 py-1.5 text-xs ${
                    form.preferredLanguage === lang
                      ? "border-sea bg-sea text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <Field label="Certificate theme">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEME_META) as CertificateTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("certificateTheme", t)}
                  className={`rounded-sm border px-3 py-2 text-left text-xs ${
                    form.certificateTheme === t
                      ? "border-sea bg-sea text-primary-foreground"
                      : "border-border bg-paper"
                  }`}
                >
                  <span className="block font-semibold uppercase tracking-wider">{THEME_META[t].label}</span>
                  <span className="opacity-80">{THEME_META[t].blurb}</span>
                </button>
              ))}
            </div>
          </Field>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.showCoordinates}
              onChange={(e) => update("showCoordinates", e.target.checked)}
            />
            Show birth coordinates on certificate
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.showBirthTime}
              onChange={(e) => update("showBirthTime", e.target.checked)}
            />
            Show birth time on certificate
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-sea px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Resolving your place…" : "Open my world"}
          </button>
        </form>
      </main>

      <style>{`
        .field {
          width: 100%;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--paper));
          border-radius: 2px;
          padding: 0.75rem 0.9rem;
          font-size: 0.95rem;
          color: hsl(var(--ink));
        }
        .field:focus {
          outline: 2px solid hsl(var(--sea) / 0.35);
          border-color: hsl(var(--sea));
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-sea">
        {label}
      </span>
      {children}
    </label>
  );
}
