import type { CapsuleData, CapsuleMode } from "@/born/types";
import type { MediaItem } from "@/born/types";
import { ExternalLink } from "lucide-react";

export function CultureSection({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const culture = mode === "local" ? capsule.culture : capsule.globalCulture;

  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">
        {mode === "local" ? "What your region sounded & looked like" : "Global culture of the era"}
      </p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">
        {mode === "local" ? "Regional culture" : "World culture"}
      </h2>
      {culture.note && <p className="mt-3 max-w-2xl text-sm italic text-muted-foreground">{culture.note}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ChipBlock title="Languages" items={culture.languages} />
        <ChipBlock title="Festivals & celebrations" items={culture.festivals} />
        <ChipBlock title="Foods of place" items={culture.foods} />
        <ChipBlock title="Sports" items={culture.sports} />
        {culture.fashion && (
          <div className="lg:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Fashion & style</h3>
            <p className="mt-2 font-display text-2xl text-ink">{culture.fashion}</p>
          </div>
        )}
        {culture.movements && culture.movements.length > 0 && (
          <ChipBlock title="Cultural movements" items={culture.movements} />
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Cinema of the era</h3>
        <ul className="mt-4 divide-y divide-border rounded-sm border border-border bg-card/60">
          {culture.films.map((f) => (
            <FilmRow key={f.title} item={f} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ChipBlock({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-border bg-background px-3 py-1.5 text-sm text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilmRow({ item }: { item: MediaItem }) {
  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-display text-xl">{item.title}</div>
        <div className="text-sm text-muted-foreground">
          {item.artistOrCreator} · {item.scope}
        </div>
      </div>
      {item.youtubeUrl && (
        <a
          href={item.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-copper hover:underline"
        >
          Watch trailer <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </li>
  );
}
