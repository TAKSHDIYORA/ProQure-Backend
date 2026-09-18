import { Schema, model, Types } from "mongoose";

const approvalSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ["PURCHASE_REQUISITION"],
      required: true,
    },

    entityId: {
      type: Types.ObjectId,
      required: true,
    },

    requestedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    approverId: {
      type: Types.ObjectId,
      ref: "User",
    },

    decision: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    comments: {
      type: String,
    },

    decidedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Approval = model("Approval", approvalSchema);
