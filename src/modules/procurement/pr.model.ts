import { Schema, model, Types } from "mongoose";

const prItemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedUnitPrice: {
      type: Number,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const purchaseRequisitionSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    prNumber: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    requestedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [prItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Purchase requisition must contain at least one item",
      },
    },

    justification: {
      type: String,
      required: true,
    },

    requiredDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "CANCELLED"],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  },
);

purchaseRequisitionSchema.index(
  {
    tenantId: 1,
    prNumber: 1,
  },
  {
    unique: true,
  },
);

export const PurchaseRequisition = model(
  "PurchaseRequisition",
  purchaseRequisitionSchema,
);
