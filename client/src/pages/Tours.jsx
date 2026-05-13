import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { getTourServices } from "../services/api";
import { useChatRequestCount } from "../utils/chatRequests";
import { getLocalizedSiteCopy, SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./Shopping.css";
import "./Tours.css";

const TOUR_SERVICES = [
  {
    id: "tt1",
    name: "Colombo City Tuk Tuk Hire",
    category: "Tuk Tuk Rides",
    location: "Colombo 3, Western Province",
    description:
      "Reliable city tuk tuk rides for hotel pickups, street food runs, shopping stops and short sightseeing loops around Colombo.",
    rating: 4.8,
    reviewCount: 214,
    priceRange: "LKR 3,500 – 8,500 / day",
    tag: "Fast City Hire",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    availability: "24/7",
    vehicle: "3-wheel tuk tuk",
    idealFor: "City rides & food tours",
    phone: "+94 77 345 1188",
    whatsapp: "94773451188",
  },
  {
    id: "tt2",
    name: "Kandy Heritage Tuk Tours",
    category: "Tuk Tuk Rides",
    location: "Kandy, Central Province",
    description:
      "Private tuk tuk tours around Kandy Lake, Temple of the Tooth, Bahirawakanda and nearby viewpoints with local driver-guides.",
    rating: 4.7,
    reviewCount: 167,
    priceRange: "LKR 4,000 – 9,000 / half day",
    tag: "Local Guide",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80",
    availability: "6 AM – 10 PM",
    vehicle: "Sightseeing tuk tuk",
    idealFor: "Temple runs & viewpoints",
    phone: "+94 76 998 5544",
    whatsapp: "94769985544",
  },
  {
    id: "vn1",
    name: "Island Family Van & Driver",
    category: "Van with Driver",
    location: "Negombo, Western Province",
    description:
      "Comfortable air-conditioned van hire for intercity travel, family tours, hill country routes and hotel-to-hotel transfers.",
    rating: 4.9,
    reviewCount: 301,
    priceRange: "LKR 18,000 – 38,000 / day",
    tag: "Family Favourite",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
    availability: "Islandwide, daily",
    vehicle: "7 to 12-seat van",
    idealFor: "Families & luggage",
    phone: "+94 71 222 6400",
    whatsapp: "94712226400",
  },
  {
    id: "vn2",
    name: "South Coast Surf Transfer Van",
    category: "Van with Driver",
    location: "Galle, Southern Province",
    description:
      "Private van service for surfboard-friendly airport pickups and easy transfers between Galle, Weligama, Mirissa and Hiriketiya.",
    rating: 4.8,
    reviewCount: 188,
    priceRange: "LKR 16,000 – 30,000 / trip",
    tag: "Surf Friendly",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    availability: "24/7 on request",
    vehicle: "Board-ready van",
    idealFor: "Beach transfers & groups",
    phone: "+94 75 640 1212",
    whatsapp: "94756401212",
  },
  {
    id: "ap1",
    name: "Bandaranaike Airport Transfer Desk",
    category: "Airport Transfers",
    location: "Katunayake, Western Province",
    description:
      "Direct airport pickups and drop-offs with meet-and-greet service, fixed rates and late-night arrival support.",
    rating: 4.8,
    reviewCount: 422,
    priceRange: "LKR 9,000 – 18,000 / trip",
    tag: "Airport Pickup",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    availability: "24/7",
    vehicle: "Sedan or van",
    idealFor: "Airport arrivals",
    phone: "+94 77 880 9900",
    whatsapp: "94778809900",
  },
  {
    id: "pc1",
    name: "Ceylon Chauffeur Sedan",
    category: "Private Car",
    location: "Colombo 7, Western Province",
    description:
      "Private sedan hire with an English-speaking chauffeur for business meetings, day tours and premium hotel transfers.",
    rating: 4.9,
    reviewCount: 156,
    priceRange: "LKR 14,000 – 28,000 / day",
    tag: "Premium Ride",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    availability: "Daily, advance booking",
    vehicle: "Private sedan",
    idealFor: "Couples & business travel",
    phone: "+94 70 444 2020",
    whatsapp: "94704442020",
  },
  {
    id: "pc2",
    name: "Ella Highlands Personal Driver",
    category: "Private Car",
    location: "Ella, Uva Province",
    description:
      "Flexible hill-country transport for Nine Arch Bridge, tea estates, waterfalls and scenic train station pickups around Ella.",
    rating: 4.7,
    reviewCount: 132,
    priceRange: "LKR 12,000 – 24,000 / day",
    tag: "Hill Country Driver",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    availability: "6 AM – 9 PM",
    vehicle: "Private car",
    idealFor: "Scenic day rides",
    phone: "+94 76 281 8181",
    whatsapp: "94762818181",
  },
  {
    id: "sj1",
    name: "Yala Safari Jeep Hire",
    category: "Safari Jeeps",
    location: "Tissamaharama, Southern Province",
    description:
      "Private jeep hire with experienced safari drivers for Yala park entries, sunrise runs and full-day wildlife circuits.",
    rating: 4.8,
    reviewCount: 287,
    priceRange: "LKR 17,000 – 32,000 / safari",
    tag: "Wildlife Jeep",
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=1200&q=80",
    availability: "Morning & evening slots",
    vehicle: "Open safari jeep",
    idealFor: "Parks & photography",
    phone: "+94 77 612 7878",
    whatsapp: "94776127878",
  },
  {
    id: "co1",
    name: "Ceylon Group Coach Lines",
    category: "Coaches",
    location: "Colombo 10, Western Province",
    description:
      "Mini coaches and large buses for group tours, corporate travel, destination weddings and event transfers across Sri Lanka.",
    rating: 4.6,
    reviewCount: 119,
    priceRange: "LKR 32,000 – 85,000 / day",
    tag: "Group Transport",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=1200&q=80",
    availability: "Daily, pre-booking advised",
    vehicle: "Mini coach / full coach",
    idealFor: "Groups & events",
    phone: "+94 11 289 4555",
    whatsapp: "94112894555",
  },
];

const CATEGORIES = [
  "All",
  "Tuk Tuk Rides",
  "Van with Driver",
  "Airport Transfers",
  "Private Car",
  "Safari Jeeps",
  "Coaches",
];

const CATEGORY_ICONS = {
  All: "🧭",
  "Tuk Tuk Rides": "🛺",
  "Van with Driver": "🚐",
  "Airport Transfers": "🛬",
  "Private Car": "🚘",
  "Safari Jeeps": "🦁",
  Coaches: "🚌",
};

const AREA_ALL = "All Areas";
const PROVINCES = new Set([
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
]);

const TOURS_COPY = {
  en: {
    nav: {
      home: "Home",
      destinations: "Destinations",
      shopping: "Stores",
      tours: "Tours",
      chat: "Chat",
      myBookings: "My Bookings",
      selectLanguage: "Select Language",
      greeting: "Hi",
      logout: "Logout",
      signIn: "Sign in",
      register: "Register",
    },
    hero: {
      badge: "Private Rides & Local Hires",
      titleLine1: "Book Trusted Sri Lankan",
      titleLine2: "Tuks, Vans & Chauffeur Tours",
      subtitle:
        "Contact local transport partners for airport pickups, tuk tuk hires, personal rides, safari jeeps and custom day tours across the island.",
      searchPlaceholder: "Search tuk tuk, van, airport pickup...",
      searchButton: "Search",
    },
    filters: {
      allAreas: "All Areas",
      browseByArea: "Browse By Area",
      showing: "Showing",
      serviceSingular: "service",
      servicePlural: "services",
      in: "in",
      acrossSriLanka: "across Sri Lanka",
      clearFilters: "Clear Filters ✕",
    },
    sections: {
      allCategories: "All Hire Types",
      resultsFor: "Results for",
      featuredServicesIn: "Featured transport services in",
      in: "in",
      browseIntro: "Call or message trusted drivers for personal rides, private hires and tour transfers.",
      noServicesFound: "No transport services found",
      noServicesBody: "Try a different keyword, hire type or area.",
      clearSearch: "Clear Search",
      callNow: "Call Now",
      whatsapp: "WhatsApp",
      availability: "Availability",
      vehicle: "Vehicle",
      idealFor: "Best For",
      priceRange: "rate guide",
    },
    info: {
      airportTitle: "Airport Pickups",
      airportBody: "Arrange direct hotel or airport transfers with luggage-friendly vehicles, fixed pricing and late-night support.",
      tukTitle: "Tuk Tuk City Rides",
      tukBody: "Great for short personal rides, flexible local sightseeing and food or shopping stops around busy towns.",
      vanTitle: "Vans With Drivers",
      vanBody: "Ideal for family travel, day tours, hotel-to-hotel routes and multi-stop trips with room for bags.",
      safariTitle: "Safari & Group Travel",
      safariBody: "Book jeeps, minibuses and full coaches for parks, weddings, surf groups and custom island routes.",
    },
    footer: "© 2025 Ceylon Explore. All rights reserved.",
    rating: {
      excellent: "Excellent",
      veryGood: "Very Good",
      good: "Good",
      reviewSingular: "review",
      reviewPlural: "reviews",
    },
  },
};

function getServiceArea(location) {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (!PROVINCES.has(parts[index])) {
      return parts[index];
    }
  }

  return "Sri Lanka";
}

