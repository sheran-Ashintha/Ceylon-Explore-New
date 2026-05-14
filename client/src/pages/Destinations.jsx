import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getDestinations, getPackages } from "../services/api";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import PlaceImage from "../components/PlaceImage";
import { useChatRequestCount } from "../utils/chatRequests";
import { SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import { getDestinationCopy } from "../utils/siteTranslations";
import "./Destinations.css";

const DEFAULT_PLACE_RATING = 4.4;
const PRICE_CONVERSION_RATE = 300;
const PRICE_FILTER_MAX = 450;

function getDisplayRating(rating) {
  return rating > 0 ? Math.min(5, rating) : DEFAULT_PLACE_RATING;
}

function getRatingStars(rating) {
  const roundedRating = Math.max(1, Math.min(5, Math.round(getDisplayRating(rating))));
  return `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;
}

function getRatingText(rating, reviewCount, language = "en") {
  const ratingCopy = getDestinationCopy(language).rating;
  const displayRating = getDisplayRating(rating);
  const ratingLabel = displayRating >= 4.7 ? ratingCopy.excellent : displayRating >= 4.2 ? ratingCopy.veryGood : ratingCopy.good;

  if (reviewCount > 0) {
    return `${ratingLabel} · ${reviewCount} ${reviewCount === 1 ? ratingCopy.reviewSingular : ratingCopy.reviewPlural}`;
  }

  return ratingLabel;
}

function getPlaceBadge(destination, fallbackCountry) {
  return destination.tag || destination.location?.split(",")[0]?.trim() || fallbackCountry;
}

function getPlaceDescription(destination) {
  if (!destination.location) {
    return destination.description;
  }

  return `${destination.location}. ${destination.description}`;
}

function matchesPackageSearch(pkg, searchTerm) {
  if (!searchTerm) {
    return true;
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [pkg.title, pkg.text, pkg.category]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const copy = getDestinationCopy(language);

  const initialFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      maxPrice: searchParams.get("maxPrice") || String(PRICE_FILTER_MAX),
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadPackageCatalog = async () => {
      setPackagesLoading(true);

      try {
        const { data } = await getPackages();
        setPackages(data.packages || []);
        setCategories(data.categories?.length ? data.categories : ["All"]);
      } catch (err) {
        console.error("Failed to load packages:", err.message);
      } finally {
        setPackagesLoading(false);
      }
    };

    loadPackageCatalog();
  }, []);

  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      try {
        const { data } = await getDestinations(initialFilters);
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load destinations:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [initialFilters]);

  const fetchDestinations = async (nextFilters) => {
    setLoading(true);
    try {
      const { data } = await getDestinations(nextFilters);
      setDestinations(data);
    } catch (err) {
      console.error("Failed to load destinations:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, search: searchInput };
    setFilters(nextFilters);
    await fetchDestinations(nextFilters);
  };

  const handleSearchInputChange = async (event) => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);

    if (nextValue.trim() === "" && filters.search) {
      const nextFilters = { ...filters, search: "" };
      setFilters(nextFilters);
      await fetchDestinations(nextFilters);
    }
  };

  const handlePriceChange = async (value) => {
    const nextFilters = { ...filters, maxPrice: value };
    setFilters(nextFilters);
    await fetchDestinations(nextFilters);
  };

  const resetFilters = async () => {
    const nextFilters = {
      search: "",
      maxPrice: String(PRICE_FILTER_MAX),
    };
    setFilters(nextFilters);
    setSearchInput("");
    await fetchDestinations(nextFilters);
  };

  const maxPriceValue = Number(filters.maxPrice || PRICE_FILTER_MAX);
  const maxPackagePrice = maxPriceValue * PRICE_CONVERSION_RATE;

  const visiblePackages = packages.filter((pkg) => {
    const matchesCategory = activeCategory === "All" || pkg.category === activeCategory;
    const matchesPrice = !Number.isFinite(maxPackagePrice) || pkg.price <= maxPackagePrice;

    return matchesCategory && matchesPackageSearch(pkg, filters.search) && matchesPrice;
  });

  const getPackageDetailPath = (pkg) => `/destinations/packages/${pkg.slug}`;
  const destinationCountLabel = destinations.length === 1 ? copy.destinationSection.destinationSingular : copy.destinationSection.destinationPlural;
  const languageSelector = (
    <div className="dp-lang">
      <span className="dp-lang-label">{copy.nav.selectLanguage}</span>
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
    <div className="dp">
      <header className="dp-nav">
        <Link to="/" className="dp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="dp-nav-right">
          <Link to="/" className="dp-nav-link">
            {copy.nav.home}
          </Link>
          <Link to="/destinations" className="dp-nav-link">
            {copy.nav.destinations || "Destinations"}
          </Link>
          <Link to="/shopping" className="dp-nav-link">
            {copy.nav.shopping}
          </Link>
          <Link to="/tours" className="dp-nav-link">
            {copy.nav.tours || "Tours"}
          </Link>
          <Link to="/sos" className="dp-nav-link">
            SOS
          </Link>
          <Link to={user ? "/chat" : "/login"} className="dp-nav-link">
            {copy.nav.chat || "Chat"}
            <ChatRequestBadge count={chatRequestCount} />
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="dp-nav-link">
                {copy.nav.myBookings}
              </Link>
              {languageSelector}
              <span className="dp-nav-name">{copy.nav.greeting}, {user.name}</span>
              <button className="dp-nav-btn dp-nav-btn--outline" onClick={logout}>
                {copy.nav.logout}
              </button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="dp-nav-btn dp-nav-btn--outline">
                {copy.nav.signIn}
              </Link>
              <Link to="/register" className="dp-nav-btn dp-nav-btn--fill">
                {copy.nav.register}
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="dp-hero">
        <div className="dp-hero-content">
          <span className="dp-hero-badge">{copy.hero.badge}</span>
          <h1 className="dp-hero-title">
            {copy.hero.titleLine1}
            <br />
            {copy.hero.titleLine2}
          </h1>
          <p className="dp-hero-sub">
            {copy.hero.subtitle}
          </p>

          <form className="dp-search" onSubmit={handleSearch}>
            <div className="dp-search-field">
              <svg className="dp-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={copy.hero.searchPlaceholder}
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>
            <button type="submit" className="dp-search-btn">
              {copy.hero.searchButton}
            </button>
          </form>
        </div>
      </section>

      <div className="dp-tabs">
        <div className="dp-tabs-inner">
          <div className="dp-tabs-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`dp-tab${activeCategory === category ? " dp-tab--on" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "All" ? copy.allTab : category}
              </button>
            ))}
          </div>
          <div className="dp-price-filter">
            <span>
              {copy.hero.maxLabel}: <strong>LKR {(maxPriceValue * PRICE_CONVERSION_RATE).toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="0"
              max={String(PRICE_FILTER_MAX)}
              step="5"
              value={String(maxPriceValue)}
              onChange={(event) => handlePriceChange(event.target.value)}
            />
          </div>
        </div>
      </div>

      <section className="dp-section">
        <div className="dp-container">
          <div className="dp-section-head">
            <div>
              <p className="dp-kicker">{copy.packageSection.kicker}</p>
              <h2 className="dp-section-title">{copy.packageSection.title}</h2>
            </div>
            <button
              type="button"
              className="dp-link-btn"
              onClick={() => document.getElementById("dp-places")?.scrollIntoView({ behavior: "smooth" })}
            >
              {copy.packageSection.browsePlaces}
            </button>
          </div>

          {packagesLoading ? (
            <div className="dp-pkg-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="dp-skeleton">
                  <div className="dp-skeleton-img" />
                  <div className="dp-skeleton-body">
                    <div className="dp-skeleton-line" style={{ width: "70%" }} />
                    <div className="dp-skeleton-line" style={{ width: "55%" }} />
                    <div className="dp-skeleton-line" style={{ width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : visiblePackages.length === 0 ? (
            <div className="dp-empty dp-empty--compact">
              <span>🔎</span>
              <h3>{copy.packageSection.noMatchTitle}</h3>
              <p>{copy.packageSection.noMatchBody}</p>
              <button onClick={resetFilters}>{copy.packageSection.clearSearch}</button>
            </div>
          ) : (
            <div className="dp-pkg-grid">
              {visiblePackages.map((pkg) => (
                <article
                  key={pkg.slug}
                  className="dp-pkg-card"
                  onClick={() => navigate(getPackageDetailPath(pkg))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(getPackageDetailPath(pkg));
                    }
                  }}
                >
                  <div className="dp-card-img">
                    <PlaceImage key={pkg.title} title={pkg.title} fallbackImage={pkg.image} alt={pkg.title} />
                    <span className="dp-card-badge dp-card-badge--days">{copy.packageSection.packageBadge}</span>
                    <span className="dp-card-badge dp-card-badge--cat">{pkg.category}</span>
                  </div>
                  <div className="dp-card-body">
                    <h3 className="dp-card-title">{pkg.title}</h3>
                    <p className="dp-card-desc">{pkg.text}</p>
                    <div className="dp-card-foot">
                      <div className="dp-stars">
                        ★★★★☆ <span>{copy.packageSection.defaultRating}</span>
                      </div>
                      <div className="dp-price-col">
                        <strong>LKR {pkg.price.toLocaleString()}</strong>
                        <small>{copy.packageSection.packageUnit}</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dp-card-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(getPackageDetailPath(pkg));
                      }}
                    >
                      {copy.packageSection.viewDetails}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dp-section dp-section--alt" id="dp-places">
        <div className="dp-container">
          <div className="dp-section-head">
            <div>
              <p className="dp-kicker">{copy.destinationSection.kicker}</p>
              <h2 className="dp-section-title">
                {loading ? copy.destinationSection.loading : `${destinations.length} ${destinationCountLabel}`}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="dp-place-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="dp-skeleton">
                  <div className="dp-skeleton-img" />
                  <div className="dp-skeleton-body">
                    <div className="dp-skeleton-line" style={{ width: "70%" }} />
                    <div className="dp-skeleton-line" style={{ width: "50%" }} />
                    <div className="dp-skeleton-line" style={{ width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="dp-empty">
              <span>🏝️</span>
              <h3>{copy.destinationSection.noDestinationsTitle}</h3>
              <p>{copy.destinationSection.noDestinationsBody}</p>
              <button onClick={resetFilters}>{copy.destinationSection.clearFilters}</button>
            </div>
          ) : (
            <div className="dp-place-grid">
              {destinations.map((destination) => (
                <article
                  key={destination._id}
                  className="dp-place-card"
                  onClick={() => navigate(`/destinations/${destination._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/destinations/${destination._id}`);
                    }
                  }}
                >
                  <div className="dp-card-img">
                    <PlaceImage key={destination._id || destination.name} destination={destination} alt={destination.name} />
                    <span className="dp-card-badge dp-card-badge--days">{getPlaceBadge(destination, copy.fallbackCountry)}</span>
                    <span className="dp-card-badge dp-card-badge--cat">{destination.category}</span>
                  </div>
                  <div className="dp-card-body">
                    <h3 className="dp-card-title">{destination.name}</h3>
                    <p className="dp-card-desc">{getPlaceDescription(destination)}</p>
                    <div className="dp-card-foot">
                      <div className="dp-stars">
                        {getRatingStars(destination.rating)}
                        <span>{getRatingText(destination.rating, destination.reviewCount, language)}</span>
                      </div>
                      <div className="dp-price-col">
                        {destination.price ? (
                          <>
                            <strong>LKR {(destination.price * 300).toLocaleString()}</strong>
                            <small>{copy.destinationSection.perNight}</small>
                          </>
                        ) : (
                          <>
                            <strong>{copy.destinationSection.contactForPrice}</strong>
                            <small>{copy.destinationSection.checkAvailability}</small>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dp-card-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/destinations/${destination._id}`);
                      }}
                    >
                      {copy.packageSection.viewDetails}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="dp-footer">
        <Link to="/" className="dp-nav-brand">
          Ceylon Explore
        </Link>
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}