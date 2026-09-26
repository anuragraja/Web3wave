'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Clock, Users, CheckCircle2, QrCode, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react'
import { LumaEvent } from './LumaEventGrid'
import { EventPoster } from '@/components/EventPoster'
import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'
import { registerForEventApi } from '@/src/api/events'

interface LumaEventModalProps {
  event: LumaEvent | null
  onClose: () => void
}

export function LumaEventModal({ event, onClose }: LumaEventModalProps) {
  useModalScrollLock(!!event)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketIssued, setTicketIssued] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!event) return null

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!name.trim()) {
      setErrorMsg('Full Name is required.')
      return
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    const targetEventId = (event as any).backendId || event.id

    setIsSubmitting(true)
    try {
      if (targetEventId && targetEventId.length === 24) {
        const res = await registerForEventApi(targetEventId, {
          name: name.trim(),
          email: email.trim(),
          role,
        })
        setSuccessMsg(res.message || 'Seat reserved successfully!')
        setTicketIssued(true)
      } else {
        // Fallback for mock/static events without 24-char ObjectId
        setSuccessMsg('Seat reserved successfully!')
        setTicketIssued(true)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register for event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto overscroll-none"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          className="luma-card max-w-2xl w-full bg-[#141418] border border-white/10 my-auto relative overflow-y-auto max-h-[85vh] overscroll-contain shadow-2xl rounded-3xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Cover Image / Workshop Poster with Branded Fallback */}
          <div className="relative w-full overflow-hidden bg-black/60 border-b border-white/10 flex items-center justify-center">
            <EventPoster
              posterUrl={event.coverImage}
              title={event.title}
              category={event.category}
              venue={event.venue}
              dateString={event.dateString}
              className="w-full h-auto max-h-[360px] sm:max-h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10">
              <span className="text-xs font-bold text-rose-300 bg-rose-500/80 backdrop-blur-md px-3 py-1 rounded-full border border-rose-300/30 shadow-md">
                {event.eventType || event.category}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
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
                className="w-9 h-9 rounded-full object-contain bg-[#181820] p-1 ring-2 ring-white/20"
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
                  <div className="text-white font-bold">{event.dateString}</div>
                  <div className="text-rose-400 font-mono">{event.timeString}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] font-mono">VENUE & LOCATION</div>
                  <div className="text-white font-bold">{event.venue}</div>
                  <div className="text-zinc-400 text-[11px]">{event.location || 'Bhopal, MP'}</div>
                </div>
              </div>
            </div>

            {/* Overview & Description */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                ABOUT THIS SESSION
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {event.description}
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Registration Form / Issued Ticket View */}
            <div className="p-6 rounded-2xl bg-[#181822] border border-white/10">
              {ticketIssued ? (
                <div className="text-center space-y-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{successMsg || 'Seat Reserved!'}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Your registration ticket for <strong className="text-white">{name}</strong> ({email}) has been issued.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-zinc-500 block font-mono">BUILDER PASS TICKET</span>
                      <span className="text-xs font-bold text-rose-300">{event.title}</span>
                    </div>
                    <QrCode className="w-8 h-8 text-zinc-400" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRSVP} className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Reserve Your Builder Seat (Free)</span>
                    <span className="text-xs font-normal text-rose-400 font-mono">Limited Seats</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if(errorMsg) setErrorMsg(''); }}
                        placeholder="Alex Rivera"
                        className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if(errorMsg) setErrorMsg(''); }}
                        placeholder="alex@web3wave.in"
                        className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Reserving...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm RSVP & Get Pass</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
