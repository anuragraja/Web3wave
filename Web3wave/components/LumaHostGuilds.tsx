'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Building2, Cpu, ShieldAlert, ArrowUpRight, Calendar } from 'lucide-react'

const guilds = [
  {
    name: 'MANIT Bhopal Guild',
    type: 'CAMPUS CHAPTER',
    members: '180+ Members',
    events: '12 Events Hosted',
    icon: GraduationCap,
    description: 'Student-led developer chapter running smart contract audits, Solidity bootcamps, and hackathons.',
  },
  {
    name: 'LNCT Tech Nest',
    type: 'CAMPUS CHAPTER',
    members: '120+ Members',
    events: '8 Events Hosted',
    icon: Cpu,
    description: 'Focused on protocol development, gas optimization, and cross-chain dApp infrastructure.',
  },
  {
    name: 'MP Startup Hub',
    type: 'INCUBATOR',
    members: '45 Startups',
    events: '6 Pitch Nights',
    icon: Building2,
    description: 'Connecting local Web3 founders with global Web3 grant pools, seed funds, and legal guidance.',
  },
  {
    name: 'ZK & Cyber Guild',
    type: 'RESEARCH',
    members: '60+ Researchers',
    events: '5 Research Labs',
    icon: ShieldAlert,
    description: 'Pioneering zero-knowledge cryptography research and privacy-preserving protocol architecture.',
  },
]

export function LumaHostGuilds() {
  return (
    <section id="guilds" className="py-16 border-t border-white/10">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
              // CAMPUS & PARTNER CALENDARS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Sub-Guilds & Hosts
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Explore dedicated event calendars managed by student chapters and tech incubators across Bhopal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guilds.map((g) => {
            const Icon = g.icon
            return (
              <div key={g.name} className="luma-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block mb-1">
                    {g.type}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{g.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {g.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-semibold">{g.members}</span>
                  <span className="text-zinc-500">{g.events}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
