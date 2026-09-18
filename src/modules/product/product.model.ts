import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      enum: ["RAW_MATERIAL", "COMPONENT", "WORK_IN_PROGRESS", "FINISHED_GOOD"],
      required: true,
    },

    unitOfMeasure: {
      type: String,
      required: true,
    },

    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    marketplaceVisible: {
      type: Boolean,
      default: false,
    },

    marketplacePrice: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

export const Product = model("Product", productSchema);
