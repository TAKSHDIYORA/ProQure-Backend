import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `ProQure server running on port ${PORT}`
        );
    });
};

startServer();