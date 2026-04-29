require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { syncPackageCatalog } = require("./utils/syncPackageCatalog");

async function run() {
  try {
    await connectDB();
    const result = await syncPackageCatalog();
    console.log(`Package catalog synced: ${result.count} packages (${result.upserted} upserted, ${result.modified} updated, ${result.matched} matched)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Package sync failed:", error.message);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  }
}

run();