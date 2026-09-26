'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Users,
  Code2,
  Terminal,
  Download,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { EventPoster } from '@/components/EventPoster'

export interface Workshop {
  id: string
  title: string
  instructor: string
  instructorAvatar: string
  dateString: string
  timeString: string
  venue: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  techStack: string[]
  coverImage: string
  description: string
  starterKitRepo?: string
  recordingUrl?: string
  seatsLeft: number
  capacity: number
}

interface WorkshopsSectionProps {
  workshops?: Workshop[]
  onReserveWorkshop: (workshop: Workshop) => void
}

export function WorkshopsSection({ workshops = [], onReserveWorkshop }: WorkshopsSectionProps) {
  const [levelFilter, setLevelFilter] = useState('All Levels')

  const filteredWorkshops = workshops.filter(w => {
    if (levelFilter === 'All Levels') return true
    return w.level === levelFilter
  })

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900/30 via-[#1c1218] to-[#0d0d12] border border-rose-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              Hands-On Web3 Masterclasses
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Developer Workshops & Masterclasses
          </h2>
          <p className="text-xs md:text-sm text-zinc-300">
            A hands-on, beginner-friendly workshop environment to explore Web3 technologies and modern creative web development with industry experts.
          </p>
        </div>

        {/* Level Filter Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full">
          {['All Levels', 'Beginner'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                levelFilter === lvl
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Workshop Cards or Empty State */}
      <div className="max-w-4xl mx-auto w-full">
        {filteredWorkshops.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#121217] border border-white/10 space-y-3">
            <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Workshops Currently Scheduled</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              There are no published workshop events in the database right now. New build sessions and masterclasses will be published soon!
            </p>
          </div>
        ) : (
          filteredWorkshops.map((workshop) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl bg-[#121217] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all group my-6"
            >
              <BorderBeam size="md" colorVariant="colorful" />
              <div>
                {/* Cover Image / Poster with Branded Fallback */}
                <div className="relative w-full overflow-hidden bg-black/60 flex items-center justify-center border-b border-white/10">
                  <EventPoster
                    posterUrl={workshop.coverImage}
                    title={workshop.title}
                    category="Workshops"
                    venue={workshop.venue}
                    dateString={workshop.dateString}
                    className="w-full h-auto max-h-[460px] group-hover:scale-[1.01] transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider backdrop-blur-md bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      {workshop.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider backdrop-blur-md bg-rose-500/20 text-rose-300 border-rose-500/30">
                      Workshop
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/10">
                    {workshop.capacity} Capacity
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={workshop.instructorAvatar}
                        alt={workshop.instructor}
                        className="w-8 h-8 rounded-full object-cover border border-rose-500/30 bg-[#121217] p-0.5"
                      />
                      <div className="text-xs">
                        <span className="text-zinc-400">Organized by: </span>
                        <span className="font-bold text-white">{workshop.instructor}</span>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {workshop.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-rose-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug group-hover:text-rose-300 transition-colors">
                      {workshop.title}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed mt-2">
                      {workshop.description}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Workshop Highlights
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                        <span className="text-xl">🎁</span>
                        <div>
                          <div className="text-xs font-bold text-white">Free Goodies</div>
                          <div className="text-[11px] text-zinc-400">Stickers, Swags & More</div>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                          <div className="text-xs font-bold text-white">Ideas & Inspiration</div>
                          <div className="text-[11px] text-zinc-400">Discover new ideas, trends and opportunities in Web3</div>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                        <span className="text-xl">🤝</span>
                        <div>
                          <div className="text-xs font-bold text-white">Meet & Network</div>
                          <div className="text-[11px] text-zinc-400">With like-minded builders, designers and Web3 enthusiasts</div>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                        <span className="text-xl">💻</span>
                        <div>
                          <div className="text-xs font-bold text-white">Learn from Industry Experts</div>
                          <div className="text-[11px] text-zinc-400">Hands-on Sessions & Live Demos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meta details: Date/Time & Venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-zinc-300 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">
                          Date & Time
                        </div>
                        <div className="text-white font-black text-sm sm:text-base mt-0.5">
                          {workshop.dateString}
                        </div>
                        <div className="text-rose-400 font-mono text-xs font-bold mt-0.5">
                          {workshop.timeString}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.06)]">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-wider">
                          Venue & Location
                        </div>
                        <div className="text-white font-black text-sm sm:text-base mt-0.5">
                          {workshop.venue}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onReserveWorkshop(workshop)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-sm font-extrabold text-white transition-all shadow-[0_0_25px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reserve Seat & View Details</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
