import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  getMyOrganization,
  updateMyOrganization,
} from "./organization.controller";

const router = Router();

router.get("/me", protect, getMyOrganization);

router.patch("/me", protect, authorize("ADMIN"), updateMyOrganization);

export default router;
