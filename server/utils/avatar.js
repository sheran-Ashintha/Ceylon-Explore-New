const crypto = require("crypto");

function getAvatarUrl(email, options = {}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    return "";
  }

  const size = Number.isFinite(Number(options.size)) ? Math.max(24, Math.min(512, Number(options.size))) : 160;
  const fallback = String(options.fallback || "identicon").trim() || "identicon";
  const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");

  return `https://www.gravatar.com/avatar/${hash}?d=${encodeURIComponent(fallback)}&s=${size}`;
}

module.exports = {
  getAvatarUrl,
};
