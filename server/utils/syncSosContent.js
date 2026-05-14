const SosContent = require("../models/SosContent");
const { SOS_CONTENT } = require("./sosSeedSource");

async function syncSosContent() {
  const result = await SosContent.updateOne(
    { key: SOS_CONTENT.key },
    { $set: SOS_CONTENT },
    { upsert: true }
  );

  return {
    matched: result.matchedCount,
    modified: result.modifiedCount,
    upserted: result.upsertedCount,
  };
}

async function getOrCreateSosContent() {
  let content = await SosContent.findOne({ key: SOS_CONTENT.key });

  if (!content) {
    await syncSosContent();
    content = await SosContent.findOne({ key: SOS_CONTENT.key });
  }

  return content;
}

module.exports = {
  SOS_CONTENT,
  getOrCreateSosContent,
  syncSosContent,
};