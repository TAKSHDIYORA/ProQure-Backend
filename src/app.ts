import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import marketplaceRoutes from "./modules/marketplace/marketplace.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import connectionRoutes from "./modules/connection/connection.routes";
import procurementRoutes from "./modules/procurement/pr.routes";
import rfqRoutes from "./modules/procurement/rfq.routes";
import quotationRoutes from "./modules/procurement/quotation.routes";
import poRoutes from "./modules/procurement/po.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/organizations", organizationRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/procurement/pr", procurementRoutes);
app.use("/api/procurement/rfqs", rfqRoutes);
app.use("/api/procurement/quotations", quotationRoutes);
app.use("/api/procurement/pos", poRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "ProQure API is running",
  });
});

app.use("/api/auth", authRoutes);

export default app;
