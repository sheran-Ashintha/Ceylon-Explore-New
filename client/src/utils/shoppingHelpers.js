import { getShoppingCopy } from "./siteTranslations";

export const CATEGORY_ICONS = {
  All: "🛍️",
  "Coffee Shops": "☕",
  Jewellery: "💎",
  "Spa & Wellness": "🧖",
  Clothing: "👗",
  "Spices & Tea": "🍵",
  Souvenirs: "🎁",
  Supermarkets: "🛒",
  "Furniture & Home": "🛋️",
  "Beauty & Cosmetics": "💄",
  Bookshops: "📚",
};

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

export function getShopArea(location) {
  const parts = String(location || "")
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

export function getRatingStars(rating) {
  const roundedRating = Math.max(1, Math.min(5, Math.round(rating)));
  return `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;
}

export function getRatingText(rating, reviewCount, language = "en") {
  const labels = getShoppingCopy(language).rating;
  const label = rating >= 4.7 ? labels.excellent : rating >= 4.2 ? labels.veryGood : labels.good;

  return reviewCount > 0
    ? `${label} · ${reviewCount} ${reviewCount === 1 ? labels.reviewSingular : labels.reviewPlural}`
    : label;
}
