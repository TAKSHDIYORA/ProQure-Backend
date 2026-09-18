import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "./product.controller";

const router = Router();

router.use(protect);

router.get("/", getMyProducts);

router.post("/", authorize("ADMIN", "PROCUREMENT_MANAGER"), createProduct);

router.patch("/:id", authorize("ADMIN", "PROCUREMENT_MANAGER"), updateProduct);

router.delete("/:id", authorize("ADMIN", "PROCUREMENT_MANAGER"), deleteProduct);

export default router;
