import UserService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

class AdminUserController {
    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const result = await this.userService.getAllUsers(page, limit, search);

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.data,
            pagination: result.pagination,
        });
    });

    getUserById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await this.userService.getUser(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    });

    updateUserRole = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { roleId } = req.body;

        if (!roleId) {
            throw new AppError("Role ID is required", 400);
        }

        const updatedUser = await this.userService.updateUserRole(id, roleId);
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUser,
        });
    });

    deleteUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const deleted = await this.userService.deleteUser(id);
        if (!deleted) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    });

    blastUsers = asyncHandler(async (req, res) => {
        const { userIds, subject, message } = req.body;
        const result = await this.userService.blastUsers({ userIds, subject, message });

        res.status(200).json({
            success: true,
            message: result.message,
        });
    });
}

export default AdminUserController;
