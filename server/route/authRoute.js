// authRoute.js
// This file defines all the URL addresses for auth
// Route = the address people use to call our API

import express from "express";
import {
  deleteById,
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controller/authController.js";

export const router = express.Router();

// ── AUTH ROUTES ──────────────────────────────
// POST = sending data to server

// Register a new user
// URL: POST /api/auth/register
router.post("/register", register);

// Login with email and password
// URL: POST /api/auth/login
router.post("/login", login);

// ── USER ROUTES ──────────────────────────────
// GET = getting data from server
// PUT = updating data
// DELETE = removing data

// Get all users
// URL: GET /api/auth/users
router.get("/users", getAllUsers);

// Get one user by id
// URL: GET /api/auth/users/5
router.get("/users/:id", getUserById);

// Update a user
// URL: PUT /api/auth/users/5
router.put("/users/:id", updateUser);

// Delete a user
// URL: DELETE /api/auth/users/5
router.delete("/users/:id", deleteById);
