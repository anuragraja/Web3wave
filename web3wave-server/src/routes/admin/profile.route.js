import express from "express";
import AdminProfileController from "../../controllers/adminProfile.controller.js";

const router = express.Router();
const controller = new AdminProfileController();

router.get("/", controller.getProfile);
router.patch("/update", controller.updateProfile);
router.delete("/delete", controller.deleteProfile);

export default router;
