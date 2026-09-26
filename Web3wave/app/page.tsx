'use client'

import { useState, useEffect, useCallback } from 'react'
import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { LumaNav } from '@/components/LumaNav'
import { LumaHero } from '@/components/LumaHero'
import { LumaEventGrid, LumaEvent } from '@/components/LumaEventGrid'
import dynamic from 'next/dynamic'
import { getPublicEventsApi } from '@/src/api/events'
import { mapBackendEventToLumaEvent, isUserAdmin } from '@/src/utils/eventUtils'
import { useAuth } from '@/src/context/AuthContext'
import { AlertCircle, Loader2 } from 'lucide-react'

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
  const { user } = useAuth()
  const isAdmin = isUserAdmin(user)

  const [events, setEvents] = useState<LumaEvent[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [activeCategory, setActiveCategory] = useState('All Events')
  const [selectedEvent, setSelectedEvent] = useState<LumaEvent | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  // Fetch Public Events directly from Backend API (No Dummy Fallback)
  const fetchPublicEvents = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await getPublicEventsApi()
      if (res.success && Array.isArray(res.data)) {
        const mappedEvents = res.data.map(mapBackendEventToLumaEvent)
        setEvents(mappedEvents)
      } else {
        setEvents([])
      }
    } catch (err: any) {
      console.error('Failed to fetch public events from backend:', err)
      setErrorMsg('Unable to load community events from backend server.')
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPublicEvents()
  }, [fetchPublicEvents])

  const handleAddEvent = () => {
    fetchPublicEvents()
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

      {/* Interactive Event Grid / Loading / Error Banner */}
      {errorMsg ? (
        <section className="py-8 px-4 max-w-xl mx-auto text-center">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </section>
      ) : isLoading ? (
        <section className="py-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <span className="text-xs font-mono">Fetching Events from MongoDB...</span>
        </section>
      ) : (
        <LumaEventGrid
          events={events}
          activeCategory={activeCategory}
          onSelectEvent={(evt) => setSelectedEvent(evt)}
        />
      )}

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

      {isAdmin && (
        <LumaCreateEventModal
          isOpen={createEventOpen}
          onClose={() => setCreateEventOpen(false)}
          onAddEvent={handleAddEvent}
          onSuccess={fetchPublicEvents}
        />
      )}

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
