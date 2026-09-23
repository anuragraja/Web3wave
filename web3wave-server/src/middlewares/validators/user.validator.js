import Joi from "joi";
import { AppError } from "../../utils/appError.js";

export const updateUserSchema = Joi.object({
    email: Joi.string().email().messages({
        "string.email": "A valid email address is required",
    }),
    password: Joi.string().min(4).messages({
        "string.min": "Password must be at least 4 characters long",
    }),
    name: Joi.string().messages({
        "string.base": "Name must be a string",
    }),
    number: Joi.string().min(10).messages({
        "string.min": "Phone number must be at least 10 digits long",
    }),
}).min(1);

const validate = (schema) => (req, _res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(new AppError(error.details.map((d) => d.message).join(", "), 400));
    }
    next();
};

export const updateUserValidator = validate(updateUserSchema);