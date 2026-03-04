
import { Companies } from "../model/companyModel.js";
import { Users }     from "../model/userModel.js";

export const getAllApproved = async (req, res) => {
  try {
    const companies = await Companies.findAll({
      where: { status: "approved" },
    });
    res.status(200).json({ data: companies });
  } catch (err) {
    console.error("Get approved error:", err);
    res.status(500).json({ message: "Failed to get companies" });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const company = await Companies.findOne({ where: { userId: req.user.id } });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ data: company });
  } catch (err) {
    console.error("Get my company error:", err);
    res.status(500).json({ message: "Failed to get company" });
  }
};

export const createCompany = async (req, res) => {
  try {
    const { name, logo, location, description } = req.body;

    const existing = await Companies.findOne({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: "Company profile already exists" });
    }

    const company = await Companies.create({
      userId: req.user.id,
      name, logo, location, description,
      status: "pending",
    });

    res.status(201).json({
      message: "Company created! Waiting for admin approval.",
      data: company,
    });
  } catch (err) {
    console.error("Create company error:", err);
    res.status(500).json({ message: "Failed to create company" });
  }
};

// ── UPDATE COMPANY ───────────────────────────────
export const updateCompany = async (req, res) => {
  try {
    const { name, logo, location, description } = req.body;

    const company = await Companies.findOne({ where: { userId: req.user.id } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (name)        company.name        = name;
    if (logo)        company.logo        = logo;
    if (location)    company.location    = location;
    if (description) company.description = description;

    await company.save();
    res.status(200).json({ message: "Company updated!", data: company });
  } catch (err) {
    console.error("Update company error:", err);
    res.status(500).json({ message: "Failed to update company" });
  }
};

// ── GET ALL COMPANIES (admin) ────────────────────
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Companies.findAll({
      include: [{
        model: Users,
        attributes: ["name", "email", "phone"],
      }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: companies });
  } catch (err) {
    console.error("Get all companies error:", err);
    res.status(500).json({ message: "Failed to get companies" });
  }
};

// ── APPROVE COMPANY (admin) ──────────────────────
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.status = "approved";
    await company.save();
    res.status(200).json({ message: "Company approved!", data: company });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Failed to approve company" });
  }
};

// ── REJECT COMPANY (admin) ───────────────────────
export const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Companies.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.status = "rejected";
    await company.save();
    res.status(200).json({ message: "Company rejected!", data: company });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Failed to reject company" });
  }
};