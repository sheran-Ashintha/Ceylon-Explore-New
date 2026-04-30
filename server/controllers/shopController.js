const {
  findShopById,
  findShopDocumentById,
  getNextShopDisplayOrder,
  getRelatedShops,
  getShopCatalog,
  SHOP_CATEGORIES,
  slugifyCatalogId,
} = require("../utils/shopCatalog");
const Shop = require("../models/Shop");

function buildShopPayload(body) {
  const payload = {};

  if (body.id !== undefined) payload.id = slugifyCatalogId(body.id);
  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.category !== undefined) payload.category = String(body.category).trim();
  if (body.location !== undefined) payload.location = String(body.location).trim();
  if (body.description !== undefined) payload.description = String(body.description).trim();
  if (body.rating !== undefined) payload.rating = Number(body.rating);
  if (body.reviewCount !== undefined) payload.reviewCount = Number(body.reviewCount);
  if (body.priceRange !== undefined) payload.priceRange = String(body.priceRange).trim();
  if (body.tag !== undefined) payload.tag = String(body.tag).trim();
  if (body.image !== undefined) payload.image = String(body.image).trim();
  if (body.openHours !== undefined) payload.openHours = body.openHours == null ? null : String(body.openHours).trim();
  if (body.phone !== undefined) payload.phone = body.phone == null ? null : String(body.phone).trim();
  if (body.website !== undefined) payload.website = body.website == null ? null : String(body.website).trim();
  if (body.displayOrder !== undefined) payload.displayOrder = Number(body.displayOrder);

  return payload;
}

function validateShopPayload(payload) {
  if (payload.category !== undefined && !SHOP_CATEGORIES.includes(payload.category)) {
    return "Shop category is invalid.";
  }

  if (payload.displayOrder !== undefined && Number.isNaN(payload.displayOrder)) {
    return "Display order must be a number.";
  }

  if (payload.rating !== undefined && (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 5)) {
    return "Rating must be between 0 and 5.";
  }

  if (payload.reviewCount !== undefined && (!Number.isFinite(payload.reviewCount) || payload.reviewCount < 0)) {
    return "Review count must be zero or greater.";
  }

  return "";
}

function handleShopError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({ message: "Shop id already exists." });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message });
}

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

async function createShop(req, res) {
  try {
    const payload = buildShopPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ message: "Shop name is required." });
    }

    if (!payload.category || !payload.location || !payload.description || !payload.priceRange || !payload.tag || !payload.image) {
      return res.status(400).json({ message: "Category, location, description, price range, tag, and image are required." });
    }

    payload.id = payload.id || slugifyCatalogId(payload.name);

    if (!payload.id) {
      return res.status(400).json({ message: "Shop id is required." });
    }

    const validationMessage = validateShopPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    if (payload.displayOrder === undefined) {
      payload.displayOrder = await getNextShopDisplayOrder();
    }

    const existingShop = await findShopById(payload.id);

    if (existingShop) {
      return res.status(409).json({ message: "Shop id already exists." });
    }

    const shop = await Shop.create(payload);
    return res.status(201).json(shop);
  } catch (err) {
    return handleShopError(res, err);
  }
}

async function updateShop(req, res) {
  try {
    const shop = await findShopDocumentById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    const payload = buildShopPayload(req.body);
    const nextId = payload.id || shop.id;
    const validationMessage = validateShopPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    if (nextId !== shop.id) {
      const duplicateShop = await findShopById(nextId);

      if (duplicateShop) {
        return res.status(409).json({ message: "Shop id already exists." });
      }
    }

    Object.assign(shop, payload, { id: nextId });
    await shop.save();

    return res.json(shop);
  } catch (err) {
    return handleShopError(res, err);
  }
}

async function deleteShop(req, res) {
  try {
    const shop = await findShopDocumentById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    await shop.deleteOne();
    return res.json({ message: "Shop deleted." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createShop,
  deleteShop,
  getShop,
  getShops,
  updateShop,
};