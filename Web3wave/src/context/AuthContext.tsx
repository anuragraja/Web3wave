"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  User,
  CompanyUser,
  LoginUserRequest,
  RegisterUserRequest,
  VerifyEmailRequest,
  RegisterCompanyRequest,
  LoginCompanyRequest,
} from "../api/auth/types";
import {
  getMeApi,
  loginUserApi,
  registerUserApi,
  googleAuthApi,
  verifyEmailApi,
  resendVerificationApi,
  logoutUserApi,
  registerCompanyApi,
  loginCompanyApi,
  logoutCompanyApi,
  forgotPasswordApi,
  verifyResetOtpApi,
  confirmResetPasswordApi,
} from "../api/auth";

interface AuthContextType {
  user: User | null;
  company: CompanyUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (credentials: LoginUserRequest) => Promise<User>;
  registerUser: (data: RegisterUserRequest) => Promise<{ user: User; message?: string }>;
  googleAuth: (idToken: string) => Promise<User>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginCompany: (credentials: LoginCompanyRequest) => Promise<CompanyUser>;
  registerCompany: (data: RegisterCompanyRequest) => Promise<CompanyUser>;
  logoutCompany: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string, isCompany?: boolean) => Promise<string>;
  verifyResetOtp: (email: string, otp: string, isCompany?: boolean) => Promise<string>;
  confirmResetPassword: (email: string, resetToken: string, newPassword: string, isCompany?: boolean) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<CompanyUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check auth status on mount from backend HTTP-only cookies
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMeApi();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      // Check company session from localStorage as fallback/UI state if present
      const savedCompany = localStorage.getItem("web3wave_company_session");
      if (savedCompany) {
        try {
          const parsed = JSON.parse(savedCompany);
          if (parsed.companyEmail) {
            setCompany(parsed);
          }
        } catch (e) {
          console.error("Failed parsing company session", e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginUser = async (credentials: LoginUserRequest): Promise<User> => {
    const res = await loginUserApi(credentials);
    const loggedInUser = res.data?.user;
    if (loggedInUser) {
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error("Invalid response from server");
  };

  const registerUser = async (data: RegisterUserRequest) => {
    const res = await registerUserApi(data);
    if (res.data?.user) {
      setUser(res.data.user);
      return { user: res.data.user, message: res.message || res.data.message };
    }
    throw new Error("Failed to register user");
  };

  const googleAuth = async (idToken: string): Promise<User> => {
    const res = await googleAuthApi({ idToken });
    const loggedInUser = res.data?.user;
    if (loggedInUser) {
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error("Failed to authenticate with Google");
  };

  const verifyEmail = async (email: string, otp: string) => {
    await verifyEmailApi({ email, otp });
    if (user) {
      setUser({ ...user, isVerified: true });
    }
  };

  const resendVerification = async (email: string) => {
    await resendVerificationApi({ email });
  };

  const logoutUser = async () => {
    try {
      await logoutUserApi();
    } catch (e) {
      console.warn("Logout request error", e);
    } finally {
      setUser(null);
    }
  };

  const loginCompany = async (credentials: LoginCompanyRequest): Promise<CompanyUser> => {
    const res = await loginCompanyApi(credentials);
    const companyData = res.data?.company || {
      email: credentials.email,
      companyName: "Verified Company Node",
    };
    setCompany(companyData);
    localStorage.setItem("web3wave_company_session", JSON.stringify(companyData));
    return companyData;
  };

  const registerCompany = async (data: RegisterCompanyRequest): Promise<CompanyUser> => {
    const res = await registerCompanyApi(data);
    const companyData = res.data?.company || {
      companyName: data.companyName,
      email: data.email,
      number: data.number,
      website: data.website,
      role: data.role,
    };
    setCompany(companyData);
    localStorage.setItem("web3wave_company_session", JSON.stringify(companyData));
    return companyData;
  };

  const logoutCompany = async () => {
    try {
      await logoutCompanyApi();
    } catch (e) {
      console.warn("Logout company error", e);
    } finally {
      setCompany(null);
      localStorage.removeItem("web3wave_company_session");
    }
  };

  const forgotPassword = async (email: string, isCompany: boolean = false): Promise<string> => {
    const res = await forgotPasswordApi(email, isCompany);
    return res.message || "Password reset code sent to your email.";
  };

  const verifyResetOtp = async (email: string, otp: string, isCompany: boolean = false): Promise<string> => {
    const res = await verifyResetOtpApi(email, otp, isCompany);
    if (res.data?.resetToken) {
      return res.data.resetToken;
    }
    throw new Error("Failed to obtain reset token.");
  };

  const confirmResetPassword = async (
    email: string,
    resetToken: string,
    newPassword: string,
    isCompany: boolean = false
  ): Promise<string> => {
    const res = await confirmResetPasswordApi({ email, resetToken, newPassword }, isCompany);
    return res.message || "Password updated successfully.";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isLoading,
        isAuthenticated: !!user || !!company,
        loginUser,
        registerUser,
        googleAuth,
        verifyEmail,
        resendVerification,
        logoutUser,
        loginCompany,
        registerCompany,
        logoutCompany,
        checkAuth,
        forgotPassword,
        verifyResetOtp,
        confirmResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
