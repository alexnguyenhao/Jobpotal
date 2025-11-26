// createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Admin } from "./models/admin.model.js";
import connectDB from "./utils/db.js";

dotenv.config();

const createAdminAccount = async () => {
  try {
    connectDB();

    const email = "admin@gmail.com";
    const password = "admin123";
    const exist = await Admin.findOne({ email });
    if (exist) {
      console.log("⚠️ Admin account already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      fullName: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdminAccount();
