import { Request, Response } from "express";
import { Organization } from "../organization/organization.model";
import { Product } from "../product/product.model";

export const searchOrganizations = async (req: Request, res: Response) => {
  try {
    const { search, capability } = req.query;

    const filter: any = {
      marketplaceVisible: true,
    };

    if (capability) {
      filter.capabilities = capability;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const organizations = await Organization.find(filter)
      .select(
        "name capabilities description email phone address marketplaceVisible",
      )
      .limit(50);

    return res.status(200).json({
      count: organizations.length,
      organizations,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrganizationProfile = async (req: Request, res: Response) => {
  try {
    const organization = await Organization.findOne({
      _id: req.params.id,
      marketplaceVisible: true,
    }).select(
      "name capabilities description email phone address marketplaceVisible createdAt",
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found or not publicly visible",
      });
    }

    const products = await Product.find({
      tenantId: organization._id,
      marketplaceVisible: true,
    }).select(
      "sku name description category productType unitOfMeasure minimumOrderQuantity marketplacePrice",
    );

    return res.status(200).json({
      organization,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
