require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

function readArg(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1 || index === process.argv.length - 1) {
    return "";
  }

  return String(process.argv[index + 1] || "").trim();
}

function resolveInput(flag, envKey) {
  return readArg(flag) || String(process.env[envKey] || "").trim();
}

async function main() {
  const name = resolveInput("--name", "ADMIN_NAME");
  const email = resolveInput("--email", "ADMIN_EMAIL").toLowerCase();
  const password = resolveInput("--password", "ADMIN_PASSWORD");

  if (!email) {
    throw new Error("Admin email is required. Pass --email or set ADMIN_EMAIL.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      let shouldSave = false;

      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        shouldSave = true;
      }

      if (name && existingUser.name !== name) {
        existingUser.name = name;
        shouldSave = true;
      }

      if (password) {
        if (password.length < 6) {
          throw new Error("Admin password must be at least 6 characters.");
        }

        existingUser.password = await bcrypt.hash(password, 10);
        shouldSave = true;
      }

      if (shouldSave) {
        await existingUser.save();
      }

      console.log(`Admin ready: ${existingUser.email}`);
      return;
    }

    if (!name) {
      throw new Error("Admin name is required when creating a new admin user. Pass --name or set ADMIN_NAME.");
    }

    if (!password) {
      throw new Error("Admin password is required when creating a new admin user. Pass --password or set ADMIN_PASSWORD.");
    }

    if (password.length < 6) {
      throw new Error("Admin password must be at least 6 characters.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created: ${adminUser.email}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});