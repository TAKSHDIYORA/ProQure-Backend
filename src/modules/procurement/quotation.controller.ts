import { Request, Response } from "express";

import { RFQ } from "./rfq.model";
import { Quotation } from "./quotation.model";

export const submitQuotation = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const rfq = await RFQ.findOne({
      _id: req.params.rfqId,
      status: "OPEN",
    });

    if (!rfq) {
      return res.status(404).json({
        message: "Open RFQ not found",
      });
    }

    const isInvited = rfq.invitedSuppliers.some(
      (id) => id.toString() === user.tenantId,
    );

    if (!isInvited) {
      return res.status(403).json({
        message: "Your organization was not invited to this RFQ",
      });
    }

    if (new Date() > new Date(rfq.closingDate)) {
      return res.status(400).json({
        message: "RFQ submission deadline has passed",
      });
    }

    const { items, leadTimeDays, validUntil } = req.body;

    const totalAmount = items.reduce(
      (total: number, item: any) =>
        total +
        item.offeredQuantity * item.unitPrice * (1 + item.taxRate / 100),
      0,
    );

    const quotation = await Quotation.create({
      rfqId: rfq._id,

      buyerTenantId: rfq.tenantId,

      supplierTenantId: user.tenantId,

      supplierUserId: user.userId,

      items,

      totalAmount,

      leadTimeDays,

      validUntil,

      status: "SUBMITTED",
    });

    return res.status(201).json({
      message: "Quotation submitted successfully",
      quotation,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getRFQQuotations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const quotations = await Quotation.find({
      rfqId: req.params.rfqId,
      buyerTenantId: user.tenantId,
    })
      .populate("supplierTenantId", "name capabilities")
      .populate("supplierUserId", "fullName email")
      .populate("items.productId", "sku name unitOfMeasure")
      .sort({
        totalAmount: 1,
      });

    return res.status(200).json({
      count: quotations.length,
      quotations,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const awardQuotation = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const quotation = await Quotation.findOne({
      _id: req.params.quotationId,
      buyerTenantId: user.tenantId,
    });

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    if (quotation.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Quotation cannot be awarded",
      });
    }

    const rfq = await RFQ.findOne({
      _id: quotation.rfqId,
      tenantId: user.tenantId,
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.status !== "OPEN") {
      return res.status(400).json({
        message: "RFQ is not open",
      });
    }

    quotation.status = "ACCEPTED";

    await quotation.save();

    await Quotation.updateMany(
      {
        rfqId: rfq._id,
        _id: {
          $ne: quotation._id,
        },
        status: "SUBMITTED",
      },
      {
        $set: {
          status: "REJECTED",
        },
      },
    );

    rfq.status = "AWARDED";

    await rfq.save();

    return res.status(200).json({
      message: "Quotation awarded successfully",
      quotation,
      rfq,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
