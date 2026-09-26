'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpRight, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'

interface JoinModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  useModalScrollLock(isOpen)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto overscroll-none"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            className="craft-card max-w-lg w-full p-8 bg-[#121215] relative my-auto max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to Web3 Bhopal!
                </h3>
                <p className="text-sm text-zinc-400">
                  Onboarding link sent to {email}.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Join Bhopal&apos;s Web3 Collective.
                </h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Connect with over 500+ developers, protocol founders, and researchers in Central India.
                </p>

                {/* Direct Social Channels */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-600 transition-colors text-xs font-mono font-bold"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Discord Guild</span>
                  </a>

                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-600 transition-colors text-xs font-mono font-bold"
                  >
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Telegram Group</span>
                  </a>
                </div>

                {/* Newsletter Form */}
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
                      placeholder="satoshi@web3wave.in"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <button type="submit" className="w-full btn-solid py-3 justify-center">
                    <span>Get Community Onboarding Link</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
