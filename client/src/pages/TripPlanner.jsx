import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatRequestBadge from "../components/ChatRequestBadge";
import { useAuth } from "../context/useAuth";
import { useChatRequestCount } from "../utils/chatRequests";
import { createBooking, getDestinations, getShops, getTourServices } from "../services/api";
import {
  getLocalizedSiteCopy,
  SITE_LANGUAGE_DATE_LOCALES,
  SITE_LANGUAGE_OPTIONS,
  useSiteLanguage,
} from "../utils/siteLanguage";
import { getDestinationCopy } from "../utils/siteTranslations";
import {
  buildTripPlan,
  createEmptyPlannerDraft,
  mergePlannerDraft,
  parsePlannerMessage,
} from "../utils/tripPlanner";
import "./TripPlanner.css";

const EMPTY_PLANNER_ADD_ONS = {
  transportServices: [],
  cafeStops: [],
};

const TRIP_PLANNER_COPY = {
  en: {
    hero: {
      badge: "Journey Planner",
      title: "Plan and book your Sri Lanka journey",
      subtitle:
        "Tell the planner where you want to go, when you want to travel, how many people are joining, and whether you need transport or cafe stops. It will match stays, estimate the total, and keep optional extras ready alongside the itinerary.",
      examplesTitle: "Quick examples",
      previewTitle: "Live booking preview",
      previewBody:
        "As you type, the planner turns your request into a quote-ready route with matched stays, optional transport services, cafe suggestions, travel dates, and a running total.",
    },
    chat: {
      intro:
        "Tell the Journey Planner the places you want to visit, a start date, and either a checkout date or total nights. You can also ask for transport, airport pickup, or cafe stops. Example: Plan Ella and Kandy from 10 May 2026 to 15 May 2026 for 2 people with transport and cafes.",
      placeholder: "Type your journey request here...",
      send: "Plan journey",
      reset: "Start over",
      loading: "Loading destination data...",
      unavailable: "I could not load destination data right now. Please try again.",
      panelTitle: "Planner conversation",
      panelStatus: "Auto quote",
      composerTitle: "Describe the journey you want",
      composerHint:
        "Mention places, dates, nights, and guest count in one message or across several messages. Add transport, airport pickup, or cafes if needed and the planner will include matching suggestions.",
      usePrompt: "Use this prompt",
      examples: [
        "Plan Ella and Kandy from 10 May 2026 to 15 May 2026 for 2 people",
        "I want Galle and Mirissa for 5 nights from 2026-06-04 for 3 guests with transport",
        "Book Sigiriya and Kandy from 2026-07-01 to 2026-07-06 for 1 person and add cafes",
      ],
    },
    summary: {
      title: "Journey summary",
      emptyTitle: "No itinerary yet",
      emptyBody:
        "The planner needs at least one place, a start date, and either a checkout date or trip length before it can calculate the total.",
      matchedTitle: "Matched stays",
      travelers: "Travelers",
      dates: "Travel dates",
      duration: "Duration",
      staysTotal: "Stay total",
      transportEstimate: "Transport estimate",
      total: "Estimated total",
      add: "Add to My Bookings",
      adding: "Adding to My Bookings...",
      added: "Added to My Bookings",
      viewBookings: "View My Bookings",
      createsNote: "This saves the stay bookings only. Transport services and cafe suggestions remain as recommendations.",
      defaultGuestsNote: "Using 1 traveler until you tell me a guest count.",
      stopLabel: "Stop",
      matches: "Matched places",
      transportTitle: "Transport services",
      transportBody: "Matched from Tours using your route and group size.",
      transportUnavailable: "No transport match yet. Add transport, airport pickup, or more route details.",
      openTours: "Open Tours",
      cafesTitle: "Cafe stops",
      cafesBody: "Optional cafe picks for breaks on your route.",
      cafesUnavailable: "No cafe suggestions matched yet.",
      openStores: "Open Stores",
      hours: "Hours",
      optionalLabel: "Optional",
      waiting: "Waiting",
      readyStatus: "Ready to save",
      collectingStatus: "Collecting details",
      previewNone: "No matched places yet",
      missing: {
        destinations: "places to visit",
        startDate: "a start date",
        duration: "a checkout date or total nights",
      },
      requirements: [
        "Places to visit, for example Ella, Kandy, or Galle",
        "A start date like 2026-05-10 or 10 May 2026",
        "Either a checkout date or a duration like 4 nights",
        "How many people are traveling",
        "Optional: ask for transport, airport pickup, or cafes if needed",
      ],
    },
    messages: {
      cleared: "Plan cleared. Tell me the places, dates, and guest count to start again.",
      noPlaces:
        "I could not match any destinations from that message. Try place names like Ella, Kandy, Galle, Mirissa, or Sigiriya.",
      matched: "I matched {places}.",
      needMore: "I still need {items} before I can build the booking plan.",
      ready:
        "I planned {stops} stop(s) from {start} to {end} for {guests} traveler(s). Estimated total: LKR {total}.",
      transportIncluded: "That total includes an estimated transport add-on of LKR {total}.",
      transportMatched: "I also matched {count} transport option(s), led by {service}.",
      cafesMatched: "I found {count} cafe stop suggestion(s), starting with {cafe}.",
      invalidDates: "The end date needs to be after the start date.",
      tooManyStops: "Your trip is shorter than the number of places. Add more nights or remove a stop.",
      saved: "Added {count} booking(s) to My Bookings.",
      partialSave:
        "{count} booking(s) were added before the planner stopped. Please check My Bookings before trying again.",
      saveFailed: "The planner could not save those bookings right now. Please try again.",
    },
  },
};

