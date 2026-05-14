require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { syncSosContent } = require("./utils/syncSosContent");

async function run() {
  try {
    await connectDB();
    const result = await syncSosContent();
    console.log(`SOS content synced (${result.upserted} upserted, ${result.modified} updated, ${result.matched} matched)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("SOS sync failed:", error.message);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  }
}

run();