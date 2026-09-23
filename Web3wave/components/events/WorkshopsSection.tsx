'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Users,
  Code2,
  Terminal,
  Download,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

export interface Workshop {
  id: string
  title: string
  instructor: string
  instructorAvatar: string
  dateString: string
  timeString: string
  venue: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  techStack: string[]
  coverImage: string
  description: string
  starterKitRepo?: string
  recordingUrl?: string
  seatsLeft: number
  capacity: number
}

export const sampleWorkshops: Workshop[] = [
  {
    id: 'workshop-solidity-foundry',
    title: 'Solidity & Foundry Architecture Masterclass',
    instructor: 'Aarav Sharma',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    dateString: 'Sunday, Nov 02, 2026',
    timeString: '11:00 AM - 4:00 PM IST',
    venue: 'MANIT Tinkering Lab, Bhopal',
    level: 'Intermediate',
    techStack: ['Solidity', 'Foundry', 'Ethers.js', 'Arbitrum Sepolia'],
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=85',
    description: 'Hands-on developer workshop covering smart contract unit testing, invariant tests, gas optimization tricks, and live deployment.',
    starterKitRepo: 'https://github.com/web3wave/foundry-starter-kit',
    seatsLeft: 8,
    capacity: 50
  },
  {
    id: 'workshop-ai-telegram-bot',
    title: 'Building Autonomous AI Telegram Agents on Base',
    instructor: 'Priya Rathore',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    dateString: 'Saturday, Dec 05, 2026',
    timeString: '4:00 PM - 7:00 PM IST',
    venue: 'LNCT Tech Nest & Live Stream',
    level: 'Beginner',
    techStack: ['Python', 'ElizaOS', 'Base L2', 'Web3.py'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
    description: 'Create an AI bot that listens to user commands on Telegram, signs transactions, and transfers tokens on Base L2.',
    starterKitRepo: 'https://github.com/web3wave/ai-agent-bot-template',
    seatsLeft: 15,
    capacity: 60
  },
  {
    id: 'workshop-zk-proofs-101',
    title: 'Zero-Knowledge Proofs 101: Circom & Noir',
    instructor: 'Devansh Kulkarni',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    dateString: 'Sunday, Dec 20, 2026',
    timeString: '2:00 PM - 6:00 PM IST',
    venue: 'Bhopal Innovation Center',
    level: 'Advanced',
    techStack: ['Circom', 'Noir', 'SnarkJS', 'Next.js'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85',
    description: 'Learn zero-knowledge circuit math, write your first zk-SNARK proof, and integrate onchain verification into Next.js.',
    starterKitRepo: 'https://github.com/web3wave/zk-noir-demo',
    recordingUrl: 'https://youtube.com',
    seatsLeft: 5,
    capacity: 40
  }
]

interface WorkshopsSectionProps {
  onReserveWorkshop: (workshop: Workshop) => void
}

export function WorkshopsSection({ onReserveWorkshop }: WorkshopsSectionProps) {
  const [levelFilter, setLevelFilter] = useState('All Levels')

  const filteredWorkshops = sampleWorkshops.filter(w => {
    if (levelFilter === 'All Levels') return true
    return w.level === levelFilter
  })

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900/30 via-[#1c1218] to-[#0d0d12] border border-rose-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              Hands-On Technical Masterclasses
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Code & Build Live with Expert Mentors
          </h2>
          <p className="text-xs md:text-sm text-zinc-300">
            Every workshop includes live coding, starter templates, POAP badges, and peer code reviews.
          </p>
        </div>

        {/* Level Filter Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full">
          {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                levelFilter === lvl
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredWorkshops.map((workshop) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-[#121217] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all group"
          >
            <BorderBeam size="sm" />
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                <img
                  src={workshop.coverImage}
                  alt={workshop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider backdrop-blur-md ${
                    workshop.level === 'Beginner'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : workshop.level === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {workshop.level}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                  {workshop.seatsLeft} Seats Left
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={workshop.instructorAvatar}
                    alt={workshop.instructor}
                    className="w-7 h-7 rounded-full object-cover border border-rose-500/30"
                  />
                  <div className="text-xs">
                    <span className="text-zinc-400">Instructor: </span>
                    <span className="font-bold text-white">{workshop.instructor}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-rose-300 transition-colors">
                  {workshop.title}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {workshop.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {workshop.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-rose-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Meta details */}
                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{workshop.dateString}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>{workshop.timeString}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{workshop.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 space-y-2">
              <button
                onClick={() => onReserveWorkshop(workshop)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-xs font-extrabold text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reserve Seat & Get Starter Kit</span>
              </button>

              {workshop.starterKitRepo && (
                <a
                  href={workshop.starterKitRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub Starter Repo</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
