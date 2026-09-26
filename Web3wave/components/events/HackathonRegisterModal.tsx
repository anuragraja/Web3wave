'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Users, Code2, CheckCircle2, Coins, ArrowRight, ShieldCheck, QrCode, Cpu } from 'lucide-react'
import { HackathonItem } from './HackathonsSection'

import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'

interface HackathonRegisterModalProps {
  hackathon: HackathonItem | null
  onClose: () => void
}

export function HackathonRegisterModal({ hackathon, onClose }: HackathonRegisterModalProps) {
  useModalScrollLock(!!hackathon)
  const [mode, setMode] = useState<'Team' | 'Solo'>('Team')
  const [teamName, setTeamName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedTrack, setSelectedTrack] = useState('')
  const [role, setRole] = useState('Fullstack Web3 Developer')
  const [githubUrl, setGithubUrl] = useState('')
  const [discordTag, setDiscordTag] = useState('')
  const [registered, setRegistered] = useState(false)

  if (!hackathon) return null

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistered(true)
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
          className="relative max-w-xl w-full bg-[#10131e] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] my-auto max-h-[85vh] overflow-y-auto overscroll-contain"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {!registered ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    HACKATHON REGISTRATION
                  </span>
                  <span className="text-xs font-semibold text-amber-400 font-mono">
                    {hackathon.prizePool}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{hackathon.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{hackathon.dateRange} • {hackathon.venue}</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Team vs Solo Mode */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    Registration Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('Team')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        mode === 'Team'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Team (2-4 Builders)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('Solo')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        mode === 'Solo'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Solo Hacker</span>
                    </button>
                  </div>
                </div>

                {mode === 'Team' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Onchain Innovators"
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                {/* Track Selection */}
                {hackathon.tracks.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-2">
                      Target Bounty Track
                    </label>
                    <select
                      value={selectedTrack}
                      onChange={(e) => setSelectedTrack(e.target.value)}
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">Select a Track (or decide later)</option>
                      {hackathon.tracks.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title} ({t.prize})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Captain / Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      {mode === 'Team' ? 'Team Captain Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vitalik Buterin"
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hacker@web3.eth"
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Role & Socials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Primary Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Smart Contract Engineer">Smart Contract Engineer</option>
                      <option value="Fullstack Web3 Developer">Fullstack Web3 Developer</option>
                      <option value="AI / ML Engineer">AI / ML Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Product & Tokenomics">Product & Tokenomics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Discord Tag</label>
                    <input
                      type="text"
                      required
                      value={discordTag}
                      onChange={(e) => setDiscordTag(e.target.value)}
                      placeholder="username#0000"
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">GitHub Profile Link</label>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/myusername"
                    className="w-full bg-[#161a29] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-extrabold text-white transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-cyan-300" />
                  <span>Submit Hackathon Entry Pass</span>
                </button>
              </form>
            </div>
          ) : (
            /* Registration Pass Confirmation */
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  OFFICIAL HACKATHON BUILDER TICKET
                </span>
                <h3 className="text-2xl font-black text-white mt-1">You Are Registered!</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto">
                  Team entry confirmed for <span className="text-cyan-300 font-bold">{hackathon.title}</span>. Access details emailed to <span className="font-mono text-cyan-300">{email}</span>.
                </p>
              </div>

              {/* Pass Card Preview */}
              <div className="bg-[#141824] border border-cyan-500/30 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">ENTRY TYPE</span>
                    <span className="font-bold text-white">{mode === 'Team' ? `Team: ${teamName}` : 'Solo Hacker'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">CAPTAIN</span>
                    <span className="font-mono text-cyan-300 font-bold">{name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">TARGET TRACK</span>
                    <span className="font-bold text-white">{selectedTrack || 'General Track'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">DISCORD TAG</span>
                    <span className="text-xs text-cyan-300 font-mono">{discordTag}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TICKET ID: W3W-HACK-{(Math.random() * 90000 + 10000).toFixed(0)}
                  </span>
                  <QrCode className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
              >
                Done & Join Hackathon Discord
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
