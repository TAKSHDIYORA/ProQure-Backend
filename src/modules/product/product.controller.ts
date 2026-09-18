import { Request, Response } from "express";
import { Product } from "./product.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const {
      sku,
      name,
      description,
      category,
      productType,
      unitOfMeasure,
      minimumOrderQuantity,
      marketplaceVisible,
      marketplacePrice,
    } = req.body;

    const existingProduct = await Product.findOne({
      tenantId: user.tenantId,
      sku,
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "SKU already exists in your organization",
      });
    }

    const product = await Product.create({
      tenantId: user.tenantId,
      sku,
      name,
      description,
      category,
      productType,
      unitOfMeasure,
      minimumOrderQuantity,
      marketplaceVisible,
      marketplacePrice,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const products = await Product.find({
      tenantId: user.tenantId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (
    req: Request,
    res: Response
) => {
    try {
        const user = (req as any).user;

        const {
            name,
            description,
            category,
            productType,
            unitOfMeasure,
            minimumOrderQuantity,
            marketplaceVisible,
            marketplacePrice,
        } = req.body;

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                tenantId: user.tenantId,
            },
            {
                name,
                description,
                category,
                productType,
                unitOfMeasure,
                minimumOrderQuantity,
                marketplaceVisible,
                marketplacePrice,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


export const deleteProduct = async (
    req: Request,
    res: Response
) => {
    try {
        const user = (req as any).user;

        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            tenantId: user.tenantId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};