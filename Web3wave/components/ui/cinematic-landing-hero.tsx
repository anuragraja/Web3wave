"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";

const INJECTED_STYLES = `
  /* Environment Overlays */
  @media (min-width: 768px) {
    .film-grain {
        position: absolute; inset: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
        background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
    }
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .wave-ambient-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 320px;
      height: 200px;
      background: radial-gradient(ellipse at center, rgba(244, 63, 94, 0.18) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%);
      filter: blur(30px);
      pointer-events: none;
  }

  @media (min-width: 768px) {
    .wave-ambient-glow {
        width: 600px;
        height: 300px;
        filter: blur(80px);
        animation: wavePulse 6s ease-in-out infinite alternate;
    }
  }

  @keyframes wavePulse {
      0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
      100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
  }

  /* Theme-aware text */
  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  /* Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({ 
  brandName = "Web3Wave",
  tagline1 = "Central India's Web3 Hub,",
  tagline2 = "BUILD. SHIP. GROW.",
  cardHeading = "Who We Are & What We Do.",
  cardDescription = <><span className="text-white font-semibold">Web3Wave</span> is Central India's flagship Web3 developer collective in Bhopal. We host local hackathons, connect coders to global Web3 protocol grants & USDC bounties, incubate campus guilds, and turn code into shipped dApps.</>,
  metricValue = 500,
  metricLabel = "Active Builders",
  ctaHeading = "Ready to build onchain?",
  ctaDescription = "Subscribe to the official Web3Wave community calendar and get instant invites to local hack nights, grant sprints, and workshops.",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-full bg-background text-foreground font-sans antialiased overflow-hidden",
        className
      )}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true" />
      <div className="wave-ambient-glow" aria-hidden="true" />

      {/* FLUID PARTICLES ANIMATION BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <FluidParticlesBackground particleCount={isMobile ? 120 : 500} noiseIntensity={0.003} />
      </div>

      {/* FOLD 1: FULL SCREEN HERO HEADLINE (EXACTLY 2 LINES WITH TIGHT SPACING) */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center text-center px-2 sm:px-4">
        <div className="hero-text-wrapper flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto my-auto space-y-0">
          <h1 className="text-3d-matte text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.8rem] font-bold tracking-tight mb-0 sm:mb-1 leading-[0.95] whitespace-nowrap">
            {tagline1}
          </h1>
          <h1 className="text-silver-matte text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.8rem] font-extrabold tracking-tighter leading-[0.95] whitespace-nowrap">
            {tagline2}
          </h1>
        </div>
      </div>

      {/* FOLD 2: WIDER LIGHTWEIGHT INFORMATION PANEL */}
      <div className="relative z-10 w-full pb-24 pt-6 px-4 md:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl rounded-2xl md:rounded-3xl bg-neutral-950/80 border border-rose-500/25 backdrop-blur-xl p-6 sm:p-10 text-left shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300 hover:border-rose-500/40">
          
          {/* Subtle background ambient radial glow inside panel */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Panel Telemetry / Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_#f43f5e]" />
              <span className="tracking-wider">{brandName}</span>
            </div>
            <span className="text-xs font-mono text-rose-200/60 uppercase tracking-widest">
              Central India Web3 Developer Collective
            </span>
          </div>

          {/* Card Heading & Description */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            {cardHeading}
          </h2>
          <div className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed mb-8 font-normal">
            {cardDescription}
          </div>

          {/* Core Ecosystem Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 mb-8">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/25 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-400 text-sm">
                ⚡
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white">Builders & Developers</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">Connecting {metricValue}+ coders & campus guilds across Central India</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/25 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-400 text-sm">
                🏆
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white">Hackathons & Workshops</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">Local hack nights, dApp bootcamps & build sprints</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/25 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-400 text-sm">
                🌐
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white">Web3 Protocol Ecosystem</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">Direct links to global protocol grants & USDC bounties</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/25 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-400 text-sm">
                🚀
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white">Shipped Onchain dApps</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">Turning code into live, protocol-funded production rails</p>
              </div>
            </div>
          </div>

          {/* HERO CTA BUTTONS INSIDE PANEL */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2 w-full border-t border-white/10 pt-6">
            <a
              href="#events"
              className="btn-modern-light w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl group focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <svg className="w-5 h-5 text-rose-500 transition-transform group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] font-bold tracking-wider text-neutral-500 uppercase mb-[-2px]">Explore Community</div>
                <div className="text-lg font-bold leading-none tracking-tight">Events Calendar</div>
              </div>
            </a>

            <a
              href="https://discord.gg/sPHtRJPfQz"
              className="btn-modern-dark w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl group focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-background"
            >
              <svg className="w-5 h-5 text-white transition-transform group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <div className="text-left">
                <div className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase mb-[-2px]">Get Started</div>
                <div className="text-lg font-bold leading-none tracking-tight">Join Network</div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}


