// guardController.js
// All logic for guard operations

import { Guards } from "../model/guardModel.js";
import { Companies } from "../model/companyModel.js";

// ── GET MY GUARDS (company sees their guards) ──
export const getMyGuards = async (req, res) => {
  try {
    // Find company first
    const company = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Get all guards for this company
    const guards = await Guards.findAll({
      where: { companyId: company.id },
    });

    res.status(200).json({ data: guards });
  } catch (err) {
    res.status(500).json({ message: "Failed to get guards" });
  }
};

// ── GET ALL GUARDS (customers see available guards) ──
export const getAllGuards = async (req, res) => {
  try {
    const { companyId } = req.query;

    // If companyId given, filter by company
    const where = { status: "available" };
    if (companyId) where.companyId = companyId;

    const guards = await Guards.findAll({
      where,
      include: [{ model: Companies, attributes: ["name", "location"] }],
    });

    res.status(200).json({ data: guards });
  } catch (err) {
    res.status(500).json({ message: "Failed to get guards" });
  }
};

// ── ADD GUARD (company adds a guard) ──────────
export const addGuard = async (req, res) => {
  try {
    const { name, badge, phone, experience, shift, zone, price, photo } = req.body;

    // Get company
    const company = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Create guard
    const guard = await Guards.create({
      companyId: company.id,
      name,
      badge,
      phone,
      experience,
      shift,
      zone,
      price,
      photo,
      status: "available",
    });

    res.status(201).json({ message: "Guard added successfully", data: guard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add guard" });
  }
};

// ── UPDATE GUARD ───────────────────────────────
export const updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, badge, phone, experience, shift, zone, price, photo } = req.body;

    const guard = await Guards.findByPk(id);
    if (!guard) return res.status(404).json({ message: "Guard not found" });

    // Update fields
    if (name)       guard.name       = name;
    if (badge)      guard.badge      = badge;
    if (phone)      guard.phone      = phone;
    if (experience) guard.experience = experience;
    if (shift)      guard.shift      = shift;
    if (zone)       guard.zone       = zone;
    if (price)      guard.price      = price;
    if (photo)      guard.photo      = photo;

    await guard.save();

    res.status(200).json({ message: "Guard updated", data: guard });
  } catch (err) {
    res.status(500).json({ message: "Failed to update guard" });
  }
};

// ── UPDATE GUARD STATUS ────────────────────────
export const updateGuardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const guard = await Guards.findByPk(id);
    if (!guard) return res.status(404).json({ message: "Guard not found" });

    guard.status = status;
    await guard.save();

    res.status(200).json({ message: "Guard status updated", data: guard });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ── DELETE GUARD ───────────────────────────────
export const deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    const guard = await Guards.findByPk(id);
    if (!guard) return res.status(404).json({ message: "Guard not found" });

    await guard.destroy();

    res.status(200).json({ message: "Guard deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete guard" });
  }
};