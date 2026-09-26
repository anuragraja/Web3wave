import Joi from "joi";
import { AppError } from "../../utils/appError.js";
import { EVENT_CATEGORIES, EVENT_STATUS } from "../../constants/events.js";

const categoryValues = Object.values(EVENT_CATEGORIES);
const statusValues = Object.values(EVENT_STATUS);

const createEventSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "any.required": "Event title is required",
        "string.empty": "Event title cannot be empty",
    }),
    category: Joi.string()
        .uppercase()
        .valid(...categoryValues)
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
    date: Joi.date().iso().required().messages({
        "any.required": "Event date is required",
        "date.format": "Date must be a valid ISO 8601 date string",
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
    organizerEmail: Joi.string().email().required().messages({
        "any.required": "Organizer email is required",
        "string.email": "Organizer email must be a valid email address",
    }),
    organizerPhone: Joi.string().trim().allow("", null),
    poster: Joi.string().trim().allow("", null),
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
    category: Joi.string().uppercase().valid(...categoryValues),
    description: Joi.string().trim(),
    capacity: Joi.number().integer().min(1),
    date: Joi.date().iso(),
    startTime: Joi.string().trim(),
    endTime: Joi.string().trim().allow("", null),
    location: Joi.string().trim(),
    organizerName: Joi.string().trim(),
    organizerEmail: Joi.string().email(),
    organizerPhone: Joi.string().trim().allow("", null),
    poster: Joi.string().trim().allow("", null),
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
