import { Schema, model, Types } from "mongoose";

const poStatusHistorySchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    poId: {
      type: Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
      index: true,
    },

    fromStatus: {
      type: String,
      required: true,
    },

    toStatus: {
      type: String,
      required: true,
    },

    changedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const POStatusHistory = model("POStatusHistory", poStatusHistorySchema);
