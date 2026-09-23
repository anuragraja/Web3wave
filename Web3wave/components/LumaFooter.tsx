'use client'

import { Bell, MapPin } from 'lucide-react'

interface LumaFooterProps {
  onOpenSubscribe: () => void
}

export function LumaFooter({ onOpenSubscribe }: LumaFooterProps) {
  return (
    <footer className="bg-[#0a0a0d] border-t border-white/10 pt-20 pb-12 text-white">
      <div className="shell">
        {/* Subscription Callout */}
        <div className="luma-card p-8 sm:p-12 mb-16 text-center bg-gradient-to-b from-[#181820] to-[#121217] border border-white/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Stay updated on Web3Wave events.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Join 500+ developers receiving instant invites for workshops, hackathons, and community meetups.
          </p>
          <button onClick={onOpenSubscribe} className="btn-luma-accent py-3 px-8 text-sm mx-auto">
            <Bell className="w-4 h-4" />
            <span>Subscribe to Calendar</span>
          </button>
        </div>

        {/* Footer Nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white font-extrabold text-xs">
                  W3
                </div>
                <span className="text-sm font-extrabold text-white">
                  Web3Wave Calendar
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-4">
                The official event discovery & community platform for Web3, AI, and open-source software developers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Bhopal & Central India Node</span>
            </div>
          </div>

          <div className="md:col-span-3 text-xs space-y-2.5">
            <span className="text-zinc-400 font-mono font-bold uppercase tracking-wider block mb-3">
              CALENDAR DIRECTORY
            </span>
            <a href="/events" className="block text-zinc-400 hover:text-white transition-colors">
              Upcoming Events
            </a>
            <a href="#guilds" className="block text-zinc-400 hover:text-white transition-colors">
              Campus Chapters
            </a>
            <a href="#projects" className="block text-zinc-400 hover:text-white transition-colors">
              Shipped Projects
            </a>
            <a href="#builder-pass" className="block text-zinc-400 hover:text-white transition-colors">
              Builder Pass
            </a>
          </div>

          <div className="md:col-span-4 text-xs space-y-2.5">
            <span className="text-zinc-400 font-mono font-bold uppercase tracking-wider block mb-3">
              CONNECT & HOST
            </span>
            <a href="mailto:hello@web3wave.in" className="block text-zinc-400 hover:text-white transition-colors">
              Contact: hello@web3wave.in
            </a>
            <a href="tel:+918815680076" className="block text-zinc-400 hover:text-white transition-colors">
              Phone: +91 88156 80076
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="block text-zinc-400 hover:text-white transition-colors">
              GitHub Community Org
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="block text-zinc-400 hover:text-white transition-colors">
              Discord Guild Server
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
          <span>© 2026 Web3Wave Ecosystem · Onchain Developer Network</span>
          <span>Bhopal, MP · India</span>
        </div>
      </div>
    </footer>
  )
}
