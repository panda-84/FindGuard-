import express from "express";
import cors from "cors";
import { router as authRouter }    from "./route/authRoute.js";
import { router as companyRouter } from "./route/companyRoute.js";
import { router as guardRouter }   from "./route/guardRoute.js";
import { router as bookingRouter } from "./route/bookingRoute.js";
import { router as profileRouter } from "./route/Profileroute.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());

app.use("/api/auth",      authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/guards",    guardRouter);
app.use("/api/bookings",  bookingRouter);
app.use("/api/profile",   profileRouter);

app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

export default app;