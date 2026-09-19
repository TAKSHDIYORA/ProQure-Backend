import { Schema, model, Types } from "mongoose";

const purchaseOrderItemSchema = new Schema(
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

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const purchaseOrderSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    poNumber: {
      type: String,
      required: true,
    },

    quotationId: {
      type: Types.ObjectId,
      ref: "Quotation",
      required: true,
    },

    rfqId: {
      type: Types.ObjectId,
      ref: "RFQ",
      required: true,
    },

    supplierTenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    items: {
      type: [purchaseOrderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Purchase order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentTerms: {
      type: String,
    },

    shippingTerms: {
      type: String,
    },

    expectedDeliveryDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "ISSUED",
        "ACKNOWLEDGED",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ISSUED",
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

purchaseOrderSchema.index(
  {
    tenantId: 1,
    poNumber: 1,
  },
  {
    unique: true,
  },
);

export const PurchaseOrder = model("PurchaseOrder", purchaseOrderSchema);
