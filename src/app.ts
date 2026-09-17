import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "ProQure API is running",
    });
});

app.use(
    "/api/auth",
    authRoutes
);

export default app;