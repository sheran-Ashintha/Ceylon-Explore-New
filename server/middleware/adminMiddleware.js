const adminOnly = (req, res, next) => {
  const role = req.user?.role || "user";

  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  next();
};

module.exports = adminOnly;