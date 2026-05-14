import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { getTouristHelpContent } from "../services/api";
import { useChatRequestCount } from "../utils/chatRequests";
import { SITE_LANGUAGE_OPTIONS, getLocalizedSiteCopy, useSiteLanguage } from "../utils/siteLanguage";
import "./Shopping.css";
import "./TouristHelp.css";

const TOURIST_HELP_COPY = {
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
      badge: "Tourist Help Desk",
      title: "Emergency contacts for travellers in Sri Lanka",
      body:
        "Reach the right department fast for medical emergencies, tourist complaints, police assistance, lost passport issues, and severe weather events.",
      urgentLabel: "Need immediate help?",
      urgentBody:
        "Call first, then explain your exact location, hotel name, nearest landmark, and what happened. If your phone battery is low, start with the department most relevant to the emergency.",
      primaryCta: "Call Tourism Hotline 1912",
      secondaryCta: "Call Ambulance 1990",
    },
    sections: {
      contactsTitle: "Official department contacts",
      contactsBody: "These contacts are based on official Sri Lankan government and tourism authority sites.",
      scenariosTitle: "Which department should a tourist call?",
      scenariosBody: "Use the issue guide below if you are unsure which office should be your first call.",
      prepTitle: "Before you make the call",
      prepBody: "A short, clear explanation helps emergency teams route you faster.",
      whyTitle: "Why keep these contacts ready",
      whyBody: "Travellers may need urgent help for more than just medical problems. Keep these numbers accessible before you head out.",
      sourceTitle: "Official sources used",
      sourceBody: "Every department below links back to its official site so tourists can verify details directly.",
    },
    status: {
      loading: "Loading official SOS contacts...",
      loadError: "Unable to load official SOS contacts right now.",
      empty: "No SOS contacts are published yet.",
    },
    actions: {
      call: "Call now",
      backupCall: "Call backup line",
      email: "Email department",
      website: "Open official site",
      shareLocation: "Share my location in chat",
      openChat: "Open travel chat",
      signInForChat: "Sign in for travel chat",
    },
    footer: "© 2026 Ceylon Explore. All rights reserved.",
  },
};

const EMPTY_HELP_CONTENT = {
  contacts: [],
  scenarios: [],
  reasons: [],
  prepSteps: [],
  sources: [],
};

