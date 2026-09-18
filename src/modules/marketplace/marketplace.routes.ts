import { Router } from "express";

import {
  searchOrganizations,
  getOrganizationProfile,
} from "./marketplace.controller";

const router = Router();

router.get("/organizations", searchOrganizations);

router.get("/organizations/:id", getOrganizationProfile);

export default router;
