import { Schema, model, Types } from "mongoose";

const quotationItemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },

    offeredQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const quotationSchema = new Schema(
  {
    rfqId: {
      type: Types.ObjectId,
      ref: "RFQ",
      required: true,
      index: true,
    },

    buyerTenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    supplierTenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    supplierUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [quotationItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    leadTimeDays: {
      type: Number,
      required: true,
      min: 0,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED"],
      default: "SUBMITTED",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

quotationSchema.index(
  {
    rfqId: 1,
    supplierTenantId: 1,
  },
  {
    unique: true,
  },
);

export const Quotation = model("Quotation", quotationSchema);
