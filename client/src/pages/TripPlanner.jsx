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
import { evaluateFestivalPlan, optimizeFestivalPlan } from "../utils/festivalPlanner";
import { evaluateMonsoonPlan, optimizeMonsoonPlan } from "../utils/monsoonPlanner";
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
      robotShow: "Open Planner Bot",
      robotHide: "Hide Planner Bot",
      robotClose: "Close",
      robotToggleLabel: "Toggle planner robot panel",
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
      monsoonTitle: "Monsoon smart optimizer",
      monsoonBody:
        "Scores each stop for seasonal rain pressure, route friction, and budget fit, then can auto-reorder your itinerary for safer travel windows.",
      monsoonScore: "Comfort score",
      monsoonSafe: "Safe",
      monsoonCaution: "Caution",
      monsoonAvoid: "Avoid",
      monsoonRoute: "Route km",
      monsoonFix: "Auto Fix My Plan",
      festivalTitle: "Festival and Poya guard",
      festivalBody:
        "Flags Poya-day restrictions, major event crowd pressure, and can reorder your route for either comfort or cultural immersion.",
      festivalComfortScore: "Comfort",
      festivalExperienceScore: "Experience",
      festivalPoya: "Poya stops",
      festivalEvents: "Event stops",
      festivalCrowd: "High crowd",
      festivalRestrictions: "Restrictions",
      festivalComfortButton: "Prioritize Comfort",
      festivalExperienceButton: "Prioritize Festivals",
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
      monsoonOptimized:
        "Monsoon auto-fix applied. Comfort score improved from {from} to {to} (+{gain}) and estimated transfer distance dropped by {route} km.",
      monsoonStable:
        "Your itinerary is already monsoon-balanced. Current comfort score: {score}.",
      festivalOptimized:
        "{mode} route applied. Comfort score moved from {comfortFrom} to {comfortTo}, experience score moved from {experienceFrom} to {experienceTo}, and restrictions changed from {restrictionsFrom} to {restrictionsTo}.",
      festivalStable: "Your itinerary is already strong for {mode} mode.",
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

