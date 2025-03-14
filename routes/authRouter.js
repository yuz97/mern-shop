import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/authController.js";
import { protectMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protectMiddleware, logoutUser);
router.get("/getuser", protectMiddleware, getCurrentUser);

export default router;
