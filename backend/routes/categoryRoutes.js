import express from "express";
import { getPublicCategories } from "../Controllers/categoryAdminController.js";

const router = express.Router();

router.get("/", getPublicCategories);

export default router;
