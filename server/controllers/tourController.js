const {
  findTourServiceById,
  findTourServiceDocumentById,
  getNextTourDisplayOrder,
  getRelatedTourServices,
  getTourCatalog,
  slugifyCatalogId,
  TOUR_CATEGORIES,
} = require("../utils/tourCatalog");
const TourService = require("../models/TourService");

function buildTourPayload(body) {
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
  if (body.availability !== undefined) payload.availability = body.availability == null ? null : String(body.availability).trim();
  if (body.vehicle !== undefined) payload.vehicle = body.vehicle == null ? null : String(body.vehicle).trim();
  if (body.idealFor !== undefined) payload.idealFor = body.idealFor == null ? null : String(body.idealFor).trim();
  if (body.phone !== undefined) payload.phone = body.phone == null ? null : String(body.phone).trim();
  if (body.whatsapp !== undefined) payload.whatsapp = body.whatsapp == null ? null : String(body.whatsapp).trim();
  if (body.displayOrder !== undefined) payload.displayOrder = Number(body.displayOrder);

  return payload;
}

function validateTourPayload(payload) {
  if (payload.category !== undefined && !TOUR_CATEGORIES.includes(payload.category)) {
    return "Tour category is invalid.";
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

function handleTourError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({ message: "Tour service id already exists." });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message });
}

async function getTourServices(req, res) {
  try {
    res.json(await getTourCatalog(req.query));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getTourService(req, res) {
  try {
    const service = await findTourServiceById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Tour service not found." });
    }

    return res.json({
      service,
      relatedServices: await getRelatedTourServices(service.id, service.category),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function createTourService(req, res) {
  try {
    const payload = buildTourPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ message: "Tour service name is required." });
    }

    if (!payload.category || !payload.location || !payload.description || !payload.priceRange || !payload.tag || !payload.image) {
      return res.status(400).json({ message: "Category, location, description, price range, tag, and image are required." });
    }

    payload.id = payload.id || slugifyCatalogId(payload.name);

    if (!payload.id) {
      return res.status(400).json({ message: "Tour service id is required." });
    }

    const validationMessage = validateTourPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    if (payload.displayOrder === undefined) {
      payload.displayOrder = await getNextTourDisplayOrder();
    }

    const existingService = await findTourServiceById(payload.id);

    if (existingService) {
      return res.status(409).json({ message: "Tour service id already exists." });
    }

    const service = await TourService.create(payload);
    return res.status(201).json(service);
  } catch (err) {
    return handleTourError(res, err);
  }
}

async function updateTourService(req, res) {
  try {
    const service = await findTourServiceDocumentById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Tour service not found." });
    }

    const payload = buildTourPayload(req.body);
    const nextId = payload.id || service.id;
    const validationMessage = validateTourPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    if (nextId !== service.id) {
      const duplicateService = await findTourServiceById(nextId);

      if (duplicateService) {
        return res.status(409).json({ message: "Tour service id already exists." });
      }
    }

    Object.assign(service, payload, { id: nextId });
    await service.save();

    return res.json(service);
  } catch (err) {
    return handleTourError(res, err);
  }
}

async function deleteTourService(req, res) {
  try {
    const service = await findTourServiceDocumentById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Tour service not found." });
    }

    await service.deleteOne();
    return res.json({ message: "Tour service deleted." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createTourService,
  deleteTourService,
  getTourService,
  getTourServices,
  updateTourService,
};