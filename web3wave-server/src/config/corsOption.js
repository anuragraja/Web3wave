import config from "./environment.js";

const { ALLOWED_ORIGINS, NODE_ENV } = config;

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (NODE_ENV === "development") {
            return callback(null, true);
        }

        const allowedList = Array.isArray(ALLOWED_ORIGINS)
            ? ALLOWED_ORIGINS
            : typeof ALLOWED_ORIGINS === "string"
                ? ALLOWED_ORIGINS.split(",").map((s) => s.trim())
                : [];

        if (allowedList.length === 0 || allowedList.includes(origin) || NODE_ENV !== "production") {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};
