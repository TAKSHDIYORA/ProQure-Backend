import { Router } from "express";
import { registerOrganization, loginUser, getMe } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerOrganization);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

export default router;