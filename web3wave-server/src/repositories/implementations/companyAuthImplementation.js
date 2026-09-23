import mongoose from "mongoose";
import CompanyRepository from "../contracts/ICompanyAuthRepo.js";
import Company from "../../models/company.model.js";
import { AppError } from "../../utils/appError.js";
import { paginateAggregation } from "../../utils/pagination.js";

class MongoCompanyRepository extends CompanyRepository {
    async createCompany(companyData) {
        try {
            const company = await Company.create(companyData);

            const result = await Company.aggregate([
                {
                    $match: {
                        _id: company._id,
                    },
                },
                {
                    $project: {
                        password: 0,
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
            ]);

            return result[0] || null;
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError("Company email already exists", 409);
            }

            throw new AppError("Failed to create company", 500);
        }
    }

    async findCompanyById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError("Invalid company ID", 400);
            }

            const result = await Company.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    },
                },
                {
                    $project: {
                        password: 0,
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            return result[0] || null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("Failed to find company", 500);
        }
    }

    async findCompanyByEmail(email) {
        try {
            const normalizedEmail = email.trim().toLowerCase();

            const result = await Company.aggregate([
                {
                    $match: {
                        email: normalizedEmail,
                    },
                },
                {
                    $project: {
                        password: 0,
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            return result[0] || null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("Failed to find company", 500);
        }
    }

    async findCompanyByEmailWithPassword(email) {
        try {
            const normalizedEmail = email.trim().toLowerCase();

            const result = await Company.aggregate([
                {
                    $match: {
                        email: normalizedEmail,
                    },
                },
                {
                    $project: {
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            return result[0] || null;
        } catch (error) {
            throw new AppError(
                "Failed to find company for authentication",
                500
            );
        }
    }

    async updateCompany(id, companyData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError("Invalid company ID", 400);
            }

            const allowedFields = [
                "companyName",
                "email",
                "phone",
                "isVerified",
                "resetPasswordToken",
                "resetPasswordExpires",
            ];

            const updateData = {};

            for (const field of allowedFields) {
                if (companyData[field] !== undefined) {
                    updateData[field] = companyData[field];
                }
            }

            const updatedCompany = await Company.findByIdAndUpdate(
                id,
                {
                    $set: updateData,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select(
                "-password -resetPasswordToken -resetPasswordExpires"
            );

            if (!updatedCompany) {
                return null;
            }

            return updatedCompany;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error.code === 11000) {
                throw new AppError("Company email already exists", 409);
            }

            throw new AppError("Failed to update company", 500);
        }
    }

    async updateCompanyPassword(id, hashedPassword) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError("Invalid company ID", 400);
            }

            const updatedCompany = await Company.findByIdAndUpdate(
                id,
                {
                    $set: { password: hashedPassword },
                },
                {
                    new: true,
                }
            ).select("-password -resetPasswordToken -resetPasswordExpires");

            return updatedCompany || null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Failed to update company password", 500);
        }
    }

    async deleteCompany(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError("Invalid company ID", 400);
            }

            const deletedCompany = await Company.findByIdAndDelete(id).select(
                "-password -resetPasswordToken -resetPasswordExpires"
            );

            return deletedCompany || null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("Failed to delete company", 500);
        }
    }

    async findCompanyByResetToken(resetPasswordToken) {
        try {
            const result = await Company.aggregate([
                {
                    $match: {
                        resetPasswordToken,
                        resetPasswordExpires: {
                            $gt: new Date(),
                        },
                    },
                },
                {
                    $project: {
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            return result[0] || null;
        } catch (error) {
            throw new AppError(
                "Failed to find company by reset token",
                500
            );
        }
    }

    async findAllCompanies(filter = {}, options = {}) {
        try {
            const pipeline = [
                {
                    $match: filter,
                },
                {
                    $project: {
                        password: 0,
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ];

            return await paginateAggregation(
                Company,
                pipeline,
                options
            );
        } catch (error) {
            throw new AppError("Failed to fetch companies", 500);
        }
    }

    async findCompanyByVerificationToken(id, tokenHash) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError("Invalid company ID", 400);
            }

            const result = await Company.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                        verifyTokenHash: tokenHash,
                        verifyTokenExpiry: {
                            $gt: new Date(),
                        },
                    },
                },
                {
                    $project: {
                        password: 0,
                        resetPasswordToken: 0,
                        resetPasswordExpires: 0,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            return result[0] || null;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                "Failed to verify company email",
                500
            );
        }
    }
}

export default MongoCompanyRepository;