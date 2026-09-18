import { Request, Response } from "express";
import {
  registerOrganization as registerOrganizationService,
  loginUser as loginUserService,
} from "./auth.service";
import { User } from "../user/user.model";
import { Organization } from "../organization/organization.model";

export const registerOrganization = async (req: Request, res: Response) => {
  try {
    const result = await registerOrganizationService(req.body);

    return res.status(201).json({
      message: "Organization registered successfully",
      token: result.token,
      user: {
        id: result.user._id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
      },
      organization: result.organization,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService(email, password);

    return res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user._id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
      },
      organization: result.organization,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    console.log(req);

    const authUser = (req as any).user;

    const user = await User.findById(authUser.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const organization = await Organization.findById(authUser.tenantId);

    return res.status(200).json({
      user,
      organization,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
