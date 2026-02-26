// index.js
// This is the main file that starts our server
// Everything starts from here

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./Database/db.js";
import { router as authRouter } from "./route/authRoute.js";

// Load .env file variables
dotenv.config();

// Create express app
const app = express();

// ── MIDDLEWARE ────────────────────────────────
// These run on every request before routes

// Allow frontend to talk to backend (different ports)
app.use(cors());

// Allow server to read JSON data from requests
app.use(express.json());

// ── TEST ROUTE ────────────────────────────────
// Visit http://localhost:5000 to check server is running
app.get("/", (req, res) => {
  res.send("✅ FindGuard Server is running!");
});

// ── ROUTES ────────────────────────────────────
// All auth routes start with /api/auth
// Example: /api/auth/login, /api/auth/register
app.use("/api/auth", authRouter);

// ── START SERVER ──────────────────────────────
// Connect to database first, then start server
const PORT = process.env.PORT || 5000;

// Connect to database
connection().then(() => {
  // After database connects, start the server
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});
