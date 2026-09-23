'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Clock, CheckCircle2, ArrowUpRight, Plus, Terminal, Users, Trophy, QrCode, Phone, AlertCircle } from 'lucide-react'
import { LumaEvent } from './LumaEventGrid'

interface LumaCreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: LumaEvent) => void
}

export function LumaCreateEventModal({
  isOpen,
  onClose,
  onAddEvent,
}: LumaCreateEventModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Workshops')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [hostName, setHostName] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [hostPhone, setHostPhone] = useState('')
  const [capacity, setCapacity] = useState('60')
  const [description, setDescription] = useState('')
  const [agenda, setAgenda] = useState('1. Keynote & Technical Deep Dive\n2. Live Code Sprint & Demo\n3. Q&A & Peer Networking')
  
  const [errorMsg, setErrorMsg] = useState('')
  const [createdEvent, setCreatedEvent] = useState<LumaEvent | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  // Ensure phone only accepts numbers (0-9) and caps at 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    const numericOnly = rawVal.replace(/\D/g, '').slice(0, 10)
    setHostPhone(numericOnly)
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // Strict Field Validation
    if (!title.trim()) {
      setErrorMsg('Event / Workshop Title is required.')
      return
    }
    if (!capacity || parseInt(capacity) <= 0) {
      setErrorMsg('Target Capacity must be a positive number.')
      return
    }
    if (!date) {
      setErrorMsg('Please select an event date.')
      return
    }
    if (!time.trim()) {
      setErrorMsg('Time Slot is required (e.g. 05:00 PM - 08:00 PM IST).')
      return
    }
    if (!venue.trim()) {
      setErrorMsg('Venue / Location is required.')
      return
    }
    if (!hostName.trim()) {
      setErrorMsg('Host / Organizer Name is required.')
      return
    }
    if (!hostEmail.trim() || !/\S+@\S+\.\S+/.test(hostEmail)) {
      setErrorMsg('Please enter a valid Organizer Contact Email.')
      return
    }
    if (!hostPhone || hostPhone.length !== 10) {
      setErrorMsg('Organizer Contact Number is required and must contain exactly 10 digits.')
      return
    }
    if (!description.trim()) {
      setErrorMsg('Session Description is required.')
      return
    }

    // Format date string nicely
    const dateObj = new Date(date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    
    const dayName = days[dateObj.getDay()] || 'Saturday'
    const monthName = months[dateObj.getMonth()] || 'NOV'
    const dayNum = String(dateObj.getDate()).padStart(2, '0')
    const formattedDateStr = `${dayName}, ${monthName} ${dayNum}, ${dateObj.getFullYear()}`

    const newEvt: LumaEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      dateString: formattedDateStr,
      dayNumber: dayNum,
      monthName: monthName,
      timeString: time.trim(),
      venue: venue.trim(),
      hostName: hostName.trim(),
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      coverImage: category === 'Workshops' 
        ? 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=85'
        : category === 'Hackathons'
        ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=85'
        : 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
      category: category,
      attendeeCount: 1,
      capacity: parseInt(capacity) || 50,
      price: 'Free',
      description: description.trim(),
      agenda: agenda.split('\n').filter(Boolean),
    }

    onAddEvent(newEvt)
    setCreatedEvent(newEvt)
    setSuccess(true)
  }

  const handleCloseAndReset = () => {
    setSuccess(false)
    setCreatedEvent(null)
    setErrorMsg('')
    setTitle('')
    setDate('')
    setTime('')
    setVenue('')
    setHostName('')
    setHostEmail('')
    setHostPhone('')
    setDescription('')
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseAndReset}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-[#121217] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] my-8"
        >
          <button
            onClick={handleCloseAndReset}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {success && createdEvent ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                  EVENT LIVE ON COMMUNITY CALENDAR
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Published Successfully!</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto">
                  Your <span className="text-rose-300 font-bold">{createdEvent.category}</span> session has been published and is now live on the event calendar.
                </p>
              </div>

              {/* Event Card Summary */}
              <div className="bg-[#181822] border border-white/10 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">EVENT TITLE</span>
                    <span className="font-bold text-white">{createdEvent.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">CATEGORY</span>
                    <span className="font-mono text-rose-400 font-bold">{createdEvent.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">DATE & TIME</span>
                    <span className="font-semibold text-zinc-200">{createdEvent.dateString} ({createdEvent.timeString})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">VENUE</span>
                    <span className="text-xs text-zinc-300 font-medium">{createdEvent.venue}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] text-rose-400 font-mono">
                    <span className="block font-bold">HOST: {createdEvent.hostName}</span>
                    <span className="text-zinc-400">PHONE: +91 {hostPhone}</span>
                  </div>
                  <QrCode className="w-8 h-8 text-zinc-400" />
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                View Live in Calendar
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-2">
                <Plus className="w-4 h-4" />
                <span>Host Event / Workshop</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                Submit an Event or Workshop
              </h2>
              <p className="text-xs text-zinc-400 mb-5">
                All fields marked with <span className="text-rose-400 font-bold">*</span> are required.
              </p>

              {/* Error Message Banner */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Event / Workshop Title <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="e.g. Solidity Smart Contract & Foundry Masterclass"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Event Category <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Workshops">Workshops</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Meetups">Meetups</option>
                      <option value="Grant Sprints">Grant Sprints</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Target Capacity <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="60"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Date <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Time Slot <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={time}
                      onChange={(e) => { setTime(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      placeholder="05:00 PM - 08:00 PM IST"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Venue / Hybrid Location (Bhopal) <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={venue}
                    onChange={(e) => { setVenue(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="MANIT Tinkering Lab, The Nest Workspace, or Discord"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Host / Organizer Name <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={hostName}
                    onChange={(e) => { setHostName(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="MANIT Web3 Chapter / Builder"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Organizer Contact Email <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={hostEmail}
                      onChange={(e) => { setHostEmail(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      placeholder="organizer@web3wave.in"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Mobile Number (Numbers Only) <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={hostPhone}
                      onChange={handlePhoneChange}
                      placeholder="9876543210 (10 digits)"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 block mt-0.5">Exactly 10 numeric digits</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Session Description <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="Describe what developers will learn or build during this session..."
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
                >
                  <span>Publish Event to Calendar</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
