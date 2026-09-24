"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export interface SocialLink {
  icon: React.ElementType;
  href: string;
}

export interface TeamMember {
  name: string;
  designation: string;
  imageSrc: string;
  socialLinks?: SocialLink[];
}

export interface TeamSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  members?: TeamMember[];
  registerLink?: string;
  logo?: React.ReactNode;
  socialLinksMain?: SocialLink[];
}

export const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  (
    {
      title,
      description,
      members,
      registerLink,
      logo,
      socialLinksMain,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden bg-[#0c0c10] text-white py-14 sm:py-16 md:py-20 border-b border-white/10",
          className
        )}
        {...props}
      >
        {/* Ambient Glow & Grid Backdrop */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <svg className="h-full w-full" fill="none">
            <defs>
              <pattern
                id="leadership-grid"
                x="0"
                y="0"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M28 0L0 0 0 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-rose-500/50"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leadership-grid)" />
          </svg>
        </div>

        {/* Central Radial Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card Container */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/60 relative overflow-hidden group">
            {/* Subtle Gradient Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
              {/* Left Column: Heading, Badge, Description */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-4 shadow-sm shadow-rose-950/40">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>O U R &nbsp; L E A D E R S H I P</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] mb-4">
                  {title}
                </h2>

                <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {description}
                </p>
              </div>

              {/* Right Column: Logo & CTA Button */}
              <div className="flex flex-col items-center md:items-end justify-center gap-4 shrink-0">
                {logo && (
                  <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono tracking-widest drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                    {logo}
                  </div>
                )}
                {registerLink && (
                  <Link
                    href={registerLink}
                    className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 px-6 sm:px-8 text-xs sm:text-sm font-bold font-mono tracking-wider text-white shadow-lg shadow-rose-500/30 transition-all duration-200 border border-rose-400/30"
                  >
                    <span>JOIN NETWORK</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Row: Social Links & Domain */}
            {socialLinksMain && socialLinksMain.length > 0 && (
              <div className="relative z-10 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center md:justify-between gap-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {socialLinksMain.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200 active:scale-95"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-400 hover:text-rose-300 transition-colors font-mono text-xs sm:text-sm font-medium tracking-wide">
                    web3wave.in
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";
