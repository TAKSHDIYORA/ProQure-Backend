import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  createPurchaseRequisition,
  getPurchaseRequisitions,
  getPurchaseRequisitionById,
  submitPurchaseRequisition,
} from "./pr.controller";

import {
  approvePurchaseRequisition,
  rejectPurchaseRequisition,
} from "./approval.controller";

const router = Router();

router.use(protect);

router.post(
  "/",
  authorize("ADMIN", "EMPLOYEE", "PROCUREMENT_OFFICER"),
  createPurchaseRequisition,
);

router.get("/", getPurchaseRequisitions);

router.get("/:id", getPurchaseRequisitionById);

router.patch(
  "/:id/submit",
  authorize("ADMIN", "EMPLOYEE", "PROCUREMENT_OFFICER"),
  submitPurchaseRequisition,
);

router.patch(
  "/:id/approve",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  approvePurchaseRequisition,
);

router.patch(
  "/:id/reject",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  rejectPurchaseRequisition,
);

export default router;
