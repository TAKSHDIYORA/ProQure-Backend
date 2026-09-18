import { Schema, model, Types } from "mongoose";

const connectionSchema = new Schema(
  {
    requesterOrganizationId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    receiverOrganizationId: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    requestedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    respondedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "BLOCKED"],
      default: "PENDING",
    },

    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

connectionSchema.index(
  {
    requesterOrganizationId: 1,
    receiverOrganizationId: 1,
  },
  {
    unique: true,
  },
);

export const Connection = model("Connection", connectionSchema);
