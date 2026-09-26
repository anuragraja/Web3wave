'use client'

import { useState, useEffect } from 'react'
import { Flame, Sparkles, Calendar, MapPin } from 'lucide-react'

interface EventPosterProps {
  posterUrl?: string
  title: string
  category?: string
  venue?: string
  dateString?: string
  className?: string
  badgeText?: string
  aspectRatio?: string
}

export function EventPoster({
  posterUrl,
  title,
  category = 'Workshops',
  venue = 'Bhopal',
  dateString,
  className = '',
  badgeText,
}: EventPosterProps) {
  const [imgError, setImgError] = useState(false)

  // Reset imgError if posterUrl changes
  useEffect(() => {
    setImgError(false)
  }, [posterUrl])

  const hasValidPoster = Boolean(posterUrl && posterUrl.trim() && !imgError)

  if (hasValidPoster) {
    return (
      <img
        src={posterUrl}
        alt={title}
        onError={() => setImgError(true)}
        className={`object-cover ${className}`}
        loading="eager"
      />
    )
  }

  // Branded Fallback Visual Card (Web3Wave Identity)
  return (
    <div
      className={`relative w-full h-full min-h-[240px] bg-gradient-to-br from-[#1c1825] via-[#12121a] to-[#09090d] border border-white/10 flex flex-col justify-between p-6 sm:p-8 overflow-hidden group select-none ${className}`}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-500/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Top Header Badge Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/web3wave-logo.png"
            alt="Web3Wave Logo"
            className="h-6 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
          <span className="text-xs font-black tracking-tight text-white font-mono">
            WEB3WAVE
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
          {badgeText || category || 'WEB3 EVENT'}
        </span>
      </div>

      {/* Center Event Information */}
      <div className="relative z-10 my-auto py-4 space-y-2">
        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          OFFICIAL COMMUNITY EVENT
        </span>

        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug group-hover:text-rose-300 transition-colors">
          {title}
        </h3>

        {dateString && (
          <p className="text-xs font-mono text-zinc-400 font-semibold pt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>{dateString}</span>
          </p>
        )}
      </div>

      {/* Bottom Footer Row */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-400">
        <span className="truncate max-w-[200px] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{venue}</span>
        </span>
        <span className="text-rose-400 font-bold shrink-0">BUILD · SHIP · GROW</span>
      </div>
    </div>
  )
}
