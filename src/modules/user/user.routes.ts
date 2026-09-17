import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from "./user.controller";

const router = Router();

router.use(protect);

router.post("/", authorize("ADMIN"), createUser);

router.get("/", authorize("ADMIN"), getUsers);

router.get("/:id", authorize("ADMIN"), getUserById);

router.patch("/:id", authorize("ADMIN"), updateUser);

router.patch("/:id/status", authorize("ADMIN"), updateUserStatus);

export default router;
