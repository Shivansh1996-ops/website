import { Link } from "react-router-dom";

export function BornNav({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 ${
        solid ? "border-b border-border/70 bg-paper/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-[0.08em] text-ink">
            BORN
          </span>
          <span className="hidden font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            The day your story began
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link to="/create" className="transition hover:text-ink">
            Create
          </Link>
          <Link
            to="/create"
            className="rounded-sm bg-sea px-3.5 py-2 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Begin
          </Link>
        </nav>
      </div>
    </header>
  );
}
