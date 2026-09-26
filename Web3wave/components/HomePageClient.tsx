'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LumaHero } from '@/components/LumaHero'
import { LumaEventGrid, LumaEvent } from '@/components/LumaEventGrid'
import { LumaHostGuilds } from '@/components/LumaHostGuilds'
import { LumaNav } from '@/components/LumaNav'
import HoverFooter from '@/components/ui/hover-footer'
import { LazySection } from '@/components/ui/LazySection'
import { getPublicEventsApi } from '@/src/api/events'
import { mapBackendEventToLumaEvent, isUserAdmin } from '@/src/utils/eventUtils'
import { useAuth } from '@/src/context/AuthContext'
import { AlertCircle, Loader2 } from 'lucide-react'

// Above-the-fold Hero
const CinematicHero = dynamic(
  () => import('@/components/ui/cinematic-landing-hero').then(mod => mod.CinematicHero),
  {
    loading: () => <div className="h-screen w-full bg-[#0d0d10]" />,
  }
)

// Below-the-fold strategic code splitting
const ProjectShowcase = dynamic(
  () => import('@/components/ProjectShowcase').then(mod => mod.ProjectShowcase)
)

const BuilderPassGenerator = dynamic(
  () => import('@/components/BuilderPassGenerator').then(mod => mod.BuilderPassGenerator)
)

const GallerySection = dynamic(
  () => import('@/components/GallerySection').then(mod => mod.GallerySection)
)

const DiscordSection = dynamic(
  () => import('@/components/DiscordSection').then(mod => mod.DiscordSection)
)

// Interaction-driven modals (P3 Priority)
const LumaEventModal = dynamic(
  () => import('@/components/LumaEventModal').then(mod => mod.LumaEventModal)
)

const LumaCreateEventModal = dynamic(
  () => import('@/components/LumaCreateEventModal').then(mod => mod.LumaCreateEventModal)
)

const LumaSubscribeModal = dynamic(
  () => import('@/components/LumaSubscribeModal').then(mod => mod.LumaSubscribeModal)
)

const LumaAuthModal = dynamic(
  () => import('@/components/LumaAuthModal').then(mod => mod.LumaAuthModal)
)

interface HomePageClientProps {
  initialEvents: LumaEvent[]
}

export function HomePageClient({ initialEvents }: HomePageClientProps) {
  const { user } = useAuth()
  const isAdmin = isUserAdmin(user)

  const [events, setEvents] = useState<LumaEvent[]>(initialEvents)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [activeCategory, setActiveCategory] = useState('All Events')
  const [selectedEvent, setSelectedEvent] = useState<LumaEvent | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  // Fetch Public Events directly from Backend API when refreshed
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
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddEvent = () => {
    fetchPublicEvents()
  }

  return (
    <main className="relative min-h-screen">
      {/* P0 Critical: Navigation Bar */}
      <LumaNav
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAuthModal={() => setAuthOpen(true)}
      />

      {/* P0 Critical: Cinematic Hero Component */}
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

      {/* P0 Critical: Community Event Calendar Section */}
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
          <span className="text-xs font-mono">Fetching Events from Backend...</span>
        </section>
      ) : (
        <LumaEventGrid
          events={events}
          activeCategory={activeCategory}
          onSelectEvent={(evt) => setSelectedEvent(evt)}
        />
      )}

      {/* P1 Near Viewport: Sub-Guilds & Campus Chapters */}
      <LazySection minHeight="400px">
        <LumaHostGuilds />
      </LazySection>

      {/* P2 Below Viewport: Shipped Projects Showcase */}
      <LazySection minHeight="500px">
        <ProjectShowcase />
      </LazySection>

      {/* P2 Below Viewport: Builder Card Membership Widget */}
      <LazySection minHeight="450px">
        <BuilderPassGenerator />
      </LazySection>

      {/* P2 Below Viewport: Past Event Photo Gallery */}
      <LazySection minHeight="600px">
        <GallerySection />
      </LazySection>

      {/* P2 Below Viewport: Join Discord Guild Section */}
      <LazySection minHeight="350px">
        <DiscordSection />
      </LazySection>

      {/* Interactive Hover Footer */}
      <HoverFooter onOpenSubscribe={() => setSubscribeOpen(true)} />

      {/* P3 Interaction-Driven: Modals & Drawers */}
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
