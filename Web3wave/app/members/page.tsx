"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Compass,
  Calendar,
  Building,
  Briefcase,
  Code,
  Gift,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  QrCode,
  Award,
  Trophy,
  Zap,
  MapPin,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

type MemberTab =
  | "discover"
  | "events"
  | "communities"
  | "opportunities"
  | "hackathons"
  | "rewards";

import { useAuth } from "@/src/context/AuthContext";

export default function MembersPage() {
  const { user, loginUser, verifyLoginOtp, resendLoginOtp, registerUser, verifyEmail, resendVerification, logoutUser, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register" | "verify_otp">("login");
  const [isLoginOtp, setIsLoginOtp] = useState(true);
  const [memberOtp, setMemberOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [activeTab, setActiveTab] = useState<MemberTab>("discover");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberMobile, setMemberMobile] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signedIn = !!user;

  const hasUpperCase = /[A-Z]/.test(memberPassword);
  const hasLowerCase = /[a-z]/.test(memberPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(memberPassword);
  const hasMinLength = memberPassword.length >= 8;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasSpecialChar && hasMinLength;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (authMode === "register") {
      if (!isPasswordValid) {
        setErrorMsg("Password must contain uppercase, lowercase, special character, and be at least 8 characters long.");
        return;
      }
      if (memberMobile.trim().length < 8) {
        setErrorMsg("Please enter a valid mobile number.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await registerUser({
          name: memberName,
          email: memberEmail,
          number: memberMobile,
          password: memberPassword,
        });
        setIsLoginOtp(false);
        setAuthMode("verify_otp");
      } catch (err: any) {
        setErrorMsg(err.message || "Registration failed.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        const res = await loginUser({
          email: memberEmail,
          password: memberPassword,
        });
        if (res?.requiresOtp) {
          setIsLoginOtp(true);
          setAuthMode("verify_otp");
        }
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("verify your email")) {
          setErrorMsg(err.message);
          setIsLoginOtp(false);
          setAuthMode("verify_otp");
        } else {
          setErrorMsg(err.message || "Invalid email or password.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!memberOtp || memberOtp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginOtp) {
        await verifyLoginOtp(memberEmail, memberOtp.trim());
      } else {
        await verifyEmail(memberEmail, memberOtp.trim());
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendMemberOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    try {
      if (isLoginOtp) {
        await resendLoginOtp(memberEmail);
      } else {
        await resendVerification(memberEmail);
      }
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
            <img
              src="/web3wave-logo.png"
              alt="Web3Wave Logo"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-rose-300 transition-colors">
              Web3Wave <span className="text-rose-400 font-mono text-xs font-normal">/ Member Portal</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>{user?.name || "Member"} (520 XP)</span>
              </div>
              <button
                onClick={() => logoutUser()}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/companies"
              className="text-xs font-semibold text-rose-300 hover:text-white px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Company Portal</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {!signedIn ? (
        /* Sign In View */
        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="w-full max-w-md luma-card p-8 sm:p-10 relative z-10 bg-[#121217] border border-white/10 shadow-2xl rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">
              Member Sign In
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Access your Web3Wave builder pass, event tickets, hackathon rewards, and campus community nodes.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {authMode === "verify_otp" ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-400 uppercase mb-1.5">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={memberOtp}
                    onChange={(e) => setMemberOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    Check your inbox at {memberEmail} for the 6-digit code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || memberOtp.length !== 6}
                  className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center mt-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? "Verifying..." : "Verify & Enter Dashboard"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={handleResendMemberOtp}
                    disabled={resendCooldown > 0}
                    className="text-zinc-400 hover:text-rose-400 transition-colors disabled:text-zinc-600"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMsg("");
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 uppercase mb-1.5">
                  Full Name / Handle *
                </label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Abhishek Patidar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 uppercase mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="builder@web3wave.in"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 uppercase mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={memberMobile}
                    onChange={(e) => setMemberMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-400 uppercase mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

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
                className="w-full btn-luma-accent py-3.5 text-sm font-bold justify-center mt-2"
              >
                <span>Enter Member Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Hosting an event or hiring?</span>
              <Link href="/companies" className="text-rose-400 hover:underline">
                Company Portal →
              </Link>
            </div>
          </div>
        </main>
      ) : (
        /* Authenticated Member Dashboard */
        <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-8 gap-6">
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#181216] via-[#121217] to-[#141520] border border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  VERIFIED BUILDER
                </span>
                <span className="text-xs text-zinc-400 font-mono">• CENTRAL INDIA NODE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user?.name || memberName || "Builder"}!
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-mono text-zinc-400 block">TOTAL XP</span>
                <span className="text-base font-black text-rose-400">520 XP</span>
              </div>
              <Link
                href="/gallery"
                className="btn-luma-accent py-2.5 px-4 text-xs font-semibold"
              >
                <span>Gallery</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs (Below Members: Discover, Events, Communities, Opportunities, Hackathons, Rewards) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
            {[
              { id: "discover", label: "Discover", icon: Compass },
              { id: "events", label: "Events", icon: Calendar },
              { id: "communities", label: "Communities", icon: Building },
              { id: "opportunities", label: "Opportunities", icon: Briefcase },
              { id: "hackathons", label: "Hackathons", icon: Code },
              { id: "rewards", label: "Rewards", icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as MemberTab)}
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

          {/* Tab 1: Discover */}
          {activeTab === "discover" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-4">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 font-mono text-[10px] font-bold">
                    TRENDING PROTOCOL
                  </span>
                  <h3 className="text-xl font-extrabold text-white">BharatPay Protocol</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Decentralized instant micro-payments on EVM layer-2s built by developers in Bhopal.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-xs font-mono text-emerald-400">● 12 Grants Open</span>
                    <span className="text-xs font-mono text-zinc-400">340 Local Contributors</span>
                  </div>
                </div>

                <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Community Activity Feed
                  </h4>
                  <ul className="space-y-3 text-xs text-zinc-300">
                    <li className="p-2.5 rounded-xl bg-white/5">
                      <span className="font-bold text-white">Krishna P.</span> submitted team project to ZK Hackathon.
                    </li>
                    <li className="p-2.5 rounded-xl bg-white/5">
                      <span className="font-bold text-white">MANIT Node</span> registered 45 new builders this week.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Events */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Your Event Pass & Tickets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1218] via-[#121217] to-black border border-rose-500/30 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                        CONFIRMED TICKET
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">Web3Wave Bhopal Meetup</h4>
                    </div>
                    <QrCode className="w-10 h-10 text-rose-400" />
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">Date: Sep 20, 2026 • 6:00 PM IST</p>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-3 border-t border-white/10">
                    <span>MANIT Incubator Hub</span>
                    <span className="text-rose-400 font-bold">PASS #W3W-904</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Communities */}
          {activeTab === "communities" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "MANIT Bhopal Chapter", members: "220+", tag: "Campus Guild" },
                { name: "LNCT Developer Nest", members: "160+", tag: "Incubator Node" },
                { name: "MP Startup Hub", members: "120+", tag: "Innovation Hub" },
              ].map((guild) => (
                <div key={guild.name} className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-white/5 text-rose-300 font-mono text-[10px]">
                    {guild.tag}
                  </span>
                  <h4 className="text-base font-bold text-white">{guild.name}</h4>
                  <p className="text-xs text-zinc-400">{guild.members} Active Builders</p>
                  <button className="btn-luma-secondary py-2 px-4 text-xs w-full justify-center">
                    Joined Chapter
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Opportunities */}
          {activeTab === "opportunities" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Active Bounties & Grants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-emerald-400 font-bold">$2,500 USDC BOUNTY</span>
                    <span className="text-[10px] text-zinc-500">ENDS IN 5 DAYS</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Build Cross-chain Payment SDK</h4>
                  <p className="text-xs text-zinc-400">Sponsored by BharatPay Protocol</p>
                  <button className="btn-luma-accent py-2 px-4 text-xs w-full justify-center">
                    Apply for Bounty
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Hackathons */}
          {activeTab === "hackathons" && (
            <div className="space-y-6">
              <div className="luma-card p-6 bg-[#121217] border border-white/10 rounded-2xl space-y-4">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  LIVE HACKATHON
                </span>
                <h3 className="text-xl font-extrabold text-white">Central India Web3 Hackathon 2026</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  48-hour build track. $10,000 in bounties, grant allocations, and VC mentorship.
                </p>
                <div className="flex gap-3">
                  <button className="btn-luma-accent py-2.5 px-6 text-xs font-bold">
                    Register Team
                  </button>
                  <button className="btn-luma-secondary py-2.5 px-6 text-xs font-semibold">
                    Find Teammates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Rewards */}
          {activeTab === "rewards" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-950 border border-rose-500/30 text-center space-y-3">
                <Trophy className="w-10 h-10 text-rose-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Builder Rank #12</h4>
                <p className="text-xs text-zinc-400">520 XP Earned in 2026</p>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono inline-block">
                  Level 3 Developer Badge
                </span>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
