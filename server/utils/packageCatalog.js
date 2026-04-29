const Package = require("../models/Package");
const { PACKAGE_CATEGORIES } = require("../models/Package");
const { getPackageDurationDays } = require("./packageSeedSource");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugifyPackageTitle(title = "") {
  return String(title)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildPackageFilter({ category = "", search = "" } = {}) {
  const filter = {};
  const normalizedCategory = String(category).trim();
  const normalizedSearch = String(search).trim();

  if (normalizedCategory && normalizedCategory !== "All") {
    filter.category = normalizedCategory;
  }

  if (normalizedSearch) {
    const searchRegex = new RegExp(escapeRegex(normalizedSearch), "i");
    filter.$or = [{ title: searchRegex }, { text: searchRegex }, { category: searchRegex }];
  }

  return filter;
}

async function getCatalogPackages(filters = {}) {
  return Package.find(buildPackageFilter(filters)).sort({ displayOrder: 1 }).lean();
}

async function getCatalogCategories() {
  const existingCategories = await Package.distinct("category");
  return ["All", ...PACKAGE_CATEGORIES.filter((category) => existingCategories.includes(category))];
}

async function findCatalogPackageBySlug(slug) {
  return Package.findOne({ slug }).lean();
}

async function findCatalogPackageDocumentBySlug(slug) {
  return Package.findOne({ slug });
}

async function getNextPackageDisplayOrder() {
  const lastPackage = await Package.findOne().sort({ displayOrder: -1 }).select("displayOrder").lean();
  return (lastPackage?.displayOrder ?? -1) + 1;
}

module.exports = {
  findCatalogPackageDocumentBySlug,
  findCatalogPackageBySlug,
  getCatalogCategories,
  getCatalogPackages,
  getNextPackageDisplayOrder,
  getPackageDurationDays,
  slugifyPackageTitle,
};