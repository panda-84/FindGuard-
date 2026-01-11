import express from "express";
import { deleteById, getAll, getById, save, updateById } from "../controller/userController.js";

export const router = express.Router();

router.get("/", getAll);
router.post("/",save);
router.get("/:id",getById);

router.patch("/:id",updateById);

router.delete("/:id",deleteById);