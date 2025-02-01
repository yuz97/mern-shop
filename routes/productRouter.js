import express from "express";
import {
  getAllProduct,
  createProduct,
  showProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
} from "../controller/productController.js";
import {
  protectMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

router.get("/", getAllProduct);
// router.post("/", protectMiddleware, roleMiddleware("owner"), createProduct);
router.post("/", createProduct);
router.get("/:id", showProduct);
router.put("/:id", updateProduct);
router.delete(
  "/:id",
  protectMiddleware,
  roleMiddleware("owner"),
  deleteProduct
);

router.post(
  "/file-upload",
  // protectMiddleware,
  // roleMiddleware("owner"),
  upload.single("image"),
  fileUpload
);

export default router;
