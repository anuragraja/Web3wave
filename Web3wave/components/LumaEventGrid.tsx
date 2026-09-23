'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, ArrowUpRight, CheckCircle } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

export interface LumaEvent {
  id: string
  title: string
  dateString: string
  dayNumber: string
  monthName: string
  timeString: string
  venue: string
  hostName: string
  hostAvatar: string
  coverImage: string
  category: string
  attendeeCount: number
  capacity: number
  price: string
  description: string
  agenda: string[]
}

export const sampleEvents: LumaEvent[] = [
  {
    id: 'meetup-oct',
    title: 'Web3Wave Genesis Meetup #01',
    dateString: 'Saturday, Oct 18, 2026',
    dayNumber: '18',
    monthName: 'OCT',
    timeString: '5:00 PM - 8:00 PM IST',
    venue: 'The Nest Workspace, Arera Colony, Bhopal',
    hostName: 'Web3Wave Core',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
    category: 'Meetups',
    attendeeCount: 85,
    capacity: 100,
    price: 'Free',
    description: 'Join developers, founders, and curious minds for an evening of open conversations, lightning talks, and networking over coffee.',
    agenda: [
      '05:00 PM — Welcome & Keynote: Onchain Bhopal',
      '05:45 PM — Lightning Demos: 3 Local Shipped DApps',
      '06:30 PM — Open Networking & Discussions',
    ],
  },
  {
    id: 'workshop-nov',
    title: 'Build & Deploy on Ethereum & L2 Rollups',
    dateString: 'Sunday, Nov 02, 2026',
    dayNumber: '02',
    monthName: 'NOV',
    timeString: '11:00 AM - 4:00 PM IST',
    venue: 'MANIT Tinkering Lab, Bhopal',
    hostName: 'MANIT Web3 Chapter',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=85',
    category: 'Workshops',
    attendeeCount: 42,
    capacity: 50,
    price: 'Free',
    description: 'Hands-on developer workshop covering Solidity smart contract architecture, gas optimization, testing with Foundry, and deployment to L2 testnets.',
    agenda: [
      '11:00 AM — Solidity & Foundry Setup',
      '01:00 PM — Lunch & Peer Code Reviews',
      '02:30 PM — Deploying Smart Contracts to L2',
    ],
  },
  {
    id: 'hack-nov',
    title: 'Web3Wave Hack Night 2026',
    dateString: 'Saturday, Nov 16, 2026',
    dayNumber: '16',
    monthName: 'NOV',
    timeString: '8:00 PM - 8:00 AM IST (Overnight)',
    venue: 'Bhopal Innovation Hub, MP Nagar',
    hostName: 'Web3Wave & Build Club',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
    category: 'Hackathons',
    attendeeCount: 118,
    capacity: 150,
    price: 'Free',
    description: 'One overnight hackathon. Fresh ideas. Non-stop shipping. Bring your laptop, form a team, and build a working prototype before sunrise.',
    agenda: [
      '08:00 PM — Team Matching & Kickoff',
      '12:00 AM — Midnight Pizza & Energy Drinks',
      '06:30 AM — Code Freeze & Project Demos',
    ],
  },
  {
    id: 'ai-web3-dec',
    title: 'AI x Web3 Autonomous Agents Lab',
    dateString: 'Saturday, Dec 05, 2026',
    dayNumber: '05',
    monthName: 'DEC',
    timeString: '4:00 PM - 7:00 PM IST',
    venue: 'LNCT Tech Nest, Bhopal',
    hostName: 'LNCT Web3 Guild',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85',
    category: 'Workshops',
    attendeeCount: 65,
    capacity: 80,
    price: 'Free',
    description: 'Exploring autonomous AI agents executing onchain smart contracts, decentralized inference, and tokenized agent economies.',
    agenda: [
      '04:00 PM — Introduction to Onchain AI Agents',
      '05:15 PM — Building Agentic Workflows with LangChain & Viem',
      '06:30 PM — Open Q&A & Project Feedback',
    ],
  },
]

interface LumaEventGridProps {
  events: LumaEvent[]
  activeCategory: string
  onSelectEvent: (event: LumaEvent) => void
}

export function LumaEventGrid({ events, activeCategory, onSelectEvent }: LumaEventGridProps) {
  const filteredEvents =
    activeCategory === 'All Events'
      ? events
      : activeCategory === 'Past Highlights'
      ? events.slice(0, 2)
      : events.filter((e) => e.category === activeCategory)

  return (
    <section id="events" className="py-12">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectEvent(evt)}
              className="luma-card relative group cursor-pointer flex flex-col justify-between"
            >
              <BorderBeam size="sm" />
              <div>
                {/* Banner Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent opacity-90" />

                  {/* Date Badge Overlay (Luma Style) */}
                  <div className="absolute top-3 left-3 bg-[#121216]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
                    <span className="text-sm font-black text-white font-mono leading-none">
                      {evt.dayNumber}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                      {evt.monthName}
                    </span>
                  </div>

                  {/* Price Badge Overlay */}
                  <div className="absolute top-3 right-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-400">
                    {evt.price}
                  </div>
                </div>

                {/* Event Information */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1.5">
                    <span>{evt.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {evt.dateString.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug mb-3">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-zinc-400 font-medium mb-4">
                    <div className="flex items-center gap-2 truncate">
                      <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{evt.timeString}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer (Luma Host & RSVP CTA) */}
              <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                {/* Host Info */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={evt.hostAvatar}
                    alt={evt.hostName}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <span className="text-xs text-zinc-400 font-medium truncate max-w-[130px]">
                    {evt.hostName}
                  </span>
                </div>

                {/* RSVP Button */}
                <button className="btn-luma-primary py-1.5 px-3.5 text-xs">
                  <span>Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