const AREAS = [
  AREA_ALL,
  ...Array.from(new Set(TOUR_SERVICES.map((service) => getServiceArea(service.location)))).sort((left, right) => left.localeCompare(right)),
];

function getRatingStars(rating) {
  const roundedRating = Math.max(1, Math.min(5, Math.round(rating)));
  return `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;
}

function getRatingText(rating, reviewCount, copy) {
  const ratingCopy = copy.rating;
  const ratingLabel = rating >= 4.7 ? ratingCopy.excellent : rating >= 4.2 ? ratingCopy.veryGood : ratingCopy.good;

  if (reviewCount > 0) {
    return `${ratingLabel} · ${reviewCount} ${reviewCount === 1 ? ratingCopy.reviewSingular : ratingCopy.reviewPlural}`;
  }

  return ratingLabel;
}

export default function Tours() {
  const areaDropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const copy = getLocalizedSiteCopy(TOURS_COPY, language);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES);
  const [areas, setAreas] = useState(AREAS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeArea, setActiveArea] = useState(AREA_ALL);
  const [isAreaMenuOpen, setIsAreaMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTourServices()
      .then((response) => {
        if (!active) {
          return;
        }

        setServices(response.data?.services || []);
        setCategories(response.data?.categories || CATEGORIES);
        setAreas(response.data?.areas || AREAS);
        setError("");
      })
      .catch(() => {
        if (active) {
          setError("Unable to load transport services right now.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isAreaMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setIsAreaMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAreaMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAreaMenuOpen]);

  const visibleServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = activeCategory === "All" || service.category === activeCategory;
      const matchesArea = activeArea === AREA_ALL || getServiceArea(service.location) === activeArea;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query) ||
        getServiceArea(service.location).toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tag.toLowerCase().includes(query) ||
        service.idealFor.toLowerCase().includes(query);

      return matchesCategory && matchesArea && matchesSearch;
    });
  }, [activeArea, activeCategory, searchTerm, services]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);

    if (nextValue.trim() === "") {
      setSearchTerm("");
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setActiveCategory("All");
    setActiveArea(AREA_ALL);
    setIsAreaMenuOpen(false);
  };

  const handleAreaSelect = (area) => {
    setActiveArea(area);
    setIsAreaMenuOpen(false);
  };

  const hasActiveFilters = activeCategory !== "All" || activeArea !== AREA_ALL || searchTerm.trim() !== "";
  const locationLabel = activeArea === AREA_ALL ? "Sri Lanka" : activeArea;
  const serviceLabel = visibleServices.length === 1 ? copy.filters.serviceSingular : copy.filters.servicePlural;
  const emptyTitle = loading
    ? "Loading transport services..."
    : error
      ? "Unable to load transport services"
      : copy.sections.noServicesFound;
  const emptyBody = loading
    ? "Please wait while we load the latest transport catalogue."
    : error || copy.sections.noServicesBody;
  const languageSelector = (
    <div className="sp-lang">
      <span className="sp-lang-label">{copy.nav.selectLanguage}</span>
      <select aria-label={copy.nav.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="sp tp">
      <header className="sp-nav">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="sp-nav-right">
          <Link to="/" className="sp-nav-link">{copy.nav.home}</Link>
          <Link to="/destinations" className="sp-nav-link">{copy.nav.destinations}</Link>
          <Link to="/shopping" className="sp-nav-link">{copy.nav.shopping}</Link>
          <Link to="/tours" className="sp-nav-link">{copy.nav.tours}</Link>
          <Link to={user ? "/chat" : "/login"} className="sp-nav-link">{copy.nav.chat}<ChatRequestBadge count={chatRequestCount} /></Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="sp-nav-link">{copy.nav.myBookings}</Link>
              {languageSelector}
              <span className="sp-nav-name">{copy.nav.greeting}, {user.name}</span>
              <button className="sp-nav-btn sp-nav-btn--outline" onClick={logout}>{copy.nav.logout}</button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="sp-nav-btn sp-nav-btn--outline">{copy.nav.signIn}</Link>
              <Link to="/register" className="sp-nav-btn sp-nav-btn--fill">{copy.nav.register}</Link>
            </>
          )}
        </nav>
      </header>

      <section className="sp-hero">
        <div className="sp-hero-content">
          <span className="sp-hero-badge">{copy.hero.badge}</span>
          <h1 className="sp-hero-title">
            {copy.hero.titleLine1}
            <br />
            {copy.hero.titleLine2}
          </h1>
          <p className="sp-hero-sub">{copy.hero.subtitle}</p>
          <form className="sp-search" onSubmit={handleSearch}>
            <div className="sp-search-field">
              <svg className="sp-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={copy.hero.searchPlaceholder}
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <button type="submit" className="sp-search-btn">{copy.hero.searchButton}</button>
          </form>
        </div>
      </section>

      <div className="sp-tabs">
        <div className="sp-tabs-inner">
          <div className="sp-tabs-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`sp-tab${activeCategory === category ? " sp-tab--on" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                <span className="sp-tab-icon">{CATEGORY_ICONS[category]}</span>
                {category}
              </button>
            ))}
          </div>
          <div className="sp-tabs-count">
            <span>{visibleServices.length} {serviceLabel}</span>
          </div>
        </div>
      </div>

      <section className="sp-filter-strip">
        <div className="sp-container">
          <div className="sp-filterbar">
            <div className="sp-filter-group">
              <label className="sp-filter-label" id="tp-area-filter-label">
                {copy.filters.browseByArea}
              </label>
              <div className="sp-dropdown" ref={areaDropdownRef}>
                <button
                  id="tp-area-filter"
                  type="button"
                  className={`sp-select sp-select-button${isAreaMenuOpen ? " sp-select-button--open" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={isAreaMenuOpen}
                  aria-labelledby="tp-area-filter-label"
                  aria-controls="tp-area-filter-menu"
                  onClick={() => setIsAreaMenuOpen((open) => !open)}
                >
                  <span>{activeArea === AREA_ALL ? copy.filters.allAreas : activeArea}</span>
                </button>
                {isAreaMenuOpen && (
                  <div
                    id="tp-area-filter-menu"
                    className="sp-dropdown-menu"
                    role="listbox"
                    aria-labelledby="tp-area-filter-label"
                  >
                    {areas.map((area) => {
                      const isSelected = area === activeArea;
                      return (
                        <button
                          key={area}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`sp-dropdown-option${isSelected ? " sp-dropdown-option--selected" : ""}`}
                          onClick={() => handleAreaSelect(area)}
                        >
                          {area === AREA_ALL ? copy.filters.allAreas : area}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <p className="sp-results-note">
              {copy.filters.showing} <strong>{visibleServices.length}</strong> {serviceLabel}
              {activeArea !== AREA_ALL ? ` ${copy.filters.in} ${activeArea}` : ` ${copy.filters.acrossSriLanka}`}.
            </p>
            {hasActiveFilters && (
              <button type="button" className="sp-link-btn" onClick={resetFilters}>
                {copy.filters.clearFilters}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-section-head">
            <div>
              <p className="sp-kicker">{activeCategory === "All" ? copy.sections.allCategories : activeCategory}</p>
              <h2 className="sp-section-title">
                {searchTerm
                  ? `${copy.sections.resultsFor} "${searchTerm}"`
                  : activeCategory === "All"
                  ? `${copy.sections.featuredServicesIn} ${locationLabel}`
                  : `${activeCategory} ${copy.sections.in} ${locationLabel}`}
              </h2>
              <p className="sp-results-note sp-results-note--inline">{copy.sections.browseIntro}</p>
            </div>
          </div>

          {visibleServices.length === 0 ? (
            <div className="sp-empty">
              <span>🚐</span>
              <h3>{emptyTitle}</h3>
              <p>{emptyBody}</p>
              {!loading && !error && <button onClick={resetFilters}>{copy.sections.clearSearch}</button>}
            </div>
          ) : (
            <div className="sp-grid">
              {visibleServices.map((service) => (
                <article key={service.id} className="sp-card tp-card">
                  <div className="sp-card-img">
                    <img src={service.image} alt={service.name} loading="lazy" />
                    <span className="sp-card-badge sp-card-badge--tag">{service.tag}</span>
                    <span className="sp-card-badge sp-card-badge--cat">
                      {CATEGORY_ICONS[service.category]} {service.category}
                    </span>
                  </div>
                  <div className="sp-card-body">
                    <h3 className="sp-card-title">{service.name}</h3>
                    <div className="sp-card-loc">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {service.location}
                    </div>
                    <p className="sp-card-desc">{service.description}</p>
                    <div className="sp-card-foot">
                      <div className="sp-stars">
                        {getRatingStars(service.rating)}
                        <span>{getRatingText(service.rating, service.reviewCount, copy)}</span>
                      </div>
                      <div className="sp-price-col">
                        <strong>{service.priceRange}</strong>
                        <small>{copy.sections.priceRange}</small>
                      </div>
                    </div>

                    <div className="tp-contact-grid">
                      <div className="tp-contact-card">
                        <span>{copy.sections.availability}</span>
                        <strong>{service.availability}</strong>
                      </div>
                      <div className="tp-contact-card">
                        <span>{copy.sections.vehicle}</span>
                        <strong>{service.vehicle}</strong>
                      </div>
                      <div className="tp-contact-card tp-contact-card--wide">
                        <span>{copy.sections.idealFor}</span>
                        <strong>{service.idealFor}</strong>
                      </div>
                    </div>

                    <div className="tp-contact-inline">
                      <a href={`tel:${service.phone}`} className="tp-contact-link">{service.phone}</a>
                      <a href={`https://wa.me/${service.whatsapp}?text=Hello%20I%20would%20like%20to%20book%20a%20ride%20in%20Sri%20Lanka.`} target="_blank" rel="noreferrer" className="tp-contact-link">
                        WhatsApp
                      </a>
                    </div>

                    <div className="tp-card-actions">
                      <a href={`tel:${service.phone}`} className="sp-card-btn">{copy.sections.callNow}</a>
                      <a
                        href={`https://wa.me/${service.whatsapp}?text=Hello%20I%20would%20like%20to%20book%20a%20ride%20in%20Sri%20Lanka.`}
                        target="_blank"
                        rel="noreferrer"
                        className="tp-card-btn-secondary"
                      >
                        {copy.sections.whatsapp}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="sp-section sp-section--alt">
        <div className="sp-container">
          <div className="sp-info-grid">
            <div className="sp-info-card">
              <span className="sp-info-icon">🛬</span>
              <h3>{copy.info.airportTitle}</h3>
              <p>{copy.info.airportBody}</p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-icon">🛺</span>
              <h3>{copy.info.tukTitle}</h3>
              <p>{copy.info.tukBody}</p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-icon">🚐</span>
              <h3>{copy.info.vanTitle}</h3>
              <p>{copy.info.vanBody}</p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-icon">🚌</span>
              <h3>{copy.info.safariTitle}</h3>
              <p>{copy.info.safariBody}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="sp-footer">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}