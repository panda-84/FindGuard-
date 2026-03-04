

import cron     from "node-cron";
import { Op }   from "sequelize";
import { Bookings } from "../model/bookingModel.js";
import { Guards }   from "../model/guardModel.js";

const getEndDate = (booking) => {
  const start    = new Date(booking.startDate);
  const duration = booking.duration;
  const type     = booking.durationType;

  if (type === "hours")  return new Date(start.getTime() + duration * 60 * 60 * 1000);
  if (type === "days")   return new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  if (type === "months") return new Date(start.getTime() + duration * 30 * 24 * 60 * 60 * 1000);
  return start;
};

export const startBookingScheduler = () => {

  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Checking for ended bookings...");

    try {
      const now = new Date();

      const confirmedBookings = await Bookings.findAll({
        where: { status: "confirmed" },
      });

      for (const booking of confirmedBookings) {
        const endDate = getEndDate(booking);

        if (now >= endDate) {
          console.log(`✅ Booking #${booking.id} ended → releasing guard #${booking.guardId}`);

          booking.status = "completed";
          await booking.save();

          const otherActive = await Bookings.count({
            where: {
              guardId: booking.guardId,
              status:  "confirmed",
              id:      { [Op.ne]: booking.id },
            },
          });

          if (otherActive === 0) {
            await Guards.update(
              { status: "available" },
              { where: { id: booking.guardId } }
            );
            console.log(`🟢 Guard #${booking.guardId} is now available again`);
          }
        }
      }

    } catch (err) {
      console.error("Scheduler error:", err.message);
    }
  });

  console.log("✅ Booking scheduler started (runs every hour)");
};