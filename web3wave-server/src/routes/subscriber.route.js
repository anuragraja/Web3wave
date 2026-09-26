import express from "express";
import SubscriberController from "../controllers/subscriber.controller.js";

const router = express.Router();
const controller = new SubscriberController();

router.post("/", controller.subscribe);
router.post("/subscribe", controller.subscribe);

export default router;
