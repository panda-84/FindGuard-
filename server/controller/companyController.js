// companyController.js
// All logic for company operations

import { Companies } from "../model/companyModel.js";
import { Users } from "../model/userModel.js";

// ── GET MY COMPANY ─────────────────────────────
// Company user gets their own profile
export const getMyCompany = async (req, res) => {
  try {
    const company = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.status(200).json({ data: company });
  } catch (err) {
    res.status(500).json({ message: "Failed to get company" });
  }
};

// ── CREATE COMPANY ─────────────────────────────
// Called when company user registers (auto create profile)
export const createCompany = async (req, res) => {
  try {
    const { name, location, description, logo } = req.body;

    // Check if company already exists for this user
    const existing = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ message: "Company profile already exists" });
    }

    const company = await Companies.create({
      userId: req.user.id,
      name: name || "My Company",
      location,
      description,
      logo,
      status: "pending",
    });

    res.status(201).json({ message: "Company created", data: company });
  } catch (err) {
    res.status(500).json({ message: "Failed to create company" });
  }
};

// ── UPDATE COMPANY ─────────────────────────────
// Company updates their own profile
export const updateCompany = async (req, res) => {
  try {
    const { name, location, description, logo } = req.body;

    const company = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update only provided fields
    if (name)        company.name        = name;
    if (location)    company.location    = location;
    if (description) company.description = description;
    if (logo)        company.logo        = logo;

    await company.save();

    res.status(200).json({ message: "Company updated", data: company });
  } catch (err) {
    res.status(500).json({ message: "Failed to update company" });
  }
};

// ── GET ALL APPROVED (for customers) ──────────
export const getAllApproved = async (req, res) => {
  try {
    const companies = await Companies.findAll({
      where: { status: "approved" },
    });

    res.status(200).json({ data: companies });
  } catch (err) {
    res.status(500).json({ message: "Failed to get companies" });
  }
};

// ── GET ALL (for admin) ────────────────────────
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Companies.findAll({
      include: [{ model: Users, attributes: ["name", "email"] }],
    });

    res.status(200).json({ data: companies });
  } catch (err) {
    res.status(500).json({ message: "Failed to get companies" });
  }
};

// ── APPROVE COMPANY (admin only) ───────────────
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByPk(id);

    if (!company) return res.status(404).json({ message: "Company not found" });

    company.status = "approved";
    await company.save();

    res.status(200).json({ message: "Company approved", data: company });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve company" });
  }
};

// ── REJECT COMPANY (admin only) ────────────────
export const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByPk(id);

    if (!company) return res.status(404).json({ message: "Company not found" });

    company.status = "rejected";
    await company.save();

    res.status(200).json({ message: "Company rejected", data: company });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject company" });
  }
};