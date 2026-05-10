const REGION_RAIN_RISK_BY_MONTH = {
  southwest: [24, 26, 34, 58, 74, 78, 72, 69, 60, 54, 42, 30],
  eastnorth: [58, 54, 46, 34, 28, 24, 26, 30, 44, 62, 78, 82],
  highlands: [38, 40, 46, 54, 64, 68, 65, 62, 56, 60, 58, 46],
  dryzone: [56, 52, 44, 36, 30, 26, 28, 34, 46, 60, 74, 78],
  default: [42, 40, 39, 45, 54, 58, 55, 52, 50, 56, 60, 50],
};

const REGION_KEYWORDS = {
  southwest: [
    "colombo",
    "galle",
    "matara",
    "mirissa",
    "hikkaduwa",
    "bentota",
    "kalutara",
    "unawatuna",
    "weligama",
    "tangalle",
    "negombo",
    "wadduwa",
    "beruwala",
    "ahungalla",
  ],
  eastnorth: ["trincomalee", "arugam", "pasikudah", "nilaveli", "batticaloa", "jaffna", "mannar"],
  highlands: ["ella", "kandy", "nuwara", "haputale", "badulla", "knuckles", "horton", "belihuloya"],
  dryzone: [
    "sigiriya",
    "dambulla",
    "polonnaruwa",
    "anuradhapura",
    "wilpattu",
    "minneriya",
    "yala",
    "kumana",
    "kaudulla",
    "pidurangala",
  ],
};

