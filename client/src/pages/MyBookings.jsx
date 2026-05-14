import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/api";
import ChatRequestBadge from "../components/ChatRequestBadge";
import PlaceImage from "../components/PlaceImage";
import { useAuth } from "../context/useAuth";
import { useChatRequestCount } from "../utils/chatRequests";
import { getAccountCopy } from "../utils/accountTranslations";
import {
  SITE_LANGUAGE_DATE_LOCALES,
  SITE_LANGUAGE_OPTIONS,
  useSiteLanguage,
} from "../utils/siteLanguage";
import "./MyBookings.css";

function MyBookings() {
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const copy = getAccountCopy(language);
  const locale = SITE_LANGUAGE_DATE_LOCALES[language] || "en-US";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState("");
  const navigate = useNavigate();

  const formatCopy = (template, values) =>
    template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setErrorKey("load"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm(copy.myBookings.confirmCancel)) return;
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch {
      alert(copy.myBookings.errors.cancel);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const nights = (ci, co) => Math.max(1, Math.round((new Date(co) - new Date(ci)) / 86400000));
  const getBookingName = (booking) => booking.destination?.name || booking.package?.title || copy.myBookings.curatedPackage;
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const plannedSpend = bookings.reduce(
    (sum, booking) => sum + (booking.status === "confirmed" ? booking.totalPrice || 0 : 0),
    0,
  );

  const getBookingLocation = (booking) => {
    if (booking.destination?.location) {
      return booking.destination.location;
    }

    if (booking.package?.category) {
      return formatCopy(copy.myBookings.packageLocationTemplate, { category: booking.package.category });
    }

    return copy.myBookings.curatedExperience;
  };

  const getStatusLabel = (status) => copy.statuses[status] || status;
  const getNightLabel = (nightCount) => (nightCount === 1 ? copy.myBookings.nightSingular : copy.myBookings.nightPlural);
  const getGuestLabel = (guestCount) => (guestCount === 1 ? copy.myBookings.guestSingular : copy.myBookings.guestPlural);
  const userName = user?.name || "";
  const languageSelector = (
    <div className="mb-lang">
      <span className="mb-lang-label">{copy.selectLanguage}</span>
      <select aria-label={copy.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mybookings-page">
      <header className="mb-nav">
        <Link to="/" className="mb-logo">Ceylon Explore</Link>
        <nav className="mb-nav-right">
          <Link to="/" className="mb-nav-link">{copy.nav.home || "Home"}</Link>
          <Link to="/destinations" className="mb-nav-link">{copy.nav.destinations || "Destinations"}</Link>
          <Link to="/shopping" className="mb-nav-link">{copy.nav.shopping || "Stores"}</Link>
          <Link to="/tours" className="mb-nav-link">{copy.nav.tours || "Tours"}</Link>
          <Link to="/sos" className="mb-nav-link">SOS</Link>
          <Link to="/chat" className="mb-nav-link">{copy.nav.chat || "Chat"}<ChatRequestBadge count={chatRequestCount} /></Link>
          <Link to="/my-bookings" className="mb-nav-link">{copy.nav.myBookings || "My Bookings"}</Link>
          {languageSelector}
          <span className="mb-nav-name">{copy.nav.greeting || "Hi"}, {userName}</span>
          <button className="mb-nav-btn mb-nav-btn--outline" onClick={() => { logout(); navigate("/"); }}>{copy.nav.logout || "Logout"}</button>
        </nav>
      </header>

      <main className="mb-main">
        <section className="mb-hero">
          <div className="mb-hero-copy">
            <span className="mb-kicker">{copy.myBookings.kicker}</span>
            <h1>{copy.myBookings.title}</h1>
            <p className="mb-subtitle">{copy.myBookings.subtitle}</p>
          </div>

          {!loading && !errorKey && bookings.length > 0 && (
            <div className="mb-hero-stats">
              <div className="mb-stat-card">
                <strong>{formatNumber(confirmedBookings)}</strong>
                <span>{copy.myBookings.confirmedTrips}</span>
              </div>
              <div className="mb-stat-card">
                <strong>LKR {formatNumber(plannedSpend)}</strong>
                <span>{copy.myBookings.plannedSpend}</span>
              </div>
            </div>
          )}
        </section>

        {loading && <div className="mb-loading">{copy.myBookings.loading}</div>}
        {errorKey && <div className="mb-error">{copy.myBookings.errors[errorKey]}</div>}
        {!loading && !errorKey && bookings.length === 0 && (
          <div className="mb-empty">
            <p>{copy.myBookings.empty}</p>
            <Link to="/destinations" className="mb-browse-btn">{copy.myBookings.browseDestinations}</Link>
          </div>
        )}

        <div className="mb-bookings-list">
          {bookings.map((b) => (
            <div
              key={b._id}
              className={"mb-booking-card" + (b.status === "cancelled" ? " mb-booking-card--cancelled" : "")}
            >
              <PlaceImage
                key={b.destination?._id || b.package?.slug || b._id}
                className="mb-booking-image"
                destination={b.destination || undefined}
                title={b.package?.title}
                fallbackImage={b.package?.image}
                alt={getBookingName(b)}
              />
              <div className="mb-booking-info">
                <div className="mb-booking-header">
                  <h3>{getBookingName(b)}</h3>
                  <span className={"mb-status-badge mb-status-badge--" + b.status}>{getStatusLabel(b.status)}</span>
                </div>
                <p className="mb-booking-location">
                  {getBookingLocation(b)}
                  {b.bookingType === "package" ? ` · ${copy.myBookings.bookingTypeSuffix}` : ""}
                </p>
                <div className="mb-booking-dates">
                  <span>{formatDate(b.checkIn)} — {formatDate(b.checkOut)}</span>
                  <span className="mb-booking-nights">{formatNumber(nights(b.checkIn, b.checkOut))} {getNightLabel(nights(b.checkIn, b.checkOut))}</span>
                </div>
                <div className="mb-booking-footer">
                  <span className="mb-booking-guests">{formatNumber(b.guests)} {getGuestLabel(b.guests)}</span>
                  <span className="mb-booking-price">LKR {formatNumber(b.totalPrice)}</span>
                  {b.status === "confirmed" && (
                    <button className="mb-cancel-btn" onClick={() => handleCancel(b._id)}>{copy.myBookings.cancelLabel}</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MyBookings;
