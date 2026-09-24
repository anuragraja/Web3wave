import express from "express";
import healthController from "../controllers/health.controller.js";

const router = express.Router();

// GET /health or GET /api/health
router.get("/", healthController.getHealth);

// GET /health/deep or GET /api/health/deep
router.get("/deep", healthController.getDeepHealth);

export default router;
