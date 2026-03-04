// route/guardRoute.js

import express from "express";
import {
  addGuard,
  getMyGuards,
  getAllGuards,
  updateGuard,
  updateGuardStatus,
  deleteGuard,
  getAllGuardsAdmin,
} from "../controller/guardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

export const router = express.Router();

router.get("/all", authMiddleware, roleMiddleware("admin"), getAllGuardsAdmin);

router.get("/", authMiddleware, getAllGuards);

router.get(   "/mine",       authMiddleware, roleMiddleware("company"), getMyGuards);
router.post(  "/",           authMiddleware, roleMiddleware("company"), addGuard);
router.put(   "/:id",        authMiddleware, roleMiddleware("company"), updateGuard);
router.patch( "/:id/status", authMiddleware, roleMiddleware("company"), updateGuardStatus);
router.delete("/:id",        authMiddleware, roleMiddleware("company"), deleteGuard);