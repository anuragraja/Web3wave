'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Users, ArrowUpRight, Copy, Check, ShieldCheck, Zap } from 'lucide-react'
import { BorderBeamPanel } from '@/components/ui/border-beam-panel'

export function DiscordSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyInvite = () => {
    navigator.clipboard.writeText('https://discord.gg/web3wave')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="discord" className="py-20 border-t border-white/10 relative overflow-hidden bg-[#0a0a0d]">
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="shell relative z-10">
        <BorderBeamPanel
          beams={2}
          thickness={2}
          radius={24}
          glow={true}
          idleSpeed={45}
          hoverSpeed={220}
          colors={["#f43f5e", "#22c7d9"]}
          className="p-8 sm:p-14 bg-gradient-to-b from-[#181824] via-[#12121c] to-[#0e0e15] border border-white/12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Info */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>OFFICIAL DISCORD GUILD</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  340+ Online Now
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Hang out in the <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">
                  Web3Wave Discord.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl mb-8">
                Get 24/7 peer code support, collaborate on hackathon projects, discover Web3 bounties, and get direct feedback from senior protocol engineers.
              </p>

              {/* Channel Tags Preview */}
              <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                  #general-chat
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                  #dev-help
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-rose-300 font-semibold">
                  #bounties-and-grants
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                  #hackathons
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                  #ship-showcase
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luma-accent py-3.5 px-7 text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 hover:from-indigo-500 hover:to-rose-400 shadow-lg shadow-indigo-500/25"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Join Discord Community</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  onClick={handleCopyInvite}
                  className="btn-luma-secondary py-3.5 px-5 text-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Invite Copied!' : 'Copy Invite Link'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: High-Tech Discord Stats Box */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0b12] border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Web3Wave Guild</div>
                      <div className="text-[10px] font-mono text-zinc-400">discord.gg/web3wave</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                    OPEN GUILD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-1">TOTAL MEMBERS</span>
                    <span className="text-white text-lg font-bold">500+</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-1">ONLINE NOW</span>
                    <span className="text-emerald-400 text-lg font-bold">340+</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Verified developer role badges</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Weekly voice stage AMA sessions & code reviews</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Exclusive hackathon team matching channels</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderBeamPanel>
      </div>
    </section>
  )
}
