import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getMyConnections,
} from "./connection.controller";

const router = Router();

router.use(protect);

router.get("/", getMyConnections);

router.post(
  "/request/:organizationId",
  authorize("ADMIN", "PROCUREMENT_MANAGER", "SALES_MANAGER"),
  sendConnectionRequest,
);

router.patch(
  "/:id/accept",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  acceptConnectionRequest,
);

router.patch(
  "/:id/reject",
  authorize("ADMIN", "PROCUREMENT_MANAGER"),
  rejectConnectionRequest,
);

export default router;
