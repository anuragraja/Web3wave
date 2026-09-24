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
  verifyLoginOtpApi,
  resendLoginOtpApi,
  registerUserApi,
  googleAuthApi,
  verifyEmailApi,
  resendVerificationApi,
  logoutUserApi,
  registerCompanyApi,
  loginCompanyApi,
  verifyCompanyLoginOtpApi,
  resendCompanyLoginOtpApi,
  getCompanyMeApi,
  verifyCompanyEmailApi,
  resendCompanyVerificationApi,
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
  loginUser: (credentials: LoginUserRequest) => Promise<{ requiresOtp?: boolean; user?: User; message?: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<User>;
  resendLoginOtp: (email: string) => Promise<void>;
  registerUser: (data: RegisterUserRequest) => Promise<{ user?: User; requiresOtp?: boolean; message?: string }>;
  googleAuth: (idToken: string) => Promise<User>;
  verifyEmail: (email: string, otp: string) => Promise<User | undefined>;
  resendVerification: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginCompany: (credentials: LoginCompanyRequest) => Promise<{ requiresOtp?: boolean; company?: CompanyUser; message?: string }>;
  verifyCompanyLoginOtp: (email: string, otp: string) => Promise<CompanyUser>;
  resendCompanyLoginOtp: (email: string) => Promise<void>;
  registerCompany: (data: RegisterCompanyRequest) => Promise<{ company?: CompanyUser; requiresOtp?: boolean; message?: string }>;
  verifyCompanyEmail: (email: string, otp: string) => Promise<CompanyUser | undefined>;
  resendCompanyVerification: (email: string) => Promise<void>;
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
    }

    try {
      const companyRes = await getCompanyMeApi();
      if (companyRes.success && companyRes.data) {
        setCompany(companyRes.data);
        localStorage.setItem("web3wave_company_session", JSON.stringify(companyRes.data));
      } else {
        const savedCompany = localStorage.getItem("web3wave_company_session");
        if (savedCompany) {
          try {
            setCompany(JSON.parse(savedCompany));
          } catch {
            setCompany(null);
          }
        } else {
          setCompany(null);
        }
      }
    } catch {
      const savedCompany = localStorage.getItem("web3wave_company_session");
      if (savedCompany) {
        try {
          setCompany(JSON.parse(savedCompany));
        } catch {
          setCompany(null);
        }
      } else {
        setCompany(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginUser = async (credentials: LoginUserRequest): Promise<{ requiresOtp?: boolean; user?: User; message?: string }> => {
    const res = await loginUserApi(credentials);
    const data = res.data;
    if (data?.requiresOtp || res.requiresOtp) {
      return { requiresOtp: true, message: res.message || data?.message };
    }
    const loggedInUser = data?.user;
    if (loggedInUser) {
      setUser(loggedInUser);
      return { user: loggedInUser, message: res.message };
    }
    throw new Error(res.message || "Invalid response from server");
  };

  const verifyLoginOtp = async (email: string, otp: string): Promise<User> => {
    const res = await verifyLoginOtpApi({ email, otp });
    const verifiedUser = res.data?.user;
    if (verifiedUser) {
      setUser(verifiedUser);
      return verifiedUser;
    }
    throw new Error(res.message || "Failed to verify login code");
  };

  const resendLoginOtp = async (email: string): Promise<void> => {
    await resendLoginOtpApi({ email });
  };

  const registerUser = async (data: RegisterUserRequest): Promise<{ user?: User; requiresOtp?: boolean; message?: string }> => {
    const res = await registerUserApi(data);
    const registeredUser = res.data?.user;
    if (registeredUser || res.requiresOtp || res.data?.requiresOtp || res.success) {
      return {
        user: registeredUser,
        requiresOtp: true,
        message: res.message || res.data?.message || "Registration successful! A 6-digit verification code has been sent to your email.",
      };
    }
    throw new Error(res.message || "Failed to register user");
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

  const verifyEmail = async (email: string, otp: string): Promise<User | undefined> => {
    const res = await verifyEmailApi({ email, otp });
    const verifiedUser = res.data?.user;
    if (verifiedUser) {
      setUser(verifiedUser);
      return verifiedUser;
    } else if (user) {
      const updated = { ...user, isVerified: true };
      setUser(updated);
      return updated;
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

  const loginCompany = async (credentials: LoginCompanyRequest): Promise<{ requiresOtp?: boolean; company?: CompanyUser; message?: string }> => {
    const res = await loginCompanyApi(credentials);
    const data = res.data;
    if (data?.requiresOtp || res.requiresOtp) {
      return { requiresOtp: true, message: res.message || data?.message };
    }
    const companyData = data?.company;
    if (companyData) {
      setCompany(companyData);
      localStorage.setItem("web3wave_company_session", JSON.stringify(companyData));
      return { company: companyData, message: res.message };
    }
    throw new Error(res.message || "Invalid response from server");
  };

  const verifyCompanyLoginOtp = async (email: string, otp: string): Promise<CompanyUser> => {
    const res = await verifyCompanyLoginOtpApi({ email, otp });
    const verifiedCompany = res.data?.company;
    if (verifiedCompany) {
      setCompany(verifiedCompany);
      localStorage.setItem("web3wave_company_session", JSON.stringify(verifiedCompany));
      return verifiedCompany;
    }
    throw new Error(res.message || "Failed to verify company login code");
  };

  const resendCompanyLoginOtp = async (email: string): Promise<void> => {
    await resendCompanyLoginOtpApi({ email });
  };

  const registerCompany = async (data: RegisterCompanyRequest): Promise<{ company?: CompanyUser; requiresOtp?: boolean; message?: string }> => {
    const res = await registerCompanyApi(data);
    const companyData = res.data?.company;
    if (companyData || res.requiresOtp || res.data?.requiresOtp || res.success) {
      return {
        company: companyData,
        requiresOtp: true,
        message: res.message || res.data?.message || "Company registered successfully. Verification code sent to company email.",
      };
    }
    throw new Error(res.message || "Failed to register company");
  };

  const verifyCompanyEmail = async (email: string, otp: string): Promise<CompanyUser | undefined> => {
    const res = await verifyCompanyEmailApi({ email, otp });
    const verifiedCompany = res.data?.company;
    if (verifiedCompany) {
      setCompany(verifiedCompany);
      localStorage.setItem("web3wave_company_session", JSON.stringify(verifiedCompany));
      return verifiedCompany;
    } else if (company) {
      const updated = { ...company, isVerified: true };
      setCompany(updated);
      localStorage.setItem("web3wave_company_session", JSON.stringify(updated));
      return updated;
    }
  };

  const resendCompanyVerification = async (email: string) => {
    await resendCompanyVerificationApi({ email });
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
        verifyLoginOtp,
        resendLoginOtp,
        registerUser,
        googleAuth,
        verifyEmail,
        resendVerification,
        logoutUser,
        loginCompany,
        verifyCompanyLoginOtp,
        resendCompanyLoginOtp,
        registerCompany,
        verifyCompanyEmail,
        resendCompanyVerification,
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
