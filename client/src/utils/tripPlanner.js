const DAY_IN_MS = 1000 * 60 * 60 * 24;

const MONTH_INDEX = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const GENERIC_ALIAS_WORDS = new Set([
  "ancient",
  "bag",
  "bay",
  "beach",
  "bungalow",
  "camp",
  "city",
  "colonial",
  "country",
  "cove",
  "district",
  "eco",
  "estate",
  "falls",
  "fort",
  "fortress",
  "guesthouse",
  "heritage",
  "highlands",
  "hostel",
  "hotel",
  "island",
  "lagoon",
  "lodge",
  "monastery",
  "mountain",
  "national",
  "park",
  "province",
  "resort",
  "retreat",
  "rock",
  "sacred",
  "safari",
  "southern",
  "tea",
  "temple",
  "villa",
]);

const DATE_TOKEN_PATTERN = /\b(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}[/-](?:\d{2}|\d{4})|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{2,4})?|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{2,4})?)\b/gi;
const TRANSPORT_POSITIVE_PATTERN = /\b(transport|ride|rides|driver|chauffeur|car|van|coach|tuk[\s-]?tuk|transfer|pickup|drop[\s-]?off|airport)\b/i;
const TRANSPORT_NEGATIVE_PATTERN = /\b(?:no|without|skip)\s+(?:any\s+)?(?:transport|rides?|driver|chauffeur|car|van|coach|tuk[\s-]?tuk|transfer)s?\b/i;
const CAFE_POSITIVE_PATTERN = /\b(cafe|cafes|coffee|tea house|tea stop|coffee shop|breakfast stop|brunch)\b/i;
const CAFE_NEGATIVE_PATTERN = /\b(?:no|without|skip)\s+(?:any\s+)?(?:cafe|cafes|coffee|tea|breakfast)\b/i;
const AIRPORT_POSITIVE_PATTERN = /\b(airport|pickup|drop[\s-]?off|arrival|departure)\b/i;
const AIRPORT_NEGATIVE_PATTERN = /\b(?:no|without|skip)\s+(?:airport|pickup|drop[\s-]?off|transfer)\b/i;

export function createEmptyPlannerDraft() {
  return {
    destinations: [],
    guests: 1,
    hasGuestCount: false,
    startDate: "",
    endDate: "",
    nights: 0,
    transportRequested: false,
    cafeRequested: false,
    airportTransferRequested: false,
  };
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseStoredDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12, 0, 0, 0);
}

function diffNights(startDate, endDate) {
  return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / DAY_IN_MS));
}

function resolveYear(rawYear, month, day) {
  if (rawYear) {
    const numericYear = Number(rawYear);
    return String(rawYear).length === 2 ? 2000 + numericYear : numericYear;
  }

  const today = startOfToday();
  const currentYear = today.getFullYear();
  const candidate = new Date(currentYear, month, day, 12, 0, 0, 0);

  return candidate < today ? currentYear + 1 : currentYear;
}

function parseFlexibleDate(rawValue) {
  const cleaned = String(rawValue || "")
    .trim()
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/(\d)(st|nd|rd|th)\b/g, "$1")
    .replace(/\s+/g, " ");

  let match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
  }

  match = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/);
  if (match) {
    const [, day, month, rawYear] = match;
    return new Date(resolveYear(rawYear, Number(month) - 1, Number(day)), Number(month) - 1, Number(day), 12, 0, 0, 0);
  }

  match = cleaned.match(/^([a-z]+)\s+(\d{1,2})(?:\s+(\d{2,4}))?$/);
  if (match) {
    const [, rawMonth, day, rawYear] = match;
    const month = MONTH_INDEX[rawMonth];

    if (month !== undefined) {
      return new Date(resolveYear(rawYear, month, Number(day)), month, Number(day), 12, 0, 0, 0);
    }
  }

  match = cleaned.match(/^(\d{1,2})\s+([a-z]+)(?:\s+(\d{2,4}))?$/);
  if (match) {
    const [, day, rawMonth, rawYear] = match;
    const month = MONTH_INDEX[rawMonth];

    if (month !== undefined) {
      return new Date(resolveYear(rawYear, month, Number(day)), month, Number(day), 12, 0, 0, 0);
    }
  }

  return null;
}

