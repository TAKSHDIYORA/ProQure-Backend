import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  createPurchaseOrder,
  getMyPurchaseOrders,
  getSupplierPurchaseOrders,
  updatePurchaseOrderStatus,
} from "./po.controller";

const router = Router();

router.use(protect);

router.post(
  "/",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  createPurchaseOrder,
);

router.get(
  "/buyer",
  authorize("ADMIN", "PROCUREMENT_MANAGER", "PROCUREMENT_OFFICER"),
  getMyPurchaseOrders,
);

router.get(
  "/supplier",
  authorize("ADMIN", "SALES_MANAGER"),
  getSupplierPurchaseOrders,
);

router.patch(
  "/:id/status",
  authorize(
    "ADMIN",
    "PROCUREMENT_MANAGER",
    "PROCUREMENT_OFFICER",
    "SALES_MANAGER",
  ),
  updatePurchaseOrderStatus,
);

export default router;
