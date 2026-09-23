'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Clock, Users, CheckCircle2, QrCode, ArrowUpRight, Share2 } from 'lucide-react'
import { LumaEvent } from './LumaEventGrid'

interface LumaEventModalProps {
  event: LumaEvent | null
  onClose: () => void
}

export function LumaEventModal({ event, onClose }: LumaEventModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [ticketIssued, setTicketIssued] = useState(false)

  if (!event) return null

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault()
    setTicketIssued(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="luma-card max-w-2xl w-full bg-[#141418] border border-white/10 my-8 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Cover Image */}
          <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/40 to-transparent" />

            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/20">
                {event.category}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20">
                {event.price}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Title & Host */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {event.title}
            </h2>

            <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
              <img
                src={event.hostAvatar}
                alt={event.hostName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
              />
              <div>
                <div className="text-xs text-zinc-400">Hosted by</div>
                <div className="text-sm font-bold text-white">{event.hostName}</div>
              </div>
            </div>

            {/* Time & Venue Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 font-medium text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-500 text-[10px] font-mono">DATE & TIME</div>
                  <div>{event.dateString}</div>
                  <div className="text-zinc-400">{event.timeString}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-500 text-[10px] font-mono">LOCATION</div>
                  <div className="text-white font-semibold">{event.venue}</div>
                </div>
              </div>
            </div>

            {/* Description & Agenda */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                ABOUT THIS EVENT
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {event.description}
              </p>

              {event.agenda.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    SCHEDULE AGENDAS
                  </h3>
                  <div className="space-y-2 font-mono text-xs">
                    {event.agenda.map((ag, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-300">
                        {ag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Registration State or Issued Pass */}
            {ticketIssued ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">You&apos;re Registered!</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Ticket pass issued for <strong className="text-white">{name}</strong>. Confirmation email sent to {email}.
                </p>

                {/* Digital Pass Stub */}
                <div className="w-full max-w-sm rounded-2xl bg-[#0e0e12] border border-white/10 p-5 text-left font-mono text-xs mb-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                    <span className="text-[10px] text-rose-400 font-bold">WEB3WAVE EVENT PASS</span>
                    <span className="text-[9px] text-zinc-500">PASS ID: W3W-9841</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{event.title}</div>
                  <div className="text-xs text-zinc-400 mb-3">{event.dateString}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-zinc-500 block">ATTENDEE</span>
                      <span className="text-white font-bold">{name}</span>
                    </div>
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luma-primary text-xs py-2 px-4"
                  >
                    <span>Add to Google Calendar</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold text-white mb-4">
                  Registration / RSVP
                </h3>

                <form onSubmit={handleRSVP} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        FULL NAME
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivers"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        EMAIL ADDRESS
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@web3bhopal.in"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      YOUR ROLE / CRAFT
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#1a1a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Developer">Developer / Engineer</option>
                      <option value="Founder">Protocol Founder / Startup</option>
                      <option value="Student">Student Builder</option>
                      <option value="Designer">UI/UX Designer</option>
                      <option value="Researcher">ZK / AI Researcher</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full btn-luma-accent py-3 text-sm justify-center">
                    <span>Complete Free Registration</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
