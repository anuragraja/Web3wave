import DashboardService from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class DashboardController {
    constructor() {
        this.dashboardService = new DashboardService();
    }

    getOverview = asyncHandler(async (req, res) => {
        const data = await this.dashboardService.getDashboardOverview();
        res.status(200).json({
            success: true,
            message: "Dashboard overview fetched successfully",
            data,
        });
    });
}

export default DashboardController;
