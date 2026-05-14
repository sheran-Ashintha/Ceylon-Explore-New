const rateLimit = require("express-rate-limit");

function shouldSkipRateLimit() {
  return process.env.NODE_ENV === "test";
}

function createLimiter(config) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skip: shouldSkipRateLimit,
    ...config,
  });
}

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 400,
  message: { message: "Too many requests. Please try again later." },
});

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many authentication attempts. Please try again later." },
});

const chatLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: { message: "Too many chat requests. Please slow down." },
});

module.exports = {
  apiLimiter,
  authLimiter,
  chatLimiter,
};