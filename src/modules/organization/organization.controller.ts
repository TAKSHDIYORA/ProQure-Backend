import { Request, Response } from "express";
import { Organization } from "./organization.model";

export const getMyOrganization = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const organization = await Organization.findById(user.tenantId);

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      organization,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMyOrganization = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { name, description, phone, address, marketplaceVisible } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      user.tenantId,
      {
        name,
        description,
        phone,
        address,
        marketplaceVisible,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
