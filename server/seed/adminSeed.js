

import bcrypt         from "bcrypt";
import { Users }      from "../model/userModel.js";
import { connection } from "../Database/db.js";

const seedAdmin = async () => {
  try {
    await connection();

    const existing = await Users.findOne({
      where: { email: "admin@findguard.com" }
    });

    if (existing) {
      console.log("✅ Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Users.create({
      name:     "Super Admin",
      email:    "admin@findguard.com",
      password: hashedPassword,
      phone:    "9800000000",
      dob:      "1990-01-01",
      role:     "admin",
    });

    console.log("✅ Admin created!");
    console.log("📧 Email:    admin@findguard.com");
    console.log("🔑 Password: Admin@123");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();