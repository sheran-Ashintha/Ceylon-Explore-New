const path = require("path");
const { pathToFileURL } = require("url");

const packageSeedUrl = pathToFileURL(
  path.join(__dirname, "../../client/src/data/packages.js")
).href;

let packageSeedPromise;

function loadPackageSeedModule() {
  if (!packageSeedPromise) {
    packageSeedPromise = import(packageSeedUrl);
  }

  return packageSeedPromise;
}

function getPackageDurationDays(pkg) {
  const parsedDays = Number.parseInt(String(pkg?.days || ""), 10);
  return Number.isNaN(parsedDays) ? 1 : Math.max(1, parsedDays);
}

async function loadPackageSeedData() {
  const { PACKAGES } = await loadPackageSeedModule();

  return PACKAGES.map((pkg, displayOrder) => ({
    title: pkg.title,
    slug: pkg.slug,
    category: pkg.category,
    days: getPackageDurationDays(pkg),
    price: Number(pkg.price),
    text: pkg.text,
    image: pkg.image,
    displayOrder,
  }));
}

module.exports = {
  getPackageDurationDays,
  loadPackageSeedData,
};