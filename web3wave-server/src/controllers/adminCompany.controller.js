import CompanyAuthService from "../services/company.auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AdminCompanyController {
    constructor() {
        this.companyAuthService = new CompanyAuthService();
    }

    getAllCompanies = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const result = await this.companyAuthService.getAllCompanies(page, limit, search);

        res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: result.data,
            pagination: result.pagination,
        });
    });
}

export default AdminCompanyController;
