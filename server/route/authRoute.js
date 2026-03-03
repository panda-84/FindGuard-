

import express from "express";
import {
  register,
  login,
  getAllUsers,
  deleteUser,
} from "../controller/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

export const router = express.Router();

router.post("/register", register);
router.post("/login",    login);

router.get("/users",        authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);