// companyRoute.js
// All company API URLs

import express from "express";
import {
  createCompany,
  getMyCompany,
  getAllApproved,
  updateCompany,
  getAllCompanies,
  approveCompany,
  rejectCompany,
} from "../controller/companyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

export const router = express.Router();

// ── PUBLIC ────────────────────────────────────
// Customers can see approved companies
router.get("/", getAllApproved);

// ── COMPANY ONLY ──────────────────────────────
router.get(  "/mine", authMiddleware, roleMiddleware("company"), getMyCompany);
router.post( "/",     authMiddleware, roleMiddleware("company"), createCompany);
router.put(  "/mine", authMiddleware, roleMiddleware("company"), updateCompany);

// ── ADMIN ONLY ────────────────────────────────
router.get(   "/all",          authMiddleware, roleMiddleware("admin"), getAllCompanies);
router.patch( "/:id/approve",  authMiddleware, roleMiddleware("admin"), approveCompany);
router.patch( "/:id/reject",   authMiddleware, roleMiddleware("admin"), rejectCompany);