import { Request, Response } from "express";
import { PurchaseRequisition } from "./pr.model";
import { Product } from "../product/product.model";
import { generateDocumentNumber } from "../../utils/generateDocumentNumber";

export const createPurchaseRequisition = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const { title, items, justification, requiredDate } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    const productIds = items.map((item: any) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      tenantId: user.tenantId,
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products do not belong to your organization",
      });
    }

    const pr = await PurchaseRequisition.create({
      tenantId: user.tenantId,
      prNumber: generateDocumentNumber("PR"),
      title,
      requestedBy: user.userId,
      items,
      justification,
      requiredDate,
      status: "PENDING_APPROVAL",
    });

    return res.status(201).json({
      message: "Purchase requisition created successfully",
      pr,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPurchaseRequisitions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const prs = await PurchaseRequisition.find({
      tenantId: user.tenantId,
    })
      .populate("requestedBy", "fullName email role")
      .populate("items.productId", "sku name category unitOfMeasure")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: prs.length,
      prs,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPurchaseRequisitionById = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const pr = await PurchaseRequisition.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    })
      .populate("requestedBy", "fullName email role")
      .populate("items.productId", "sku name category unitOfMeasure");

    if (!pr) {
      return res.status(404).json({
        message: "Purchase requisition not found",
      });
    }

    return res.status(200).json({
      pr,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const submitPurchaseRequisition = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const pr = await PurchaseRequisition.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    });

    if (!pr) {
      return res.status(404).json({
        message: "Purchase requisition not found",
      });
    }

    if (pr.status !== "DRAFT") {
      return res.status(400).json({
        message: "Only draft requisitions can be submitted",
      });
    }

    pr.status = "PENDING_APPROVAL";

    await pr.save();

    return res.status(200).json({
      message: "Purchase requisition submitted for approval",
      pr,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
