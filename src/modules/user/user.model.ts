import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
    {
        tenantId: {
            type: Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: [
                "ADMIN",
                "PROCUREMENT_MANAGER",
                "PROCUREMENT_OFFICER",
                "WAREHOUSE_MANAGER",
                "FINANCE_MANAGER",
                "EMPLOYEE",
                "SALES_MANAGER",
            ],
            default: "EMPLOYEE",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLoginAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const User = model("User", userSchema);