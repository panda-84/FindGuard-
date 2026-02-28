// controller/guardController.js

import { Guards }    from "../model/guardModel.js";
import { Companies } from "../model/companyModel.js";

// ── ADD GUARD ───────────────────────────────────
export const addGuard = async (req, res) => {
  try {
    const { name, badge, phone, experience, shift, zone, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const company = await Companies.findOne({ where: { userId: req.user.id } });
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const guard = await Guards.create({
      companyId: company.id,
      name, badge, phone, experience, shift, zone, price,
    });

    res.status(201).json({ message: "Guard added!", data: guard });

  } catch (err) {
    console.error("Add guard error:", err);
    res.status(500).json({ message: "Failed to add guard" });
  }
};

// ── GET MY GUARDS (company) ─────────────────────
export const getMyGuards = async (req, res) => {
  try {
    const company = await Companies.findOne({ where: { userId: req.user.id } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const guards = await Guards.findAll({ where: { companyId: company.id } });
    res.status(200).json({ data: guards });

  } catch (err) {
    console.error("Get my guards error:", err);
    res.status(500).json({ message: "Failed to get guards" });
  }
};

// ── GET ALL AVAILABLE GUARDS (customers) ────────
export const getAllGuards = async (req, res) => {
  try {
    const { companyId } = req.query;
    const where = { status: "available" };
    if (companyId) where.companyId = companyId;

    const guards = await Guards.findAll({
      where,
      include: [{ model: Companies, attributes: ["name", "location"] }],
    });

    res.status(200).json({ data: guards });

  } catch (err) {
    console.error("Get guards error:", err);
    res.status(500).json({ message: "Failed to get guards" });
  }
};

// ── GET ALL GUARDS (admin) ──────────────────────
export const getAllGuardsAdmin = async (req, res) => {
  try {
    const guards = await Guards.findAll({
      include: [{ model: Companies, attributes: ["name", "location"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: guards });

  } catch (err) {
    console.error("Get all guards admin error:", err);
    res.status(500).json({ message: "Failed to get guards" });
  }
};

// ── UPDATE GUARD ────────────────────────────────
export const updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, badge, phone, experience, shift, zone, price } = req.body;

    const company = await Companies.findOne({ where: { userId: req.user.id } });
    const guard   = await Guards.findOne({ where: { id, companyId: company.id } });

    if (!guard) return res.status(404).json({ message: "Guard not found" });

    if (name)       guard.name       = name;
    if (badge)      guard.badge      = badge;
    if (phone)      guard.phone      = phone;
    if (experience) guard.experience = experience;
    if (shift)      guard.shift      = shift;
    if (zone)       guard.zone       = zone;
    if (price)      guard.price      = price;

    await guard.save();
    res.status(200).json({ message: "Guard updated!", data: guard });

  } catch (err) {
    console.error("Update guard error:", err);
    res.status(500).json({ message: "Failed to update guard" });
  }
};

// ── UPDATE GUARD STATUS ─────────────────────────
export const updateGuardStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const company = await Companies.findOne({ where: { userId: req.user.id } });
    const guard   = await Guards.findOne({ where: { id, companyId: company.id } });

    if (!guard) return res.status(404).json({ message: "Guard not found" });

    guard.status = status;
    await guard.save();
    res.status(200).json({ message: `Guard ${status}!`, data: guard });

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ── DELETE GUARD ────────────────────────────────
export const deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Companies.findOne({ where: { userId: req.user.id } });
    const guard   = await Guards.findOne({ where: { id, companyId: company.id } });

    if (!guard) return res.status(404).json({ message: "Guard not found" });

    await guard.destroy();
    res.status(200).json({ message: "Guard deleted!" });

  } catch (err) {
    console.error("Delete guard error:", err);
    res.status(500).json({ message: "Failed to delete guard" });
  }
};