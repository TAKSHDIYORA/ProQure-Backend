import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  submitQuotation,
  getRFQQuotations,
  awardQuotation,
} from "./quotation.controller";

const router = Router();

router.use(protect);

router.post(
  "/rfq/:rfqId",
  authorize("ADMIN", "SALES_MANAGER"),
  submitQuotation,
);

router.get(
  "/rfq/:rfqId",
  authorize("ADMIN", "PROCUREMENT_MANAGER", "PROCUREMENT_OFFICER"),
  getRFQQuotations,
);

router.patch(
  "/:quotationId/award",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  awardQuotation,
);

export default router;
