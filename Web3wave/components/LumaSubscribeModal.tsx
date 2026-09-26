'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle2, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react'
import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'
import { subscribeEmailApi } from '@/src/api/events'

interface LumaSubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LumaSubscribeModal({ isOpen, onClose }: LumaSubscribeModalProps) {
  useModalScrollLock(isOpen)
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('Every New Event')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setFeedbackMsg('')

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await subscribeEmailApi(email, frequency)
      setFeedbackMsg(res.message || "✓ You're subscribed to Web3Wave event updates.")
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEmail('')
        setFeedbackMsg('')
        onClose()
      }, 2500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit email subscription.')
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
          className="luma-card max-w-md w-full bg-[#141418] border border-white/10 p-6 sm:p-8 relative my-auto max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl rounded-3xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">Subscribed!</h3>
              <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">
                {feedbackMsg || `You will receive Web3Wave event invites directly at ${email}.`}
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
              <p className="text-xs text-zinc-400 mb-5">
                Subscribe to get instant calendar invites for Web3Wave hack nights, workshops, and tech talks.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-luma-accent py-3 text-sm justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Subscription</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
