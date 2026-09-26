'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Check, Copy, UserCheck } from 'lucide-react'
import { BorderBeamPanel } from '@/components/ui/border-beam-panel'

const tracks = [
  'Solidity / EVM Architecture',
  'Rust / Solana Protocols',
  'ZK Proofs & Cryptography',
  'Frontend & UI Engineering',
  'DeFi & Tokenomics',
  'AI x Web3 Autonomous Agents',
]

export function BuilderPassGenerator() {
  const [handle, setHandle] = useState('bhopal_builder')
  const [track, setTrack] = useState(tracks[0])
  const [guild, setGuild] = useState('MANIT / Open Guild')
  const [copied, setCopied] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#ff5500', '#10b981'],
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://web3bhopal.in/builder/${handle}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="builder-pass" className="py-24 border-b border-zinc-800 bg-[#09090b]">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Generate Your Builder Card.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Claim your official digital membership badge in the Bhopal Web3 ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Form */}
          <div className="lg:col-span-6">
            <div className="craft-card p-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    HANDLE / NAME
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                    required
                    placeholder="alex_builder"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    PRIMARY TRACK
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-zinc-500"
                  >
                    {tracks.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    CAMPUS / AFFILIATION
                  </label>
                  <input
                    type="text"
                    value={guild}
                    onChange={(e) => setGuild(e.target.value)}
                    required
                    placeholder="MANIT / Independent"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <button type="submit" className="w-full btn-accent py-3.5 justify-center">
                  <UserCheck className="w-4 h-4" />
                  <span>Update Membership Card</span>
                </button>
              </form>
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <BorderBeamPanel
              beams={2}
              thickness={2}
              radius={16}
              glow={true}
              idleSpeed={36}
              hoverSpeed={200}
              colors={["#ff5500", "#10b981"]}
              className="w-full max-w-md aspect-[1.586/1] bg-[#121215] border border-zinc-700 p-6 flex flex-col justify-between shadow-2xl select-none"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <Image src="/web3wave-logo.png" alt="Web3Wave Logo" width={28} height={28} className="h-7 w-auto object-contain" />
                  <div>
                    <div className="text-xs font-bold text-white leading-none">
                      WEB3WAVE
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500">BUILDER BADGE</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-emerald-400 font-bold">● VERIFIED</div>
                  <div className="text-[9px] text-zinc-500">NODE: 23.25°N</div>
                </div>
              </div>

              {/* Card Body */}
              <div>
                <div className="text-[10px] font-mono text-zinc-500 mb-1">MEMBER HANDLE</div>
                <div className="text-2xl font-black text-white font-mono tracking-tight">
                  @{handle || 'bhopal_builder'}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 text-[9px] block">PRIMARY TRACK</span>
                    <span className="text-white font-semibold truncate block">{track}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[9px] block">AFFILIATION</span>
                    <span className="text-white font-semibold truncate block">{guild}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                <span>CENTRAL INDIA BUILDER GUILD</span>
                <span className="text-white font-bold">2026 EDITION</span>
              </div>
            </BorderBeamPanel>

            <div className="mt-6">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share Membership Badge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
