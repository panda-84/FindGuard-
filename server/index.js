import express from "express";
import cors from "cors";
import { connection } from "./Database/db.js";
import { router as authRouter } from "./route/authRoute.js";

const app = express();


connection();


app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("FindGuard Server is running");
});


app.use("/api/auth", authRouter);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
