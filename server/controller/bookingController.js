// bookingController.js
// All logic for booking operations

import { Bookings } from "../model/bookingModel.js";
import { Guards } from "../model/guardModel.js";
import { Companies } from "../model/companyModel.js";
import { Users } from "../model/userModel.js";

// ── CREATE BOOKING (customer books a guard) ────
export const createBooking = async (req, res) => {
  try {
    const {
      guardId, startDate, duration, durationType,
      contactName, contactPhone, contactEmail,
      address, specialRequirements,
    } = req.body;

    // Get guard to find company and calculate cost
    const guard = await Guards.findByPk(guardId);
    if (!guard) return res.status(404).json({ message: "Guard not found" });

    // Calculate total cost
    // price is in USD, convert to NPR (1 USD = 140 NPR)
    let hours = duration;
    if (durationType === "days")   hours = duration * 8;
    if (durationType === "months") hours = duration * 8 * 30;

    const totalCost = hours * guard.price * 140;

    const booking = await Bookings.create({
      customerId: req.user.id,
      guardId,
      companyId: guard.companyId,
      startDate,
      duration,
      durationType,
      contactName,
      contactPhone,
      contactEmail,
      address,
      specialRequirements,
      totalCost,
      status: "pending",
    });

    res.status(201).json({ message: "Booking created", data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// ── GET MY BOOKINGS (customer) ─────────────────
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customerId: req.user.id },
      include: [
        { model: Guards,    as: "guard",   attributes: ["name", "photo", "price"] },
        { model: Companies, as: "company", attributes: ["name"] },
      ],
    });

    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

// ── GET COMPANY BOOKINGS (company sees their bookings) ──
export const getCompanyBookings = async (req, res) => {
  try {
    const company = await Companies.findOne({
      where: { userId: req.user.id },
    });

    if (!company) return res.status(404).json({ message: "Company not found" });

    const bookings = await Bookings.findAll({
      where: { companyId: company.id },
      include: [
        { model: Guards, as: "guard",    attributes: ["name", "photo"] },
        { model: Users,  as: "customer", attributes: ["name", "email", "phone"] },
      ],
    });

    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

// ── UPDATE BOOKING STATUS (company confirms/cancels) ──
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Bookings.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking ${status}`, data: booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// ── CANCEL BOOKING (customer cancels pending) ──
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only pending bookings can be cancelled
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// ── GET ALL BOOKINGS (admin) ───────────────────
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      include: [
        { model: Guards,    as: "guard",    attributes: ["name"] },
        { model: Companies, as: "company",  attributes: ["name"] },
        { model: Users,     as: "customer", attributes: ["name", "email"] },
      ],
    });

    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};