function extractGuests(text) {
  const match = text.match(/(\d+)\s*(people|persons|person|guests|guest|travellers|traveler|travelers|adults|adult|pax)\b/i);

  if (!match) {
    return { guests: null, hasGuestCount: false };
  }

  return {
    guests: Math.max(1, Number(match[1]) || 1),
    hasGuestCount: true,
  };
}

function extractDuration(text) {
  const nightsMatch = text.match(/(\d+)\s*(night|nights)\b/i);

  if (nightsMatch) {
    return { nights: Math.max(1, Number(nightsMatch[1]) || 1) };
  }

  const daysMatch = text.match(/(\d+)\s*(day|days)\b/i);

  if (daysMatch) {
    const days = Math.max(1, Number(daysMatch[1]) || 1);
    return { nights: Math.max(1, days - 1) };
  }

  return { nights: null };
}

function extractDateRange(rawText) {
  const matches = Array.from(String(rawText || "").matchAll(DATE_TOKEN_PATTERN))
    .map((match) => parseFlexibleDate(match[0]))
    .filter(Boolean);

  if (matches.length >= 2) {
    return {
      startDate: formatDateInput(matches[0]),
      endDate: formatDateInput(matches[1]),
    };
  }

  if (matches.length === 1) {
    return {
      startDate: formatDateInput(matches[0]),
      endDate: "",
    };
  }

  return {
    startDate: "",
    endDate: "",
  };
}

function extractBooleanPreference(text, positivePattern, negativePattern) {
  if (negativePattern.test(text)) {
    return false;
  }

  if (positivePattern.test(text)) {
    return true;
  }

  return null;
}

function extractAddOnPreferences(text) {
  return {
    transportRequested: extractBooleanPreference(text, TRANSPORT_POSITIVE_PATTERN, TRANSPORT_NEGATIVE_PATTERN),
    cafeRequested: extractBooleanPreference(text, CAFE_POSITIVE_PATTERN, CAFE_NEGATIVE_PATTERN),
    airportTransferRequested: extractBooleanPreference(text, AIRPORT_POSITIVE_PATTERN, AIRPORT_NEGATIVE_PATTERN),
  };
}

function getMeaningfulTokens(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 3 && !GENERIC_ALIAS_WORDS.has(token));
}

function getLocationSegments(value = "") {
  return String(value)
    .split(",")
    .map((part) => normalizeText(part))
    .filter(Boolean);
}

function getDestinationAreas(destination) {
  const areas = new Set();
  const primaryLocation = normalizeText(getPrimaryLocation(destination));

  if (primaryLocation) {
    areas.add(primaryLocation);
  }

  getLocationSegments(destination.location).forEach((segment) => areas.add(segment));

  return Array.from(areas);
}

function scoreLocationMatch(location, destination) {
  const normalizedLocation = normalizeText(location);
  const locationTokens = getMeaningfulTokens(location);

  return getDestinationAreas(destination).reduce((score, area) => {
    if (!area) {
      return score;
    }

    if (normalizedLocation.includes(area) || area.includes(normalizedLocation)) {
      return Math.max(score, area === normalizeText(getPrimaryLocation(destination)) ? 54 : 32);
    }

    const matchedTokens = getMeaningfulTokens(area).filter((token) => locationTokens.includes(token));
    return matchedTokens.length ? Math.max(score, 12 + matchedTokens.length * 9) : score;
  }, 0);
}

