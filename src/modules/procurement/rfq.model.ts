import { Schema, model, Types } from "mongoose";

const rfqItemSchema = new Schema(
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
  },
  {
    _id: false,
  },
);

const rfqSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    rfqNumber: {
      type: String,
      required: true,
    },

    prId: {
      type: Types.ObjectId,
      ref: "PurchaseRequisition",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    items: {
      type: [rfqItemSchema],
      required: true,
    },

    invitedSuppliers: [
      {
        type: Types.ObjectId,
        ref: "Organization",
      },
    ],

    deliveryLocation: {
      type: String,
      required: true,
    },

    closingDate: {
      type: Date,
      required: true,
    },

    terms: {
      type: String,
    },

    status: {
      type: String,
      enum: ["DRAFT", "OPEN", "CLOSED", "AWARDED", "CANCELLED"],
      default: "DRAFT",
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

rfqSchema.index(
  {
    tenantId: 1,
    rfqNumber: 1,
  },
  {
    unique: true,
  },
);

export const RFQ = model("RFQ", rfqSchema);
