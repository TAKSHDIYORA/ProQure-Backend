import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "./user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      tenantId: currentUser.tenantId,
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const users = await User.find({
      tenantId: currentUser.tenantId,
    }).select("-password");

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const user = await User.findOne({
      _id: req.params.id,
      tenantId: currentUser.tenantId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const { fullName, role } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: currentUser.tenantId,
      },
      {
        fullName,
        role,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const { isActive } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: currentUser.tenantId,
      },
      {
        isActive,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
