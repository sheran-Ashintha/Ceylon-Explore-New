const Shop = require("../models/Shop");
const { SHOPS } = require("./shopCatalog");

async function syncShopCatalog() {
  const operations = SHOPS.map((shop, index) => ({
    updateOne: {
      filter: { id: shop.id },
      update: {
        $set: {
          ...shop,
          displayOrder: index,
        },
      },
      upsert: true,
    },
  }));

  const result = await Shop.bulkWrite(operations, { ordered: false });

  return {
    count: SHOPS.length,
    matched: result.matchedCount,
    modified: result.modifiedCount,
    upserted: result.upsertedCount,
  };
}

module.exports = { syncShopCatalog };