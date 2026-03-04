
import { Op }        from "sequelize";
import { Bookings }  from "../model/bookingModel.js";
import { Guards }    from "../model/guardModel.js";
import { Companies } from "../model/companyModel.js";
import { Users }     from "../model/userModel.js";

export const createBooking = async (req, res) => {
  try {
    const {
      guardId, startDate, duration, durationType,
      contactName, contactPhone, contactEmail,
      address, specialRequirements,
    } = req.body;

    const guard = await Guards.findByPk(guardId);
    if (!guard) return res.status(404).json({ message: "Guard not found" });

    // Check guard is available
    if (guard.status !== "available") {
      return res.status(400).json({ message: "This guard is not available for booking" });
    }

    // Calculate cost in NPR
    const rawPrice  = parseFloat(guard.price || 0);
    const rateNPR   = rawPrice < 100 ? Math.round(rawPrice * 133) : Math.round(rawPrice);
    let totalHours  = duration;
    if (durationType === "days")   totalHours = duration * 8;
    if (durationType === "months") totalHours = duration * 8 * 30;
    const totalCost = totalHours * rateNPR;

    const booking = await Bookings.create({
      customerId: req.user.id,
      guardId,
      companyId:  guard.companyId,
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

    res.status(201).json({ message: "Booking created!", data: booking });
  } catch (err) {
    console.error("Create booking error:", err);
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
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

// ── GET COMPANY BOOKINGS ───────────────────────
export const getCompanyBookings = async (req, res) => {
  try {
    const company = await Companies.findOne({ where: { userId: req.user.id } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const bookings = await Bookings.findAll({
      where: { companyId: company.id },
      include: [
        { model: Guards, as: "guard",    attributes: ["name", "photo"] },
        { model: Users,  as: "customer", attributes: ["name", "email", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

// ── UPDATE BOOKING STATUS (company confirms/cancels) ──
export const updateBookingStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const booking = await Bookings.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const prevStatus  = booking.status;
    booking.status    = status;
    await booking.save();

    // ── UPDATE GUARD STATUS ──
    const guard = await Guards.findByPk(booking.guardId);
    if (guard) {
      if (status === "confirmed") {
        // Guard is now on duty
        guard.status = "on-duty";
        await guard.save();
      } else if (status === "cancelled" && prevStatus === "confirmed") {
        // Booking was confirmed but now cancelled → guard is free again
        // Check if guard has any other confirmed bookings
        const otherConfirmed = await Bookings.count({
          where: {
            guardId: guard.id,
            status:  "confirmed",
            id:      { [Op.ne]: id },
          },
        });
        if (otherConfirmed === 0) {
          guard.status = "available";
          await guard.save();
        }
      }
    }

    res.status(200).json({ message: `Booking ${status}!`, data: booking });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// ── CANCEL BOOKING (customer) ──────────────────
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();


    res.status(200).json({ message: "Booking cancelled!" });
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
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};