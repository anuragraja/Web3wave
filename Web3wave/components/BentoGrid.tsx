'use client'

import { Code2, Compass, Users, Rocket, ArrowUpRight } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

const pillars = [
  {
    icon: Code2,
    title: 'Build & Ship',
    subtitle: 'From Prototype to Mainnet',
    description: 'Turn ambitious ideas into working decentralized applications alongside engineers who ship fast.',
  },
  {
    icon: Compass,
    title: 'Learn in Public',
    subtitle: 'Deep Dives & Code Audits',
    description: 'Master smart contract architecture, Zero Knowledge proofs, and decentralized infrastructure.',
  },
  {
    icon: Users,
    title: 'Peer Network',
    subtitle: 'Co-founders & Collaborators',
    description: 'Meet ambitious builders, mentors, and investors right here in Bhopal.',
  },
  {
    icon: Rocket,
    title: 'Ecosystem Launch',
    subtitle: 'Grants, Demos & Incubators',
    description: 'Get direct access to global Web3 hackathons, grant pools, and local incubation programs.',
  },
]

export function BentoGrid() {
  return (
    <section id="about" className="py-24 border-b border-zinc-800 bg-[#09090b]">
      <div className="shell">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Built by builders, for builders.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            We are creating the central node where Bhopal&apos;s tech talent, capital, and global Web3 protocols connect.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="craft-card relative p-8 flex flex-col justify-between">
                <BorderBeam size="sm" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-6">
                    <Icon className="w-6 h-6 text-[#ff5500]" />
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono font-semibold text-zinc-400 mb-4">
                    {item.subtitle}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