const LOCATION_COORDINATES = {
  anuradhapura: [8.3114, 80.4037],
  arugam: [6.8406, 81.8368],
  badulla: [6.9934, 81.055],
  belihuloya: [6.7167, 80.7833],
  bentota: [6.4218, 79.9969],
  colombo: [6.9271, 79.8612],
  dambulla: [7.8731, 80.651],
  ella: [6.8667, 81.0466],
  galle: [6.0535, 80.221],
  haputale: [6.765, 80.9511],
  hikkaduwa: [6.1395, 80.101],
  jaffna: [9.6615, 80.0255],
  kalutara: [6.5854, 79.9607],
  kandy: [7.2906, 80.6337],
  mannar: [8.9763, 79.9042],
  mirissa: [5.9483, 80.4716],
  negombo: [7.2084, 79.8358],
  nuwara: [6.9497, 80.7891],
  pasikudah: [7.929, 81.5621],
  polonnaruwa: [7.9403, 81.0188],
  sigiriya: [7.9568, 80.7603],
  tangalle: [6.0243, 80.7941],
  trincomalee: [8.5874, 81.2152],
  unawatuna: [6.0108, 80.2492],
  weligama: [5.9746, 80.4298],
  wilpattu: [8.5111, 80.1403],
  yala: [6.372, 81.5185],
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMonthIndex(dateInput) {
  const date = new Date(`${dateInput}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return new Date().getMonth();
  }

  return date.getMonth();
}

function inferClimateRegion(destination) {
  const haystack = normalizeText(`${destination?.name || ""} ${destination?.location || ""}`);

  const region = Object.entries(REGION_KEYWORDS).find(([, keywords]) => {
    return keywords.some((keyword) => haystack.includes(keyword));
  });

  return region ? region[0] : "default";
}

function getRainRisk(destination, dateInput) {
  const region = inferClimateRegion(destination);
  const monthIndex = parseMonthIndex(dateInput);
  const profile = REGION_RAIN_RISK_BY_MONTH[region] || REGION_RAIN_RISK_BY_MONTH.default;
  return profile[monthIndex] ?? REGION_RAIN_RISK_BY_MONTH.default[monthIndex] ?? 50;
}

function getClimateScore(destination, dateInput) {
  const rainRisk = getRainRisk(destination, dateInput);
  return clamp(Math.round(100 - rainRisk), 18, 96);
}

function resolveCoordinates(destination) {
  const haystack = normalizeText(`${destination?.name || ""} ${destination?.location || ""}`);
  const key = Object.keys(LOCATION_COORDINATES).find((entry) => haystack.includes(entry));
  return key ? LOCATION_COORDINATES[key] : null;
}

function haversineDistanceKm(pointA, pointB) {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;

  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function estimateLegDistanceKm(destinationA, destinationB) {
  if (!destinationA || !destinationB) {
    return 0;
  }

  const coordinatesA = resolveCoordinates(destinationA);
  const coordinatesB = resolveCoordinates(destinationB);

  if (!coordinatesA || !coordinatesB) {
    return 160;
  }

  return haversineDistanceKm(coordinatesA, coordinatesB);
}

function getTravelScore(distanceKm) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return 70;
  }

  return clamp(Math.round(100 - distanceKm * 0.34), 18, 96);
}

function getBudgetScore(price, minPrice, maxPrice) {
  const amount = Number(price || 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 58;
  }

  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice) || maxPrice <= minPrice) {
    return 76;
  }

  const normalized = (amount - minPrice) / (maxPrice - minPrice);
  return clamp(Math.round(100 - normalized * 45), 48, 98);
}

function getRiskTone(climateScore) {
  if (climateScore >= 70) {
    return "safe";
  }

  if (climateScore >= 52) {
    return "caution";
  }

  return "avoid";
}

function getRiskLabel(riskTone) {
  if (riskTone === "safe") {
    return "Safe";
  }

  if (riskTone === "avoid") {
    return "Avoid";
  }

  return "Caution";
}

function buildRiskSummary(riskTone, travelDistanceKm) {
  const weatherSummary =
    riskTone === "safe"
      ? "Lower monsoon disruption expected."
      : riskTone === "avoid"
        ? "Higher rain disruption likelihood."
        : "Some rain disruption is possible.";

  const transferSummary = Number.isFinite(travelDistanceKm)
    ? `Transfer pressure is around ${Math.round(travelDistanceKm)} km.`
    : "Transfer distance is currently approximate.";

  return `${weatherSummary} ${transferSummary}`;
}

function evaluateStops(stops) {
  if (!Array.isArray(stops) || !stops.length) {
    return {
      averageScore: 0,
      routeDistanceKm: 0,
      counts: { safe: 0, caution: 0, avoid: 0 },
      stops: [],
    };
  }

  const prices = stops
    .map((stop) => Number(stop?.destination?.price || 0))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const evaluatedStops = stops.map((stop, index) => {
    const previousStop = stops[index - 1];
    const nextStop = stops[index + 1];
    const previousLegDistance = previousStop ? estimateLegDistanceKm(previousStop.destination, stop.destination) : null;
    const nextLegDistance = nextStop ? estimateLegDistanceKm(stop.destination, nextStop.destination) : null;

    let travelDistanceKm = 0;

    if (Number.isFinite(previousLegDistance) && Number.isFinite(nextLegDistance)) {
      travelDistanceKm = (previousLegDistance + nextLegDistance) / 2;
    } else if (Number.isFinite(previousLegDistance)) {
      travelDistanceKm = previousLegDistance;
    } else if (Number.isFinite(nextLegDistance)) {
      travelDistanceKm = nextLegDistance;
    }

    const climateScore = getClimateScore(stop.destination, stop.checkIn);
    const travelScore = getTravelScore(travelDistanceKm);
    const budgetScore = getBudgetScore(stop.destination?.price, minPrice, maxPrice);
    const totalScore = Math.round(climateScore * 0.45 + travelScore * 0.3 + budgetScore * 0.25);
    const tone = getRiskTone(climateScore);

    return {
      destinationId: stop.destination?._id,
      climateScore,
      travelScore,
      budgetScore,
      totalScore,
      tone,
      label: getRiskLabel(tone),
      summary: buildRiskSummary(tone, travelDistanceKm),
    };
  });

  const routeDistanceKm = Math.round(
    stops.slice(1).reduce((sum, stop, index) => {
      return sum + estimateLegDistanceKm(stops[index].destination, stop.destination);
    }, 0),
  );

  const counts = evaluatedStops.reduce(
    (summary, stop) => {
      summary[stop.tone] += 1;
      return summary;
    },
    { safe: 0, caution: 0, avoid: 0 },
  );

  const averageScore = Math.round(
    evaluatedStops.reduce((sum, stop) => sum + stop.totalScore, 0) / evaluatedStops.length,
  );

  return {
    averageScore,
    routeDistanceKm,
    counts,
    stops: evaluatedStops,
  };
}

function pickBestStop(remainingStops, previousStop, checkInDate, minPrice, maxPrice) {
  return remainingStops.reduce((bestChoice, candidate) => {
    const weatherScore = getClimateScore(candidate.destination, checkInDate);
    const distanceScore = previousStop
      ? getTravelScore(estimateLegDistanceKm(previousStop.destination, candidate.destination))
      : 72;
    const budgetScore = getBudgetScore(candidate.destination?.price, minPrice, maxPrice);
    const weightedScore = Math.round(weatherScore * 0.55 + distanceScore * 0.3 + budgetScore * 0.15);

    if (!bestChoice) {
      return {
        stop: candidate,
        weightedScore,
      };
    }

    if (weightedScore > bestChoice.weightedScore) {
      return {
        stop: candidate,
        weightedScore,
      };
    }

    if (weightedScore === bestChoice.weightedScore) {
      const candidatePrice = Number(candidate.destination?.price || Number.MAX_SAFE_INTEGER);
      const bestPrice = Number(bestChoice.stop.destination?.price || Number.MAX_SAFE_INTEGER);

      if (candidatePrice < bestPrice) {
        return {
          stop: candidate,
          weightedScore,
        };
      }
    }

    return bestChoice;
  }, null);
}

export function evaluateMonsoonPlan(plan) {
  if (!plan || plan.status !== "ready") {
    return null;
  }

  return evaluateStops(plan.stops);
}

export function optimizeMonsoonPlan(plan) {
  if (!plan || plan.status !== "ready" || !Array.isArray(plan.stops) || plan.stops.length < 2) {
    const baseline = evaluateMonsoonPlan(plan);
    return {
      changed: false,
      reorderedDestinations: plan?.stops?.map((stop) => stop.destination) || [],
      before: baseline,
      after: baseline,
    };
  }

  const sourceStops = plan.stops;
  const checkInDates = sourceStops.map((stop) => stop.checkIn);
  const remainingStops = [...sourceStops];
  const prices = sourceStops
    .map((stop) => Number(stop?.destination?.price || 0))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const reorderedStops = [];

  for (let index = 0; index < checkInDates.length; index += 1) {
    const previousStop = reorderedStops[index - 1] || null;
    const bestChoice = pickBestStop(remainingStops, previousStop, checkInDates[index], minPrice, maxPrice);

    if (!bestChoice?.stop) {
      break;
    }

    reorderedStops.push(bestChoice.stop);
    const selectedIndex = remainingStops.findIndex(
      (stop) => stop.destination?._id === bestChoice.stop.destination?._id,
    );

    if (selectedIndex >= 0) {
      remainingStops.splice(selectedIndex, 1);
    }
  }

  const reorderedDestinations = reorderedStops.map((stop) => stop.destination);
  const changed = reorderedDestinations.some((destination, index) => destination?._id !== sourceStops[index]?.destination?._id);

  const before = evaluateStops(sourceStops);
  const afterStops = sourceStops.map((stop, index) => ({
    ...stop,
    destination: reorderedDestinations[index] || stop.destination,
  }));
  const after = evaluateStops(afterStops);

  return {
    changed,
    reorderedDestinations,
    before,
    after,
  };
}
