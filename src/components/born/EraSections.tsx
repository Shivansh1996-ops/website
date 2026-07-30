import type { CapsuleData, CapsuleMode } from "@/born/types";

export function TechSection({ capsule, mode }: { capsule: CapsuleData; mode: CapsuleMode }) {
  const { tech } = capsule;
  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Technology of arrival</p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">
        {mode === "local" ? "What technology looked like around you" : "Global technology of the era"}
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-border bg-card/60 p-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-teal">
            {mode === "local" ? "Your region" : "Global devices"}
          </h3>
          <List
            items={
              mode === "local"
                ? [
                    ...tech.region.phones,
                    tech.region.internetPenetration,
                    tech.region.networkGeneration,
                  ].filter(Boolean) as string[]
                : tech.global.phones
            }
          />
          {mode === "local" && tech.region.popularSites.length > 0 && (
            <>
              <h4 className="mt-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Popular sites</h4>
              <List items={tech.region.popularSites} />
            </>
          )}
          {mode === "local" && tech.region.localCompanies.length > 0 && (
            <>
              <h4 className="mt-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Local tech companies</h4>
              <List items={tech.region.localCompanies} />
            </>
          )}
        </div>
        <div className="rounded-sm border border-border bg-card/60 p-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-copper">
            {mode === "local" ? "Global comparison" : "Major launches"}
          </h3>
          <List items={mode === "local" ? tech.global.launches : tech.global.launches} />
          <h4 className="mt-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Operating systems</h4>
          <List items={tech.global.operatingSystems} />
          <p className="scope-pill mt-6">Scope · {tech.scope}</p>
        </div>
      </div>
    </section>
  );
}

export function SportsSection({ capsule }: { capsule: CapsuleData }) {
  const s = capsule.sports;
  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">On the field</p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">Regional sports</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Block title="Popular sports" items={s.popularSports} />
        <Block title="Teams & clubs" items={s.localTeams} />
        <Block title="Athletes of the era" items={s.athletes} />
        <Block title="Events" items={s.events} />
      </div>
      <p className="scope-pill mt-4">Scope · {s.scope}</p>
    </section>
  );
}

export function PricesSection({ capsule }: { capsule: CapsuleData }) {
  return (
    <section className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.22em] text-copper">Cost of living</p>
      <h2 className="mt-2 font-display text-4xl text-ink md:text-5xl">Your region — then & today</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Indicative ranges only. Unavailable historical prices are labeled — never invented as exact facts.
      </p>
      <div className="mt-8 overflow-hidden rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Then</th>
              <th className="px-4 py-3 font-medium">Today</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Global context</th>
            </tr>
          </thead>
          <tbody>
            {capsule.prices.map((p) => (
              <tr key={p.category} className="border-t border-border bg-card/40">
                <td className="px-4 py-4 font-medium">{p.category}</td>
                <td className="px-4 py-4 text-muted-foreground">
                  {p.available ? p.thenValue : "Not verified"}
                  {p.note && <div className="mt-1 text-[11px] italic">{p.note}</div>}
                </td>
                <td className="px-4 py-4 text-muted-foreground">{p.todayValue ?? "—"}</td>
                <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                  {p.globalBenchmark ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item} className="border-b border-border/60 pb-2 font-display text-xl text-ink last:border-0">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-sm border border-border bg-card/60 p-5">
      <h3 className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="font-display text-xl text-ink">{i}</li>
        ))}
      </ul>
    </div>
  );
}
