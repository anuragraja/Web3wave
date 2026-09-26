import express from "express";
import EventController from "../../controllers/event.controller.js";
import {
    createEventValidator,
    updateEventValidator,
} from "../../middlewares/validators/event.validator.js";

const router = express.Router();
const controller = new EventController();

router.post("/", createEventValidator, controller.createEvent);
router.get("/", controller.getAdminEvents);
router.get("/:id", controller.getEventById);
router.patch("/:id", updateEventValidator, controller.updateEvent);
router.delete("/:id", controller.deleteEvent);
router.patch("/:id/publish", controller.publishEvent);
router.patch("/:id/unpublish", controller.unpublishEvent);

export default router;
