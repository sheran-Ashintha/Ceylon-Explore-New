const {
  findCatalogPackageDocumentBySlug,
  findCatalogPackageBySlug,
  getCatalogCategories,
  getCatalogPackages,
  getNextPackageDisplayOrder,
  getPackageDurationDays,
  slugifyPackageTitle,
} = require("../utils/packageCatalog");

function buildPackagePayload(body) {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.category !== undefined) payload.category = String(body.category).trim();
  if (body.text !== undefined) payload.text = String(body.text).trim();
  if (body.image !== undefined) payload.image = String(body.image).trim();
  if (body.days !== undefined) payload.days = getPackageDurationDays({ days: body.days });
  if (body.price !== undefined) payload.price = Number(body.price);
  if (body.displayOrder !== undefined) payload.displayOrder = Number(body.displayOrder);
  if (body.slug !== undefined) payload.slug = slugifyPackageTitle(body.slug);

  return payload;
}

function handlePackageError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({ message: "Package slug already exists." });
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message });
}

const getPackages = async (req, res) => {
  try {
    res.json({
      categories: await getCatalogCategories(),
      packages: await getCatalogPackages(req.query),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPackage = async (req, res) => {
  try {
    const pkg = await findCatalogPackageBySlug(req.params.slug);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found." });
    }

    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const payload = buildPackagePayload(req.body);

    if (!payload.title) {
      return res.status(400).json({ message: "Package title is required." });
    }

    payload.slug = payload.slug || slugifyPackageTitle(payload.title);

    if (!payload.slug) {
      return res.status(400).json({ message: "Package slug is required." });
    }

    if (payload.displayOrder === undefined || Number.isNaN(payload.displayOrder)) {
      payload.displayOrder = await getNextPackageDisplayOrder();
    }

    const existingPackage = await findCatalogPackageBySlug(payload.slug);

    if (existingPackage) {
      return res.status(409).json({ message: "Package slug already exists." });
    }

    const createdPackage = await findCatalogPackageDocumentBySlug(payload.slug);
    const pkg = createdPackage || null;

    if (pkg) {
      return res.status(409).json({ message: "Package slug already exists." });
    }

    const Package = require("../models/Package");
    const newPackage = await Package.create(payload);
    res.status(201).json(newPackage);
  } catch (err) {
    handlePackageError(res, err);
  }
};

const updatePackage = async (req, res) => {
  try {
    const pkg = await findCatalogPackageDocumentBySlug(req.params.slug);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found." });
    }

    const payload = buildPackagePayload(req.body);
    const nextSlug = payload.slug || pkg.slug;

    if (nextSlug !== pkg.slug) {
      const duplicatePackage = await findCatalogPackageBySlug(nextSlug);

      if (duplicatePackage) {
        return res.status(409).json({ message: "Package slug already exists." });
      }
    }

    Object.assign(pkg, payload, { slug: nextSlug });
    await pkg.save();

    res.json(pkg);
  } catch (err) {
    handlePackageError(res, err);
  }
};

const deletePackage = async (req, res) => {
  try {
    const pkg = await findCatalogPackageDocumentBySlug(req.params.slug);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found." });
    }

    await pkg.deleteOne();
    res.json({ message: "Package deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPackage, deletePackage, getPackage, getPackages, updatePackage };