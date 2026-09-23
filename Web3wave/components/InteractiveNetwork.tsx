'use client'

import { useState } from 'react'
import { Server, Users, ArrowUpRight } from 'lucide-react'

const networkNodes = [
  {
    id: 'manit',
    name: 'MANIT Chapter',
    role: 'Student Guild & Hackers',
    builders: '180+ Members',
    focus: 'Ethereum, Rust, Zero-Knowledge',
    description: 'The primary campus developer collective running weekly smart contract audits and research sessions.',
  },
  {
    id: 'lnct',
    name: 'LNCT Tech Nest',
    role: 'DeFi & Smart Contracts',
    builders: '120+ Members',
    focus: 'Solidity, EVM, Smart Audits',
    description: 'Focused on protocol development, gas optimization, and cross-chain dApp infrastructure.',
  },
  {
    id: 'mpstartup',
    name: 'MP Startup Hub',
    role: 'Founders & Incubation',
    builders: '45 Startups',
    focus: 'Grants, Pitching, Legal Rails',
    description: 'Connecting local Web3 founders with global Web3 grant pools, seed funds, and legal guidance.',
  },
  {
    id: 'zklab',
    name: 'ZK & Cyber Guild',
    role: 'Cryptography & Privacy',
    builders: '60+ Members',
    focus: 'Circom, Noir, RISC Zero',
    description: 'Pioneering zero-knowledge cryptography research and privacy-preserving protocol architecture.',
  },
]

export function InteractiveNetwork() {
  return (
    <section id="ecosystem" className="py-24 border-b border-zinc-800 bg-[#09090b]">
      <div className="shell">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-6">
            Where Bhopal&apos;s talent intersects.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Connecting campus guilds, startup incubators, and independent developers into one high-throughput network across Central India.
          </p>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {networkNodes.map((node) => (
            <div key={node.id} className="craft-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-[#ff5500]" />
                    <h3 className="text-xl font-bold text-white">{node.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                    {node.builders}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-zinc-400 mb-2">
                  ROLE: {node.role}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {node.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>TECH: {node.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
