import { Suspense, lazy, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./PlannerRobotLauncher.css";

const TripPlanner = lazy(() => import("../pages/TripPlanner"));

const VISIBLE_ROUTE_PREFIXES = ["/", "/shopping", "/tours", "/destinations", "/chat", "/my-bookings"];

function shouldShowLauncher(pathname) {
  if (pathname === "/") {
    return true;
  }

  return VISIBLE_ROUTE_PREFIXES
    .filter((routePrefix) => routePrefix !== "/")
    .some((routePrefix) => pathname === routePrefix || pathname.startsWith(`${routePrefix}/`));
}

export default function PlannerRobotLauncher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  if (loading || !shouldShowLauncher(pathname)) {
    return null;
  }

  const isSignedIn = Boolean(user);
  const title = isSignedIn ? "Open Journey Planner" : "Login to Plan";
  const subtitle = isSignedIn ? "Prompt-based AI planner" : "Planner requires account";

  const handleClick = () => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    setIsPlannerOpen(true);
  };

  return (
    <>
      <button type="button" className="prl" onClick={handleClick} aria-label={title}>
        <span className="prl-face" aria-hidden="true">
          <span className="prl-eye" />
          <span className="prl-eye" />
        </span>
        <span className="prl-copy">
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
      </button>

      {isSignedIn && isPlannerOpen ? (
        <Suspense fallback={null}>
          <TripPlanner popupMode onClose={() => setIsPlannerOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
