const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { apiLimiter, authLimiter, chatLimiter } = require("./middleware/rateLimitMiddleware");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiLimiter);

  app.use("/api/packages", require("./routes/packageRoutes"));
  app.use("/api/destinations", require("./routes/destinationRoutes"));
  app.use("/api/shops", require("./routes/shopRoutes"));
  app.use("/api/tours", require("./routes/tourRoutes"));
  app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/bookings", require("./routes/bookingRoutes"));
  app.use("/api/chat", chatLimiter, require("./routes/chatRoutes"));
  app.use("/api/sos", require("./routes/sosRoutes"));
  app.use("/api/destinations/:id/reviews", require("./routes/reviewRoutes"));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;