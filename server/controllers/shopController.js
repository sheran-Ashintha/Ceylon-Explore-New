const {
  findShopById,
  getRelatedShops,
  getShopCatalog,
} = require("../utils/shopCatalog");

async function getShops(req, res) {
  try {
    res.json(await getShopCatalog(req.query));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getShop(req, res) {
  try {
    const shop = await findShopById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    return res.json({
      shop,
      relatedShops: await getRelatedShops(shop.id, shop.category),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getShop,
  getShops,
};