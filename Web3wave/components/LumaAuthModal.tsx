"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  RefreshCw,
  Loader2,
  UserPlus,
  LogIn,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { openGoogleOAuthPopup } from "@/src/utils/googleOAuthPopup";

interface LumaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LumaAuthModal({ isOpen, onClose }: LumaAuthModalProps) {
  const router = useRouter();
  const {
    loginUser,
    verifyLoginOtp,
    resendLoginOtp,
    registerUser,
    googleAuth,
    verifyEmail,
    resendVerification,
    loginCompany,
    verifyCompanyLoginOtp,
    resendCompanyLoginOtp,
    registerCompany,
    verifyCompanyEmail,
    resendCompanyVerification,
    forgotPassword,
    verifyResetOtp,
    confirmResetPassword,
  } = useAuth();

  const [role, setRole] = useState<"member" | "company">("member");
  const [mode, setMode] = useState<
    | "login"
    | "register"
    | "verify_email"
    | "forgot_password"
    | "verify_reset_otp"
    | "confirm_reset_password"
  >("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [website, setWebsite] = useState("");
  const [companyRole, setCompanyRole] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoginOtp, setIsLoginOtp] = useState(false);

  // Prevent background page scrolling & pause Lenis when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Password validation criteria checks
  const targetPassword = mode === "confirm_reset_password" ? newPassword : password;
  const hasUpperCase = /[A-Z]/.test(targetPassword);
  const hasLowerCase = /[a-z]/.test(targetPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(targetPassword);
  const hasMinLength = targetPassword.length >= 8;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasSpecialChar && hasMinLength;

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    // Pre-open popup synchronously on user gesture to prevent browser popup blocker
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    let popupWindow: Window | null = null;
    try {
      popupWindow = window.open(
        "about:blank",
        "Google OAuth Sign In",
        `width=${width},height=${height},top=${top},left=${left}`
      );
    } catch {
      popupWindow = null;
    }

    try {
      const googleClientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "205620553440-ttv58ga9fgch2nba8nv727erilfpgk0d.apps.googleusercontent.com";

      const idToken = await openGoogleOAuthPopup(googleClientId, popupWindow);

      if (idToken) {
        await googleAuth(idToken);
        onClose();
      }
    } catch (err: any) {
      if (popupWindow && !popupWindow.closed) {
        try {
          popupWindow.close();
        } catch {
          // ignore
        }
      }
      console.error("Google Auth error:", err);
      if (err?.message?.includes("closed")) {
        setErrorMsg("Google Sign-in popup was closed.");
      } else if (err?.message?.includes("blocked")) {
        setErrorMsg("Pop-up window was blocked by browser. Please allow popups or use Email login.");
      } else {
        setErrorMsg(err?.message || "Google Authentication failed. Please try Email login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "register") {
      if (!isPasswordValid) {
        setErrorMsg("Password must meet security requirements (8+ chars, uppercase, lowercase, special char).");
        return;
      }
      if (mobile.trim().length < 8) {
        setErrorMsg("Please enter a valid mobile number.");
        return;
      }

      setIsSubmitting(true);
      try {
        if (role === "member") {
          const res = await registerUser({
            name,
            email,
            number: mobile,
            password,
          });
          setIsLoginOtp(false);
          setSuccessMsg("Verification code sent to your email!");
          setMode("verify_email");
        } else {
          const res = await registerCompany({
            companyName: name,
            email,
            phone: mobile,
            number: mobile,
            website: website || "https://web3wave.in",
            role: companyRole || "Sponsor",
            password,
          });
          setIsLoginOtp(false);
          setSuccessMsg("Verification code sent to company email!");
          setMode("verify_email");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Registration failed.");
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === "login") {
      setIsSubmitting(true);
      try {
        if (role === "member") {
          const res = await loginUser({ email, password });
          if (res?.requiresOtp) {
            setIsLoginOtp(true);
            setSuccessMsg("A 6-digit login verification code has been sent to your email.");
            setMode("verify_email");
          } else {
            onClose();
          }
        } else {
          const res = await loginCompany({ email, password });
          if (res?.requiresOtp) {
            setIsLoginOtp(true);
            setSuccessMsg("A 6-digit login verification code has been sent to your email.");
            setMode("verify_email");
          } else {
            onClose();
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Invalid credentials.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginOtp) {
        if (role === "company") {
          await verifyCompanyLoginOtp(email, otp.trim());
        } else {
          await verifyLoginOtp(email, otp.trim());
        }
        setSuccessMsg("Login successful! Welcome back.");
      } else {
        if (role === "company") {
          await verifyCompanyEmail(email, otp.trim());
        } else {
          await verifyEmail(email, otp.trim());
        }
        setSuccessMsg("Email verified successfully! Welcome to Web3Wave.");
      }
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const msg = await forgotPassword(email, role === "company");
      setSuccessMsg(msg || "Reset OTP sent to your email!");
      setMode("verify_reset_otp");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyResetOtpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit reset code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await verifyResetOtp(email, otp.trim(), role === "company");
      setResetToken(token);
      setSuccessMsg("Reset code verified! Please enter your new password.");
      setMode("confirm_reset_password");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid reset code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmResetPasswordStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isPasswordValid) {
      setErrorMsg("New password must meet security requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const msg = await confirmResetPassword(email, resetToken, newPassword, role === "company");
      setSuccessMsg(msg || "Password reset successfully! Please sign in.");
      setPassword("");
      setNewPassword("");
      setTimeout(() => {
        setMode("login");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (mode === "verify_email") {
        if (isLoginOtp) {
          if (role === "company") {
            await resendCompanyLoginOtp(email);
          } else {
            await resendLoginOtp(email);
          }
        } else {
          if (role === "company") {
            await resendCompanyVerification(email);
          } else {
            await resendVerification(email);
          }
        }
      } else {
        await forgotPassword(email, role === "company");
      }
      setSuccessMsg("Verification code sent to your email!");
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend code.");
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto overscroll-none"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          data-lenis-prevent="true"
          className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-[#121217] border border-white/10 shadow-2xl rounded-3xl text-white max-h-[80vh] overflow-y-auto overscroll-contain my-auto font-sans shadow-rose-950/40"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            aria-label="Close auth modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
              <img
                src="/web3wave-logo.png"
                alt="Web3Wave Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {mode === "verify_email"
                  ? "Email Verification"
                  : mode === "forgot_password" || mode === "verify_reset_otp" || mode === "confirm_reset_password"
                  ? "Reset Password"
                  : mode === "login"
                  ? "Sign In to Web3Wave"
                  : "Register Web3Wave Account"}
              </h2>
              <p className="text-xs text-zinc-400">
                {mode === "forgot_password"
                  ? "Enter your email to receive a password reset code."
                  : mode === "verify_reset_otp"
                  ? `Enter 6-digit reset code sent to ${email}`
                  : mode === "confirm_reset_password"
                  ? "Create a new secure password for your account."
                  : mode === "verify_email"
                  ? `Enter 6-digit OTP sent to ${email}`
                  : "Select account type & enter details to continue."}
              </p>
            </div>
          </div>

          {(mode === "login" || mode === "register") && (
            <>
              {/* Role Selector Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-1 bg-white/5 border border-white/5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    role === "member"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>For Members</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("company")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    role === "company"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>For Companies</span>
                </button>
              </div>

              {/* Mode Selector Tabs (Register vs Sign In) */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1 mb-4 border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-center ${
                    mode === "register"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-center ${
                    mode === "login"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>

              {/* Continue with Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full mb-4 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">OR EMAIL</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Section 1 & 2: Login or Register */}
          {(mode === "login" || mode === "register") && (
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {/* Name (Register Mode Only) */}
              {mode === "register" && (
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                    {role === "company" ? "Company / Protocol Name *" : "Full Name / Handle *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "company" ? "e.g. BharatPay Protocol" : "e.g. Abhishek Patidar"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                  {role === "company" ? "Work Email / ENS *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "company" ? "grants@company.eth" : "builder@web3wave.in"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Mobile (Register Mode Only) */}
              {mode === "register" && (
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase">
                    Password *
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot_password");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[11px] font-mono text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Forgot Password?</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Requirement Rules Checklist (Register Mode) */}
                {mode === "register" && (
                  <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-[11px] font-mono">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-1">
                      Password Requirements:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-400" : "text-zinc-500"}`}>
                        <CheckCircle2 className={`w-3 h-3 ${hasUpperCase ? "text-emerald-400" : "text-zinc-600"}`} />
                        <span>Uppercase (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasLowerCase ? "text-emerald-400" : "text-zinc-500"}`}>
                        <CheckCircle2 className={`w-3 h-3 ${hasLowerCase ? "text-emerald-400" : "text-zinc-600"}`} />
                        <span>Lowercase (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-400" : "text-zinc-500"}`}>
                        <CheckCircle2 className={`w-3 h-3 ${hasSpecialChar ? "text-emerald-400" : "text-zinc-600"}`} />
                        <span>Special (!@#$%)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-zinc-500"}`}>
                        <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? "text-emerald-400" : "text-zinc-600"}`} />
                        <span>Min 8 chars</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center mt-3 gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "login"
                        ? role === "company"
                          ? "Sign In to Company Portal"
                          : "Sign In to Member Portal"
                        : role === "company"
                        ? "Register Company Node"
                        : "Create Account & Send Verification OTP"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer Switch Mode Link */}
              <div className="pt-3 text-center text-xs text-zinc-400 font-mono">
                {mode === "register" ? (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg("");
                      }}
                      className="text-rose-400 hover:underline font-bold"
                    >
                      Sign In here →
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setErrorMsg("");
                      }}
                      className="text-rose-400 hover:underline font-bold"
                    >
                      Register Account →
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Form Section 3: Forgot Password - Step 1 (Request Reset Code) */}
          {mode === "forgot_password" && (
            <form onSubmit={handleForgotPasswordStep1} className="space-y-4 py-2">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                  {role === "company" ? "Company Work Email *" : "Registered Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@web3wave.in"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Password Reset OTP</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Form Section 4: Forgot Password - Step 2 (Verify Reset OTP) */}
          {mode === "verify_reset_otp" && (
            <form onSubmit={handleVerifyResetOtpStep2} className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <KeyRound className="w-8 h-8 text-rose-400 mx-auto animate-pulse" />
                <h3 className="text-sm font-bold text-white">Check Your Email</h3>
                <p className="text-xs text-zinc-400">
                  Enter 6-digit password reset code sent to{" "}
                  <span className="text-white font-mono">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                  6-Digit Reset Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code & Continue</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2 font-mono">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-rose-400 hover:underline flex items-center gap-1 disabled:text-zinc-600 disabled:no-underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Reset Code"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Form Section 5: Forgot Password - Step 3 (Confirm New Password) */}
          {mode === "confirm_reset_password" && (
            <form onSubmit={handleConfirmResetPasswordStep3} className="space-y-4 py-2">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-[11px] font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-1">
                    Password Requirements:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-400" : "text-zinc-500"}`}>
                      <CheckCircle2 className={`w-3 h-3 ${hasUpperCase ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowerCase ? "text-emerald-400" : "text-zinc-500"}`}>
                      <CheckCircle2 className={`w-3 h-3 ${hasLowerCase ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-400" : "text-zinc-500"}`}>
                      <CheckCircle2 className={`w-3 h-3 ${hasSpecialChar ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span>Special (!@#$%)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-zinc-500"}`}>
                      <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span>Min 8 chars</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid}
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Password & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode Email Verification (Registration) */}
          {mode === "verify_email" && (
            <form onSubmit={handleVerifyEmail} className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <Mail className="w-8 h-8 text-rose-400 mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-white">Check Your Inbox</h3>
                <p className="text-xs text-zinc-400">
                  {isLoginOtp
                    ? "We've sent a 6-digit login verification OTP to "
                    : "We've sent a 6-digit verification OTP to "}
                  <span className="text-white font-mono">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase mb-1">
                  6-Digit {isLoginOtp ? "Login" : "Email"} OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isLoginOtp ? "Verify & Sign In" : "Verify Email & Complete Registration"}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-rose-400 hover:underline flex items-center gap-1 font-mono disabled:text-zinc-600 disabled:no-underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtp("");
                    setErrorMsg("");
                    setSuccessMsg("");
                    setMode(isLoginOtp ? "login" : "register");
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  {isLoginOtp ? "Back to Login" : "Change Email"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
