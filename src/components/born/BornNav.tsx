import { Link } from "react-router-dom";

export function BornNav() {
  return (
    <header className="relative z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-display text-3xl font-semibold tracking-tight text-ink">BORN</span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            The day your story began
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/create" className="text-muted-foreground transition hover:text-foreground">
            Create
          </Link>
          <Link
            to="/create"
            className="rounded-sm bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90"
          >
            Open capsule
          </Link>
        </nav>
      </div>
    </header>
  );
}
