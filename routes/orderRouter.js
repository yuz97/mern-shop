import express from "express";
import {
  createOrder,
  currentUserOrder,
  detailOrder,
  getOrder,
  handlerNotification,
} from "../controller/orderController.js";
import {
  protectMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectMiddleware, roleMiddleware("owner"), getOrder);
router.post("/", protectMiddleware, createOrder);
router.get("/current", protectMiddleware, currentUserOrder);
router.get("/:id", protectMiddleware, roleMiddleware("owner"), detailOrder);
router.post("/callback/midtrans", handlerNotification);

export default router;
