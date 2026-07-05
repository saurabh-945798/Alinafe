import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  deleteConversationForAdmin,
  getAllConversations,
  getMessagesForAdmin,
} from "../Controllers/adminMessageController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/conversations", getAllConversations);
router.get("/messages/:conversationId", getMessagesForAdmin);
router.delete("/conversations/:conversationId", deleteConversationForAdmin);

export default router;
