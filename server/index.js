// index.js
import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import { connection } from "./Database/db.js";

dotenv.config();

// ── MODELS ──
import { Users }     from "./model/userModel.js";
import { Companies } from "./model/companyModel.js";
import { Guards }    from "./model/guardModel.js";
import { Bookings }  from "./model/bookingModel.js";

// ── ROUTES ──
import { router as authRouter }    from "./route/authRoute.js";
import { router as companyRouter } from "./route/companyRoute.js";
import { router as guardRouter }   from "./route/guardRoute.js";
import { router as bookingRouter } from "./route/bookingRoute.js";
import { router as profileRouter } from "./route/Profileroute.js";

// ── SCHEDULER ──
import { startBookingScheduler } from "./scheduler/bookingScheduler.js";

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("✅ FindGuard Server Running!"));

app.use("/api/auth",      authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/guards",    guardRouter);
app.use("/api/bookings",  bookingRouter);
app.use("/api/profile",   profileRouter);

connection().then(() => {
  startBookingScheduler();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});