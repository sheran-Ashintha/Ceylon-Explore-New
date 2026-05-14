import { useLocation, useNavigate } from "react-router-dom";
import "./TouristHelpLauncher.css";

const HIDDEN_ROUTE_PREFIXES = ["/login", "/register", "/admin", "/tourist-help"];

function shouldShowLauncher(pathname) {
  return !HIDDEN_ROUTE_PREFIXES.some((routePrefix) => pathname === routePrefix || pathname.startsWith(`${routePrefix}/`));
}

export default function TouristHelpLauncher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!shouldShowLauncher(pathname)) {
    return null;
  }

  return (
    <button
      type="button"
      className="thl"
      onClick={() => navigate("/tourist-help")}
      aria-label="Open tourist help contacts"
    >
      <span className="thl-icon" aria-hidden="true">SOS</span>
      <span className="thl-copy">
        <strong>Tourist Help</strong>
        <small>1912 | 1990</small>
      </span>
    </button>
  );
}