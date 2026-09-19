import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  createRFQ,
  inviteSupplier,
  openRFQ,
  getMyRFQs,
} from "./rfq.controller";

const router = Router();

router.use(protect);

router.post(
  "/",
  authorize("ADMIN", "PROCUREMENT_MANAGER", "PROCUREMENT_OFFICER"),
  createRFQ,
);

router.get("/", getMyRFQs);

router.patch(
  "/:id/invite",
  authorize("ADMIN", "PROCUREMENT_MANAGER", "PROCUREMENT_OFFICER"),
  inviteSupplier,
);

router.patch("/:id/open", authorize("ADMIN", "PROCUREMENT_MANAGER"), openRFQ);

export default router;
