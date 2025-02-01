import express from "express";
import {
  createOrder,
  currentUserOrder,
  detailOrder,
  getOrder,
} from "../controller/orderController.js";
import {
  protectMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectMiddleware, roleMiddleware("owner"), getOrder);
router.post("/", protectMiddleware, roleMiddleware("owner"), createOrder);
router.get(
  "/current",
  protectMiddleware,
  roleMiddleware("owner"),
  currentUserOrder
);
router.get("/:id", protectMiddleware, roleMiddleware("owner"), detailOrder);

export default router;
