'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Plus, MapPin, Users, Zap, Trophy, Rocket, Flame, ArrowRight, ShieldCheck } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { useAuth } from '@/src/context/AuthContext'
import { isUserAdmin } from '@/src/utils/eventUtils'

interface LumaHeroProps {
  onOpenSubscribe: () => void
  onOpenCreateEvent: () => void
  activeCategory: string
  onSelectCategory: (cat: string) => void
}

const categories = ['All Events', 'Workshops']

const pillars = [
  {
    icon: Users,
    badge: 'CENTRAL INDIA NODE',
    title: 'Who We Are',
    desc: 'Central India’s premier Web3 builder network based in Bhopal, uniting 500+ developers, protocol researchers, founders, and campus hackers into a high-accountability collective.',
    highlight: '500+ Connected Builders',
    color: 'from-rose-500/20 to-rose-600/5',
    border: 'border-rose-500/20 hover:border-rose-500/50',
    iconColor: 'text-rose-400 bg-rose-500/10',
    variant: 'colorful' as const,
  },
  {
    icon: Zap,
    badge: 'HANDS-ON LEARNING',
    title: 'Hackathons & Build Nights',
    desc: 'We host weekly in-person coding sprints, smart contract workshops, zero-knowledge masterclasses, and local hackathons across Bhopal.',
    highlight: 'Weekly Build Sprints',
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/50',
    iconColor: 'text-purple-400 bg-purple-500/10',
    variant: 'ocean' as const,
  },
  {
    icon: Trophy,
    badge: 'GLOBAL PIPELINE',
    title: 'Grants & USDC Bounties',
    desc: 'Direct access pipelines connecting local developers to global Web3 foundation grants (Ethereum, Solana, Polygon, Arbitrum) and bounty rewards.',
    highlight: 'Ecosystem Funding',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20 hover:border-amber-500/50',
    iconColor: 'text-amber-400 bg-amber-500/10',
    variant: 'sunset' as const,
  },
  {
    icon: Rocket,
    badge: 'CAMPUS CHAPTERS',
    title: 'Incubation & Guilds',
    desc: 'Student builder incubators at MANIT Bhopal, LNCT, and MP Startup Hub that help turn hackathon ideas into production smart contracts.',
    highlight: 'MANIT · LNCT · MP Hub',
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    iconColor: 'text-cyan-400 bg-cyan-500/10',
    variant: 'colorful' as const,
  },
]

export function LumaHero({
  onOpenSubscribe,
  onOpenCreateEvent,
  activeCategory,
  onSelectCategory,
}: LumaHeroProps) {
  const { user } = useAuth()
  const isAdmin = isUserAdmin(user)

  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="luma-ambient" aria-hidden="true" />

      <div className="shell relative z-10">
        {/* Who We Are & What We Do Header & 4 Pillars Grid */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>WELCOME TO WEB3WAVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Who We Are & What We Do
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
              Web3Wave is Central India's flagship Web3 builder ecosystem. We bring together developers, researchers, and campus guilds to build, ship, and scale decentralized protocols.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-b ${item.color} bg-[#131317]/80 backdrop-blur-xl border ${item.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between overflow-hidden`}
              >
                <BorderBeam colorVariant={item.variant} duration={8 + idx * 2} delay={idx * 1.5} />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${item.iconColor} flex items-center justify-center border border-white/5`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{item.highlight}</span>
                  <span className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Calendar Header Card */}
        <div className="luma-card relative p-6 sm:p-10 mb-10 bg-gradient-to-b from-[#18181f] to-[#131317] border border-white/10 overflow-hidden">
          <BorderBeam colorVariant="colorful" duration={10} />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Info */}
            <div className="flex items-start gap-6">
              {/* Mark */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-rose-500/30 via-purple-500/30 to-cyan-500/30 p-0.5 shadow-xl shadow-rose-500/20 shrink-0 flex items-center justify-center bg-[#121217]">
                <Image
                  src="/web3wave-logo.png"
                  alt="Web3Wave Logo"
                  width={64}
                  height={64}
                  className="w-12 sm:w-16 h-auto object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    Verified Calendar
                  </span>
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    Bhopal & Central India Node
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  Web3Wave Community Calendar
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed mb-4">
                  The central event platform for Web3, AI, and open-source developer meetups, workshops, and hack nights.
                </p>

                {/* Subscriber Avatars */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <Image
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#16161a] object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Subscriber Avatar"
                      width={28}
                      height={28}
                    />
                    <Image
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#16161a] object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      alt="Subscriber Avatar"
                      width={28}
                      height={28}
                    />
                    <Image
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#16161a] object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                      alt="Subscriber Avatar"
                      width={28}
                      height={28}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">
                    <strong className="text-white">500+ builders</strong> subscribed
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Bar */}
            <div className="flex flex-wrap lg:flex-col items-stretch gap-3 min-w-[220px]">
              <Link
                href="/events"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-cyan-300" />
                <span>Hackathons & Workshops Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={onOpenSubscribe}
                className="btn-luma-accent py-3 px-6 text-sm flex-1 lg:flex-initial justify-center"
              >
                <Bell className="w-4 h-4" />
                <span>Subscribe Calendar</span>
              </button>

              {/* Show Create Event ONLY if Admin */}
              {isAdmin && (
                <button
                  onClick={onOpenCreateEvent}
                  className="btn-luma-secondary py-3 px-6 text-sm flex-1 lg:flex-initial justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Local Event (Admin)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Event Category Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                    : 'bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-zinc-500 hidden sm:block shrink-0">
            Showing upcoming sessions
          </div>
        </div>
      </div>
    </section>
  )
}
