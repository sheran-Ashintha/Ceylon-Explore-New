const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const {
  findCatalogPackageBySlug,
  getPackageDurationDays,
} = require("../utils/packageCatalog");

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function isValidDate(value) {
  return !Number.isNaN(new Date(value).getTime());
}

function hasValidDateRange(checkIn, checkOut) {
  return new Date(checkOut).getTime() > new Date(checkIn).getTime();
}

function getBookingNights(checkIn, checkOut) {
  return Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / DAY_IN_MS));
}

const createBooking = async (req, res) => {
  try {
    const { bookingType, destinationId, checkIn, checkOut, guests, packageDetails, packageSlug } = req.body;
    const normalizedGuests = Math.max(1, Number(guests) || 1);

    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      return res.status(400).json({ message: "Please select valid travel dates." });
    }

    if (!hasValidDateRange(checkIn, checkOut)) {
      return res.status(400).json({ message: "Check-out must be after check-in." });
    }

    const nights = getBookingNights(checkIn, checkOut);

    if (bookingType === "package") {
      const selectedPackageSlug = packageSlug || packageDetails?.slug;

      if (!selectedPackageSlug) {
        return res.status(400).json({ message: "Please choose a package." });
      }

      const catalogPackage = await findCatalogPackageBySlug(selectedPackageSlug);

      if (!catalogPackage) {
        return res.status(404).json({ message: "Package not found." });
      }

      const packagePrice = Number(catalogPackage.price);
      const packageDays = getPackageDurationDays(catalogPackage);

      if (!Number.isFinite(packagePrice) || packagePrice <= 0) {
        return res.status(400).json({ message: "Package details are incomplete." });
      }

      const dailyRate = packagePrice / packageDays;
      const totalPrice = Math.round(dailyRate * nights * normalizedGuests);
      const booking = await Booking.create({
        user: req.userId,
        bookingType: "package",
        package: {
          title: catalogPackage.title,
          slug: catalogPackage.slug,
          category: catalogPackage.category,
          image: catalogPackage.image,
          days: packageDays,
          price: packagePrice,
        },
        checkIn,
        checkOut,
        guests: normalizedGuests,
        totalPrice,
      });

      return res.status(201).json(booking);
    }

    const dest = await Destination.findById(destinationId);
    if (!dest) return res.status(404).json({ message: "Destination not found." });
    const totalPrice = nights * (Number(dest.price) || 0) * normalizedGuests;
    const booking = await Booking.create({
      user: req.userId,
      bookingType: "destination",
      destination: destinationId,
      checkIn,
      checkOut,
      guests: normalizedGuests,
      totalPrice,
    });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("destination", "name location images price")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.user.toString() !== req.userId) return res.status(403).json({ message: "Not authorized." });
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
