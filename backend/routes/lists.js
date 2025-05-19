const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const xlsx = require("xlsx");
const ListItem = require("../models/ListItem");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload and distribute lists
router.post(
  "/upload",
  protect,
  admin,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Get agents
      const agents = await User.find({ role: "agent" });
      if (agents.length === 0) {
        return res
          .status(400)
          .json({ message: "No agents found for distribution" });
      }

      // Parse file
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let items = [];

      if (fileExt === ".csv") {
        items = await parseCSV(req.file.path);
      } else {
        items = await parseExcel(req.file.path);
      }

      // Validate items
      if (!items.length) {
        return res
          .status(400)
          .json({ message: "No valid items found in file" });
      }

      // Validate required fields
      const firstItem = items[0];
      if (!hasRequiredFields(firstItem)) {
        return res.status(400).json({
          message: "File must contain 'FirstName' and 'Phone' columns",
          sample: firstItem,
        });
      }

      // Distribute items
      const distributedItems = await distributeItems(items, agents);

      // Clean up
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(201).json({
        message: "Items distributed successfully",
        items: distributedItems,
        total: distributedItems.length,
      });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({
        message: "Error processing file",
        error: err.message,
      });
    }
  }
);

// Helper functions
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

function hasRequiredFields(item) {
  const hasFirstName = ["FirstName", "firstname", "First Name"].some((field) =>
    Object.keys(item).some((key) => key.toLowerCase() === field.toLowerCase())
  );
  const hasPhone = ["Phone", "phone"].some((field) =>
    Object.keys(item).some((key) => key.toLowerCase() === field.toLowerCase())
  );
  return hasFirstName && hasPhone;
}

function getFieldValue(item, possibleNames) {
  for (const name of possibleNames) {
    for (const key of Object.keys(item)) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return item[key];
      }
    }
  }
  return null;
}

async function distributeItems(items, agents) {
  const distributedItems = [];
  let currentAgentIndex = 0;

  for (const item of items) {
    // Get field values
    const firstName = getFieldValue(item, [
      "FirstName",
      "firstname",
      "First Name",
    ]);
    const phone = getFieldValue(item, ["Phone", "phone"]);
    const notes = getFieldValue(item, ["Notes", "notes", "Note"]) || "";

    // Validate phone number
    const phoneNumber = phone.toString().replace(/\D/g, "");
    if (phoneNumber.length !== 10) continue;

    // Select agent using round-robin
    const selectedAgent = agents[currentAgentIndex];
    currentAgentIndex = (currentAgentIndex + 1) % agents.length;

    // Create and save item
    const newItem = new ListItem({
      firstName,
      phone: phoneNumber,
      notes,
      agentId: selectedAgent._id,
    });

    await newItem.save();
    distributedItems.push(newItem);
  }

  return distributedItems;
}

// Get all distributed lists
router.get("/", protect, admin, async (req, res) => {
  try {
    const items = await ListItem.find().populate("agentId", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lists" });
  }
});

// Get lists for specific agent
router.get("/agent/:agentId", protect, admin, async (req, res) => {
  try {
    const items = await ListItem.find({ agentId: req.params.agentId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching agent lists" });
  }
});

module.exports = router;
