import express from "express";
import EventController from "../controllers/event.controller.js";

const router = express.Router();
const controller = new EventController();

router.get("/", controller.getPublicEvents);
router.get("/:slugOrId", controller.getPublicEventBySlugOrId);
router.post("/:id/register", controller.registerForEvent);
router.get("/:id/registration-status", controller.getRegistrationStatus);

export default router;
