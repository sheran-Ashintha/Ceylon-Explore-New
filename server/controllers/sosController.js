const { getOrCreateSosContent } = require("../utils/syncSosContent");

function sanitizeString(value) {
  return value == null ? null : String(value).trim();
}

function sanitizeStringArray(values) {
  if (!Array.isArray(values)) {
    return undefined;
  }

  return values
    .map((value) => sanitizeString(value))
    .filter(Boolean);
}

function sanitizeContact(contact) {
  const primaryNumber = sanitizeString(contact?.primaryNumber);
  const secondaryNumber = sanitizeString(contact?.secondaryNumber);
  const email = sanitizeString(contact?.email);

  return {
    id: sanitizeString(contact?.id),
    accent: sanitizeString(contact?.accent) || "#3b82f6",
    category: sanitizeString(contact?.category),
    department: sanitizeString(contact?.department),
    summary: sanitizeString(contact?.summary),
    primaryNumber,
    primaryHref: sanitizeString(contact?.primaryHref) || (primaryNumber ? `tel:${primaryNumber.replace(/\s+/g, "")}` : null),
    secondaryNumber,
    secondaryHref: sanitizeString(contact?.secondaryHref) || (secondaryNumber ? `tel:${secondaryNumber.replace(/\s+/g, "")}` : null),
    email,
    emailHref: sanitizeString(contact?.emailHref) || (email ? `mailto:${email}` : null),
    websiteHref: sanitizeString(contact?.websiteHref),
    websiteLabel: sanitizeString(contact?.websiteLabel),
    bullets: sanitizeStringArray(contact?.bullets) || [],
    availability: sanitizeString(contact?.availability),
    source: sanitizeString(contact?.source),
  };
}

function sanitizeScenario(scenario) {
  return {
    title: sanitizeString(scenario?.title),
    primary: sanitizeString(scenario?.primary),
    body: sanitizeString(scenario?.body),
  };
}

function sanitizeSource(source) {
  return {
    label: sanitizeString(source?.label),
    detail: sanitizeString(source?.detail),
    href: sanitizeString(source?.href),
  };
}

function buildSosPayload(body) {
  const payload = {};

  if (body.contacts !== undefined) {
    payload.contacts = Array.isArray(body.contacts) ? body.contacts.map(sanitizeContact) : [];
  }

  if (body.scenarios !== undefined) {
    payload.scenarios = Array.isArray(body.scenarios) ? body.scenarios.map(sanitizeScenario) : [];
  }

  if (body.reasons !== undefined) {
    payload.reasons = sanitizeStringArray(body.reasons) || [];
  }

  if (body.prepSteps !== undefined) {
    payload.prepSteps = sanitizeStringArray(body.prepSteps) || [];
  }

  if (body.sources !== undefined) {
    payload.sources = Array.isArray(body.sources) ? body.sources.map(sanitizeSource) : [];
  }

  return payload;
}

function validateSosPayload(payload) {
  if (payload.contacts) {
    const ids = new Set();

    for (const contact of payload.contacts) {
      if (!contact.id || !contact.category || !contact.department || !contact.summary || !contact.primaryNumber || !contact.primaryHref) {
        return "Each SOS contact requires id, category, department, summary, primary number, and primary href.";
      }

      if (ids.has(contact.id)) {
        return "SOS contact ids must be unique.";
      }

      ids.add(contact.id);
    }
  }

  if (payload.scenarios) {
    for (const scenario of payload.scenarios) {
      if (!scenario.title || !scenario.primary || !scenario.body) {
        return "Each SOS scenario requires title, primary guidance, and body text.";
      }
    }
  }

  if (payload.sources) {
    for (const source of payload.sources) {
      if (!source.label || !source.detail || !source.href) {
        return "Each SOS source requires label, detail, and href.";
      }
    }
  }

  return "";
}

function formatSosContent(content) {
  return {
    contacts: content.contacts,
    scenarios: content.scenarios,
    reasons: content.reasons,
    prepSteps: content.prepSteps,
    sources: content.sources,
    updatedAt: content.updatedAt,
  };
}

async function getSosContent(req, res) {
  try {
    const content = await getOrCreateSosContent();

    if (!content) {
      return res.status(404).json({ message: "SOS content not found." });
    }

    return res.json(formatSosContent(content));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateSosContent(req, res) {
  try {
    const payload = buildSosPayload(req.body);

    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: "At least one SOS content field is required." });
    }

    const validationMessage = validateSosPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const content = await getOrCreateSosContent();
    Object.assign(content, payload);
    await content.save();

    return res.json(formatSosContent(content));
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getSosContent,
  updateSosContent,
};