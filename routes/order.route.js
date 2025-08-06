import express from "express";
import {
  createOrder,
  getOrders,
  confirmOrder,
  createPaymentIntent,
  updatePaymentStatus,
} from "../controllers/ordercontroller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/confirm/:id", verifyToken, confirmOrder);
router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.put("/update-payment", verifyToken, updatePaymentStatus);

export default router;