// controller/profileController.js

import { Users }     from "../model/userModel.js";
import { Bookings }  from "../model/bookingModel.js";
import { Guards }    from "../model/guardModel.js";
import { Companies } from "../model/companyModel.js";
import bcrypt        from "bcrypt";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "dob", "role"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, dob, password } = req.body;
    const user = await Users.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name)  user.name  = name;
    if (phone) user.phone = phone;
    if (dob)   user.dob   = dob;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({
      message: "Profile updated!",
      data: { id: user.id, name: user.name, email: user.email, phone: user.phone, dob: user.dob },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// GET /api/profile/bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customerId: req.user.id },
      include: [
        {
          model: Guards,
          as: "guard",
          attributes: ["id", "name", "photo"],
          // Include company inside guard
          include: [{
            model: Companies,
            attributes: ["id", "name"],
          }],
        },
        {
          model: Companies,
          as: "company",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: bookings });
  } catch (err) {
    console.error("Get my bookings error:", err.message);

    // If association error, try without includes
    try {
      const bookings = await Bookings.findAll({
        where: { customerId: req.user.id },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({ data: bookings });
    } catch (err2) {
      console.error("Fallback error:", err2.message);
      res.status(500).json({ message: "Failed to get bookings" });
    }
  }
};

// GET /api/profile/guards
export const getMyGuards = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customerId: req.user.id },
      include: [{
        model: Guards,
        as: "guard",
        include: [{ model: Companies, attributes: ["name"] }],
      }],
    });

    const seen   = new Set();
    const guards = [];
    bookings.forEach((b) => {
      if (b.guard && !seen.has(b.guard.id)) {
        seen.add(b.guard.id);
        guards.push(b.guard);
      }
    });

    res.status(200).json({ data: guards });
  } catch (err) {
    console.error("Get my guards error:", err);
    res.status(500).json({ message: "Failed to get guards" });
  }
};