export default function TripPlanner({ popupMode = false, onClose }) {
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
  const [isRobotOpen, setIsRobotOpen] = useState(popupMode);
  const [isPromptPickerOpen, setIsPromptPickerOpen] = useState(false);
  const messageListRef = useRef(null);
  const plannerInputRef = useRef(null);
  const latestDraftRef = useRef(createEmptyPlannerDraft());
  const plannerPanelOpen = popupMode || isRobotOpen;

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

  useEffect(() => {
    if (plannerPanelOpen) {
      plannerInputRef.current?.focus();
    }
  }, [plannerPanelOpen]);

  useEffect(() => {
    if (!popupMode) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [popupMode, onClose]);

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
  const monsoonInsights = useMemo(() => evaluateMonsoonPlan(plan), [plan]);
  const festivalInsights = useMemo(() => evaluateFestivalPlan(plan), [plan]);
  const previewStatusLabel = plan.status === "ready" ? copy.summary.readyStatus : "";
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
  const showPromptSuggestions = isPromptPickerOpen && copy.chat.examples.length > 0;
  const popupSummaryText = loading
    ? copy.chat.loading
    : error
      ? error
      : plan.status === "ready"
        ? `${previewDates} · ${previewDuration} · ${previewTotal}`
        : plan.status === "invalid"
          ? (plan.reason === "too-many-stops" ? copy.messages.tooManyStops : copy.messages.invalidDates)
          : draft.destinations.length
            ? formatCopy(copy.messages.needMore, {
                items: (plan.missing || []).map((key) => copy.summary.missing[key]).join(", "),
              })
            : copy.summary.emptyBody;

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

    setIsRobotOpen(true);
    setIsPromptPickerOpen(false);
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
    setIsPromptPickerOpen(false);
    setSavedPlanSignature("");
    setError("");
    setMessages([...getInitialMessages(copy), createMessage("assistant", copy.messages.cleared)]);
  };

  const handleMonsoonAutoFix = () => {
    if (plan.status !== "ready") {
      return;
    }

    const optimization = optimizeMonsoonPlan(plan);

    if (!optimization.changed || !optimization.reorderedDestinations.length) {
      const stableScore = optimization.after?.averageScore || monsoonInsights?.averageScore || 0;
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          formatCopy(copy.messages.monsoonStable, {
            score: formatNumber(stableScore, locale),
          }),
        ),
      ]);
      return;
    }

    const nextDraft = {
      ...draft,
      destinations: optimization.reorderedDestinations,
    };
    const nextPlan = buildTripPlan(nextDraft, plannerAddOns);
    const scoreFrom = optimization.before?.averageScore || 0;
    const scoreTo = optimization.after?.averageScore || 0;
    const scoreGain = Math.max(0, scoreTo - scoreFrom);
    const routeSaved = Math.max(
      0,
      (optimization.before?.routeDistanceKm || 0) - (optimization.after?.routeDistanceKm || 0),
    );

    setDraft(nextDraft);
    setPlan(nextPlan);
    setSavedPlanSignature("");
    setError("");
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage(
        "assistant",
        formatCopy(copy.messages.monsoonOptimized, {
          from: formatNumber(scoreFrom, locale),
          to: formatNumber(scoreTo, locale),
          gain: formatNumber(scoreGain, locale),
          route: formatNumber(routeSaved, locale),
        }),
      ),
    ]);
  };

  const handleFestivalAutoArrange = (mode) => {
    if (plan.status !== "ready") {
      return;
    }

    const optimization = optimizeFestivalPlan(plan, mode);
    const modeLabel = mode === "experience" ? copy.summary.festivalExperienceButton : copy.summary.festivalComfortButton;

    if (!optimization.changed || !optimization.reorderedDestinations.length) {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          formatCopy(copy.messages.festivalStable, {
            mode: modeLabel,
          }),
        ),
      ]);
      return;
    }

    const nextDraft = {
      ...draft,
      destinations: optimization.reorderedDestinations,
    };
    const nextPlan = buildTripPlan(nextDraft, plannerAddOns);

    setDraft(nextDraft);
    setPlan(nextPlan);
    setSavedPlanSignature("");
    setError("");
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage(
        "assistant",
        formatCopy(copy.messages.festivalOptimized, {
          mode: modeLabel,
          comfortFrom: formatNumber(optimization.before?.comfortScore || 0, locale),
          comfortTo: formatNumber(optimization.after?.comfortScore || 0, locale),
          experienceFrom: formatNumber(optimization.before?.experienceScore || 0, locale),
          experienceTo: formatNumber(optimization.after?.experienceScore || 0, locale),
          restrictionsFrom: formatNumber(optimization.before?.restrictionCount || 0, locale),
          restrictionsTo: formatNumber(optimization.after?.restrictionCount || 0, locale),
        }),
      ),
    ]);
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

  const handleViewBookings = () => {
    if (popupMode) {
      onClose?.();
    }

    navigate("/my-bookings");
  };

  const closePlannerPanel = () => {
    if (popupMode) {
      onClose?.();
      return;
    }

    setIsRobotOpen(false);
  };

  const promptSuggestionsPanel = showPromptSuggestions ? (
    popupMode ? (
      <section className="tp-popup-prompt-board" id="tp-robot-prompts">
        <div className="tp-popup-prompt-grid">
          {copy.chat.examples.map((prompt, index) => (
            <button
              key={prompt}
              type="button"
              className="tp-popup-prompt-card"
              onClick={() => handlePlannerMessage(prompt)}
              aria-label={`${copy.chat.usePrompt}: ${prompt}`}
            >
              <span className="tp-popup-prompt-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="tp-popup-prompt-copy">{prompt}</span>
              <span className="tp-popup-prompt-action">{copy.chat.usePrompt}</span>
            </button>
          ))}
        </div>
      </section>
    ) : (
      <div className="tp-robot-prompts" id="tp-robot-prompts">
        <div className="tp-chip-row tp-chip-row--robot">
          {copy.chat.examples.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="tp-chip"
              onClick={() => handlePlannerMessage(prompt)}
              aria-label={`${copy.chat.usePrompt}: ${prompt}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    )
  ) : null;

  const plannerMessageList = (
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
  );

  const plannerComposer = (
    <form className="tp-input-wrap" onSubmit={handleSubmit}>
      <div className="tp-input-head">
        <h3 className="tp-input-title">{copy.chat.composerTitle}</h3>
        <p className="tp-input-copy">{copy.chat.composerHint}</p>
      </div>
      <textarea
        ref={plannerInputRef}
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
  );

  const popupPlannerOverview = popupMode ? (
    <aside className="tp-popup-overview">
      <section className={`tp-popup-quote-card${plan.status === "ready" ? " tp-popup-quote-card--ready" : ""}`}>
        <div className="tp-popup-quote-head">
          <div>
            <span className="tp-section-label">{copy.hero.previewTitle}</span>
            <h3 className="tp-popup-quote-title">{plan.status === "ready" ? previewTotal : copy.chat.panelStatus}</h3>
            <p className="tp-popup-quote-copy">
              {plan.status === "ready" ? `${previewDates} · ${previewDuration}` : popupSummaryText}
            </p>
          </div>
          {plan.status === "ready" ? (
            <span className="tp-popup-quote-badge tp-popup-quote-badge--ready">{copy.summary.readyStatus}</span>
          ) : null}
        </div>

        {plan.status === "ready" ? (
          <>
            <div className="tp-draft-grid tp-draft-grid--robot">
              <div className="tp-stat-card">
                <span>{copy.summary.travelers}</span>
                <strong>{plan.guests}</strong>
              </div>
              <div className="tp-stat-card">
                <span>{copy.summary.duration}</span>
                <strong>{previewDuration}</strong>
              </div>
              <div className="tp-stat-card tp-stat-card--wide">
                <span>{copy.summary.dates}</span>
                <strong>{previewDates}</strong>
              </div>
            </div>

            <div className="tp-breakdown-card tp-breakdown-card--robot">
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

            <div className="tp-chip-row tp-chip-row--summary">
              {plan.stops.map((stop) => (
                <span key={`${stop.destination._id}-${stop.checkIn}`} className="tp-chip tp-chip--static">
                  {stop.destination.name}
                </span>
              ))}
            </div>

            <div className="tp-summary-actions tp-summary-actions--robot">
              <button
                type="button"
                className="tp-primary-btn"
                onClick={handleAddToBookings}
                disabled={saving || isCurrentPlanSaved}
              >
                {saving ? copy.summary.adding : isCurrentPlanSaved ? copy.summary.added : copy.summary.add}
              </button>
              <button type="button" className="tp-secondary-btn" onClick={handleViewBookings}>
                {copy.summary.viewBookings}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="tp-popup-kpi-grid">
              <div className="tp-popup-kpi-card">
                <span>{copy.summary.matches}</span>
                <strong>{draft.destinations.length || 0}</strong>
              </div>
              <div className="tp-popup-kpi-card">
                <span>{copy.summary.travelers}</span>
                <strong>{draft.guests}</strong>
              </div>
              <div className="tp-popup-kpi-card tp-popup-kpi-card--wide">
                <span>{copy.summary.dates}</span>
                <strong>{previewDates}</strong>
              </div>
              <div className="tp-popup-kpi-card tp-popup-kpi-card--wide">
                <span>{copy.summary.duration}</span>
                <strong>{previewDuration}</strong>
              </div>
            </div>

            {draft.destinations.length ? (
              <div className="tp-chip-row tp-chip-row--summary">
                {draft.destinations.map((destination) => (
                  <span key={destination._id} className="tp-chip tp-chip--static">
                    {destination.name}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>

      {promptSuggestionsPanel}
    </aside>
  ) : null;

  const plannerConversationPanel = (
    <aside
      id="tp-robot-panel"
      className={`tp-robot-panel${plannerPanelOpen ? " tp-robot-panel--open" : ""}${popupMode ? " tp-robot-panel--standalone" : ""}`}
      role={popupMode ? "dialog" : undefined}
      aria-modal={popupMode ? "true" : undefined}
      aria-labelledby={popupMode ? "tp-popup-title" : undefined}
    >
      <div className="tp-message-panel-head">
        <div>
          <div className="tp-section-label">{copy.chat.panelTitle}</div>
          <h2 className="tp-message-panel-title" id={popupMode ? "tp-popup-title" : undefined}>{copy.chat.composerTitle}</h2>
        </div>
        <div className="tp-message-panel-actions">
          <button
            type="button"
            className={`tp-message-panel-pill${showPromptSuggestions ? " tp-message-panel-pill--active" : ""}`}
            onClick={() => setIsPromptPickerOpen((currentValue) => !currentValue)}
            aria-expanded={showPromptSuggestions}
            aria-controls="tp-robot-prompts"
          >
            {copy.chat.panelStatus}
          </button>
          <button type="button" className="tp-robot-close-btn" onClick={closePlannerPanel}>
            {copy.chat.robotClose}
          </button>
        </div>
      </div>

      {popupMode ? (
        <div className="tp-popup-layout">
          {popupPlannerOverview}
          <div className="tp-popup-conversation">
            {plannerMessageList}
            {plannerComposer}
          </div>
        </div>
      ) : (
        <>
          {promptSuggestionsPanel}
          {plannerMessageList}
          {plannerComposer}
        </>
      )}
    </aside>
  );

  if (popupMode) {
    return (
      <div className="tp-popup-backdrop" onClick={closePlannerPanel}>
        <div className="tp-popup-shell" onClick={(event) => event.stopPropagation()}>
          {plannerConversationPanel}
        </div>
      </div>
    );
  }

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
          <Link to="/sos" className="tp-nav-link">
            SOS
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
                    {previewStatusLabel ? <h2 className="tp-preview-title">{previewStatusLabel}</h2> : null}
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

              {monsoonInsights ? (
                <section className="tp-monsoon-card">
                  <div className="tp-monsoon-head">
                    <div>
                      <p className="tp-section-label">{copy.summary.monsoonTitle}</p>
                      <h3>{copy.summary.monsoonTitle}</h3>
                      <p className="tp-monsoon-copy">{copy.summary.monsoonBody}</p>
                    </div>
                    <div className="tp-monsoon-score-pill">
                      <span>{copy.summary.monsoonScore}</span>
                      <strong>{monsoonInsights.averageScore}</strong>
                    </div>
                  </div>

                  <div className="tp-monsoon-grid">
                    <div className="tp-monsoon-stat">
                      <span>{copy.summary.monsoonSafe}</span>
                      <strong>{monsoonInsights.counts.safe}</strong>
                    </div>
                    <div className="tp-monsoon-stat">
                      <span>{copy.summary.monsoonCaution}</span>
                      <strong>{monsoonInsights.counts.caution}</strong>
                    </div>
                    <div className="tp-monsoon-stat">
                      <span>{copy.summary.monsoonAvoid}</span>
                      <strong>{monsoonInsights.counts.avoid}</strong>
                    </div>
                    <div className="tp-monsoon-stat">
                      <span>{copy.summary.monsoonRoute}</span>
                      <strong>{formatNumber(monsoonInsights.routeDistanceKm, locale)}</strong>
                    </div>
                  </div>

                  <button type="button" className="tp-secondary-btn tp-monsoon-btn" onClick={handleMonsoonAutoFix}>
                    {copy.summary.monsoonFix}
                  </button>
                </section>
              ) : null}

              {festivalInsights ? (
                <section className="tp-festival-card">
                  <div className="tp-festival-head">
                    <div>
                      <p className="tp-section-label">{copy.summary.festivalTitle}</p>
                      <h3>{copy.summary.festivalTitle}</h3>
                      <p className="tp-festival-copy">{copy.summary.festivalBody}</p>
                    </div>
                    <div className="tp-festival-score-wrap">
                      <div className="tp-festival-score-pill">
                        <span>{copy.summary.festivalComfortScore}</span>
                        <strong>{festivalInsights.comfortScore}</strong>
                      </div>
                      <div className="tp-festival-score-pill">
                        <span>{copy.summary.festivalExperienceScore}</span>
                        <strong>{festivalInsights.experienceScore}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="tp-festival-grid">
                    <div className="tp-festival-stat">
                      <span>{copy.summary.festivalPoya}</span>
                      <strong>{festivalInsights.poyaStops}</strong>
                    </div>
                    <div className="tp-festival-stat">
                      <span>{copy.summary.festivalEvents}</span>
                      <strong>{festivalInsights.eventfulStops}</strong>
                    </div>
                    <div className="tp-festival-stat">
                      <span>{copy.summary.festivalCrowd}</span>
                      <strong>{festivalInsights.highCrowdStops}</strong>
                    </div>
                    <div className="tp-festival-stat">
                      <span>{copy.summary.festivalRestrictions}</span>
                      <strong>{festivalInsights.restrictionCount}</strong>
                    </div>
                  </div>

                  {festivalInsights.events.length ? (
                    <div className="tp-festival-chip-row">
                      {festivalInsights.events.map((event) => (
                        <span key={event.id} className={`tp-event-badge tp-event-badge--${event.tone}`}>
                          {event.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="tp-festival-actions">
                    <button
                      type="button"
                      className="tp-secondary-btn"
                      onClick={() => handleFestivalAutoArrange("comfort")}
                    >
                      {copy.summary.festivalComfortButton}
                    </button>
                    <button
                      type="button"
                      className="tp-secondary-btn"
                      onClick={() => handleFestivalAutoArrange("experience")}
                    >
                      {copy.summary.festivalExperienceButton}
                    </button>
                  </div>
                </section>
              ) : null}

              <p className="tp-summary-note">{copy.summary.createsNote}</p>
              {!draft.hasGuestCount ? <p className="tp-summary-note tp-summary-note--soft">{copy.summary.defaultGuestsNote}</p> : null}

              <div className="tp-stop-list">
                {plan.stops.map((stop, index) => {
                  const monsoonStop = monsoonInsights?.stops?.[index];
                  const festivalStop = festivalInsights?.stops?.[index];

                  return (
                    <article key={`${stop.destination._id}-${stop.checkIn}`} className="tp-stop-card">
                      {stop.destination.images?.[0] ? (
                        <img src={stop.destination.images[0]} alt={stop.destination.name} className="tp-stop-image" />
                      ) : null}
                      <div className="tp-stop-body">
                        <span className="tp-stop-kicker">{copy.summary.stopLabel} {index + 1}</span>
                        <h3>{stop.destination.name}</h3>
                        <p>{stop.destination.location}</p>
                        <p>{formatDateLabel(stop.checkIn, locale)} - {formatDateLabel(stop.checkOut, locale)} · {stop.nights} nights</p>
                        {monsoonStop ? (
                          <div className="tp-stop-risk-wrap">
                            <span className={`tp-risk-badge tp-risk-badge--${monsoonStop.tone}`}>
                              {monsoonStop.label} · {monsoonStop.totalScore}
                            </span>
                            <p className="tp-stop-risk-copy">{monsoonStop.summary}</p>
                          </div>
                        ) : null}
                        {festivalStop?.badges?.length ? (
                          <div className="tp-stop-event-wrap">
                            <div className="tp-event-badge-row">
                              {festivalStop.badges.map((badge) => (
                                <span
                                  key={`${badge.label}-${badge.tone}`}
                                  className={`tp-event-badge tp-event-badge--${badge.tone}`}
                                >
                                  {badge.label}
                                </span>
                              ))}
                            </div>
                            <p className="tp-stop-event-copy">{festivalStop.advice}</p>
                          </div>
                        ) : null}
                        <strong>LKR {formatNumber(stop.totalPrice, locale)}</strong>
                      </div>
                    </article>
                  );
                })}
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
                <button type="button" className="tp-secondary-btn" onClick={handleViewBookings}>
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

      <button
        type="button"
        className={`tp-robot-toggle${plannerPanelOpen ? " tp-robot-toggle--active" : ""}`}
        onClick={() => setIsRobotOpen((currentState) => !currentState)}
        aria-controls="tp-robot-panel"
        aria-expanded={plannerPanelOpen}
        aria-label={copy.chat.robotToggleLabel}
      >
        <span className="tp-robot-face" aria-hidden="true">
          <span className="tp-robot-eye" />
          <span className="tp-robot-eye" />
        </span>
        <span className="tp-robot-toggle-copy">
          {plannerPanelOpen ? copy.chat.robotHide : copy.chat.robotShow}
        </span>
      </button>

      {plannerConversationPanel}
    </div>
  );
}