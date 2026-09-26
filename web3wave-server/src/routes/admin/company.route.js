import express from "express";
import AdminCompanyController from "../../controllers/adminCompany.controller.js";

const router = express.Router();
const controller = new AdminCompanyController();

router.get("/", controller.getAllCompanies);

export default router;
