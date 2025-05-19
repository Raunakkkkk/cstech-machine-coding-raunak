require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI =
  process.env.MONGO_URI;

async function seedAdmin() {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding");

    // Check if admin already exists
    const adminExists = await User.findOne({
      email: "admin@example.com",
      role: "admin",
    });

    if (adminExists) {
      console.log("Admin user already exists");
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      mobile: "+1234567890",
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
