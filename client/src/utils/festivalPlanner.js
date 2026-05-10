const POYA_DATES = new Set([
  "2026-01-03",
  "2026-02-01",
  "2026-03-03",
  "2026-04-01",
  "2026-05-01",
  "2026-05-31",
  "2026-06-29",
  "2026-07-29",
  "2026-08-27",
  "2026-09-25",
  "2026-10-25",
  "2026-11-23",
  "2026-12-23",
  "2027-01-21",
  "2027-02-20",
  "2027-03-21",
  "2027-04-19",
  "2027-05-18",
  "2027-06-17",
  "2027-07-16",
  "2027-08-15",
  "2027-09-13",
  "2027-10-13",
  "2027-11-11",
  "2027-12-11",
]);

const FESTIVAL_EVENTS = [
  {
    id: "new-year",
    name: "Sinhala and Tamil New Year",
    startDate: "2026-04-13",
    endDate: "2026-04-15",
    regions: ["all-island"],
    crowdLevel: 2,
    experienceBoost: 3,
    tip: "Book transport early because many intercity routes run on holiday schedules.",
  },
  {
    id: "vesak",
    name: "Vesak",
    startDate: "2026-05-30",
    endDate: "2026-06-01",
    regions: ["all-island"],
    crowdLevel: 2,
    experienceBoost: 3,
    tip: "Expect illuminated streets and evening crowds around major temples.",
  },
  {
    id: "poson",
    name: "Poson Pilgrimage",
    startDate: "2026-06-29",
    endDate: "2026-06-30",
    regions: ["anuradhapura", "mihintale", "polonnaruwa", "dambulla", "kandy"],
    crowdLevel: 3,
    experienceBoost: 3,
    tip: "Large pilgrim inflow can cause heavy traffic around cultural triangle routes.",
  },
  {
    id: "esala-perahera",
    name: "Kandy Esala Perahera",
    startDate: "2026-08-15",
    endDate: "2026-08-25",
    regions: ["kandy", "matale", "nuwara", "ella"],
    crowdLevel: 3,
    experienceBoost: 4,
    tip: "Street closures are common during procession nights in central Kandy.",
  },
  {
    id: "nallur-festival",
    name: "Nallur Festival",
    startDate: "2026-08-03",
    endDate: "2026-08-24",
    regions: ["jaffna", "mannar", "trincomalee"],
    crowdLevel: 2,
    experienceBoost: 3,
    tip: "Plan early arrivals near ceremony times to avoid local congestion.",
  },
  {
    id: "kataragama-festival",
    name: "Kataragama Festival",
    startDate: "2026-07-20",
    endDate: "2026-08-03",
    regions: ["kataragama", "yala", "tissamaharama", "hambantota"],
    crowdLevel: 3,
    experienceBoost: 3,
    tip: "Night ceremonies create high demand for transport and nearby stays.",
  },
  {
    id: "deepavali",
    name: "Deepavali",
    startDate: "2026-11-08",
    endDate: "2026-11-09",
    regions: ["jaffna", "trincomalee", "colombo", "batticaloa", "all-island"],
    crowdLevel: 2,
    experienceBoost: 2,
    tip: "Expect busy evening shopping windows and festival traffic in city centers.",
  },
];

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseIsoDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, 12, 0, 0, 0);
}

function getStayDates(checkIn, checkOut) {
  const startDate = parseIsoDate(checkIn);
  const endDate = parseIsoDate(checkOut);

  if (!startDate) {
    return [];
  }

  if (!endDate || endDate <= startDate) {
    return [formatIsoDate(startDate)];
  }

  const dates = [];
  let cursor = startDate;

  while (cursor < endDate) {
    dates.push(formatIsoDate(cursor));
    cursor = addDays(cursor, 1);
  }

  return dates.length ? dates : [formatIsoDate(startDate)];
}

function overlapsRange(day, startDate, endDate) {
  return day >= startDate && day <= endDate;
}

function locationMatches(destination, regions = []) {
  if (!regions.length || regions.includes("all-island")) {
    return true;
  }

  const haystack = normalizeText(`${destination?.name || ""} ${destination?.location || ""}`);
  return regions.some((region) => haystack.includes(normalizeText(region)));
}

function getMatchedEvents(destination, stayDates) {
  return FESTIVAL_EVENTS.filter((event) => {
    if (!locationMatches(destination, event.regions)) {
      return false;
    }

    const eventStart = event.startDate;
    const eventEnd = event.endDate || event.startDate;
    return stayDates.some((day) => overlapsRange(day, eventStart, eventEnd));
  });
}

function getEventTone(crowdLevel) {
  if (crowdLevel >= 3) {
    return "warning";
  }

  if (crowdLevel >= 2) {
    return "caution";
  }

  return "info";
}

