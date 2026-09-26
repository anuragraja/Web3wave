'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  UserCheck,
  Calendar,
  Clock,
  Award,
  BookOpen,
  MessageSquare,
  Shield,
  Zap,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  Code,
  CheckCircle2
} from 'lucide-react'

export interface Mentor {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  bio: string
  expertise: string[]
  availableSlots: string[]
  status: 'AVAILABLE' | 'SLOTS LIMITED' | 'OFFICE HOURS OPEN'
  totalSessionsCompleted: number
  twitterUrl?: string
  githubUrl?: string
}

export const sampleMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Aarav Sharma',
    role: 'Senior Smart Contract Auditor',
    company: 'OpenZeppelin Alum',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Secured $100M+ in Web3 TVL. Specialized in EVM assembly, Reentrancy vectors, and Foundry test suites.',
    expertise: ['Solidity', 'Foundry', 'Audit / Security', 'Gas Optimization'],
    availableSlots: ['Thu, 6:00 PM IST', 'Sat, 11:00 AM IST'],
    status: 'OFFICE HOURS OPEN',
    totalSessionsCompleted: 48,
    twitterUrl: 'https://twitter.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 'mentor-2',
    name: 'Ananya Verma',
    role: 'DeFi Protocol Architect',
    company: 'Uniswap Grantee',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneering concentrated liquidity mechanisms & automated vault strategies on Arbitrum & Base.',
    expertise: ['DeFi Primitives', 'Tokenomics', 'Math & Curve Modeling', 'Rust'],
    availableSlots: ['Fri, 5:00 PM IST', 'Sun, 4:00 PM IST'],
    status: 'SLOTS LIMITED',
    totalSessionsCompleted: 32,
    twitterUrl: 'https://twitter.com'
  },
  {
    id: 'mentor-3',
    name: 'Devansh Kulkarni',
    role: 'ZK Circuit Engineer',
    company: 'Polygon Zero Researcher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Building privacy-preserving state proofs using Noir & Circom. Former MANIT Web3 lead builder.',
    expertise: ['Zero-Knowledge', 'Noir / Circom', 'Privacy', 'Layer 2 Rollups'],
    availableSlots: ['Wed, 7:00 PM IST', 'Sat, 2:00 PM IST'],
    status: 'AVAILABLE',
    totalSessionsCompleted: 29
  },
  {
    id: 'mentor-4',
    name: 'Priya Rathore',
    role: 'AI x Onchain Agent Lead',
    company: 'Fetch.ai Labs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Connecting LLM agentic frameworks with smart contracts via Solana & EVM autonomous wallets.',
    expertise: ['AI Agents', 'Python Web3', 'LangChain / ElizaOS', 'Agentic Wallets'],
    availableSlots: ['Tue, 8:00 PM IST', 'Fri, 3:00 PM IST'],
    status: 'OFFICE HOURS OPEN',
    totalSessionsCompleted: 41
  }
]

interface MentorsSectionProps {
  onBookMentor: (mentor: Mentor) => void
  onApplyAsMentor: () => void
}

export function MentorsSection({ onBookMentor, onApplyAsMentor }: MentorsSectionProps) {
  const [selectedTag, setSelectedTag] = useState('All Skills')

  const allTags = ['All Skills', 'Solidity', 'Foundry', 'DeFi Primitives', 'Zero-Knowledge', 'AI Agents', 'Audit / Security']

  const filteredMentors = sampleMentors.filter(m => {
    if (selectedTag === 'All Skills') return true
    return m.expertise.some(exp => exp.toLowerCase().includes(selectedTag.toLowerCase()))
  })

  return (
    <div className="space-y-10">
      {/* Header Info Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#131124] to-[#0d0d12] border border-purple-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              1-on-1 Office Hours & Code Reviews
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Learn from Web3 Veterans & Grant Winners
          </h2>
          <p className="text-xs md:text-sm text-zinc-300">
            Book 30-minute private 1-on-1 sessions for smart contract audits, grant pitch feedback, architecture reviews, or career advice.
          </p>
        </div>

        <button
          onClick={onApplyAsMentor}
          className="relative z-10 px-5 py-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 text-purple-300" />
          <span>Apply as a Mentor</span>
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === tag
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-[#121217] border border-white/10 p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all group"
          >
            <div className="space-y-4">
              {/* Mentor Header Avatar */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 group-hover:border-purple-400 transition-colors shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#121217] flex items-center justify-center text-[10px] text-white font-bold" title="Verified Mentor">
                    ✓
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {mentor.status}
                </span>
              </div>

              {/* Identity */}
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                  {mentor.name}
                </h3>
                <p className="text-xs font-semibold text-purple-400 font-mono">
                  {mentor.role}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  {mentor.company}
                </p>
              </div>

              {/* Bio */}
              <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                {mentor.bio}
              </p>

              {/* Expertise Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mentor.expertise.map((exp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability & Booking Action */}
            <div className="pt-5 mt-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Next: {mentor.availableSlots[0]}
                </span>
                <span className="font-mono text-purple-300">{mentor.totalSessionsCompleted} Sessions</span>
              </div>

              <button
                onClick={() => onBookMentor(mentor)}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book 1-on-1 Office Hour</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
