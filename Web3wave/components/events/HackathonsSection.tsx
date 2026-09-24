'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Zap,
  Calendar,
  Clock,
  MapPin,
  Users,
  Code2,
  Cpu,
  ShieldCheck,
  Globe2,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Gift,
  Coins,
  Laptop
} from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

export interface HackathonTrack {
  id: string
  title: string
  sponsor: string
  prize: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
}

export interface HackathonItem {
  id: string
  title: string
  status: 'LIVE NOW' | 'UPCOMING' | 'REGISTRATIONS OPEN' | 'COMPLETED'
  dateRange: string
  prizePool: string
  venue: string
  participantsCount: number
  coverImage: string
  description: string
  tracks: HackathonTrack[]
}

export const sampleHackathons: HackathonItem[] = []

interface HackathonsSectionProps {
  onRegisterHackathon: (hackathon: HackathonItem) => void
}

export function HackathonsSection({ onRegisterHackathon }: HackathonsSectionProps) {
  const featured = sampleHackathons[0]
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 14, mins: 32, secs: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 }
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!featured) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121624]/60 p-8 text-center text-zinc-400">
        <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Hackathon Season Announced Soon</h3>
        <p className="text-xs text-zinc-400">Stay tuned for upcoming hackathon tracks and bounty announcements.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Featured Hackathon Hero Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <BorderBeam size="md" colorVariant="colorful">
          <div className="rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-[#121624] via-[#0d101d] to-[#0a0a0f] p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 animate-pulse">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              {featured.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              {featured.dateRange}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coins className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Prize Pool: {featured.prizePool}</span>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featured.title}
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              {featured.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{featured.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{featured.participantsCount}+ Builders Registered</span>
              </div>
            </div>

            {/* Countdown Ticker Box */}
            <div className="pt-4">
              <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hackathon Countdown Ticker</span>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-xs text-center">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINS', val: timeLeft.mins },
                  { label: 'SECS', val: timeLeft.secs }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-cyan-500/20 rounded-xl py-2 px-1">
                    <span className="text-xl md:text-2xl font-black text-white font-mono">{String(item.val).padStart(2, '0')}</span>
                    <span className="block text-[9px] text-zinc-400 font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onRegisterHackathon(featured)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group"
              >
                <span>Register Team / Solo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#hackathon-tracks"
                className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>View Bounties & Tracks</span>
              </a>
            </div>
          </div>

          {/* Right Preview Banner Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0d0d12]/90 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Hybrid Platform
                  </span>
                  <span className="text-cyan-400 font-mono">Web3Wave Discord</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Free food, 24/7 mentorship, high-speed WiFi & Discord pitch room access provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hackathon Tracks Grid */}
        <div id="hackathon-tracks" className="mt-12 pt-10 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                Hackathon Tracks & Protocol Bounties
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Pick a track or combine multiple bounties to maximize your hackathon winnings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.tracks.map((track) => {
              const IconComp = track.icon
              return (
                <div
                  key={track.id}
                  className={`rounded-2xl border p-5 bg-gradient-to-b ${track.color} backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                        {track.prize}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white leading-tight mb-1">
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-cyan-300 font-mono mb-2">
                        Sponsor: {track.sponsor}
                      </p>
                      <p className="text-xs text-zinc-300 leading-snug">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Direct Grant Fast-Track
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </div>
        </BorderBeam>
      </motion.div>

      {/* Upcoming & Past Hackathons List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          More Web3Wave Hackathons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleHackathons.slice(1).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#121217] border border-white/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {item.status}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{item.dateRange}</span>
                </div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Prize Pool: {item.prizePool}
                </div>
              </div>

              <button
                onClick={() => onRegisterHackathon(item)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/30 text-xs font-bold text-white transition-all whitespace-nowrap"
              >
                Register Interest
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
