'use client'

import { ArrowUpRight, Code2, Globe, MessageSquare, MapPin } from 'lucide-react'

interface FooterProps {
  onOpenJoin: () => void
}

export function Footer({ onOpenJoin }: FooterProps) {
  return (
    <footer className="bg-[#09090b] text-white pt-20 pb-12 overflow-hidden">
      <div className="shell">
        {/* Editorial Banner CTA */}
        <div id="join" className="craft-card mb-20 p-10 sm:p-16 text-center bg-[#121215]">
          <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            The future is built locally.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Find your people. Build something meaningful. Start right here in Bhopal.
          </p>
          <button onClick={onOpenJoin} className="btn-solid py-4 px-8 text-base mx-auto">
            <span>Join Community</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded bg-white font-extrabold text-xs text-black flex items-center justify-center">
                  W3
                </div>
                <span className="text-sm font-bold tracking-wider text-white">
                  WEB3 BHOPAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
                The epicenter of Web3, AI, and open-source software development in Central India. Uniting developers, founders, and students.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bhopal, MP · 23.2599° N, 77.4126° E</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 font-mono text-xs space-y-3">
            <span className="text-white uppercase tracking-widest font-bold block mb-4">
              NAVIGATION
            </span>
            <a href="#about" className="block text-zinc-400 hover:text-white transition-colors">
              Pillars & Purpose
            </a>
            <a href="#events" className="block text-zinc-400 hover:text-white transition-colors">
              Upcoming Sessions
            </a>
            <a href="#ecosystem" className="block text-zinc-400 hover:text-white transition-colors">
              Campus Chapters
            </a>
            <a href="#projects" className="block text-zinc-400 hover:text-white transition-colors">
              Shipped Projects
            </a>
            <a href="#builder-pass" className="block text-zinc-400 hover:text-white transition-colors">
              Builder Badge
            </a>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 font-mono text-xs space-y-3">
            <span className="text-white uppercase tracking-widest font-bold block mb-4">
              CONNECT
            </span>
            <a
              href="mailto:hello@web3bhopal.in"
              className="block text-zinc-400 hover:text-white transition-colors"
            >
              Contact: hello@web3bhopal.in
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub Organization</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discord Guild</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
          <span>© 2026 Web3 Bhopal Ecosystem. Grassroots & Open Source.</span>
          <span>Designed with High-Craft Editorial Architecture</span>
        </div>
      </div>
    </footer>
  )
}
