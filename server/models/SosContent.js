const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    accent: { type: String, default: "#3b82f6", trim: true },
    category: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    primaryNumber: { type: String, required: true, trim: true },
    primaryHref: { type: String, required: true, trim: true },
    secondaryNumber: { type: String, default: null, trim: true },
    secondaryHref: { type: String, default: null, trim: true },
    email: { type: String, default: null, trim: true },
    emailHref: { type: String, default: null, trim: true },
    websiteHref: { type: String, default: null, trim: true },
    websiteLabel: { type: String, default: null, trim: true },
    bullets: { type: [String], default: [] },
    availability: { type: String, default: null, trim: true },
    source: { type: String, default: null, trim: true },
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    primary: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const sourceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    detail: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const sosContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true, default: "default" },
    contacts: { type: [contactSchema], default: [] },
    scenarios: { type: [scenarioSchema], default: [] },
    reasons: { type: [String], default: [] },
    prepSteps: { type: [String], default: [] },
    sources: { type: [sourceSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SosContent", sosContentSchema);