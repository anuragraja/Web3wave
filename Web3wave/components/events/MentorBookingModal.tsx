'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, CheckCircle2, UserCheck, MessageSquare, QrCode, ArrowRight, ShieldCheck } from 'lucide-react'
import { Mentor } from './MentorsSection'

interface MentorBookingModalProps {
  mentor: Mentor | null
  onClose: () => void
}

export function MentorBookingModal({ mentor, onClose }: MentorBookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState('')
  const [topic, setTopic] = useState('Smart Contract Audit & Code Review')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [booked, setBooked] = useState(false)

  if (!mentor) return null

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setBooked(true)
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
          className="relative max-w-xl w-full bg-[#121217] border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {!booked ? (
            <div className="space-y-6">
              {/* Header Profile */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40"
                />
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    Book 1-on-1 Office Hour
                  </span>
                  <h3 className="text-xl font-black text-white">{mentor.name}</h3>
                  <p className="text-xs text-purple-300 font-mono">{mentor.role} @ {mentor.company}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleBooking} className="space-y-4">
                {/* Select Slot */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Select Available Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mentor.availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                          selectedSlot === slot
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{slot}</span>
                        {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic selection */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    Primary Session Focus / Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Smart Contract Audit & Code Review">Smart Contract Audit & Code Review</option>
                    <option value="Grant Pitch & Deck Feedback">Grant Pitch & Deck Feedback</option>
                    <option value="System Architecture & Scaling">System Architecture & Scaling</option>
                    <option value="Tokenomics & Governance Design">Tokenomics & Governance Design</option>
                    <option value="Career & Internship Guidance">Career & Internship Guidance</option>
                  </select>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Satoshi Nakamoto"
                      className="w-full bg-[#1a1a22] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="builder@web3.eth"
                      className="w-full bg-[#1a1a22] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* GitHub or Project Link */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Project GitHub / Pitch Link (Optional)</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/myusername/my-dapp"
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Specific Questions / Context</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe what you'd like to achieve during this 30 min session..."
                    className="w-full bg-[#1a1a22] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlot}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-extrabold text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                >
                  <span>Confirm 1-on-1 Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Confirmed Ticket Preview */
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                  CONFIRMED OFFICE HOUR PASS
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Booking Confirmed!</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto">
                  A Google Meet / Discord calendar invitation has been sent to <span className="text-purple-300 font-mono">{email}</span>.
                </p>
              </div>

              {/* Pass Card Preview */}
              <div className="bg-[#181822] border border-purple-500/30 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">MENTOR</span>
                    <span className="font-bold text-white">{mentor.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">TIME SLOT</span>
                    <span className="font-mono text-purple-300 font-bold">{selectedSlot}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">ATTENDEE</span>
                    <span className="font-bold text-white">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">FOCUS</span>
                    <span className="text-xs text-purple-300 font-medium">{topic}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ID: W3W-MENTOR-{(Math.random() * 10000).toFixed(0)}
                  </span>
                  <QrCode className="w-8 h-8 text-zinc-400" />
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
              >
                Close & Return to Events
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
