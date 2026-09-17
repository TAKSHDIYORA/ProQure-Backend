import bcrypt from "bcryptjs";
import { Organization } from "../organization/organization.model";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/generateToken";

interface RegisterData {
    organizationName: string;
    businessRegistrationCode: string;
    capabilities: string[];
    organizationEmail: string;
    fullName: string;
    email: string;
    password: string;
}

export const registerOrganization = async (
    data: RegisterData
) => {
    const existingOrganization = await Organization.findOne({
        $or: [
            { email: data.organizationEmail },
            {
                businessRegistrationCode:
                    data.businessRegistrationCode,
            },
        ],
    });

    if (existingOrganization) {
        throw new Error(
            "Organization already exists"
        );
    }

    const existingUser = await User.findOne({
        email: data.email,
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const organization = await Organization.create({
        name: data.organizationName,
        businessRegistrationCode:
            data.businessRegistrationCode,
        capabilities: data.capabilities,
        email: data.organizationEmail,
    });

    const hashedPassword = await bcrypt.hash(
        data.password,
        12
    );

    const user = await User.create({
        tenantId: organization._id,
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        role: "ADMIN",
    });

    const token = generateToken(
        user._id.toString(),
        organization._id.toString(),
        user.role
    );

    return {
        token,
        user,
        organization,
    };
};

export const loginUser = async (
    email: string,
    password: string
) => {
    const user = await User.findOne({
        email,
    }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
        throw new Error("User account is inactive");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(
        user._id.toString(),
        user.tenantId.toString(),
        user.role
    );

    const organization =
        await Organization.findById(user.tenantId);

    return {
        token,
        user,
        organization,
    };
};