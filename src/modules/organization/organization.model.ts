import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        businessRegistrationCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        capabilities: {
            type: [String],
            enum: ["MANUFACTURER", "SUPPLIER"],
            required: true,
        },

        description: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
        },

        address: {
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },

        marketplaceVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Organization = model(
    "Organization",
    organizationSchema
);