import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
if (!process.env.MONGODB_URI) {
    dotenv.config();
}

export default {
    MONGODB_URI: process.env.MONGODB_URI ,
    PORT: Number(process.env.PORT),
    REDIS_HOST: process.env.REDIS_HOST ,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
    NODE_ENV: process.env.NODE_ENV ,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY ,
    BREVO_SENDER_MAIL: process.env.BREVO_SENDER_MAIL,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_NUMBER: process.env.ADMIN_NUMBER,
};