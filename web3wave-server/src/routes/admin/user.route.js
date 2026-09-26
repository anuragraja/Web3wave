import express from "express";
import AdminUserController from "../../controllers/adminUser.controller.js";

const router = express.Router();
const controller = new AdminUserController();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.patch("/:id/role", controller.updateUserRole);
router.delete("/:id", controller.deleteUser);
router.post("/blast", controller.blastUsers);

export default router;
