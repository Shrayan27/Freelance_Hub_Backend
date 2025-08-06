import express from "express";
import { createMessage, getMessages, markAsRead } from "../controllers/messagecontroller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);
router.put("/read/:conversationId", verifyToken, markAsRead);

export default router;