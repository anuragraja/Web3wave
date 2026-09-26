'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowUpRight, Gift, Coffee, Users, Laptop, Sparkles, CheckCircle2 } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { EventPoster } from '@/components/EventPoster'

export interface LumaEvent {
  id: string
  title: string
  eventType?: string
  dateString: string
  dayNumber: string
  monthName: string
  timeString: string
  venue: string
  location?: string
  hostName: string
  hostAvatar: string
  coverImage: string
  category: string
  attendeeCount: number
  capacity: number
  price: string
  description: string
  agenda: string[]
  highlights?: string[]
}

interface LumaEventGridProps {
  events: LumaEvent[]
  activeCategory: string
  onSelectEvent: (event: LumaEvent) => void
}

export function LumaEventGrid({ events, activeCategory, onSelectEvent }: LumaEventGridProps) {
  const filteredEvents =
    activeCategory === 'All Events' || activeCategory === 'Workshops'
      ? events
      : events.filter((e) => e.category === activeCategory)

  return (
    <section id="events" className="py-8 sm:py-12">
      <div className="shell">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#141418] border border-white/10 max-w-xl mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white mb-1">No Events Found</h3>
            <p className="text-xs text-zinc-400">
              There are currently no events listed under this category in the database. Check back soon for upcoming sessions!
            </p>
          </div>
        ) : filteredEvents.length === 1 ? (
          /* Single Featured Event Card */
          <div className="max-w-4xl mx-auto">
            {filteredEvents.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => onSelectEvent(evt)}
                className="luma-card relative group cursor-pointer flex flex-col bg-[#121217] border border-white/10 hover:border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(244,63,94,0.15)]"
              >
                <BorderBeam size="sm" duration={10} />

                {/* Event Poster Container with Branded Fallback */}
                <div className="relative w-full overflow-hidden bg-black/60 border-b border-white/10 flex items-center justify-center">
                  <EventPoster
                    posterUrl={evt.coverImage}
                    title={evt.title}
                    category={evt.category}
                    venue={evt.venue}
                    dateString={evt.dateString}
                    className="w-full h-auto max-h-[380px] sm:max-h-[440px] md:max-h-[480px] group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Date Badge Overlay */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#121216]/90 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
                    <span className="text-sm sm:text-base font-black text-white font-mono leading-none">
                      {evt.dayNumber}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-rose-400 uppercase">
                      {evt.monthName}
                    </span>
                  </div>

                  {/* Type & Price Badges Overlay */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                    <span className="bg-rose-500/80 backdrop-blur-md border border-rose-300/40 text-white rounded-full px-3 py-1 text-[10px] sm:text-xs font-mono font-bold shadow-md">
                      {evt.eventType || '1 Day Workshop'}
                    </span>
                    <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold">
                      {evt.price}
                    </span>
                  </div>
                </div>

                {/* Details Below Poster */}
                <div className="p-6 sm:p-8 md:p-10 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 font-mono text-[11px]">
                        {evt.eventType || '1 Day Workshop'}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {evt.dateString}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-rose-300 transition-colors tracking-tight leading-tight">
                      {evt.title}
                    </h3>
                  </div>

                  {/* Meta Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-zinc-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
                          DATE & TIME
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">{evt.dateString}</div>
                        <div className="text-rose-400 font-mono text-xs font-semibold">{evt.timeString}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-1 rounded-xl">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                          VENUE & LOCATION
                        </div>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
                          {evt.venue}
                        </div>
                        <div className="text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed mt-0.5">
                          {evt.location || 'Bhopal, MP'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      SESSION OVERVIEW
                    </h4>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                      {evt.description}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3">
                      EVENT HIGHLIGHTS
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Upto ₹10K Free Goodies</span>
                          <span className="text-[11px] text-zinc-400">Stickers, Swags & More</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Free Refreshments</span>
                          <span className="text-[11px] text-zinc-400">Snacks & Beverages for all attendees</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Meet & Network</span>
                          <span className="text-[11px] text-zinc-400">With like-minded builders & Web3 enthusiasts</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Learn from Industry Experts</span>
                          <span className="text-[11px] text-zinc-400">Hands-on Sessions & Live Demos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={evt.hostAvatar}
                        alt={evt.hostName}
                        width={32}
                        height={32}
                        unoptimized
                        className="w-8 h-8 rounded-full object-contain bg-[#181820] p-0.5 ring-1 ring-white/20"
                      />
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">ORGANIZED BY</div>
                        <div className="text-xs font-bold text-white">{evt.hostName}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEvent(evt)
                      }}
                      className="btn-luma-primary py-3 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reserve Your Seat (Free)</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Multi-card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectEvent(evt)}
                className="luma-card relative group cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <BorderBeam size="sm" />
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <EventPoster
                      posterUrl={evt.coverImage}
                      title={evt.title}
                      category={evt.category}
                      venue={evt.venue}
                      dateString={evt.dateString}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent opacity-90 pointer-events-none" />

                    <div className="absolute top-3 left-3 bg-[#121216]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
                      <span className="text-sm font-black text-white font-mono leading-none">
                        {evt.dayNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                        {evt.monthName}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-400">
                      {evt.price}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1.5">
                      <span>{evt.eventType || evt.category}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {evt.dateString}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug mb-3">
                      {evt.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-zinc-400 font-medium mb-4">
                      <div className="flex items-center gap-2 truncate">
                        <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{evt.timeString}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={evt.hostAvatar}
                      alt={evt.hostName}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
                    />
                    <span className="text-xs text-zinc-400 font-medium truncate max-w-[130px]">
                      {evt.hostName}
                    </span>
                  </div>

                  <button className="btn-luma-primary py-1.5 px-3.5 text-xs">
                    <span>Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
