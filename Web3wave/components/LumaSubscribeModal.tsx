'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle2, ArrowUpRight } from 'lucide-react'

interface LumaSubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LumaSubscribeModal({ isOpen, onClose }: LumaSubscribeModalProps) {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('Every New Event')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="luma-card max-w-md w-full bg-[#141418] border border-white/10 p-6 sm:p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-rose-400 mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">Subscribed!</h3>
              <p className="text-xs text-zinc-400">
                You will receive Web3Wave event invites directly at {email}.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
                <Bell className="w-4 h-4" />
                <span>Calendar Subscriptions</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                Never miss a meetup.
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Subscribe to get instant calendar invites for Web3Wave hack nights, workshops, and tech talks.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@web3wave.in"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    NOTIFICATION PREFERENCE
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-[#1a1a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Every New Event">Every New Event</option>
                    <option value="Weekly Digest">Weekly Digest</option>
                    <option value="Hackathons Only">Hackathons & Major Summits Only</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn-luma-accent py-3 text-sm justify-center">
                  <span>Confirm Subscription</span>
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
