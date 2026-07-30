import type { CapsuleMode, MusicTrack } from "@/lib/born";

function TrackRow({ track, rank }: { track: MusicTrack; rank: number }) {
  return (
    <li className="group flex flex-col gap-3 border-b border-border/70 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="font-display text-2xl text-copper/80">{String(rank).padStart(2, "0")}</span>
        <div>
          <p className="font-display text-xl text-ink md:text-2xl">{track.title}</p>
          <p className="text-sm text-muted-foreground">{track.artist}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sea">
            {track.regionLabel}
            {track.chartNote ? ` · ${track.chartNote}` : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:shrink-0">
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-border bg-paper px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition hover:border-sea hover:text-sea"
        >
          Spotify
        </a>
        <a
          href={track.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm bg-ink px-3 py-2 text-xs font-semibold uppercase tracking-wider text-paper transition hover:bg-sea"
        >
          YouTube
        </a>
      </div>
    </li>
  );
}

export function MusicSection({
  tracks,
  mode,
  city,
  country,
}: {
  tracks: MusicTrack[];
  mode: CapsuleMode;
  city: string;
  country: string;
}) {
  const regional = tracks.filter((t) => t.scope === "regional" || t.scope === "local");
  const national = tracks.filter((t) => t.scope === "national");
  const global = tracks.filter((t) => t.scope === "global");

  const primary = mode === "my-world"
    ? (regional.length ? regional : national)
    : global;
  const secondaryLabel = mode === "my-world" ? "Global context" : `Around ${city}`;
  const secondary = mode === "my-world" ? global.slice(0, 3) : (regional.length ? regional : national).slice(0, 3);

  return (
    <section className="born-section">
      <p className="born-kicker">What your region sounded like</p>
      <h2 className="born-title">
        {mode === "my-world" ? `Charts near ${city}` : "What the world was playing"}
      </h2>
      <p className="born-lede">
        Listen instantly on Spotify or YouTube. Tracks are era-associated highlights for{" "}
        {mode === "my-world" ? `${city}, ${country}` : "global charts"} — labeled by local → national → global scope.
      </p>

      <ol className="mt-10">
        {primary.slice(0, 5).map((t, i) => (
          <TrackRow key={`${t.title}-${t.artist}`} track={t} rank={i + 1} />
        ))}
      </ol>

      {!regional.length && mode === "my-world" && (
        <p className="mt-4 text-sm text-muted-foreground">
          Detailed city chart archives are limited for this place/year. Showing the best national layer available — not inventing local #1s.
        </p>
      )}

      {secondary.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="born-kicker">{secondaryLabel}</p>
          <ul className="mt-4 space-y-3">
            {secondary.map((t) => (
              <li key={`sec-${t.title}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-ink">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-muted-foreground"> — {t.artist}</span>
                </span>
                <span className="flex gap-2">
                  <a href={t.spotifyUrl} target="_blank" rel="noreferrer" className="text-sea underline-offset-2 hover:underline">
                    Spotify
                  </a>
                  <a href={t.youtubeUrl} target="_blank" rel="noreferrer" className="text-sea underline-offset-2 hover:underline">
                    YouTube
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