function getStopSignals(stop) {
  const stayDates = getStayDates(stop.checkIn, stop.checkOut);
  const poyaDates = stayDates.filter((day) => POYA_DATES.has(day));
  const matchedEvents = getMatchedEvents(stop.destination, stayDates);
  const highestCrowd = matchedEvents.reduce((maxLevel, event) => Math.max(maxLevel, event.crowdLevel || 1), 1);
  const restrictions = [];

  if (poyaDates.length) {
    restrictions.push("Poya-day rules may restrict alcohol sales and some entertainment services.");
  }

  if (highestCrowd >= 3) {
    restrictions.push("Major event flow can cause road closures and slower transfers.");
  }

  if (matchedEvents[0]?.tip) {
    restrictions.push(matchedEvents[0].tip);
  }

  const eventBoost = matchedEvents.reduce((sum, event) => sum + (event.experienceBoost || 1), 0);
  const comfortScore = clamp(Math.round(84 - highestCrowd * 11 - poyaDates.length * 8 + (matchedEvents.length ? 3 : 0)), 20, 96);
  const experienceScore = clamp(Math.round(42 + eventBoost * 11 + poyaDates.length * 5 - highestCrowd * 3), 22, 97);
  const badges = [];

  if (poyaDates.length) {
    badges.push({ label: "Poya Day", tone: "caution" });
  }

  if (matchedEvents.length) {
    badges.push({
      label: matchedEvents[0].name,
      tone: getEventTone(matchedEvents[0].crowdLevel || 1),
    });
  }

  if (highestCrowd >= 3) {
    badges.push({ label: "Heavy Crowd", tone: "warning" });
  }

  return {
    destinationId: stop.destination?._id,
    comfortScore,
    experienceScore,
    poyaDays: poyaDates.length,
    crowdLevel: highestCrowd,
    restrictions,
    events: matchedEvents,
    badges,
    advice: restrictions[0] || "No major festival restrictions expected for this stop.",
  };
}

function summarizeInsights(stops) {
  if (!stops.length) {
    return {
      comfortScore: 0,
      experienceScore: 0,
      poyaStops: 0,
      eventfulStops: 0,
      highCrowdStops: 0,
      restrictionCount: 0,
      events: [],
      stops: [],
    };
  }

  const comfortScore = Math.round(stops.reduce((sum, stop) => sum + stop.comfortScore, 0) / stops.length);
  const experienceScore = Math.round(stops.reduce((sum, stop) => sum + stop.experienceScore, 0) / stops.length);
  const poyaStops = stops.filter((stop) => stop.poyaDays > 0).length;
  const eventfulStops = stops.filter((stop) => stop.events.length > 0).length;
  const highCrowdStops = stops.filter((stop) => stop.crowdLevel >= 3).length;
  const restrictionCount = stops.reduce((sum, stop) => sum + stop.restrictions.length, 0);
  const eventMap = new Map();

  stops.forEach((stop) => {
    stop.events.forEach((event) => {
      if (!eventMap.has(event.id)) {
        eventMap.set(event.id, {
          id: event.id,
          name: event.name,
          tone: getEventTone(event.crowdLevel || 1),
        });
      }
    });
  });

  return {
    comfortScore,
    experienceScore,
    poyaStops,
    eventfulStops,
    highCrowdStops,
    restrictionCount,
    events: Array.from(eventMap.values()).slice(0, 6),
    stops,
  };
}

function scoreDestinationForMode(destination, date, mode) {
  const sampleStop = {
    destination,
    checkIn: date,
    checkOut: date,
  };
  const signals = getStopSignals(sampleStop);
  const rating = Number(destination?.rating || 0);

  if (mode === "experience") {
    return Math.round(signals.experienceScore + rating * 2.5);
  }

  return Math.round(signals.comfortScore + rating * 1.5);
}

function pickBestDestination(remainingDestinations, date, mode) {
  return remainingDestinations.reduce((best, destination) => {
    const score = scoreDestinationForMode(destination, date, mode);

    if (!best) {
      return { destination, score };
    }

    if (score > best.score) {
      return { destination, score };
    }

    if (score === best.score) {
      const currentPrice = Number(destination?.price || Number.MAX_SAFE_INTEGER);
      const bestPrice = Number(best.destination?.price || Number.MAX_SAFE_INTEGER);

      if (mode === "comfort" && currentPrice < bestPrice) {
        return { destination, score };
      }

      if (mode === "experience" && currentPrice > bestPrice) {
        return { destination, score };
      }
    }

    return best;
  }, null);
}

export function evaluateFestivalPlan(plan) {
  if (!plan || plan.status !== "ready" || !Array.isArray(plan.stops)) {
    return null;
  }

  const evaluatedStops = plan.stops.map((stop) => getStopSignals(stop));
  return summarizeInsights(evaluatedStops);
}

export function optimizeFestivalPlan(plan, mode = "comfort") {
  const baseline = evaluateFestivalPlan(plan);

  if (!plan || plan.status !== "ready" || !Array.isArray(plan.stops) || plan.stops.length < 2) {
    return {
      changed: false,
      reorderedDestinations: plan?.stops?.map((stop) => stop.destination) || [],
      before: baseline,
      after: baseline,
      mode,
    };
  }

  const slotDates = plan.stops.map((stop) => stop.checkIn);
  const remainingDestinations = plan.stops.map((stop) => stop.destination);
  const orderedDestinations = [];

  slotDates.forEach((date) => {
    const bestChoice = pickBestDestination(remainingDestinations, date, mode);

    if (!bestChoice?.destination) {
      return;
    }

    orderedDestinations.push(bestChoice.destination);
    const targetIndex = remainingDestinations.findIndex((destination) => destination?._id === bestChoice.destination?._id);

    if (targetIndex >= 0) {
      remainingDestinations.splice(targetIndex, 1);
    }
  });

  const changed = orderedDestinations.some(
    (destination, index) => destination?._id !== plan.stops[index]?.destination?._id,
  );

  const projectedPlan = {
    ...plan,
    stops: plan.stops.map((stop, index) => ({
      ...stop,
      destination: orderedDestinations[index] || stop.destination,
    })),
  };
  const after = evaluateFestivalPlan(projectedPlan);

  return {
    changed,
    reorderedDestinations: orderedDestinations,
    before: baseline,
    after,
    mode,
  };
}
