import type { MediaItem } from "@/born/types";
import { ExternalLink } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  national?: MediaItem[];
  global?: MediaItem[];
  note?: string;
  mode: "local" | "global";
}

function ListenLinks({ item }: { item: MediaItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      {item.spotifyUrl && (
        <a
          href={item.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:text-primary"
        >
          Spotify <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {item.youtubeUrl && (
        <a
          href={item.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-foreground transition hover:border-copper hover:text-copper"
        >
          YouTube <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function TrackRow({ item, rank }: { item: MediaItem; rank: number }) {
  return (
    <li className="group flex flex-col gap-3 border-b border-border/70 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="font-display text-2xl text-mapline tabular-nums">{String(rank).padStart(2, "0")}</span>
        <div>
          <div className="font-display text-xl leading-tight text-ink">{item.title}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">
            {item.artistOrCreator}
            {item.genre ? ` · ${item.genre}` : ""}
          </div>
          <div className="scope-pill mt-2">{item.scope} · {item.region}</div>
        </div>
      </div>
      <ListenLinks item={item} />
    </li>
  );
}

export function MusicSection({ title, subtitle, items, national, global, note, mode }: Props) {
  const showLadder = mode === "local" && (national?.length || global?.length);

  return (
    <section className="animate-rise">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Sound of the era</p>
        <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>

      <ol className="rounded-sm border border-border bg-card/60 px-4 sm:px-6">
        {items.map((item, i) => (
          <TrackRow key={`${item.title}-${i}`} item={item} rank={i + 1} />
        ))}
      </ol>

      {showLadder && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {national && national.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Your country</h3>
              <ul className="mt-3 space-y-3">
                {national.slice(0, 2).map((item) => (
                  <li key={item.title} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.artistOrCreator}</div>
                    </div>
                    <ListenLinks item={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {global && global.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Global</h3>
              <ul className="mt-3 space-y-3">
                {global.slice(0, 2).map((item) => (
                  <li key={item.title} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.artistOrCreator}</div>
                    </div>
                    <ListenLinks item={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {note && (
        <p className="mt-4 text-xs italic text-muted-foreground">{note}</p>
      )}
    </section>
  );
}
