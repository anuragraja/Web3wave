import EventService from "../services/event.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class EventController {
    constructor() {
        this.eventService = new EventService();
    }

    createEvent = asyncHandler(async (req, res) => {
        const event = await this.eventService.createEvent(req.body, req.userId);
        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event,
        });
    });

    getAdminEvents = asyncHandler(async (req, res) => {
        const result = await this.eventService.getAdminEvents(req.query);
        res.status(200).json({
            success: true,
            message: "Admin events fetched successfully",
            data: result.data,
            pagination: result.pagination,
        });
    });

    getPublicEvents = asyncHandler(async (req, res) => {
        const result = await this.eventService.getPublicEvents(req.query);
        res.status(200).json({
            success: true,
            message: "Public events fetched successfully",
            data: result.data,
            pagination: result.pagination,
        });
    });

    getEventById = asyncHandler(async (req, res) => {
        const event = await this.eventService.getEventById(req.params.id);
        res.status(200).json({
            success: true,
            data: event,
        });
    });

    getPublicEventBySlugOrId = asyncHandler(async (req, res) => {
        const event = await this.eventService.getPublicEventBySlugOrId(req.params.slugOrId);
        res.status(200).json({
            success: true,
            data: event,
        });
    });

    updateEvent = asyncHandler(async (req, res) => {
        const event = await this.eventService.updateEvent(req.params.id, req.body, req.userId);
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event,
        });
    });

    deleteEvent = asyncHandler(async (req, res) => {
        const result = await this.eventService.deleteEvent(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    });

    publishEvent = asyncHandler(async (req, res) => {
        const event = await this.eventService.publishEvent(req.params.id, req.userId);
        res.status(200).json({
            success: true,
            message: "Event published successfully",
            data: event,
        });
    });

    unpublishEvent = asyncHandler(async (req, res) => {
        const event = await this.eventService.unpublishEvent(req.params.id, req.userId);
        res.status(200).json({
            success: true,
            message: "Event unpublished successfully",
            data: event,
        });
    });

    registerForEvent = asyncHandler(async (req, res) => {
        const eventId = req.params.id;
        const result = await this.eventService.registerForEvent(eventId, req.body, req.userId);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.registration,
            remainingSeats: result.remainingSeats,
        });
    });

    getRegistrationStatus = asyncHandler(async (req, res) => {
        const eventId = req.params.id;
        const email = req.query.email;
        const statusInfo = await this.eventService.getRegistrationStatus(eventId, email);
        res.status(200).json({
            success: true,
            data: statusInfo,
        });
    });
}

export default EventController;
