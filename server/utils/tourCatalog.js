const TourService = require("../models/TourService");

const TOUR_CATEGORIES = [
  "All",
  "Safari Jeeps",
  "Tuk Tuk Rides",
  "Private Car",
  "Van with Driver",
  "Airport Transfers",
  "Coaches",
];

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
    priceRange: "LKR 3,500 - 8,500 / day",
    tag: "Fast City Hire",
    image: "https://bestofceylon.com/images/sri-lanka-tailor-made-holidays-tours/essentials-tours-in-sri-lanka/sri-lanka-in-three-weeks-summer/sri-lanka-tours-and-holidays-tailor-made-04.jpg",
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
    priceRange: "LKR 4,000 - 9,000 / half day",
    tag: "Local Guide",
    image: "https://bestofceylon.com/images/sri-lanka-tailor-made-holidays-tours/essentials-tours-in-sri-lanka/sri-lanka-in-three-weeks-summer/sri-lanka-tours-and-holidays-tailor-made-04.jpg",
    availability: "6 AM - 10 PM",
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
    priceRange: "LKR 18,000 - 38,000 / day",
    tag: "Family Favourite",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/a2/44/42/getlstd-property-photo.jpg?w=1200&h=1200&s=1",
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
    priceRange: "LKR 16,000 - 30,000 / trip",
    tag: "Surf Friendly",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/a2/44/42/getlstd-property-photo.jpg?w=1200&h=1200&s=1",
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
    priceRange: "LKR 9,000 - 18,000 / trip",
    tag: "Airport Pickup",
    image: "https://go-sri-lanka.com/wp-content/uploads/2023/03/transfer-sri-lanka.webp",
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
    priceRange: "LKR 14,000 - 28,000 / day",
    tag: "Premium Ride",
    image: "https://tse4.mm.bing.net/th/id/OIP.9OUuiPx8Mrl1P6fZ_SVb6gHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
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
    priceRange: "LKR 12,000 - 24,000 / day",
    tag: "Hill Country Driver",
    image: "https://tse4.mm.bing.net/th/id/OIP.9OUuiPx8Mrl1P6fZ_SVb6gHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    availability: "6 AM - 9 PM",
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
    priceRange: "LKR 17,000 - 32,000 / safari",
    tag: "Wildlife Jeep",
    image: "https://go-sri-lanka.com/wp-content/uploads/2023/02/yala-jeep-safari-sri-lanka.webp",
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
    priceRange: "LKR 32,000 - 85,000 / day",
    tag: "Group Transport",
    image: "https://mysltravel.com/wp-content/uploads/2022/09/Screenshot-2022-09-08-153234.png",
    availability: "Daily, pre-booking advised",
    vehicle: "Mini coach / full coach",
    idealFor: "Groups & events",
    phone: "+94 11 289 4555",
    whatsapp: "94112894555",
  },
];

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

const AREA_ALL = "All Areas";

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function slugifyCatalogId(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTourAreas(services) {
  return [
    AREA_ALL,
    ...Array.from(new Set(services.map((service) => getTourArea(service.location)))).sort((left, right) => left.localeCompare(right)),
  ];
}

function buildTourQuery(query = {}) {
  const category = String(query.category || "All").trim();
  const area = String(query.area || AREA_ALL).trim();
  const search = String(query.search || "").trim();
  const exactCategory = normalizeText(query.exactCategory) === "true";
  const filter = {};

  if (category !== "All") {
    filter.category = exactCategory
      ? category
      : { $regex: escapeRegex(category), $options: "i" };
  }

  if (area !== AREA_ALL) {
    filter.location = { $regex: escapeRegex(area), $options: "i" };
  }

  if (search) {
    const searchPattern = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { id: searchPattern },
      { name: searchPattern },
      { category: searchPattern },
      { location: searchPattern },
      { description: searchPattern },
      { tag: searchPattern },
      { vehicle: searchPattern },
      { idealFor: searchPattern },
    ];
  }

  return filter;
}

function getTourArea(location = "") {
  const parts = String(location)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (!PROVINCES.has(parts[index])) {
      return parts[index];
    }
  }

  return "Sri Lanka";
}

async function getTourAreas() {
  const services = await TourService.find({}, "location")
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  return buildTourAreas(services);
}

async function getFilteredTourServices(query = {}) {
  const limit = Number(query.limit);

  let serviceQuery = TourService.find(buildTourQuery(query))
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  if (Number.isFinite(limit) && limit > 0) {
    serviceQuery = serviceQuery.limit(limit);
  }

  return serviceQuery;
}

async function getTourCatalog(query = {}) {
  return {
    categories: TOUR_CATEGORIES,
    areas: await getTourAreas(),
    services: await getFilteredTourServices(query),
  };
}

async function findTourServiceById(id) {
  const normalizedId = String(id).trim();

  return TourService.findOne({ id: normalizedId }).lean();
}

async function findTourServiceDocumentById(id) {
  return TourService.findOne({ id: String(id).trim() });
}

async function getRelatedTourServices(serviceId, category) {
  return TourService.find({ id: { $ne: serviceId }, category })
    .sort({ displayOrder: 1, _id: 1 })
    .limit(3)
    .lean();
}

async function getNextTourDisplayOrder() {
  const lastService = await TourService.findOne({}, "displayOrder").sort({ displayOrder: -1, _id: -1 }).lean();
  return lastService ? Number(lastService.displayOrder) + 1 : 0;
}

module.exports = {
  AREA_ALL,
  TOUR_CATEGORIES,
  TOUR_SERVICES,
  findTourServiceById,
  findTourServiceDocumentById,
  getFilteredTourServices,
  getNextTourDisplayOrder,
  getRelatedTourServices,
  getTourArea,
  getTourAreas,
  getTourCatalog,
  slugifyCatalogId,
};