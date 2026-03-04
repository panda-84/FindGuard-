import express from "express";
import {
  register,
  login,
  getAllUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

export const router = express.Router();

router.post("/register",        register);
router.post("/login",           login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});

router.get("/users",        authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);