require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { syncShopCatalog } = require("./utils/syncShopCatalog");

async function run() {
  try {
    await connectDB();
    const result = await syncShopCatalog();
    console.log(`Shop catalog synced: ${result.count} shops (${result.upserted} upserted, ${result.modified} updated, ${result.matched} matched)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Shop sync failed:", error.message);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  }
}

run();