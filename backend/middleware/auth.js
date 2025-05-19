const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - Admin only
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Make sure user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }

      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Since all routes now require admin access, this middleware is redundant
// but kept for semantic clarity in route definitions
exports.admin = async (req, res, next) => {
  next();
};