function parseAveragePrice(priceRange) {
  const values = String(priceRange || "")
    .match(/\d[\d,]*/g)
    ?.map((value) => Number(value.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0) || [];

  if (!values.length) {
    return 0;
  }

  if (values.length === 1) {
    return values[0];
  }

  return Math.round((values[0] + values[1]) / 2);
}

function getPreferredTransportCategory(guests) {
  if (guests >= 7) {
    return "Coaches";
  }

  if (guests >= 3) {
    return "Van with Driver";
  }

  return "Private Car";
}

function recommendTransportServices(destinations, guests, transportServices, airportTransferRequested) {
  const preferredCategory = getPreferredTransportCategory(guests);
  const rankedServices = transportServices
    .map((service) => {
      const locationScore = destinations.reduce(
        (bestScore, destination) => Math.max(bestScore, scoreLocationMatch(service.location, destination)),
        0,
      );
      let score = locationScore + Math.round((Number(service.rating) || 0) * 3);

      if (service.category === preferredCategory) {
        score += 26;
      }

      if (guests <= 2 && destinations.length === 1 && service.category === "Tuk Tuk Rides") {
        score += 18;
      }

      if (airportTransferRequested && service.category === "Airport Transfers") {
        score += 40;
      }

      if (/islandwide/i.test(service.availability || "") || /hotel-to-hotel|intercity|across sri lanka/i.test(service.description || "")) {
        score += 14;
      }

      return {
        ...service,
        estimatedPrice: parseAveragePrice(service.priceRange),
        score,
      };
    })
    .sort((left, right) => right.score - left.score || right.rating - left.rating || right.reviewCount - left.reviewCount);

  const selected = [];

  const addService = (service) => {
    if (service && !selected.some((item) => item.id === service.id)) {
      selected.push(service);
    }
  };

  if (airportTransferRequested) {
    addService(rankedServices.find((service) => service.category === "Airport Transfers"));
  }

  addService(rankedServices.find((service) => service.category === preferredCategory));

  if (guests <= 2 && destinations.length === 1) {
    addService(rankedServices.find((service) => service.category === "Tuk Tuk Rides"));
  }

  rankedServices.forEach((service) => {
    if (selected.length < 3) {
      addService(service);
    }
  });

  return selected.slice(0, 3).map((service) => {
    const normalizedService = { ...service };
    delete normalizedService.score;
    return normalizedService;
  });
}

function recommendCafeStops(destinations, cafeStops) {
  return cafeStops
    .map((cafe) => {
      const locationScore = destinations.reduce(
        (bestScore, destination) => Math.max(bestScore, scoreLocationMatch(cafe.location, destination)),
        0,
      );

      return {
        ...cafe,
        score: locationScore + Math.round((Number(cafe.rating) || 0) * 3),
      };
    })
    .sort((left, right) => right.score - left.score || right.rating - left.rating || right.reviewCount - left.reviewCount)
    .slice(0, 3)
    .map((cafe) => {
      const normalizedCafe = { ...cafe };
      delete normalizedCafe.score;
      return normalizedCafe;
    });
}

function estimateTransportTotal(recommendations, destinations, airportTransferRequested) {
  if (!recommendations.length) {
    return 0;
  }

  const routeService = recommendations.find((service) => service.category !== "Airport Transfers") || recommendations[0];
  const routeLegCount = Math.max(1, destinations.length - 1 || 1);
  let total = routeService.estimatedPrice * routeLegCount;

  if (airportTransferRequested) {
    const airportService = recommendations.find((service) => service.category === "Airport Transfers");

    if (airportService) {
      total += airportService.estimatedPrice;
    }
  }

  return Math.round(total);
}

function getPrimaryLocation(destination) {
  return destination.location?.split(",")[0]?.trim() || "";
}

function getDestinationAliases(destination) {
  const normalizedName = normalizeText(destination.name);
  const normalizedLocation = normalizeText(getPrimaryLocation(destination));
  const aliasMap = new Map();

  if (normalizedName) {
    aliasMap.set(normalizedName, 4);
  }

  if (normalizedLocation) {
    aliasMap.set(normalizedLocation, Math.max(aliasMap.get(normalizedLocation) || 0, 3));
  }

  normalizedName.split(" ").forEach((token, index) => {
    if (index === 0 && token.length >= 4 && !GENERIC_ALIAS_WORDS.has(token)) {
      aliasMap.set(token, Math.max(aliasMap.get(token) || 0, 2));
    }
  });

  normalizedLocation.split(" ").forEach((token) => {
    if (token.length >= 4 && !GENERIC_ALIAS_WORDS.has(token)) {
      aliasMap.set(token, Math.max(aliasMap.get(token) || 0, 1));
    }
  });

  return Array.from(aliasMap.entries()).map(([value, score]) => ({ value, score }));
}

function findAliasIndex(text, alias) {
  const pattern = new RegExp(`(^|\\s)${escapeRegex(alias)}(?=\\s|$)`);
  const match = pattern.exec(text);
  return match ? match.index : -1;
}

function findMatchedDestinations(rawText, destinations) {
  const normalizedText = normalizeText(rawText);
  const matchedByAlias = new Map();

  destinations.forEach((destination) => {
    const aliases = getDestinationAliases(destination);

    aliases.forEach(({ value, score }) => {
      const index = findAliasIndex(normalizedText, value);

      if (index === -1) {
        return;
      }

      const current = matchedByAlias.get(value);
      const nextEntry = {
        destination,
        index,
        score,
      };

      if (!current) {
        matchedByAlias.set(value, nextEntry);
        return;
      }

      const currentRating = Number(current.destination.rating) || 0;
      const nextRating = Number(destination.rating) || 0;
      const currentPrice = Number(current.destination.price) || Number.MAX_SAFE_INTEGER;
      const nextPrice = Number(destination.price) || Number.MAX_SAFE_INTEGER;

      if (
        score > current.score ||
        (score === current.score && nextRating > currentRating) ||
        (score === current.score && nextRating === currentRating && nextPrice < currentPrice)
      ) {
        matchedByAlias.set(value, nextEntry);
      }
    });
  });

  return Array.from(matchedByAlias.values())
    .sort((left, right) => left.index - right.index || right.score - left.score)
    .map((entry) => entry.destination)
    .filter((destination, index, collection) => collection.findIndex((item) => item._id === destination._id) === index);
}

export function parsePlannerMessage(rawText, destinations) {
  const text = String(rawText || "").trim();
  const normalizedText = normalizeText(text);
  const addOnPreferences = extractAddOnPreferences(text);

  if (!text) {
    return {
      reset: false,
      destinations: [],
      guests: null,
      hasGuestCount: false,
      startDate: "",
      endDate: "",
      nights: null,
      transportRequested: null,
      cafeRequested: null,
      airportTransferRequested: null,
    };
  }

  if (/\b(reset|start over|clear plan|new plan)\b/i.test(text)) {
    return {
      reset: true,
      destinations: [],
      guests: null,
      hasGuestCount: false,
      startDate: "",
      endDate: "",
      nights: null,
      transportRequested: false,
      cafeRequested: false,
      airportTransferRequested: false,
    };
  }

  const matchedDestinations = findMatchedDestinations(text, destinations);
  const { guests, hasGuestCount } = extractGuests(normalizedText);
  const { startDate, endDate } = extractDateRange(text);
  const { nights } = extractDuration(normalizedText);

  return {
    reset: false,
    destinations: matchedDestinations,
    guests,
    hasGuestCount,
    startDate,
    endDate,
    nights,
    transportRequested: addOnPreferences.transportRequested,
    cafeRequested: addOnPreferences.cafeRequested,
    airportTransferRequested: addOnPreferences.airportTransferRequested,
  };
}

export function mergePlannerDraft(currentDraft, partialDraft) {
  if (partialDraft.reset) {
    return createEmptyPlannerDraft();
  }

  const nextDraft = {
    ...currentDraft,
  };

  if (partialDraft.destinations?.length) {
    nextDraft.destinations = partialDraft.destinations;
  }

  if (partialDraft.hasGuestCount && Number.isFinite(partialDraft.guests)) {
    nextDraft.guests = partialDraft.guests;
    nextDraft.hasGuestCount = true;
  }

  if (partialDraft.startDate) {
    nextDraft.startDate = partialDraft.startDate;
  }

  if (partialDraft.endDate) {
    nextDraft.endDate = partialDraft.endDate;
    nextDraft.nights = 0;
  }

  if (Number.isFinite(partialDraft.nights) && partialDraft.nights > 0) {
    nextDraft.nights = partialDraft.nights;

    if (!partialDraft.endDate) {
      nextDraft.endDate = "";
    }
  }

  ["transportRequested", "cafeRequested", "airportTransferRequested"].forEach((key) => {
    if (typeof partialDraft[key] === "boolean") {
      nextDraft[key] = partialDraft[key];
    }
  });

  return nextDraft;
}

function distributeNights(totalNights, stopCount) {
  const baseNights = Math.floor(totalNights / stopCount);
  const extraNights = totalNights % stopCount;

  return Array.from({ length: stopCount }, (_, index) => baseNights + (index < extraNights ? 1 : 0));
}

export function buildTripPlan(draft, options = {}) {
  const destinations = draft.destinations || [];
  const guests = Math.max(1, Number(draft.guests) || 1);
  const transportServices = options.transportServices || [];
  const cafeStops = options.cafeStops || [];
  const transportRequested = Boolean(draft.transportRequested);
  const cafeRequested = Boolean(draft.cafeRequested);
  const airportTransferRequested = Boolean(draft.airportTransferRequested);
  const transportRecommendations = transportRequested && destinations.length
    ? recommendTransportServices(destinations, guests, transportServices, airportTransferRequested)
    : [];
  const cafeRecommendations = cafeRequested && destinations.length ? recommendCafeStops(destinations, cafeStops) : [];
  const transportTotal = transportRequested
    ? estimateTransportTotal(transportRecommendations, destinations, airportTransferRequested)
    : 0;
  const missing = [];

  if (!destinations.length) {
    missing.push("destinations");
  }

  if (!draft.startDate) {
    missing.push("startDate");
  }

  if (!draft.endDate && !draft.nights) {
    missing.push("duration");
  }

  if (missing.length) {
    return {
      status: "missing",
      missing,
      guests,
      stops: [],
      totalPrice: 0,
      staysTotal: 0,
      transportTotal,
      totalNights: 0,
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
      transportRequested,
      cafeRequested,
      airportTransferRequested,
      transportRecommendations,
      cafeRecommendations,
    };
  }

  const startDate = parseStoredDate(draft.startDate);
  const explicitEndDate = draft.endDate ? parseStoredDate(draft.endDate) : null;

  if (!startDate) {
    return {
      status: "invalid",
      reason: "invalid-dates",
      guests,
      stops: [],
      totalPrice: 0,
      staysTotal: 0,
      transportTotal,
      totalNights: 0,
      startDate: draft.startDate || "",
      endDate: draft.endDate || "",
      transportRequested,
      cafeRequested,
      airportTransferRequested,
      transportRecommendations,
      cafeRecommendations,
    };
  }

  let endDate = explicitEndDate;
  let totalNights = explicitEndDate ? diffNights(startDate, explicitEndDate) : Math.max(1, Number(draft.nights) || 1);

  if (explicitEndDate && explicitEndDate <= startDate) {
    return {
      status: "invalid",
      reason: "invalid-dates",
      guests,
      stops: [],
      totalPrice: 0,
      staysTotal: 0,
      transportTotal,
      totalNights: 0,
      startDate: draft.startDate,
      endDate: draft.endDate || "",
      transportRequested,
      cafeRequested,
      airportTransferRequested,
      transportRecommendations,
      cafeRecommendations,
    };
  }

  if (!endDate) {
    endDate = addDays(startDate, totalNights);
  }

  if (totalNights < destinations.length) {
    return {
      status: "invalid",
      reason: "too-many-stops",
      guests,
      stops: [],
      totalPrice: 0,
      staysTotal: 0,
      transportTotal,
      totalNights,
      startDate: draft.startDate,
      endDate: formatDateInput(endDate),
      transportRequested,
      cafeRequested,
      airportTransferRequested,
      transportRecommendations,
      cafeRecommendations,
    };
  }

  const allocatedNights = distributeNights(totalNights, destinations.length);
  let currentCheckIn = startDate;

  const stops = destinations.map((destination, index) => {
    const stopNights = allocatedNights[index];
    const currentCheckOut = addDays(currentCheckIn, stopNights);
    const totalPrice = Math.round(stopNights * (Number(destination.price) || 0) * guests);
    const stop = {
      destination,
      checkIn: formatDateInput(currentCheckIn),
      checkOut: formatDateInput(currentCheckOut),
      nights: stopNights,
      totalPrice,
    };
    currentCheckIn = currentCheckOut;
    return stop;
  });

  const staysTotal = stops.reduce((sum, stop) => sum + stop.totalPrice, 0);

  return {
    status: "ready",
    reason: "",
    guests,
    hasGuestCount: Boolean(draft.hasGuestCount),
    startDate: draft.startDate,
    endDate: formatDateInput(endDate),
    totalNights,
    staysTotal,
    transportTotal,
    totalPrice: staysTotal + transportTotal,
    stops,
    missing: [],
    transportRequested,
    cafeRequested,
    airportTransferRequested,
    transportRecommendations,
    cafeRecommendations,
  };
}