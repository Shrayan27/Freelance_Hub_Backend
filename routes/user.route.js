import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/usercontroller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", getUser);
router.put("/", verifyToken, updateUser);

export default router;