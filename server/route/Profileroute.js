// profileRoute.js
// Customer profile API URLs

import express from "express";
import {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyGuards,
} from "../controller/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get( "/",         authMiddleware, getProfile);
router.put( "/",         authMiddleware, updateProfile);
router.get( "/bookings", authMiddleware, getMyBookings);
router.get( "/guards",   authMiddleware, getMyGuards);