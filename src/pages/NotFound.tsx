import { Link } from "react-router-dom";
import { BornNav } from "@/components/born/BornNav";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <BornNav />
      <main className="container py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-copper">404</p>
        <h1 className="mt-2 font-display text-5xl text-ink">This page was never born</h1>
        <p className="mt-3 text-muted-foreground">The path you followed does not exist.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-sm bg-primary px-5 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground"
        >
          Return home
        </Link>
      </main>
    </div>
  );
}
