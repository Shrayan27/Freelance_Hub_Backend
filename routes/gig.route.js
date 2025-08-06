import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getUserGigs,
  updateGig,
} from "../controllers/gigcontroller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.put("/:id", verifyToken, updateGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.get("/user", verifyToken, getUserGigs);

export default router;
