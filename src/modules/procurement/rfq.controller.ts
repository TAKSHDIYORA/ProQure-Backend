import { Request, Response } from "express";

import { RFQ } from "./rfq.model";
import { PurchaseRequisition } from "./pr.model";
import { Connection } from "../connection/connection.model";
import { generateDocumentNumber } from "../../utils/generateDocumentNumber";

export const createRFQ = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { prId, deliveryLocation, closingDate, terms } = req.body;

    const pr = await PurchaseRequisition.findOne({
      _id: prId,
      tenantId: user.tenantId,
    });

    if (!pr) {
      return res.status(404).json({
        message: "Purchase requisition not found",
      });
    }

    if (pr.status !== "APPROVED") {
      return res.status(400).json({
        message: "Only approved purchase requisitions can create an RFQ",
      });
    }

    const rfq = await RFQ.create({
      tenantId: user.tenantId,

      rfqNumber: generateDocumentNumber("RFQ"),

      prId: pr._id,

      title: pr.title,

      items: pr.items,

      deliveryLocation,

      closingDate,

      terms,

      createdBy: user.userId,

      status: "DRAFT",
    });

    return res.status(201).json({
      message: "RFQ created successfully",
      rfq,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const inviteSupplier = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { supplierOrganizationId } = req.body;

    const rfq = await RFQ.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.status !== "DRAFT" && rfq.status !== "OPEN") {
      return res.status(400).json({
        message: "Supplier cannot be invited at this stage",
      });
    }

    const connection = await Connection.findOne({
      $or: [
        {
          requesterOrganizationId: user.tenantId,

          receiverOrganizationId: supplierOrganizationId,
        },
        {
          requesterOrganizationId: supplierOrganizationId,

          receiverOrganizationId: user.tenantId,
        },
      ],

      status: "ACCEPTED",
    });

    if (!connection) {
      return res.status(403).json({
        message: "You can only invite connected organizations",
      });
    }

    const alreadyInvited = rfq.invitedSuppliers.some(
      (id) => id.toString() === supplierOrganizationId,
    );

    if (alreadyInvited) {
      return res.status(409).json({
        message: "Supplier already invited",
      });
    }

    rfq.invitedSuppliers.push(supplierOrganizationId);

    await rfq.save();

    return res.status(200).json({
      message: "Supplier invited successfully",
      rfq,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const openRFQ = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const rfq = await RFQ.findOne({
      _id: req.params.id,
      tenantId: user.tenantId,
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.status !== "DRAFT") {
      return res.status(400).json({
        message: "Only draft RFQs can be opened",
      });
    }

    if (rfq.invitedSuppliers.length === 0) {
      return res.status(400).json({
        message: "Invite at least one supplier before opening the RFQ",
      });
    }

    if (new Date(rfq.closingDate) <= new Date()) {
      return res.status(400).json({
        message: "Closing date must be in the future",
      });
    }

    rfq.status = "OPEN";

    await rfq.save();

    return res.status(200).json({
      message: "RFQ opened successfully",
      rfq,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyRFQs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const rfqs = await RFQ.find({
      tenantId: user.tenantId,
    })
      .populate("prId", "prNumber title status")
      .populate("items.productId", "sku name unitOfMeasure")
      .populate("invitedSuppliers", "name capabilities")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: rfqs.length,
      rfqs,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
