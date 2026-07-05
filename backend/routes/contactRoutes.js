import express from "express";
import {
  submitContactForm,
  getAllContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../Controllers/contactController.js";

const router = express.Router();

/* USER */
router.post("/submit", submitContactForm);

/* ADMIN */
router.get("/admin/messages", getAllContactMessages);
router.put("/admin/messages/:id/read", markMessageAsRead);
router.delete("/admin/messages/:id", deleteContactMessage);

export default router;
