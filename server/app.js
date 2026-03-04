import express from "express";
import { router as authRouter } from "./route/authRoute.js";
import { router as companyRouter } from "./route/companyRoute.js";
import { router as guardRouter } from "./route/guardRoute.js";
import { router as bookingRouter } from "./route/bookingRoute.js";
import { router as profileRouter } from "./route/Profileroute.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/guards", guardRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/profile", profileRouter);

// Basic error handler for unhandled routes or errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;