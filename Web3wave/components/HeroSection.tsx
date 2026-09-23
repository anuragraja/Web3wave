'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Terminal, Shield, Cpu, Users } from 'lucide-react'

interface HeroSectionProps {
  onOpenJoin: () => void
}

export function HeroSection({ onOpenJoin }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] pt-36 pb-20 flex items-center border-b border-zinc-800 bg-[#09090b]">
      <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Copy */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Main Headline (No gradient text, solid high-contrast display) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
            Building Bhopal&apos;s Web3 & Onchain Collective.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-zinc-400 leading-relaxed max-w-xl mb-10 font-normal">
            A grassroots ecosystem connecting developers, protocol founders, researchers, and creators shaping decentralized technology from Central India to the world.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={onOpenJoin} className="btn-accent py-3.5 px-7 text-sm">
              <span>Join Community</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-800 hover:border-zinc-600 text-sm font-semibold text-zinc-300 hover:text-white transition-colors bg-zinc-900/50"
            >
              <span>Explore Events</span>
              <ArrowDownRight className="w-4 h-4 text-zinc-500" />
            </a>
          </div>

          {/* Real Metrics Grid */}
          <div className="mt-14 pt-8 border-t border-zinc-800/80 w-full grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                500+
              </div>
              <div className="text-xs text-zinc-400 font-semibold mt-1">
                Active Builders
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                20+
              </div>
              <div className="text-xs text-zinc-400 font-semibold mt-1">
                Hackathons & Sessions
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                10+
              </div>
              <div className="text-xs text-zinc-400 font-semibold mt-1">
                Shipped DApps & Rails
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Highlight Box */}
        <div className="lg:col-span-5">
          <div className="craft-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                COMMUNITY MANIFESTO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                ACTIVE GUILD
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">Grassroots & Open Source</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No gatekeeping. We build in public, share code, host peer audits, and ship real projects together.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">MANIT & LNCT Campus Hubs</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct student-led guilds bringing Web3 research into top technical institutions across MP.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">Global Ecosystem Access</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct pipelines to global hackathons, grant funds, incubator programs, and investor networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
