// index.js
import cors     from "cors";
import dotenv   from "dotenv";
import { connection } from "./Database/db.js";
import app from "./app.js";

dotenv.config();

// ── SCHEDULER ──
import { startBookingScheduler } from "./scheduler/bookingScheduler.js";

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => res.send("✅ FindGuard Server Running!"));

connection().then(() => {
  startBookingScheduler();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});