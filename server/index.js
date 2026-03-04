import "./env.js";
import { connection } from "./Database/db.js";
import app from "./app.js";
import { startBookingScheduler } from "./scheduler/bookingScheduler.js";

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("✅ FindGuard Server Running!"));

connection().then(() => {
  startBookingScheduler();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});