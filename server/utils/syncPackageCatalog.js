const Package = require("../models/Package");
const { loadPackageSeedData } = require("./packageSeedSource");

async function syncPackageCatalog({ replace = false } = {}) {
  const packages = await loadPackageSeedData();

  if (replace) {
    await Package.deleteMany({});
    await Package.insertMany(packages);

    return {
      count: packages.length,
      replaced: true,
    };
  }

  const operations = packages.map((pkg) => ({
    updateOne: {
      filter: { slug: pkg.slug },
      update: { $set: pkg },
      upsert: true,
    },
  }));

  const result = await Package.bulkWrite(operations, { ordered: false });

  return {
    count: packages.length,
    matched: result.matchedCount,
    modified: result.modifiedCount,
    upserted: result.upsertedCount,
  };
}

module.exports = { syncPackageCatalog };