function HelpCardAction({ href, label, secondary = false }) {
  if (!href) {
    return null;
  }

  const isExternalSite = href.startsWith("http");

  return (
    <a
      className={`eh-action${secondary ? " eh-action--secondary" : ""}`}
      href={href}
      target={isExternalSite ? "_blank" : undefined}
      rel={isExternalSite ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

export default function TouristHelp() {
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const copy = getLocalizedSiteCopy(TOURIST_HELP_COPY, language);
  const chatHref = user ? "/chat" : "/login";
  const chatLocationShareHref = "/chat?shareLocation=1";
  const [helpContent, setHelpContent] = useState(EMPTY_HELP_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);

    getTouristHelpContent()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setHelpContent({
          contacts: Array.isArray(data?.contacts) ? data.contacts : [],
          scenarios: Array.isArray(data?.scenarios) ? data.scenarios : [],
          reasons: Array.isArray(data?.reasons) ? data.reasons : [],
          prepSteps: Array.isArray(data?.prepSteps) ? data.prepSteps : [],
          sources: Array.isArray(data?.sources) ? data.sources : [],
        });
        setError("");
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || copy.status.loadError);
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
  }, [copy.status.loadError]);

  const contacts = helpContent.contacts;
  const scenarios = helpContent.scenarios;
  const reasons = helpContent.reasons;
  const prepSteps = helpContent.prepSteps;
  const sources = helpContent.sources;
  const tourismContact = contacts.find((contact) => contact.id === "tourism") || contacts[0] || null;
  const ambulanceContact = contacts.find((contact) => contact.id === "ambulance") || contacts[1] || null;

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
    <div className="sp eh">
      <header className="sp-nav">
        <Link to="/" className="sp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="sp-nav-right">
          <Link to="/" className="sp-nav-link">{copy.nav.home}</Link>
          <Link to="/destinations" className="sp-nav-link">{copy.nav.destinations}</Link>
          <Link to="/shopping" className="sp-nav-link">{copy.nav.shopping}</Link>
          <Link to="/tours" className="sp-nav-link">{copy.nav.tours}</Link>
          <Link to="/sos" className="sp-nav-link">SOS</Link>
          <Link to={chatHref} className="sp-nav-link">{copy.nav.chat}<ChatRequestBadge count={chatRequestCount} /></Link>
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

      <section className="eh-hero">
        <div className="sp-container eh-hero-grid">
          <div className="eh-hero-copy">
            <span className="eh-badge">{copy.hero.badge}</span>
            <h1 className="eh-title">{copy.hero.title}</h1>
            <p className="eh-body">{copy.hero.body}</p>
            <div className="eh-hero-actions">
              <a className="eh-hero-action eh-hero-action--primary" href={tourismContact?.primaryHref}>{copy.hero.primaryCta}</a>
              <a className="eh-hero-action eh-hero-action--secondary" href={ambulanceContact?.primaryHref}>{copy.hero.secondaryCta}</a>
            </div>
            <div className="eh-reason-row" aria-label={copy.sections.whyTitle}>
              {(reasons.length ? reasons : [loading ? copy.status.loading : copy.status.empty]).map((reason) => (
                <span key={reason} className="eh-reason-chip">{reason}</span>
              ))}
            </div>
            {error ? <p className="eh-fetch-state eh-fetch-state--error">{error}</p> : null}
          </div>

          <aside className="eh-urgent-card">
            <p className="eh-urgent-label">{copy.hero.urgentLabel}</p>
            <div className="eh-urgent-stack">
              <a className="eh-urgent-number" href={tourismContact?.primaryHref}>{tourismContact?.primaryNumber || "..."}</a>
              <span className="eh-urgent-caption">{tourismContact?.department || copy.hero.primaryCta}</span>
            </div>
            <div className="eh-urgent-stack eh-urgent-stack--secondary">
              <a className="eh-urgent-number" href={ambulanceContact?.primaryHref}>{ambulanceContact?.primaryNumber || "..."}</a>
              <span className="eh-urgent-caption">{ambulanceContact?.department || copy.hero.secondaryCta}</span>
            </div>
            <p className="eh-urgent-body">{copy.hero.urgentBody}</p>
          </aside>
        </div>
      </section>

      <section className="eh-section">
        <div className="sp-container">
          <div className="eh-section-head">
            <div>
              <p className="eh-kicker">Emergency directory</p>
              <h2>{copy.sections.contactsTitle}</h2>
            </div>
            <p>{copy.sections.contactsBody}</p>
          </div>

          <div className="eh-contact-grid">
            {loading ? (
              <div className="eh-fetch-card">{copy.status.loading}</div>
            ) : null}

            {!loading && !contacts.length ? (
              <div className="eh-fetch-card">{copy.status.empty}</div>
            ) : null}

            {contacts.map((contact) => (
              <article key={contact.id} className="eh-card" style={{ "--eh-accent": contact.accent }}>
                <div className="eh-card-top">
                  <div>
                    <span className="eh-card-category">{contact.category}</span>
                    <h3>{contact.department}</h3>
                    <p>{contact.summary}</p>
                  </div>
                  <span className="eh-card-source">{contact.availability}</span>
                </div>

                <a className="eh-card-number" href={contact.primaryHref}>{contact.primaryNumber}</a>

                {contact.secondaryNumber ? (
                  <a className="eh-card-secondary" href={contact.secondaryHref}>{contact.secondaryNumber}</a>
                ) : null}

                {contact.email ? (
                  <a className="eh-card-email" href={contact.emailHref}>{contact.email}</a>
                ) : null}

                <ul className="eh-card-list">
                  {contact.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="eh-card-actions">
                  <HelpCardAction href={contact.primaryHref} label={copy.actions.call} />
                  <HelpCardAction href={contact.secondaryHref} label={copy.actions.backupCall} secondary />
                  <HelpCardAction href={contact.emailHref} label={copy.actions.email} secondary />
                  <HelpCardAction href={contact.websiteHref} label={copy.actions.website} secondary />
                </div>

                <p className="eh-card-source-note">{contact.source}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="eh-section eh-section--alt">
        <div className="sp-container">
          <div className="eh-section-head">
            <div>
              <p className="eh-kicker">Issue guide</p>
              <h2>{copy.sections.scenariosTitle}</h2>
            </div>
            <p>{copy.sections.scenariosBody}</p>
          </div>

          <div className="eh-scenario-grid">
            {scenarios.map((scenario) => (
              <article key={scenario.title} className="eh-scenario-card">
                <h3>{scenario.title}</h3>
                <strong>{scenario.primary}</strong>
                <p>{scenario.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="eh-section">
        <div className="sp-container eh-bottom-grid">
          <article className="eh-info-card">
            <p className="eh-kicker">Call checklist</p>
            <h2>{copy.sections.prepTitle}</h2>
            <p>{copy.sections.prepBody}</p>
            <ol className="eh-step-list">
              {prepSteps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="eh-chat-actions">
              {user ? (
                <>
                  <Link to={chatLocationShareHref} className="eh-chat-link">
                    {copy.actions.shareLocation}
                  </Link>
                  <Link to={chatHref} className="eh-chat-link eh-chat-link--secondary">
                    {copy.actions.openChat}
                  </Link>
                </>
              ) : (
                <Link to={chatHref} className="eh-chat-link">
                  {copy.actions.signInForChat}
                </Link>
              )}
            </div>
          </article>

          <article className="eh-info-card eh-info-card--soft">
            <p className="eh-kicker">Safety reminder</p>
            <h2>{copy.sections.whyTitle}</h2>
            <p>{copy.sections.whyBody}</p>
            <ul className="eh-why-list">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>

          <article className="eh-info-card eh-info-card--soft">
            <p className="eh-kicker">Verification</p>
            <h2>{copy.sections.sourceTitle}</h2>
            <p>{copy.sections.sourceBody}</p>
            <ul className="eh-source-list">
              {sources.map((source) => (
                <li key={source.label}>
                  <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                  <span>{source.detail}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <footer className="eh-footer">{copy.footer}</footer>
    </div>
  );
}