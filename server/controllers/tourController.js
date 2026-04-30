const {
  findTourServiceById,
  getRelatedTourServices,
  getTourCatalog,
} = require("../utils/tourCatalog");

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

module.exports = {
  getTourService,
  getTourServices,
};