function formatCopy(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
  };
}

function getInitials(name = "You") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "YO";
  }

  return parts.slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "YO";
}

function formatDateLabel(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatNumber(value, locale) {
  return Number(value || 0).toLocaleString(locale);
}

function buildPlannerReply(copy, plan, draft, locale) {
  const extras = [];

  if (plan.transportRequested && plan.transportRecommendations.length) {
    extras.push(
      formatCopy(copy.messages.transportMatched, {
        count: plan.transportRecommendations.length,
        service: plan.transportRecommendations[0].name,
      }),
    );
  }

  if (plan.cafeRequested && plan.cafeRecommendations.length) {
    extras.push(
      formatCopy(copy.messages.cafesMatched, {
        count: plan.cafeRecommendations.length,
        cafe: plan.cafeRecommendations[0].name,
      }),
    );
  }

  if (!draft.destinations.length) {
    return copy.messages.noPlaces;
  }

  if (plan.status === "invalid") {
    return plan.reason === "too-many-stops" ? copy.messages.tooManyStops : copy.messages.invalidDates;
  }

  if (plan.status !== "ready") {
    const parts = [
      formatCopy(copy.messages.matched, {
        places: draft.destinations.map((destination) => destination.name).join(", "),
      }),
      formatCopy(copy.messages.needMore, {
        items: plan.missing.map((key) => copy.summary.missing[key]).join(", "),
      }),
    ];

    if (!draft.hasGuestCount) {
      parts.push(copy.summary.defaultGuestsNote);
    }

    return [...parts, ...extras].join(" ");
  }

  const parts = [formatCopy(copy.messages.ready, {
    stops: plan.stops.length,
    start: formatDateLabel(plan.startDate, locale),
    end: formatDateLabel(plan.endDate, locale),
    guests: plan.guests,
    total: formatNumber(plan.totalPrice, locale),
  })];

  if (plan.transportRequested && plan.transportTotal > 0) {
    parts.push(formatCopy(copy.messages.transportIncluded, { total: formatNumber(plan.transportTotal, locale) }));
  }

  parts.push(...extras);

  const reply = parts.join(" ");

  return draft.hasGuestCount ? reply : `${reply} ${copy.summary.defaultGuestsNote}`;
}

function getInitialMessages(copy) {
  return [createMessage("assistant", copy.chat.intro)];
}

export default function TripPlanner() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chatRequestCount = useChatRequestCount(Boolean(user));
  const { language, setLanguage } = useSiteLanguage();
  const locale = SITE_LANGUAGE_DATE_LOCALES[language] || "en-US";
  const navCopy = getDestinationCopy(language);
  const copy = getLocalizedSiteCopy(TRIP_PLANNER_COPY, language);
  const [destinations, setDestinations] = useState([]);
  const [plannerAddOns, setPlannerAddOns] = useState(EMPTY_PLANNER_ADD_ONS);
  const [draft, setDraft] = useState(createEmptyPlannerDraft);
  const [plan, setPlan] = useState(() => buildTripPlan(createEmptyPlannerDraft(), EMPTY_PLANNER_ADD_ONS));
  const [messages, setMessages] = useState(() => getInitialMessages(copy));
  const [draftMessage, setDraftMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedPlanSignature, setSavedPlanSignature] = useState("");
  const messageListRef = useRef(null);
  const latestDraftRef = useRef(createEmptyPlannerDraft());

  useEffect(() => {
    latestDraftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      getDestinations(),
      getShops({ category: "Coffee Shops", exactCategory: true }),
      getTourServices(),
    ])
      .then(([destinationsResult, cafesResult, toursResult]) => {
        if (!active) {
          return;
        }

        const nextAddOns = {
          cafeStops: cafesResult.status === "fulfilled" ? cafesResult.value.data?.shops || [] : [],
          transportServices: toursResult.status === "fulfilled" ? toursResult.value.data?.services || [] : [],
        };

        setPlannerAddOns(nextAddOns);
  setPlan(buildTripPlan(latestDraftRef.current, nextAddOns));

        if (destinationsResult.status !== "fulfilled") {
          setDestinations([]);
          setError(copy.chat.unavailable);
          return;
        }

        setDestinations(destinationsResult.value.data || []);
        setError("");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [copy.chat.unavailable]);

  useEffect(() => {
    const container = messageListRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const planSignature = useMemo(() => {
    if (plan.status !== "ready") {
      return "";
    }

    return JSON.stringify({
      guests: plan.guests,
      startDate: plan.startDate,
      endDate: plan.endDate,
      stops: plan.stops.map((stop) => [stop.destination._id, stop.checkIn, stop.checkOut]),
    });
  }, [plan]);

  const isCurrentPlanSaved = Boolean(planSignature) && planSignature === savedPlanSignature;
  const userInitials = getInitials(user?.name || "You");
  const transportRecommendations = plan.transportRecommendations || [];
  const cafeRecommendations = plan.cafeRecommendations || [];
  const previewStatusLabel = plan.status === "ready" ? copy.summary.readyStatus : copy.summary.collectingStatus;
  const previewDates = plan.status === "ready"
    ? `${formatDateLabel(plan.startDate, locale)} - ${formatDateLabel(plan.endDate, locale)}`
    : draft.startDate
      ? `${formatDateLabel(draft.startDate, locale)}${draft.endDate ? ` - ${formatDateLabel(draft.endDate, locale)}` : ""}`
      : copy.summary.waiting;
  const previewDuration = plan.status === "ready"
    ? `${plan.totalNights} nights`
    : draft.nights
      ? `${draft.nights} nights`
      : copy.summary.waiting;
  const previewTotal = plan.status === "ready"
    ? `LKR ${formatNumber(plan.totalPrice, locale)}`
    : copy.summary.waiting;

  const languageSelector = (
    <div className="tp-lang">
      <span className="tp-lang-label">{navCopy.nav.selectLanguage}</span>
      <select aria-label={navCopy.nav.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
        {SITE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderTransportSection = () => {
    if (!plan.transportRequested) {
      return null;
    }

    return (
      <section className="tp-addon-section">
        <div className="tp-addon-head">
          <div>
            <p className="tp-section-label">{copy.summary.transportTitle}</p>
            <h3>{copy.summary.transportTitle}</h3>
            <p className="tp-addon-copy">{copy.summary.transportBody}</p>
          </div>
          <span className="tp-addon-amount">
            {plan.transportTotal > 0 ? `LKR ${formatNumber(plan.transportTotal, locale)}` : copy.summary.optionalLabel}
          </span>
        </div>

        {transportRecommendations.length ? (
          <div className="tp-addon-list">
            {transportRecommendations.map((service) => (
              <article key={service.id} className="tp-addon-card">
                <div className="tp-addon-card-head">
                  <div>
                    <h4>{service.name}</h4>
                    <p>{service.location}</p>
                  </div>
                  <strong>{service.priceRange}</strong>
                </div>
                <p>{service.description}</p>
                <div className="tp-addon-meta">
                  <span>{service.category}</span>
                  <span>{service.vehicle}</span>
                  <span>{service.availability}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="tp-empty-copy tp-empty-copy--addon">{copy.summary.transportUnavailable}</p>
        )}

        <div className="tp-addon-actions">
          <Link to="/tours" className="tp-secondary-btn">{copy.summary.openTours}</Link>
        </div>
      </section>
    );
  };

  const renderCafeSection = () => {
    if (!plan.cafeRequested) {
      return null;
    }

    return (
      <section className="tp-addon-section">
        <div className="tp-addon-head">
          <div>
            <p className="tp-section-label">{copy.summary.cafesTitle}</p>
            <h3>{copy.summary.cafesTitle}</h3>
            <p className="tp-addon-copy">{copy.summary.cafesBody}</p>
          </div>
          <span className="tp-addon-amount">{copy.summary.optionalLabel}</span>
        </div>

        {cafeRecommendations.length ? (
          <div className="tp-addon-list">
            {cafeRecommendations.map((cafe) => (
              <article key={cafe.id} className="tp-addon-card">
                <div className="tp-addon-card-head">
                  <div>
                    <h4>{cafe.name}</h4>
                    <p>{cafe.location}</p>
                  </div>
                  <strong>{cafe.priceRange}</strong>
                </div>
                <p>{cafe.description}</p>
                <div className="tp-addon-meta">
                  <span>{cafe.tag}</span>
                  <span>{copy.summary.hours}: {cafe.openHours}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="tp-empty-copy tp-empty-copy--addon">{copy.summary.cafesUnavailable}</p>
        )}

        <div className="tp-addon-actions">
          <Link to="/shopping" className="tp-secondary-btn">{copy.summary.openStores}</Link>
        </div>
      </section>
    );
  };

  const handlePlannerMessage = (rawMessage) => {
    const nextMessage = String(rawMessage || "").trim();

    if (!nextMessage) {
      return;
    }

    setMessages((currentMessages) => [...currentMessages, createMessage("user", nextMessage)]);
    setDraftMessage("");
    setSavedPlanSignature("");

    if (loading) {
      setMessages((currentMessages) => [...currentMessages, createMessage("assistant", copy.chat.loading)]);
      return;
    }

    if (!destinations.length) {
      setMessages((currentMessages) => [...currentMessages, createMessage("assistant", copy.chat.unavailable)]);
      return;
    }

    const parsedMessage = parsePlannerMessage(nextMessage, destinations);

    if (parsedMessage.reset) {
      const emptyDraft = createEmptyPlannerDraft();
      setDraft(emptyDraft);
      setPlan(buildTripPlan(emptyDraft, plannerAddOns));
      setMessages([...getInitialMessages(copy), createMessage("assistant", copy.messages.cleared)]);
      setError("");
      return;
    }

    const nextDraft = mergePlannerDraft(draft, parsedMessage);
    const nextPlan = buildTripPlan(nextDraft, plannerAddOns);
    const reply = buildPlannerReply(copy, nextPlan, nextDraft, locale);

    setDraft(nextDraft);
    setPlan(nextPlan);
    setError("");
    setMessages((currentMessages) => [...currentMessages, createMessage("assistant", reply)]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePlannerMessage(draftMessage);
  };

  const handleReset = () => {
    const emptyDraft = createEmptyPlannerDraft();
    setDraft(emptyDraft);
    setPlan(buildTripPlan(emptyDraft, plannerAddOns));
    setDraftMessage("");
    setSavedPlanSignature("");
    setError("");
    setMessages([...getInitialMessages(copy), createMessage("assistant", copy.messages.cleared)]);
  };

  const handleAddToBookings = async () => {
    if (plan.status !== "ready" || saving || isCurrentPlanSaved) {
      return;
    }

    setSaving(true);
    setError("");
    let createdCount = 0;

    try {
      for (const stop of plan.stops) {
        await createBooking({
          bookingType: "destination",
          destinationId: stop.destination._id,
          checkIn: stop.checkIn,
          checkOut: stop.checkOut,
          guests: plan.guests,
        });
        createdCount += 1;
      }

      setSavedPlanSignature(planSignature);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", formatCopy(copy.messages.saved, { count: createdCount })),
      ]);
    } catch (requestError) {
      const failureMessage = createdCount > 0
        ? formatCopy(copy.messages.partialSave, { count: createdCount })
        : requestError.response?.data?.message || copy.messages.saveFailed;
      setError(failureMessage);
      setMessages((currentMessages) => [...currentMessages, createMessage("assistant", failureMessage)]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tp">
      <header className="tp-nav">
        <Link to="/" className="tp-nav-brand">
          Ceylon Explore
        </Link>
        <nav className="tp-nav-right">
          <Link to="/" className="tp-nav-link">
            {navCopy.nav.home || "Home"}
          </Link>
          <Link to="/destinations" className="tp-nav-link">
            {navCopy.nav.destinations || "Destinations"}
          </Link>
          <Link to="/shopping" className="tp-nav-link">
            {navCopy.nav.shopping || "Stores"}
          </Link>
          <Link to="/tours" className="tp-nav-link">
            {navCopy.nav.tours || "Tours"}
          </Link>
          <Link to="/chat" className="tp-nav-link">
            {navCopy.nav.chat || "Chat"}
            <ChatRequestBadge count={chatRequestCount} />
          </Link>
          <Link to="/my-bookings" className="tp-nav-link">
            {navCopy.nav.myBookings || "My Bookings"}
          </Link>
          {languageSelector}
          <span className="tp-nav-name">{navCopy.nav.greeting || "Hi"}, {user.name}</span>
          <button className="tp-nav-btn tp-nav-btn--outline" onClick={logout}>
            {navCopy.nav.logout || "Logout"}
          </button>
        </nav>
      </header>

      <main className="tp-shell">
        <section className="tp-chat-card">
          <div className="tp-card-head">
            <div className="tp-hero-grid">
              <div className="tp-hero-copy">
                <span className="tp-badge">{copy.hero.badge}</span>
                <h1 className="tp-title">{copy.hero.title}</h1>
                <p className="tp-subtitle">{copy.hero.subtitle}</p>
              </div>

              <aside className="tp-preview-card">
                <div className="tp-preview-head">
                  <div>
                    <p className="tp-preview-label">{copy.hero.previewTitle}</p>
                    <h2 className="tp-preview-title">{previewStatusLabel}</h2>
                  </div>
                  <span className={`tp-preview-status${plan.status === "ready" ? " tp-preview-status--ready" : ""}`}>
                    {plan.status === "ready" ? "Live" : "Draft"}
                  </span>
                </div>

                <p className="tp-preview-body">{copy.hero.previewBody}</p>

                <div className="tp-preview-stat-grid">
                  <div className="tp-preview-stat">
                    <span>{copy.summary.matches}</span>
                    <strong>{draft.destinations.length || 0}</strong>
                  </div>
                  <div className="tp-preview-stat">
                    <span>{copy.summary.travelers}</span>
                    <strong>{draft.guests}</strong>
                  </div>
                  <div className="tp-preview-stat tp-preview-stat--wide">
                    <span>{copy.summary.dates}</span>
                    <strong>{previewDates}</strong>
                  </div>
                  <div className="tp-preview-stat">
                    <span>{copy.summary.duration}</span>
                    <strong>{previewDuration}</strong>
                  </div>
                  <div className="tp-preview-stat">
                    <span>{copy.summary.total}</span>
                    <strong>{previewTotal}</strong>
                  </div>
                </div>

                {draft.destinations.length ? (
                  <div className="tp-preview-route">
                    {draft.destinations.map((destination) => (
                      <span key={destination._id} className="tp-preview-route-stop">
                        {destination.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="tp-preview-empty">{copy.summary.previewNone}</p>
                )}
              </aside>
            </div>
          </div>

          <div className="tp-examples">
            <div className="tp-examples-head">
              <div>
                <div className="tp-section-label">{copy.hero.examplesTitle}</div>
              </div>
            </div>
            <div className="tp-example-grid">
              {copy.chat.examples.map((prompt, index) => (
                <button key={prompt} type="button" className="tp-example-card" onClick={() => handlePlannerMessage(prompt)}>
                  <span className="tp-example-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="tp-example-copy">{prompt}</span>
                  <span className="tp-example-action">{copy.chat.usePrompt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="tp-message-panel-head">
            <div>
              <div className="tp-section-label">{copy.chat.panelTitle}</div>
              <h2 className="tp-message-panel-title">{copy.chat.composerTitle}</h2>
            </div>
            <span className="tp-message-panel-pill">{copy.chat.panelStatus}</span>
          </div>

          <div className="tp-message-list" ref={messageListRef}>
            {messages.map((message) => (
              <article key={message.id} className={`tp-message tp-message--${message.role}`}>
                <div className="tp-message-row">
                  <span className={`tp-message-avatar tp-message-avatar--${message.role}`}>
                    {message.role === "assistant" ? "AI" : userInitials}
                  </span>
                  <div className="tp-message-stack">
                    <span className="tp-message-role">{message.role === "assistant" ? "Planner Bot" : "You"}</span>
                    <div className="tp-message-bubble">{message.text}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <form className="tp-input-wrap" onSubmit={handleSubmit}>
            <div className="tp-input-head">
              <h3 className="tp-input-title">{copy.chat.composerTitle}</h3>
              <p className="tp-input-copy">{copy.chat.composerHint}</p>
            </div>
            <textarea
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              placeholder={copy.chat.placeholder}
              rows={4}
            />
            <div className="tp-input-actions">
              <button type="button" className="tp-secondary-btn" onClick={handleReset}>
                {copy.chat.reset}
              </button>
              <button type="submit" className="tp-primary-btn">
                {copy.chat.send}
              </button>
            </div>
          </form>
        </section>

        <aside className="tp-summary-card">
          <div className="tp-summary-head">
            <div>
              <p className="tp-section-label">{copy.summary.title}</p>
              <h2>{plan.status === "ready" ? `${plan.stops.length} stop itinerary` : copy.summary.emptyTitle}</h2>
            </div>
            {plan.status === "ready" ? (
              <div className="tp-total-pill">
                <span>{copy.summary.total}</span>
                <strong>LKR {formatNumber(plan.totalPrice, locale)}</strong>
              </div>
            ) : null}
          </div>

          {plan.status === "ready" ? (
            <>
              <div className="tp-stat-grid">
                <div className="tp-stat-card">
                  <span>{copy.summary.travelers}</span>
                  <strong>{plan.guests}</strong>
                </div>
                <div className="tp-stat-card">
                  <span>{copy.summary.duration}</span>
                  <strong>{plan.totalNights} nights</strong>
                </div>
                <div className="tp-stat-card tp-stat-card--wide">
                  <span>{copy.summary.dates}</span>
                  <strong>{formatDateLabel(plan.startDate, locale)} - {formatDateLabel(plan.endDate, locale)}</strong>
                </div>
              </div>

              <div className="tp-breakdown-card">
                <div className="tp-breakdown-row">
                  <span>{copy.summary.staysTotal}</span>
                  <strong>LKR {formatNumber(plan.staysTotal, locale)}</strong>
                </div>
                {plan.transportRequested ? (
                  <div className="tp-breakdown-row">
                    <span>{copy.summary.transportEstimate}</span>
                    <strong>{plan.transportTotal > 0 ? `LKR ${formatNumber(plan.transportTotal, locale)}` : copy.summary.optionalLabel}</strong>
                  </div>
                ) : null}
                <div className="tp-breakdown-row tp-breakdown-row--total">
                  <span>{copy.summary.total}</span>
                  <strong>LKR {formatNumber(plan.totalPrice, locale)}</strong>
                </div>
              </div>

              <p className="tp-summary-note">{copy.summary.createsNote}</p>
              {!draft.hasGuestCount ? <p className="tp-summary-note tp-summary-note--soft">{copy.summary.defaultGuestsNote}</p> : null}

              <div className="tp-stop-list">
                {plan.stops.map((stop, index) => (
                  <article key={`${stop.destination._id}-${stop.checkIn}`} className="tp-stop-card">
                    {stop.destination.images?.[0] ? (
                      <img src={stop.destination.images[0]} alt={stop.destination.name} className="tp-stop-image" />
                    ) : null}
                    <div className="tp-stop-body">
                      <span className="tp-stop-kicker">{copy.summary.stopLabel} {index + 1}</span>
                      <h3>{stop.destination.name}</h3>
                      <p>{stop.destination.location}</p>
                      <p>{formatDateLabel(stop.checkIn, locale)} - {formatDateLabel(stop.checkOut, locale)} · {stop.nights} nights</p>
                      <strong>LKR {formatNumber(stop.totalPrice, locale)}</strong>
                    </div>
                  </article>
                ))}
              </div>

              {renderTransportSection()}
              {renderCafeSection()}

              {error ? <div className="tp-error">{error}</div> : null}

              <div className="tp-summary-actions">
                <button
                  type="button"
                  className="tp-primary-btn"
                  onClick={handleAddToBookings}
                  disabled={saving || isCurrentPlanSaved}
                >
                  {saving ? copy.summary.adding : isCurrentPlanSaved ? copy.summary.added : copy.summary.add}
                </button>
                <button type="button" className="tp-secondary-btn" onClick={() => navigate("/my-bookings")}>
                  {copy.summary.viewBookings}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="tp-empty-copy">{copy.summary.emptyBody}</p>

              <div className="tp-requirements-card">
                {copy.summary.requirements.map((item) => (
                  <div key={item} className="tp-requirement-item">{item}</div>
                ))}
              </div>

              {draft.destinations.length ? (
                <div className="tp-matched-wrap">
                  <p className="tp-section-label">{copy.summary.matchedTitle}</p>
                  <div className="tp-chip-row tp-chip-row--summary">
                    {draft.destinations.map((destination) => (
                      <span key={destination._id} className="tp-chip tp-chip--static">
                        {destination.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="tp-draft-grid">
                <div className="tp-stat-card">
                  <span>{copy.summary.travelers}</span>
                  <strong>{draft.guests}</strong>
                </div>
                <div className="tp-stat-card">
                  <span>{copy.summary.duration}</span>
                  <strong>{draft.nights ? `${draft.nights} nights` : "Waiting"}</strong>
                </div>
                <div className="tp-stat-card tp-stat-card--wide">
                  <span>{copy.summary.dates}</span>
                  <strong>{draft.startDate ? formatDateLabel(draft.startDate, locale) : "Waiting"}</strong>
                </div>
              </div>

              {renderTransportSection()}
              {renderCafeSection()}

              {error ? <div className="tp-error">{error}</div> : null}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}