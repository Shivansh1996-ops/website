import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BornNav } from "@/components/born/BornNav";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <BornNav solid />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <p className="born-kicker">404</p>
        <h1 className="born-title">This page was never born here</h1>
        <Link to="/" className="mt-8 rounded-sm bg-sea px-5 py-3 text-sm text-primary-foreground">
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
