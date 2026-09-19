import { Request, Response } from "express";
import { PurchaseOrder } from "./po.model";
import { POStatusHistory } from "./po-status-history.model";
import { Quotation } from "./quotation.model";
import { RFQ } from "./rfq.model";
import { allowedPOTransitions } from "./po-status";
import { generateDocumentNumber } from "../../utils/generateDocumentNumber";
import { canChangePOStatus } from "./po-permissions";

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { quotationId, paymentTerms, shippingTerms, expectedDeliveryDate } =
      req.body;

    const quotation = await Quotation.findOne({
      _id: quotationId,
      buyerTenantId: user.tenantId,
      status: "ACCEPTED",
    });

    if (!quotation) {
      return res.status(404).json({
        message: "Accepted quotation not found",
      });
    }

    const rfq = await RFQ.findOne({
      _id: quotation.rfqId,
      tenantId: user.tenantId,
      status: "AWARDED",
    });

    if (!rfq) {
      return res.status(400).json({
        message: "RFQ is not in awarded state",
      });
    }

    const existingPO = await PurchaseOrder.findOne({
      quotationId: quotation._id,
    });

    if (existingPO) {
      return res.status(409).json({
        message: "A purchase order already exists for this quotation",
      });
    }

    let subtotal = 0;
    let taxAmount = 0;

    const items = quotation.items.map((item: any) => {
      const itemSubtotal = item.offeredQuantity * item.unitPrice;

      const itemTax = itemSubtotal * (item.taxRate / 100);

      const total = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      taxAmount += itemTax;

      return {
        productId: item.productId,
        quantity: item.offeredQuantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        total,
      };
    });

    const totalAmount = subtotal + taxAmount;

    const po = await PurchaseOrder.create({
      tenantId: user.tenantId,

      poNumber: generateDocumentNumber("PO"),

      quotationId: quotation._id,

      rfqId: quotation.rfqId,

      supplierTenantId: quotation.supplierTenantId,

      items,

      subtotal,
      taxAmount,
      totalAmount,

      paymentTerms,
      shippingTerms,
      expectedDeliveryDate,

      status: "ISSUED",

      createdBy: user.userId,
    });

    await POStatusHistory.create({
      tenantId: user.tenantId,
      poId: po._id,
      fromStatus: "NONE",
      toStatus: "ISSUED",
      changedBy: user.userId,
      comments: "Purchase order created",
    });

    return res.status(201).json({
      message: "Purchase order created successfully",
      po,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const purchaseOrders = await PurchaseOrder.find({
      tenantId: user.tenantId,
    })
      .populate("supplierTenantId", "name capabilities")
      .populate("items.productId", "sku name unitOfMeasure")
      .populate("quotationId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: purchaseOrders.length,
      purchaseOrders,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSupplierPurchaseOrders = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const purchaseOrders = await PurchaseOrder.find({
      supplierTenantId: user.tenantId,
    })
      .populate("tenantId", "name capabilities")
      .populate("items.productId", "sku name unitOfMeasure")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: purchaseOrders.length,
      purchaseOrders,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePurchaseOrderStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    const { status, comments } = req.body;

    const po = await PurchaseOrder.findOne({
      _id: req.params.id,
      $or: [
        {
          tenantId: user.tenantId,
        },
        {
          supplierTenantId: user.tenantId,
        },
      ],
    });

    if (!po) {
      return res.status(404).json({
        message: "Purchase order not found",
      });
    }

    const isBuyer = po.tenantId.toString() === user.tenantId;

    if (!canChangePOStatus(po.status, status, isBuyer)) {
      return res.status(403).json({
        message: "You are not allowed to perform this status transition",
      });
    }

    const allowedTransitions = allowedPOTransitions[po.status] || [];

    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition: ${po.status} → ${status}`,
      });
    }

    const oldStatus = po.status;

    po.status = status;

    await po.save();

    await POStatusHistory.create({
      tenantId: po.tenantId,

      poId: po._id,

      fromStatus: oldStatus,

      toStatus: status,

      changedBy: user.userId,

      comments,
    });

    return res.status(200).json({
      message: "Purchase order status updated",
      po,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
