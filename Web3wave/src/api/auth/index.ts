import api from "../axios";
import {
  RegisterUserRequest,
  LoginUserRequest,
  GoogleAuthRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  RegisterCompanyRequest,
  LoginCompanyRequest,
  ApiResponse,
  User,
  CompanyUser,
} from "./types";

// User Auth Services
export async function registerUserApi(
  payload: RegisterUserRequest
): Promise<ApiResponse<{ user: User; token?: string; message?: string }>> {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUserApi(
  payload: LoginUserRequest
): Promise<ApiResponse<{ user: User; token?: string }>> {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function googleAuthApi(
  payload: GoogleAuthRequest
): Promise<ApiResponse<{ user: User; token?: string }>> {
  const response = await api.post("/auth/google", payload);
  return response.data;
}

export async function verifyEmailApi(
  payload: VerifyEmailRequest
): Promise<ApiResponse> {
  const response = await api.post("/auth/verify-email", payload);
  return response.data;
}

export async function resendVerificationApi(
  payload: ResendOtpRequest
): Promise<ApiResponse> {
  const response = await api.post("/auth/resend-verification", payload);
  return response.data;
}

export async function getMeApi(): Promise<ApiResponse<User>> {
  const response = await api.get("/users/me");
  return response.data;
}

export async function logoutUserApi(): Promise<ApiResponse> {
  const response = await api.post("/auth/logout");
  return response.data;
}

// Company Auth Services
export async function registerCompanyApi(
  payload: RegisterCompanyRequest
): Promise<ApiResponse<{ company?: CompanyUser; token?: string }>> {
  const response = await api.post("/company/auth/register", payload);
  return response.data;
}

export async function loginCompanyApi(
  payload: LoginCompanyRequest
): Promise<ApiResponse<{ company?: CompanyUser; token?: string }>> {
  const response = await api.post("/company/auth/login", payload);
  return response.data;
}

export async function logoutCompanyApi(): Promise<ApiResponse> {
  const response = await api.post("/company/auth/logout");
  return response.data;
}

// Password Reset Services (User & Company)
export async function forgotPasswordApi(
  email: string,
  isCompany: boolean = false
): Promise<ApiResponse> {
  const endpoint = isCompany ? "/company/auth/forgot-password" : "/auth/forgot-password";
  const response = await api.post(endpoint, { email });
  return response.data;
}

export async function verifyResetOtpApi(
  email: string,
  otp: string,
  isCompany: boolean = false
): Promise<ApiResponse<{ resetToken: string }>> {
  const endpoint = isCompany ? "/company/auth/verify-reset-otp" : "/auth/verify-reset-otp";
  const response = await api.post(endpoint, { email, otp });
  return response.data;
}

export async function confirmResetPasswordApi(
  payload: { email: string; resetToken: string; newPassword: string },
  isCompany: boolean = false
): Promise<ApiResponse> {
  const endpoint = isCompany ? "/company/auth/confirm-reset-password" : "/auth/confirm-reset-password";
  const response = await api.post(endpoint, payload);
  return response.data;
}
