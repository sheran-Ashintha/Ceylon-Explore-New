import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { getShopById } from "../services/api";
import { useChatRequestCount } from "../utils/chatRequests";
import { CATEGORY_ICONS, getRatingStars, getRatingText, getShopArea } from "../utils/shoppingHelpers";
import { SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import { getShoppingCategoryLabel, getShoppingCopy } from "../utils/siteTranslations";
import "./Shopping.css";
import "./ShopDetail.css";

function formatCopy(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export default function ShopDetail() {
  const { shopId } = useParams();
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const copy = getShoppingCopy(language);
  const [shop, setShop] = useState(null);
  const [relatedShops, setRelatedShops] = useState([]);
  const [resolvedShopId, setResolvedShopId] = useState("");
  const loading = resolvedShopId !== String(shopId || "");

  useEffect(() => {
    let active = true;

    getShopById(shopId)
      .then((response) => {
        if (!active) {
          return;
        }

        setShop(response.data?.shop || null);
        setRelatedShops(response.data?.relatedShops || []);
      })
      .catch(() => {
        if (active) {
          setShop(null);
          setRelatedShops([]);
        }
      })
      .finally(() => {
        if (active) {
          setResolvedShopId(String(shopId || ""));
        }
      });

    return () => {
      active = false;
    };
  }, [shopId]);
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

  if (!shop) {
    return (
      <div className="sp sd">
        <header className="sp-nav">
          <Link to="/" className="sp-nav-brand">
            Ceylon Explore
          </Link>
          <nav className="sp-nav-right">
            <Link to="/" className="sp-nav-link">
              {copy.nav.home}
            </Link>
            <Link to="/destinations" className="sp-nav-link">
              {copy.nav.destinations}
            </Link>
            <Link to="/shopping" className="sp-nav-link">
              {copy.detail.breadcrumbsShopping}
            </Link>
            <Link to="/tours" className="sp-nav-link">
              {copy.nav.tours || "Tours"}
            </Link>
            <Link to={user ? "/chat" : "/login"} className="sp-nav-link">
              {copy.nav.chat || "Chat"}
              <ChatRequestBadge count={chatRequestCount} />
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="sp-nav-link">
                  {copy.nav.myBookings}
                </Link>
                {languageSelector}
                <span className="sp-nav-name">{copy.nav.greeting}, {user.name}</span>
                <button className="sp-nav-btn sp-nav-btn--outline" onClick={logout}>
                  {copy.nav.logout}
                </button>
              </>
            ) : (
              <>
                {languageSelector}
                <Link to="/login" className="sp-nav-btn sp-nav-btn--outline">
                  {copy.nav.signIn}
                </Link>
                <Link to="/register" className="sp-nav-btn sp-nav-btn--fill">
                  {copy.nav.register}
                </Link>
              </>
            )}
          </nav>
        </header>

        <section className="sd-empty-wrap">
          <div className="sp-container">
            <div className="sd-empty">
              <span>🛍️</span>
              <h1>{loading ? "Loading store..." : copy.detail.notFoundTitle}</h1>
              <p>{loading ? "Please wait while we load the latest store details." : copy.detail.notFoundBody}</p>
              <Link to="/shopping" className="sd-btn sd-btn--fill">
                {copy.detail.backToShopping}
              </Link>
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

  const area = getShopArea(shop.location);
  const categoryLabel = getShoppingCategoryLabel(language, shop.category);

  return (
    <div className="sp sd">
      <header className="sp-nav">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="sp-nav-right">
          <Link to="/" className="sp-nav-link">
            {copy.nav.home}
          </Link>
          <Link to="/destinations" className="sp-nav-link">
            {copy.nav.destinations}
          </Link>
          <Link to="/shopping" className="sp-nav-link">
            {copy.detail.breadcrumbsShopping}
          </Link>
          <Link to="/tours" className="sp-nav-link">
            {copy.nav.tours || "Tours"}
          </Link>
          <Link to={user ? "/chat" : "/login"} className="sp-nav-link">
            {copy.nav.chat || "Chat"}
            <ChatRequestBadge count={chatRequestCount} />
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="sp-nav-link">
                {copy.nav.myBookings}
              </Link>
              {languageSelector}
              <span className="sp-nav-name">{copy.nav.greeting}, {user.name}</span>
              <button className="sp-nav-btn sp-nav-btn--outline" onClick={logout}>
                {copy.nav.logout}
              </button>
            </>
          ) : (
            <>
              {languageSelector}
              <Link to="/login" className="sp-nav-btn sp-nav-btn--outline">
                {copy.nav.signIn}
              </Link>
              <Link to="/register" className="sp-nav-btn sp-nav-btn--fill">
                {copy.nav.register}
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="sd-hero">
        <div className="sp-container">
          <div className="sd-breadcrumbs">
            <Link to="/">{copy.nav.home}</Link>
            <span>/</span>
            <Link to="/shopping">{copy.detail.breadcrumbsShopping}</Link>
            <span>/</span>
            <span>{shop.name}</span>
          </div>

          <div className="sd-hero-grid">
            <div className="sd-media">
              <img src={shop.image} alt={shop.name} />
              <span className="sp-card-badge sp-card-badge--tag">{shop.tag}</span>
              <span className="sp-card-badge sp-card-badge--cat">
                {CATEGORY_ICONS[shop.category]} {categoryLabel}
              </span>
            </div>

            <div className="sd-summary">
              <p className="sd-kicker">{copy.detail.guide}</p>
              <h1 className="sd-title">{shop.name}</h1>
              <p className="sd-location">
                {area} · {shop.location}
              </p>
              <p className="sd-description">{shop.description}</p>

              <div className="sd-rating-row">
                <span className="sp-stars">{getRatingStars(shop.rating)}</span>
                <span className="sd-rating-text">{getRatingText(shop.rating, shop.reviewCount, language)}</span>
              </div>

              <div className="sd-actions">
                {shop.website ? (
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sd-btn sd-btn--fill"
                  >
                    {copy.detail.visitWebsite}
                  </a>
                ) : shop.phone ? (
                  <a href={`tel:${shop.phone}`} className="sd-btn sd-btn--fill">
                    {copy.detail.callStore}
                  </a>
                ) : null}
                <Link to="/shopping" className="sd-btn sd-btn--outline">
                  {copy.detail.backToShopping}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sd-section">
        <div className="sp-container sd-layout">
          <div className="sd-main">
            <div className="sd-panel">
              <h2 className="sd-panel-title">{copy.detail.storeDetails}</h2>
              <div className="sd-detail-grid">
                <div className="sd-detail-item">
                  <span>{copy.detail.category}</span>
                  <strong>{categoryLabel}</strong>
                </div>
                <div className="sd-detail-item">
                  <span>{copy.detail.area}</span>
                  <strong>{area}</strong>
                </div>
                <div className="sd-detail-item">
                  <span>{copy.detail.openHours}</span>
                  <strong>{shop.openHours}</strong>
                </div>
                <div className="sd-detail-item">
                  <span>{copy.detail.priceRange}</span>
                  <strong>{shop.priceRange}</strong>
                </div>
                <div className="sd-detail-item">
                  <span>{copy.detail.reviews}</span>
                  <strong>{shop.reviewCount.toLocaleString()} {copy.detail.reviewsSuffix}</strong>
                </div>
                <div className="sd-detail-item">
                  <span>{copy.detail.storeTag}</span>
                  <strong>{shop.tag}</strong>
                </div>
              </div>
            </div>

            <div className="sd-panel">
              <h2 className="sd-panel-title">{copy.detail.whyVisit}</h2>
              <ul className="sd-list">
                <li>{formatCopy(copy.detail.whyVisitLine1, { tag: shop.tag, area })}</li>
                <li>{formatCopy(copy.detail.whyVisitLine2, { category: categoryLabel })}</li>
                <li>{formatCopy(copy.detail.whyVisitLine3, { reviewCount: shop.reviewCount.toLocaleString(), rating: shop.rating.toFixed(1) })}</li>
              </ul>
            </div>
          </div>

          <aside className="sd-side">
            <div className="sd-panel">
              <h3 className="sd-panel-title">{copy.detail.visitorTips}</h3>
              <div className="sd-tips">
                <div className="sd-tip">{formatCopy(copy.detail.visitorTip1, { area })}</div>
                <div className="sd-tip">{formatCopy(copy.detail.visitorTip2, { hours: shop.openHours })}</div>
                <div className="sd-tip">{formatCopy(copy.detail.visitorTip3, { priceRange: shop.priceRange })}</div>
                {shop.phone && <div className="sd-tip">{formatCopy(copy.detail.visitorTip4, { phone: shop.phone })}</div>}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedShops.length > 0 && (
        <section className="sp-section sp-section--alt">
          <div className="sp-container">
            <div className="sp-section-head">
              <div>
                <p className="sp-kicker">{copy.detail.moreToExplore}</p>
                <h2 className="sp-section-title">{formatCopy(copy.detail.moreCategory, { category: categoryLabel })}</h2>
              </div>
            </div>

            <div className="sp-grid sd-related-grid">
              {relatedShops.map((relatedShop) => (
                <Link key={relatedShop.id} to={`/shopping/${relatedShop.id}`} className="sd-card-link">
                  <article className="sp-card">
                    <div className="sp-card-img">
                      <img src={relatedShop.image} alt={relatedShop.name} loading="lazy" />
                      <span className="sp-card-badge sp-card-badge--tag">{relatedShop.tag}</span>
                      <span className="sp-card-badge sp-card-badge--cat">
                        {CATEGORY_ICONS[relatedShop.category]} {getShoppingCategoryLabel(language, relatedShop.category)}
                      </span>
                    </div>
                    <div className="sp-card-body">
                      <h3 className="sp-card-title">{relatedShop.name}</h3>
                      <div className="sp-card-loc">{relatedShop.location}</div>
                      <p className="sp-card-desc">{relatedShop.description}</p>
                      <div className="sp-card-foot">
                        <div className="sp-stars">
                          {getRatingStars(relatedShop.rating)}
                          <span>{getRatingText(relatedShop.rating, relatedShop.reviewCount, language)}</span>
                        </div>
                        <div className="sp-price-col">
                          <strong>{relatedShop.priceRange}</strong>
                          <small>{copy.detail.priceRangeLabel}</small>
                        </div>
                      </div>
                      <div className="sp-card-btn">{copy.detail.viewStore}</div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="sp-footer">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}