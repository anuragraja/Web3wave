import axios from "axios";
import { sanitizeErrorMessage } from "@/src/utils/errorSanitizer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5004/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("web3wave_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages nicely and sanitize technical error details
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rawMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    const safeMessage = sanitizeErrorMessage(rawMessage);
    return Promise.reject(new Error(safeMessage));
  }
);

export default api;
