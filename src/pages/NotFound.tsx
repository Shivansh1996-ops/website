import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center text-center">
      <p className="born-eyebrow mb-3">404</p>
      <h1 className="text-4xl">This page was never born</h1>
      <Link to="/" className="mt-8 text-brass">
        Return home
      </Link>
    </div>
  );
}
