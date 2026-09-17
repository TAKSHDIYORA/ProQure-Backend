import jwt from "jsonwebtoken";

export const generateToken = (
    userId: string,
    tenantId: string,
    role: string
): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        {
            userId,
            tenantId,
            role,
        },
        secret,
        {
            expiresIn: "7d",
        }
    );
};