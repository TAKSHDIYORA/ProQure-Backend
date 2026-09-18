import { Request, Response } from "express";
import { Connection } from "./connection.model";
import { Organization } from "../organization/organization.model";

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const receiverOrganizationId = req.params.organizationId;

    if (user.tenantId === receiverOrganizationId) {
      return res.status(400).json({
        message: "You cannot connect with your own organization",
      });
    }

    const receiver = await Organization.findOne({
      _id: receiverOrganizationId,
      marketplaceVisible: true,
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const existingConnection = await Connection.findOne({
      requesterOrganizationId: user.tenantId,
      receiverOrganizationId,
    });

    if (existingConnection) {
      return res.status(409).json({
        message: "Connection already exists",
      });
    }

    const connection = await Connection.create({
      requesterOrganizationId: user.tenantId,
      receiverOrganizationId,
      requestedBy: user.userId,
    });

    return res.status(201).json({
      message: "Connection request sent",
      connection,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const acceptConnectionRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const connection = await Connection.findOne({
      _id: req.params.id,
      receiverOrganizationId: user.tenantId,
      status: "PENDING",
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connection.status = "ACCEPTED";
    connection.respondedBy = user.userId as any;
    connection.respondedAt = new Date();

    await connection.save();

    return res.status(200).json({
      message: "Connection request accepted",
      connection,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const connection = await Connection.findOne({
      _id: req.params.id,
      receiverOrganizationId: user.tenantId,
      status: "PENDING",
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connection.status = "REJECTED";
    connection.respondedBy = user.userId as any;
    connection.respondedAt = new Date();

    await connection.save();

    return res.status(200).json({
      message: "Connection request rejected",
      connection,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyConnections = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const connections = await Connection.find({
      $or: [
        {
          requesterOrganizationId: user.tenantId,
        },
        {
          receiverOrganizationId: user.tenantId,
        },
      ],
    })
      .populate("requesterOrganizationId", "name capabilities")
      .populate("receiverOrganizationId", "name capabilities")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: connections.length,
      connections,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
