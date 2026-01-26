import express from "express";
import { deleteById,register,login,getAllUsers,getUserById,updateUser } from "../controller/authController.js";

export const router = express.Router();


router.delete("/:id",deleteById);
router.post("/register",register);
router.post("/login",login);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);