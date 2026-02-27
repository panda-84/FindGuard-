// index.js
// Main server file

import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import { connection } from "./Database/db.js";

// Routes
import { router as authRouter }    from "./route/authRoute.js";
import { router as companyRouter } from "./route/companyRoute.js";
import { router as guardRouter }   from "./route/guardRoute.js";
import { router as bookingRouter } from "./route/bookingRoute.js";
import { router as profileRouter } from "./route/Profileroute.js";

// Models (import so tables auto create)
import "./model/userModel.js";
import "./model/companyModel.js";
import "./model/guardModel.js";
import "./model/bookingModel.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ FindGuard Server Running!");
});

// All routes
app.use("/api/auth",      authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/guards",    guardRouter);
app.use("/api/bookings",  bookingRouter);
app.use("/api/profile",   profileRouter);

// Start after DB connects
connection().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
