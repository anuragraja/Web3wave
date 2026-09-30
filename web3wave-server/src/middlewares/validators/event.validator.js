import Joi from "joi";
import { AppError } from "../../utils/appError.js";
import { EVENT_CATEGORIES, EVENT_STATUS } from "../../constants/events.js";

const categoryValues = Object.values(EVENT_CATEGORIES);
const statusValues = Object.values(EVENT_STATUS);

const categoryNormalizer = (value, helpers) => {
    if (!value || typeof value !== "string") return helpers.error("any.required");
    const norm = value.trim().toUpperCase();
    if (norm === "WORKSHOPS" || norm === "WORKSHOP") return "WORKSHOP";
    if (norm === "HACKATHONS" || norm === "HACKATHON") return "HACKATHON";
    if (norm === "MEETUPS" || norm === "MEETUP") return "MEETUP";
    if (norm === "GRANT SPRINTS" || norm === "GRANT SPRINT" || norm === "GRANT_SPRINT") return "GRANT_SPRINT";
    return helpers.error("any.only");
};

const createEventSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "any.required": "Event title is required",
        "string.empty": "Event title cannot be empty",
    }),
    category: Joi.string()
        .custom(categoryNormalizer)
        .required()
        .messages({
            "any.required": "Event category is required",
            "any.only": `Category must be one of: ${categoryValues.join(", ")}`,
        }),
    description: Joi.string().trim().required().messages({
        "any.required": "Event description is required",
        "string.empty": "Event description cannot be empty",
    }),
    capacity: Joi.number().integer().min(1).required().messages({
        "any.required": "Event capacity is required",
        "number.min": "Capacity must be at least 1",
    }),
    date: Joi.date().required().messages({
        "any.required": "Event date is required",
        "date.base": "Date must be a valid date",
    }),
    startTime: Joi.string().trim().required().messages({
        "any.required": "Start time is required",
    }),
    endTime: Joi.string().trim().allow("", null),
    location: Joi.string().trim().required().messages({
        "any.required": "Location is required",
    }),
    organizerName: Joi.string().trim().required().messages({
        "any.required": "Organizer name is required",
    }),
    organizerEmail: Joi.string().trim().email().required().messages({
        "any.required": "Organizer email is required",
        "string.email": "Organizer email must be a valid email address",
    }),
    organizerPhone: Joi.string().trim().allow("", null),
    poster: Joi.string().trim().allow("", null),
    registrationLink: Joi.string().trim().allow("", null),
    status: Joi.string()
        .uppercase()
        .valid(...statusValues)
        .default(EVENT_STATUS.DRAFT)
        .messages({
            "any.only": `Status must be one of: ${statusValues.join(", ")}`,
        }),
});

const updateEventSchema = Joi.object({
    title: Joi.string().trim(),
    category: Joi.string().custom(categoryNormalizer),
    description: Joi.string().trim(),
    capacity: Joi.number().integer().min(1),
    date: Joi.date(),
    startTime: Joi.string().trim(),
    endTime: Joi.string().trim().allow("", null),
    location: Joi.string().trim(),
    organizerName: Joi.string().trim(),
    organizerEmail: Joi.string().trim().email(),
    organizerPhone: Joi.string().trim().allow("", null),
    poster: Joi.string().trim().allow("", null),
    registrationLink: Joi.string().trim().allow("", null),
    status: Joi.string().uppercase().valid(...statusValues),
}).min(1);

const validate = (schema) => (req, _res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(
            new AppError(error.details.map((d) => d.message).join(", "), 400)
        );
    }
    next();
};

export const createEventValidator = validate(createEventSchema);
export const updateEventValidator = validate(updateEventSchema);
