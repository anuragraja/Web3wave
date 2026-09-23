'use client'

import { Building2, GraduationCap, Globe2, ShieldAlert, Cpu, Zap } from 'lucide-react'

const partners = [
  { name: 'M.P. STARTUP HUB', icon: Building2, type: 'INCUBATOR' },
  { name: 'MANIT BHOPAL', icon: GraduationCap, type: 'UNIVERSITY' },
  { name: 'BUILD CLUB INDIA', icon: Zap, type: 'COLLECTIVE' },
  { name: 'INDIA WEB3 GUILD', icon: Globe2, type: 'COMMUNITY' },
  { name: '0x COLLECTIVE', icon: Cpu, type: 'RESEARCH' },
  { name: 'BHOPAL TECH HUB', icon: ShieldAlert, type: 'INFRA' },
]

export function PartnerGrid() {
  return (
    <section className="py-20 border-b border-zinc-800 bg-[#09090b]">
      <div className="shell">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ecosystem Partners & Alliances
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.name}
                className="craft-card p-5 flex flex-col items-center justify-center text-center h-28 bg-[#121215]"
              >
                <Icon className="w-5 h-5 text-zinc-400 mb-2" />
                <span className="text-xs font-bold text-zinc-200 font-mono tracking-wider">
                  {p.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 mt-1">
                  {p.type}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
