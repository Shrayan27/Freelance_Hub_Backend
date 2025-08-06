import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
  getConversationByGig,
  debugConversations,
} from "../controllers/conversationcontroller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.get("/gig/:gigId", verifyToken, getConversationByGig);
router.put("/:id", verifyToken, updateConversation);
router.get("/debug/all", debugConversations); // Debug endpoint

export default router;
