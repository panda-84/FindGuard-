// bookingRoute.js
// All booking API URLs

import express from "express";
import {
  createBooking,
  getMyBookings,
  getCompanyBookings,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
} from "../controller/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

export const router = express.Router();

// ── CUSTOMER ONLY ─────────────────────────────
router.get(    "/mine",    authMiddleware, roleMiddleware("customer"), getMyBookings);
router.post(   "/",        authMiddleware, roleMiddleware("customer"), createBooking);
router.delete( "/:id",     authMiddleware, roleMiddleware("customer"), cancelBooking);

// ── COMPANY ONLY ──────────────────────────────
router.get(   "/company",  authMiddleware, roleMiddleware("company"), getCompanyBookings);
router.patch( "/:id",      authMiddleware, roleMiddleware("company"), updateBookingStatus);

// ── ADMIN ONLY ────────────────────────────────
router.get("/all",         authMiddleware, roleMiddleware("admin"), getAllBookings);