import { Request, Response } from "express";
import { PurchaseRequisition } from "./pr.model";
import { Approval } from "./approval.model";

export const approvePurchaseRequisition = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const { comments } = req.body;

    const pr = await PurchaseRequisition.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    });

    if (!pr) {
      return res.status(404).json({
        message: "Purchase requisition not found",
      });
    }

    if (pr.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        message: "Purchase requisition is not awaiting approval",
      });
    }

    const approval = await Approval.create({
      tenantId: user.tenantId,
      entityType: "PURCHASE_REQUISITION",
      entityId: pr._id,
      requestedBy: pr.requestedBy,
      approverId: user.userId,
      decision: "APPROVED",
      comments,
      decidedAt: new Date(),
    });

    pr.status = "APPROVED";

    await pr.save();

    return res.status(200).json({
      message: "Purchase requisition approved",
      approval,
      pr,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectPurchaseRequisition = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const { comments } = req.body;

    const pr = await PurchaseRequisition.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    });

    if (!pr) {
      return res.status(404).json({
        message: "Purchase requisition not found",
      });
    }

    if (pr.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        message: "Purchase requisition is not awaiting approval",
      });
    }

    const approval = await Approval.create({
      tenantId: user.tenantId,
      entityType: "PURCHASE_REQUISITION",
      entityId: pr._id,
      requestedBy: pr.requestedBy,
      approverId: user.userId,
      decision: "REJECTED",
      comments,
      decidedAt: new Date(),
    });

    pr.status = "REJECTED";

    await pr.save();

    return res.status(200).json({
      message: "Purchase requisition rejected",
      approval,
      pr,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
