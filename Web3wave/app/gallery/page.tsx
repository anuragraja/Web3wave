'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Flame, ArrowRight } from 'lucide-react'
import ScrollMorphHero from '@/components/ui/scroll-morph-hero'
import { LumaNav } from '@/components/LumaNav'
import { useAuth } from '@/src/context/AuthContext'
import { isUserAdmin } from '@/src/utils/eventUtils'

const LumaCreateEventModal = dynamic(() => import('@/components/LumaCreateEventModal').then(mod => mod.LumaCreateEventModal))
const LumaSubscribeModal = dynamic(() => import('@/components/LumaSubscribeModal').then(mod => mod.LumaSubscribeModal))
const LumaAuthModal = dynamic(() => import('@/components/LumaAuthModal').then(mod => mod.LumaAuthModal))

export default function GalleryPage() {
  const { user } = useAuth()
  const isAdmin = isUserAdmin(user)

  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#0a0a0d] text-white flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Header Navigation */}
      <LumaNav
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAuthModal={() => setAuthOpen(true)}
      />

      {/* Main Native Scroll Track */}
      <main className="relative w-full pt-16">
        <ScrollMorphHero />
      </main>

      {/* Footer Section at end of scroll track */}
      <footer className="relative z-20 bg-[#0c0c10] border-t border-white/10 py-16 px-6 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            Ready to join our next event?
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mb-6">
            Subscribe to the Web3Wave community calendar to get instant invites for hack nights & workshops.
          </p>
          <Link
            href="/events"
            className="btn-luma-accent py-3 px-8 text-sm flex items-center gap-2"
          >
            <span>Explore Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>

      {/* Modals Integration */}
      {isAdmin && (
        <LumaCreateEventModal
          isOpen={createEventOpen}
          onClose={() => setCreateEventOpen(false)}
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
    </div>
  )
}

