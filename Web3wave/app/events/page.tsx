'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Users,
  Terminal,
  Calendar,
  Flame,
  Search,
  Plus,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react'

import { LumaNav } from '@/components/LumaNav'
import { LumaEvent, sampleEvents } from '@/components/LumaEventGrid'
import dynamic from 'next/dynamic'

const LumaEventModal = dynamic(() => import('@/components/LumaEventModal').then(mod => mod.LumaEventModal))
const LumaCreateEventModal = dynamic(() => import('@/components/LumaCreateEventModal').then(mod => mod.LumaCreateEventModal))
const LumaSubscribeModal = dynamic(() => import('@/components/LumaSubscribeModal').then(mod => mod.LumaSubscribeModal))
const LumaAuthModal = dynamic(() => import('@/components/LumaAuthModal').then(mod => mod.LumaAuthModal))
const HackathonRegisterModal = dynamic(() => import('@/components/events/HackathonRegisterModal').then(mod => mod.HackathonRegisterModal))
import HoverFooter from '@/components/ui/hover-footer'

import { HackathonsSection, sampleHackathons, HackathonItem } from '@/components/events/HackathonsSection'
import { WorkshopsSection, sampleWorkshops, Workshop } from '@/components/events/WorkshopsSection'

type ActivePillarTab = 'all' | 'workshops'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<ActivePillarTab>('all')
  const [events, setEvents] = useState<LumaEvent[]>(sampleEvents)
  const [selectedEvent, setSelectedEvent] = useState<LumaEvent | null>(null)
  
  // Modals state
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonItem | null>(null)

  const handleAddEvent = (newEvent: LumaEvent) => {
    setEvents([newEvent, ...events])
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-white selection:bg-rose-500 selection:text-white font-sans antialiased relative">
      {/* Top Header Navigation */}
      <LumaNav
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAuthModal={() => setAuthOpen(true)}
      />

      {/* Main Page Content */}
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Hero Header */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#13141f] via-[#0e0f17] to-[#09090d] border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* Background Ambient Glowing Orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full filter blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
                <span>Home</span>
              </Link>

              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                CENTRAL INDIA WEB3 BUILDER HUB
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Events & Technical Workshops
            </h1>

            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              Your gateway to shipping onchain dApps. Attend hands-on developer masterclasses, network with ecosystem builders, and master modern creative web development.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="block text-2xl font-black text-rose-400 font-mono">1 Day</span>
                <span className="text-[11px] text-zinc-400 font-medium">Hands-On Workshop</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="block text-2xl font-black text-amber-400 font-mono">₹10K+</span>
                <span className="text-[11px] text-zinc-400 font-medium">Swags & Goodies</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="block text-2xl font-black text-cyan-400 font-mono">50+</span>
                <span className="text-[11px] text-zinc-400 font-medium">Connected Builders</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Controls Header */}
        <div className="sticky top-20 z-30 bg-[#09090d]/90 backdrop-blur-xl py-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Pillar Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-full md:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Events', icon: Calendar, color: 'text-zinc-300' },
              { id: 'workshops', label: 'Workshops', icon: Terminal, color: 'text-rose-400' }
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActivePillarTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setCreateEventOpen(true)}
              className="btn-luma-accent py-2.5 px-4 text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Host Event / Workshop</span>
            </button>

            <button
              onClick={() => setSubscribeOpen(true)}
              className="btn-luma-secondary py-2.5 px-4 text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Subscribe Calendar</span>
            </button>
          </div>
        </div>

        {/* Dynamic Render: Displays Only the Real Workshop */}
        <div className="space-y-16">
          <section id="workshops-pillar" className="space-y-6">
            <WorkshopsSection
              onReserveWorkshop={(ws) => {
                const matched = events.find(e => e.title.toLowerCase().includes(ws.title.toLowerCase().substring(0, 10)))
                if (matched) {
                  setSelectedEvent(matched)
                } else {
                  setSelectedEvent(sampleEvents[0])
                }
              }}
            />
          </section>
        </div>
      </main>

      {/* Modals Integration */}
      <HackathonRegisterModal
        hackathon={selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
      />

      <LumaEventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <LumaCreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onAddEvent={handleAddEvent}
      />

      <LumaSubscribeModal
        isOpen={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />

      <LumaAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Hover Footer */}
      <HoverFooter />
    </div>
  )
}
