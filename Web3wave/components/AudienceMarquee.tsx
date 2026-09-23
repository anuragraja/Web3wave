'use client'

const roles = [
  'Solidity Engineers',
  'Protocol Founders',
  'UI/UX Architects',
  'ZK Researchers',
  'Rust Developers',
  'DeFi Builders',
  'Student Innovators',
  'AI x Web3 Builders',
  'DAO Operators',
]

export function AudienceMarquee() {
  return (
    <section className="py-6 border-b border-zinc-800 bg-[#09090b] overflow-hidden select-none">
      <div className="relative w-full overflow-hidden flex">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {roles.concat(roles).map((role, idx) => (
            <div
              key={`${role}-${idx}`}
              className="inline-flex items-center gap-3 text-xs font-mono font-bold tracking-widest uppercase text-zinc-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span>{role}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  )
}
