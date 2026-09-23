'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, ExternalLink, ChevronDown } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'

const projects = [
  {
    num: '01',
    name: 'BharatPay Protocol',
    category: 'DEFI · PAYMENTS',
    status: 'MAINNET V1',
    description: 'Decentralized liquidity and micro-payment rails optimized for high-throughput localized Web3 commerce.',
    stack: ['Solidity', 'Foundry', 'Next.js', 'Viem'],
    github: 'https://github.com',
    link: '#',
    details: 'BharatPay Protocol reduces cross-border transfer latency to under 2 seconds using optimism rollups and localized liquidity pools built specifically for developers in emerging markets.',
  },
  {
    num: '02',
    name: 'CampusDAO Bhopal',
    category: 'GOVERNANCE · DAO',
    status: 'ACTIVE GUILD',
    description: 'A student-led collective exploring decentralized coordination, quadratic funding, and campus hackathons.',
    stack: ['Aragon', 'Snapshot', 'IPFS', 'TypeScript'],
    github: 'https://github.com',
    link: '#',
    details: 'CampusDAO connects over 500 engineering students across MANIT, LNCT, and RGPV to allocate micro-grants for open-source Web3 research and hackathon travel.',
  },
  {
    num: '03',
    name: 'Proof of Bhopal',
    category: 'INFRA · IDENTITY',
    status: 'TESTNET LIVE',
    description: 'An onchain identity and reputation graph for Bhopal builders, coders, and startup contributors.',
    stack: ['EAS (Attestations)', 'Polygon', 'Tailwind', 'GraphQL'],
    github: 'https://github.com',
    link: '#',
    details: 'Proof of Bhopal issues non-transferable soulbound attestations for hackathon wins, workshop attendance, and merged GitHub pull requests across local repositories.',
  },
]

export function ProjectShowcase() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <section id="projects" className="py-24 border-b border-zinc-800 bg-[#0c0c0e]">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Shipped in Bhopal.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Decentralized applications, open-source protocols, and developer tooling born in our hack nights.
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-4">
          {projects.map((proj, idx) => {
            const isExpanded = expandedIndex === idx
            return (
              <div key={proj.name} className="craft-card relative p-6 sm:p-8">
                <BorderBeam size="sm" />
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-mono text-zinc-500 font-bold">
                      {proj.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#ff5500] font-semibold">
                          {proj.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                          {proj.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {proj.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 max-w-md line-clamp-2 md:line-clamp-1">
                    {proj.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pt-6 mt-6 border-t border-zinc-800"
                    >
                      <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                        {proj.details}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500 mr-2">STACK:</span>
                          {proj.stack.map((st) => (
                            <span
                              key={st}
                              className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                            >
                              {st}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                          <a href={proj.link} className="btn-solid text-xs py-2 px-4">
                            <span>View Project</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
