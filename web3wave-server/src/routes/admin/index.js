import express from "express";
import { authenticateJWT } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

import dashboardRoutes from "./dashboard.route.js";
import eventRoutes from "./event.route.js";
import userRoutes from "./user.route.js";
import profileRoutes from "./profile.route.js";
import companyRoutes from "./company.route.js";

const router = express.Router();

// Apply authentication + ADMIN role authorization to ALL admin routes
router.use(authenticateJWT, authorize(ROLES.ADMIN));

router.use("/dashboard", dashboardRoutes);
router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/companies", companyRoutes);

export default router;
