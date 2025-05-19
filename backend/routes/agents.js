const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

// Get all agents - Admin only
router.get("/", protect, async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new agent - Admin only
router.post("/", protect, admin, async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate mobile format (simple validation)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be 10 digits",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAgent = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "agent",
    });

    await newAgent.save();

    // Remove password from response
    const agentResponse = {
      _id: newAgent._id,
      name: newAgent.name,
      email: newAgent.email,
      mobile: newAgent.mobile,
      role: newAgent.role,
    };

    res.status(201).json(agentResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an agent - Admin only
router.put("/:id", protect, admin, async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    // Check if agent exists
    const agent = await User.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check if trying to update to an email that already exists (except current agent)
    if (email && email !== agent.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Validate mobile format if being updated
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be 10 digits",
      });
    }

    const updatedAgent = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile },
      { new: true }
    ).select("-password");

    res.json(updatedAgent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an agent - Admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (agent.role !== "agent") {
      return res.status(400).json({ message: "Cannot delete non-agent users" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
