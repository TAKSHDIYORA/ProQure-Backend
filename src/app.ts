import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";

import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/organizations", organizationRoutes);

app.use("/api/users", userRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "ProQure API is running",
  });
});

app.use("/api/auth", authRoutes);

export default app;
