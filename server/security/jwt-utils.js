// jwt-utils.js
// This file helps us create and verify JWT tokens
// JWT token = a special code given to user after login
// This token proves who the user is on every request

import jwt from "jsonwebtoken";

// Secret key used to create and verify tokens
// In real projects this should be in .env file
const SECRET_KEY = "findguard-secret-key"; // ✅ fixed - no space before

// This function creates a token for the user
// payload = the data we want to store in token (id, email, role)
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" }); // token lasts 24 hours
};

// This function checks if a token is valid
// Returns the data inside the token if valid
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
