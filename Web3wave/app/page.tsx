'use client'

import { useState } from 'react'
import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { LumaNav } from '@/components/LumaNav'
import { LumaHero } from '@/components/LumaHero'
import { LumaEventGrid, LumaEvent, sampleEvents } from '@/components/LumaEventGrid'
import dynamic from 'next/dynamic'

const LumaEventModal = dynamic(() => import('@/components/LumaEventModal').then(mod => mod.LumaEventModal))
const LumaCreateEventModal = dynamic(() => import('@/components/LumaCreateEventModal').then(mod => mod.LumaCreateEventModal))
const LumaSubscribeModal = dynamic(() => import('@/components/LumaSubscribeModal').then(mod => mod.LumaSubscribeModal))
const LumaAuthModal = dynamic(() => import('@/components/LumaAuthModal').then(mod => mod.LumaAuthModal))
import { LumaHostGuilds } from '@/components/LumaHostGuilds'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import { BuilderPassGenerator } from '@/components/BuilderPassGenerator'
import { GallerySection } from '@/components/GallerySection'
import { DiscordSection } from '@/components/DiscordSection'
import HoverFooter from '@/components/ui/hover-footer'

export default function Home() {
  const [events, setEvents] = useState<LumaEvent[]>(sampleEvents)
  const [activeCategory, setActiveCategory] = useState('All Events')
  const [selectedEvent, setSelectedEvent] = useState<LumaEvent | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const handleAddEvent = (newEvent: LumaEvent) => {
    setEvents([newEvent, ...events])
  }

  return (
    <main className="relative min-h-screen">
      {/* Navigation Bar */}
      <LumaNav
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAuthModal={() => setAuthOpen(true)}
      />

      {/* Cinematic 3D Scroll Hero Component */}
      <div className="relative z-10">
        <CinematicHero
          brandName="Web3Wave"
          tagline1="Central India's Web3 Hub,"
          tagline2="BUILD. SHIP. GROW."
          cardHeading="Who We Are & What We Do."
          cardDescription={
            <>
              <span className="text-white font-semibold">Web3Wave</span> is Central India's flagship Web3 developer collective in Bhopal. We host local hackathons, connect coders to global Web3 protocol grants & USDC bounties, incubate campus guilds, and turn code into shipped dApps.
            </>
          }
          metricValue={500}
          metricLabel="Active Builders"
          ctaHeading="Ready to build onchain?"
          ctaDescription="Subscribe to the official Web3Wave community calendar and get instant invites to local hack nights, grant sprints, and workshops."
        />
      </div>

      {/* Community Event Calendar Section */}
      <LumaHero
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Interactive Event Grid */}
      <LumaEventGrid
        events={events}
        activeCategory={activeCategory}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
      />

      {/* Sub-Guilds & Campus Chapters */}
      <LumaHostGuilds />

      {/* Shipped Projects Showcase */}
      <ProjectShowcase />

      {/* Builder Card Membership Widget */}
      <BuilderPassGenerator />

      {/* Past Event Photo Gallery */}
      <GallerySection />

      {/* Join Discord Guild Section */}
      <DiscordSection />

      {/* Interactive Hover Footer */}
      <HoverFooter onOpenSubscribe={() => setSubscribeOpen(true)} />

      {/* Modals & Drawers */}
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
    </main>
  )
}
