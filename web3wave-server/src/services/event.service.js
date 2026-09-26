import MongoEventRepository from "../repositories/implementations/eventImplementation.js";
import Subscriber from "../models/subscriber.model.js";
import EventRegistration from "../models/eventRegistration.model.js";
import { AppError } from "../utils/appError.js";
import { slugify } from "../utils/slugify.js";
import { EVENT_CATEGORIES, EVENT_STATUS } from "../constants/events.js";
import { sendEventNotificationEmail } from "./sendMailService/sendEventNotificationEmail.js";
import logger from "../utils/logger.js";
import crypto from "crypto";

class EventService {
    constructor() {
        this.eventRepository = new MongoEventRepository();
    }

    async generateUniqueSlug(title, currentEventId = null) {
        let baseSlug = slugify(title);
        if (!baseSlug) {
            baseSlug = "event-" + crypto.randomBytes(4).toString("hex");
        }

        let slug = baseSlug;
        let count = 0;

        while (true) {
            const existing = await this.eventRepository.findEventBySlug(slug);
            if (!existing || (currentEventId && existing._id.toString() === currentEventId.toString())) {
                return slug;
            }
            count++;
            slug = `${baseSlug}-${count}`;
        }
    }

    async notifySubscribersAboutEvent(event) {
        try {
            const subscribers = await Subscriber.find({ isSubscribed: true }).lean();
            if (!subscribers || subscribers.length === 0) {
                logger.info("No active subscribers found for event notification.");
                return;
            }
            logger.info(`Sending event notification for "${event.title}" to ${subscribers.length} subscribers...`);
            for (const sub of subscribers) {
                sendEventNotificationEmail({ to: sub.email, event }).catch((err) => {
                    logger.error(`Error sending email to ${sub.email}:`, err);
                });
            }
        } catch (err) {
            logger.error("Error notifying subscribers:", err);
        }
    }

    async createEvent(eventData, userId) {
        if (!userId) {
            throw new AppError("Created by user ID is required", 400);
        }

        const category = eventData.category ? eventData.category.toUpperCase() : null;
        if (!category || !Object.values(EVENT_CATEGORIES).includes(category)) {
            throw new AppError(
                `Invalid category. Must be one of: ${Object.values(EVENT_CATEGORIES).join(", ")}`,
                400
            );
        }

        let status = EVENT_STATUS.DRAFT;
        if (eventData.status) {
            const requestedStatus = eventData.status.toUpperCase();
            if (Object.values(EVENT_STATUS).includes(requestedStatus)) {
                status = requestedStatus;
            } else {
                throw new AppError(
                    `Invalid status. Must be one of: ${Object.values(EVENT_STATUS).join(", ")}`,
                    400
                );
            }
        }

        const slug = await this.generateUniqueSlug(eventData.title);

        const payload = {
            ...eventData,
            category,
            status,
            slug,
            createdBy: userId,
            updatedBy: userId,
        };

        const created = await this.eventRepository.createEvent(payload);

        if (created && created.status === EVENT_STATUS.PUBLISHED) {
            this.notifySubscribersAboutEvent(created);
        }

        return created;
    }

    async getAdminEvents(queryParams = {}) {
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const { category, status, search } = queryParams;

        return await this.eventRepository.findAllAdminEvents({
            page,
            limit,
            category,
            status,
            search,
        });
    }

    async getPublicEvents(queryParams = {}) {
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const { category, search } = queryParams;

        return await this.eventRepository.findAllPublicEvents({
            page,
            limit,
            category,
            search,
        });
    }

    async getEventById(id) {
        const event = await this.eventRepository.findEventById(id);
        if (!event) {
            throw new AppError("Event not found", 404);
        }
        return event;
    }

    async getPublicEventBySlugOrId(slugOrId) {
        let event = null;
        if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            event = await this.eventRepository.findEventById(slugOrId);
        }
        if (!event) {
            event = await this.eventRepository.findEventBySlug(slugOrId);
        }

        if (!event || event.status !== EVENT_STATUS.PUBLISHED) {
            throw new AppError("Event not found", 404);
        }

