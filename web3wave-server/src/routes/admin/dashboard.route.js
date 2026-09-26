import express from "express";
import DashboardController from "../../controllers/dashboard.controller.js";

const router = express.Router();
const controller = new DashboardController();

router.get("/", controller.getOverview);

export default router;
