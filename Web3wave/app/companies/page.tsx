"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Users,
  TrendingUp,
  MessageSquare,
  Calendar,
  Award,
  Zap,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Globe,
  BarChart3,
  ShieldCheck,
  Target,
  Gift,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import { LumaCreateEventModal } from "@/components/LumaCreateEventModal";
import { LumaEvent } from "@/components/LumaEventGrid";

import { useAuth } from "@/src/context/AuthContext";

type CompanyTab =
  | "building"
  | "growth"
  | "engagement"
  | "events"
  | "ambassadors"
  | "campaigns";

export default function CompaniesPage() {
  const {
    company,
    loginCompany,
    verifyCompanyLoginOtp,
    resendCompanyLoginOtp,
    registerCompany,
    verifyCompanyEmail,
    resendCompanyVerification,
    logoutCompany,
  } = useAuth();
  const [authMode, setAuthMode] = useState<"register" | "login" | "verify_email">("register");
  const [isLoginOtp, setIsLoginOtp] = useState(false);
  const [activeTab, setActiveTab] = useState<CompanyTab>("building");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyMobile, setCompanyMobile] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyRole, setCompanyRole] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyOtp, setCompanyOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signedIn = !!company;
  const displayName = company?.companyName || companyName || "Verified Company Node";

  const hasUpperCase = /[A-Z]/.test(companyPassword);
  const hasLowerCase = /[a-z]/.test(companyPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(companyPassword);
  const hasMinLength = companyPassword.length >= 8;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasSpecialChar && hasMinLength;

  // Form submit handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (authMode === "register") {
      if (!companyName.trim()) {
        setErrorMsg("Company / Protocol name is required.");
        return;
      }
      if (!companyEmail.trim() || !companyEmail.includes("@")) {
        setErrorMsg("Please enter a valid official business email address.");
        return;
      }
      if (!companyMobile.trim() || companyMobile.trim().length < 8) {
        setErrorMsg("Please enter a valid contact phone number.");
        return;
      }
      if (!companyWebsite.trim()) {
        setErrorMsg("Company website or protocol URL is required.");
        return;
      }
      if (!companyRole.trim()) {
        setErrorMsg("Your designation / role is required.");
        return;
      }
      if (!isPasswordValid) {
        setErrorMsg("Password must contain uppercase, lowercase, special character, and be at least 8 characters long.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await registerCompany({
          companyName,
          email: companyEmail,
          phone: companyMobile,
          number: companyMobile,
          website: companyWebsite,
          role: companyRole,
          password: companyPassword,
        });
        setIsLoginOtp(false);
        setSuccessMsg("Company registered! Verification code sent to official business email.");
        setAuthMode("verify_email");
      } catch (err: any) {
        setErrorMsg(err.message || "Company registration failed.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login mode
      if (!companyEmail.trim() || !companyEmail.includes("@")) {
        setErrorMsg("Please enter your registered official business email.");
        return;
      }
      if (!companyPassword.trim()) {
        setErrorMsg("Please enter your password.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await loginCompany({
          email: companyEmail,
          password: companyPassword,
        });
        if (res?.requiresOtp) {
          setIsLoginOtp(true);
          setSuccessMsg("A 6-digit login verification code has been sent to your email.");
          setAuthMode("verify_email");
        } else {
          setSuccessMsg("Welcome back!");
        }
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("verify your email")) {
          setErrorMsg(err.message);
          setIsLoginOtp(false);
          setAuthMode("verify_email");
        } else {
          setErrorMsg(err.message || "Invalid email or password.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!companyOtp.trim() || companyOtp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginOtp) {
        await verifyCompanyLoginOtp(companyEmail, companyOtp.trim());
        setSuccessMsg("Login successful! Welcome to Web3Wave.");
      } else {
        await verifyCompanyEmail(companyEmail, companyOtp.trim());
        setSuccessMsg("Email verified successfully! Welcome to Web3Wave.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify email OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCompanyOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (isLoginOtp) {
        await resendCompanyLoginOtp(companyEmail);
      } else {
        await resendCompanyVerification(companyEmail);
      }
      setSuccessMsg("New 6-digit verification code sent to your official email.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend code.");
    }
  };

  const handleSignOut = async () => {
    await logoutCompany();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d10]/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span>Home</span>
          </Link>
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Image
              src="/web3wave-logo.png"
              alt="Web3Wave Logo"
              width={28}
              height={28}
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-rose-300 transition-colors">
              Web3Wave <span className="text-rose-400 font-mono text-xs font-normal">/ Companies Portal</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/members"
              className="text-xs font-semibold text-rose-300 hover:text-white px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch to Member Portal</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {!signedIn ? (
        /* Sign Up / Login Form View */
        <main className="flex-1 flex items-center justify-center p-6 relative my-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="w-full max-w-xl luma-card p-8 sm:p-10 relative z-10 bg-[#121217] border border-white/10 shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {authMode === "register" ? "Register Company Node" : "Company Portal Login"}
                  </h1>
                  <p className="text-xs text-zinc-400 font-mono">
                    {authMode === "register" ? "Official Sponsor & Enterprise Registration" : "Access your Company Dashboard"}
                  </p>
                </div>
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center ${
                  authMode === "register"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Register Company
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center ${
                  authMode === "login"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Company Sign In
              </button>
              {authMode === "verify_email" && (
                <button
                  type="button"
                  className="flex-1 py-2.5 rounded-lg font-bold transition-all text-center bg-rose-500 text-white shadow-md shadow-rose-500/20"
                >
                  Verify Email
                </button>
              )}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {authMode === "register"
                ? "Empower your Web3 protocol or company to build, grow, hire talent, and sponsor hackathons with Central India's 500+ developers."
                : authMode === "login"
                ? "Sign in with your registered company official business email to manage campaigns, post bounties, and connect with builders."
                : "Enter the 6-digit verification code sent to your official company business email to activate your company account."}
            </p>

            {successMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {authMode === "verify_email" ? (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                    Official Business Email
                  </label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                    6-Digit Verification Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={companyOtp}
                    onChange={(e) => setCompanyOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    Check your business inbox for the 6-digit OTP verification code.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center mt-4"
                >
                  <span>{isSubmitting ? "Verifying..." : isLoginOtp ? "Verify & Sign In" : "Verify Official Email & Continue"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={handleResendCompanyOtp}
                    className="text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <>
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                      Company / Protocol Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. BharatPay Protocol"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Official Business Email */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                  Official Business Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="e.g. grants@company.com or partnerships@company.eth"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  Must be your official company or work email domain
                </p>
              </div>

              {authMode === "register" && (
                <>
                  {/* Contact / Phone Number */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                      Contact / Mobile Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={companyMobile}
                        onChange={(e) => setCompanyMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company Website / Protocol Link */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                      Company Website / Protocol Link <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Globe className="w-4 h-4" />
                      </div>
                      <input
                        type="url"
                        required
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="https://company.io"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Designation / Role */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                      Your Designation / Role <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      placeholder="e.g. Co-Founder / Developer Relations Lead"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authMode === "register" && (
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

              <button
                type="submit"
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center mt-4"
              >
                <span>{authMode === "register" ? "Register & Launch Company Portal" : "Sign In to Company Portal"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Are you an individual developer?</span>
              <Link href="/members" className="text-rose-400 hover:underline">
                Sign in to Member Portal →
              </Link>
            </div>
          </div>
        </main>
      ) : (
        /* Authenticated Company Dashboard */
        <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-8 gap-6">
          {/* Dashboard Sub-Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#161620] via-[#121217] to-[#1a1318] border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  VERIFIED SPONSOR NODE
                </span>
                <span className="text-xs text-zinc-400 font-mono">• CENTRAL INDIA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {displayName} Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/events"
                className="btn-luma-secondary py-2.5 px-4 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Campaign</span>
              </Link>
              <Link
                href="/members"
                className="btn-luma-accent py-2.5 px-4 text-xs font-semibold"
              >
                <span>View Member View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs (Below Companies: Community Building, Community Growth, Engagement, Events, Ambassadors, Campaigns) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
            {[
              { id: "building", label: "Community Building", icon: Building2 },
              { id: "growth", label: "Community Growth", icon: TrendingUp },
              { id: "engagement", label: "Engagement", icon: MessageSquare },
              { id: "events", label: "Events", icon: Calendar },
              { id: "ambassadors", label: "Ambassadors", icon: Users },
              { id: "campaigns", label: "Campaigns", icon: Target },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CompanyTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 border border-rose-400/30"
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Community Building */}
          {activeTab === "building" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl">
                  <h3 className="text-lg font-extrabold text-white mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-rose-400" />
                    <span>Company Community Hub Setup</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Configure your official protocol hub on Web3Wave. Connect Discord, Telegram, and developer documentation.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Hub Domain Mapping</p>
                        <p className="text-xs text-zinc-400 font-mono">web3wave.in/hub/bharatpay</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs">
                        ACTIVE
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Discord Guild Integration</p>
                        <p className="text-xs text-zinc-400">#bharatpay-dev-channel synced</p>
                      </div>
                      <button className="text-xs text-rose-400 font-mono hover:underline">
                        Configure Webhooks
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs font-mono text-zinc-400 block mb-1">CONNECTED DEVS</span>
                    <span className="text-2xl font-black text-white">340+</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs font-mono text-zinc-400 block mb-1">SHIPPED MODULES</span>
                    <span className="text-2xl font-black text-rose-400">12</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center col-span-2 sm:col-span-1">
                    <span className="text-xs font-mono text-zinc-400 block mb-1">NODE RATING</span>
                    <span className="text-2xl font-black text-emerald-400">4.9 ★</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">
                    Quick Verification Checklist
                  </h4>
                  <ul className="space-y-3 text-xs">
                    <li className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Company Profile Verified</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>GitHub Org Token Linked</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Ambassador Stipend Wallet Connected</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Community Growth */}
          {activeTab === "growth" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 block mb-1">WEEKLY ACTIVE BUILDERS</span>
                  <span className="text-3xl font-black text-white">524</span>
                  <span className="text-xs text-emerald-400 font-mono block mt-2">+18% this month</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 block mb-1">EVENT RSVP RATE</span>
                  <span className="text-3xl font-black text-rose-400">88.4%</span>
                  <span className="text-xs text-zinc-400 font-mono block mt-2">Bhopal & MANIT chapters</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 block mb-1">BOUNTY COMPLETIONS</span>
                  <span className="text-3xl font-black text-white">42</span>
                  <span className="text-xs text-emerald-400 font-mono block mt-2">100% payout rate</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 block mb-1">RETENTION SCORE</span>
                  <span className="text-3xl font-black text-purple-400">92/100</span>
                  <span className="text-xs text-zinc-400 font-mono block mt-2">High developer loyalty</span>
                </div>
              </div>

              <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Growth Analytics & Acquisition Funnel</h3>
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-zinc-300 mb-1">
                      <span>MANIT Campus Node</span>
                      <span>220 Builders</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-300 mb-1">
                      <span>LNCT Developer Guild</span>
                      <span>160 Builders</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Engagement */}
          {activeTab === "engagement" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-400" />
                  <span>Developer Quests & Polls</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Create interactive technical challenges and governance polls to keep your community active.
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                    ACTIVE QUEST
                  </span>
                  <h4 className="text-sm font-bold text-white">Deploy Smart Contract on Testnet</h4>
                  <p className="text-xs text-zinc-400">Reward: 150 Web3Wave XP + $50 Gas Voucher</p>
                </div>
              </div>

              <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Leaderboard Spotlight</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="font-bold text-white">1. Krishna P. (MANIT)</span>
                    <span className="font-mono text-rose-400 font-bold">1,450 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="font-bold text-white">2. Abhishek P. (LNCT)</span>
                    <span className="font-mono text-rose-400 font-bold">1,210 XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Events */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Company Event Schedule</h3>
                <button onClick={() => setCreateEventOpen(true)} className="btn-luma-accent py-2 px-4 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Host New Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-3">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                    UPCOMING • SEP 20
                  </span>
                  <h4 className="text-base font-bold text-white">BharatPay Protocol Hack Night</h4>
                  <p className="text-xs text-zinc-400">Venue: MANIT incubation center · Bhopal</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400 font-mono">
                    <span>140 Confirmed RSVPs</span>
                    <span className="text-emerald-400">QR Check-in Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Ambassadors */}
          {activeTab === "ambassadors" && (
            <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                <span>Campus Ambassador Program</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Manage your student leads across MANIT Bhopal, LNCT, and MP Startup Hub nodes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">MANIT Chapter Lead</p>
                    <p className="text-xs text-zinc-400">Stipend: $300/mo</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">LNCT Campus Guild Lead</p>
                    <p className="text-xs text-zinc-400">Stipend: $250/mo</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Campaigns */}
          {activeTab === "campaigns" && (
            <div className="space-y-6">
              <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-400" />
                  <span>Protocol Grants & Bounties</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Distribute rewards and grants to builders shipping on top of your protocol.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-rose-950/40 to-zinc-900 border border-rose-500/30">
                    <span className="text-xs font-mono text-rose-300 font-bold block mb-1">BOUNTY CAMPAIGN #01</span>
                    <h4 className="text-base font-bold text-white">Build Cross-chain Payment SDK</h4>
                    <p className="text-xs text-zinc-400 mt-1 mb-4">Total Pool: $2,500 USDC</p>
                    <button className="btn-luma-accent py-2 px-4 text-xs w-full justify-center">
                      Manage Submissions (8)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      <LumaCreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onAddEvent={() => {}}
      />
    </div>
  );
}
