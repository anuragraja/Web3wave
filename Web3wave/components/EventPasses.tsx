'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, ArrowUpRight, CheckCircle2, X } from 'lucide-react'

const eventsData = [
  {
    id: 'meetup-oct',
    day: '18',
    month: 'OCT',
    tag: 'NETWORKING / MEETUP',
    title: 'Web3 Bhopal Meetup',
    description: 'A room full of curious minds, honest conversations, and new collaborations across DeFi, NFTs, and AI.',
    location: 'Bhopal · The Nest Workspace',
    time: '05:00 PM - 08:00 PM IST',
    status: 'OPEN RSVP',
  },
  {
    id: 'workshop-nov',
    day: '02',
    month: 'NOV',
    tag: 'DEVELOPER WORKSHOP',
    title: 'Build & Deploy on Ethereum & L2s',
    description: 'A hands-on coding session for writing, auditing, and shipping your first smart contract.',
    location: 'Bhopal · MANIT Tinkering Lab',
    time: '11:00 AM - 04:00 PM IST',
    status: 'LIMITED SEATS',
  },
  {
    id: 'hack-nov',
    day: '16',
    month: 'NOV',
    tag: 'HACK NIGHT / BUILDERS',
    title: 'Bhopal Web3 Hack Night',
    description: 'One night. Fresh ideas. Non-stop shipping. Bring your laptop and build a project before sunrise.',
    location: 'Bhopal · Innovation Hub',
    time: '08:00 PM - 08:00 AM IST',
    status: 'REGISTRATION OPEN',
  },
]

export function EventPasses() {
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null)
  const [registered, setRegistered] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistered(true)
    setTimeout(() => {
      setRegistered(false)
      setSelectedEvent(null)
    }, 2000)
  }

  return (
    <section id="events" className="py-24 border-b border-zinc-800 bg-[#0c0c0e]">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Upcoming Events & Sessions.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Join local developer workshops, hack nights, and community meetups across Bhopal.
          </p>
        </div>

        {/* Event Roster */}
        <div className="space-y-4">
          {eventsData.map((evt) => (
            <div
              key={evt.id}
              className="craft-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start sm:items-center gap-6">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 min-w-[70px]">
                  <span className="text-2xl font-black text-white font-mono leading-none">
                    {evt.day}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ff5500] mt-1">
                    {evt.month}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-zinc-400 font-bold uppercase">
                      {evt.tag}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                      {evt.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{evt.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(evt)}
                className="btn-solid text-xs py-2.5 px-5 self-start md:self-auto"
              >
                <span>Reserve Seat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="craft-card max-w-lg w-full p-8 bg-[#121215] relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {registered ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">RSVP Confirmed!</h3>
                  <p className="text-sm text-zinc-400">
                    We reserved your seat for {selectedEvent.title}.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 font-mono">
                    {selectedEvent.location} · {selectedEvent.time}
                  </p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">
                        FULL NAME
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Satoshi Nakamoto"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">
                        EMAIL ADDRESS
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="satoshi@web3wave.in"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <button type="submit" className="w-full btn-accent py-3 justify-center">
                      <span>Confirm RSVP</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
