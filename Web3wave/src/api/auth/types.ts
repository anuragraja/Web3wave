export interface UserRole {
  _id: string;
  name: string;
  description?: string;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  number?: string;
  googleId?: string | null;
  role?: UserRole | string | null;
  isVerified?: boolean;
}

export interface CompanyUser {
  _id?: string;
  id?: string;
  companyName: string;
  email: string;
  number?: string;
  website?: string;
  role?: string;
  isVerified?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  number: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface RegisterCompanyRequest {
  companyName: string;
  email: string;
  number: string;
  website: string;
  role: string;
  password: string;
}

export interface LoginCompanyRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ConfirmResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}
