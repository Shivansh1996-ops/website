import type { CapsuleData, CapsuleMode, TimelineEvent } from "@/born/types";

const LAYER_ORDER = ["global", "national", "regional", "local", "personal"] as const;

export function RegionalTimeline({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const events = capsule.timeline.filter((e) =>
    mode === "global" ? e.layer === "global" || e.isBirth : true,
  );

  const grouped = LAYER_ORDER.map((layer) => ({
    layer,
    items: events.filter((e) => e.layer === layer),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">What was happening near you?</p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">Layered timeline</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Priority flows from your city outward — local, regional, national, then the world.
      </p>

      <div className="mt-8 space-y-10">
        {grouped.map((g) => (
          <div key={g.layer}>
            <h3 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {labelFor(g.layer, capsule)}
            </h3>
            <ol className="relative mt-4 border-l border-mapline pl-6">
              {g.items.map((e) => (
                <TimelineRow key={`${e.year}-${e.title}`} event={e} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function labelFor(layer: string, capsule: CapsuleData) {
  switch (layer) {
    case "local":
      return `Your city · ${capsule.location.city}`;
    case "regional":
      return `Your region · ${capsule.location.state ?? capsule.location.country}`;
    case "national":
      return `Your country · ${capsule.location.country}`;
    case "global":
      return "The world";
    case "personal":
      return "Personal";
    default:
      return layer;
  }
}

function TimelineRow({ event }: { event: TimelineEvent }) {
  return (
    <li className="relative mb-6 last:mb-0">
      <span
        className={`absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full ${
          event.isBirth ? "bg-copper ring-4 ring-copper/20" : "bg-teal"
        }`}
      />
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-2xl text-ink">{event.year}</span>
        {event.isBirth && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-copper">You were born</span>
        )}
      </div>
      <div className="mt-1 font-medium text-foreground">{event.title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
    </li>
  );
}
