// middleware/authMiddleware.js
// Checks if request has a valid JWT token

import { verifyToken } from "../security/jwt-utils.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided. Please login." });
    }

    // Header format: "Bearer eyJ..."
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    // Verify token - throws error if expired or tampered
    const decoded = verifyToken(token);

    // Save user info so controllers can use it
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired. Please login again." });
  }
};