        return event;
    }

    async updateEvent(id, updateData, userId) {
        const existing = await this.eventRepository.findEventById(id);
        if (!existing) {
            throw new AppError("Event not found", 404);
        }

        const payload = { ...updateData };

        if (payload.category) {
            const category = payload.category.toUpperCase();
            if (!Object.values(EVENT_CATEGORIES).includes(category)) {
                throw new AppError(
                    `Invalid category. Must be one of: ${Object.values(EVENT_CATEGORIES).join(", ")}`,
                    400
                );
            }
            payload.category = category;
        }

        if (payload.status) {
            const status = payload.status.toUpperCase();
            if (!Object.values(EVENT_STATUS).includes(status)) {
                throw new AppError(
                    `Invalid status. Must be one of: ${Object.values(EVENT_STATUS).join(", ")}`,
                    400
                );
            }
            payload.status = status;
        }

        if (payload.title && payload.title !== existing.title) {
            payload.slug = await this.generateUniqueSlug(payload.title, id);
        }

        if (payload.capacity !== undefined && payload.capacity < 1) {
            throw new AppError("Capacity must be at least 1", 400);
        }

        if (userId) {
            payload.updatedBy = userId;
        }

        const isStatusTransitionToPublished =
            existing.status !== EVENT_STATUS.PUBLISHED && payload.status === EVENT_STATUS.PUBLISHED;

        const updated = await this.eventRepository.updateEvent(id, payload);

        if (updated && isStatusTransitionToPublished) {
            this.notifySubscribersAboutEvent(updated);
        }

        return updated;
    }

    async deleteEvent(id) {
        const existing = await this.eventRepository.findEventById(id);
        if (!existing) {
            throw new AppError("Event not found", 404);
        }
        await this.eventRepository.deleteEvent(id);
        return { message: "Event deleted successfully" };
    }

    async publishEvent(id, userId) {
        return await this.updateEvent(id, { status: EVENT_STATUS.PUBLISHED }, userId);
    }

    async unpublishEvent(id, userId) {
        return await this.updateEvent(id, { status: EVENT_STATUS.DRAFT }, userId);
    }

    async registerForEvent(eventId, registrationData, userId = null) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) {
            throw new AppError("Event not found", 404);
        }

        if (event.status !== EVENT_STATUS.PUBLISHED) {
            throw new AppError("Registration is closed for this event.", 400);
        }

        const { name, email, role } = registrationData;
        if (!name || !name.trim()) {
            throw new AppError("Full name is required for registration.", 400);
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new AppError("A valid email address is required.", 400);
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check duplicate registration
        const existingReg = await EventRegistration.findOne({
            eventId,
            email: normalizedEmail,
        });
        if (existingReg) {
            throw new AppError("You are already registered for this event.", 400);
        }

        // Check capacity
        const currentRegistrations = await EventRegistration.countDocuments({ eventId });
        if (currentRegistrations >= event.capacity) {
            throw new AppError("This event is fully booked.", 400);
        }

        const registration = await EventRegistration.create({
            eventId,
            userId: userId || null,
            name: name.trim(),
            email: normalizedEmail,
            role: role || "Developer",
        });

        const remainingSeats = Math.max(0, event.capacity - (currentRegistrations + 1));

        return {
            registration,
            remainingSeats,
            message: "Seat reserved successfully!",
        };
    }

    async getRegistrationStatus(eventId, email = null) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) {
            throw new AppError("Event not found", 404);
        }

        const currentRegistrations = await EventRegistration.countDocuments({ eventId });
        const remainingSeats = Math.max(0, event.capacity - currentRegistrations);
        const isFullyBooked = currentRegistrations >= event.capacity;

        let isRegistered = false;
        if (email) {
            const existing = await EventRegistration.findOne({
                eventId,
                email: email.trim().toLowerCase(),
            });
            if (existing) isRegistered = true;
        }

        return {
            eventId,
            capacity: event.capacity,
            registeredCount: currentRegistrations,
            remainingSeats,
            isFullyBooked,
            isRegistered,
        };
    }
}

export default EventService;
