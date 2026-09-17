import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
    userId: string;
    tenantId: string;
    role: string;
}

export const protect = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization =
            req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const [scheme, token] =
            authorization.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                "JWT_SECRET is not defined"
            );
        }

        const decoded = jwt.verify(
            token,
            secret
        ) as AuthPayload;

        (req as any).user = decoded;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};