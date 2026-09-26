'use client'

import React, { useEffect, useState } from 'react'

export type BorderBeamSize = 'sm' | 'md' | 'lg' | 'line' | 'pulse-outside' | 'pulse-inner'
export type BorderBeamTheme = 'dark' | 'light' | 'auto'
export type BorderBeamColorVariant = 'colorful' | 'mono' | 'ocean' | 'sunset'

export interface BorderBeamProps {
  className?: string
  size?: BorderBeamSize | number
  duration?: number
  borderWidth?: number
  colorVariant?: BorderBeamColorVariant
  theme?: BorderBeamTheme
  colorFrom?: string
  colorTo?: string
  delay?: number
  children?: React.ReactNode
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  duration = 6,
  borderWidth = 1.5,
  colorVariant = 'colorful',
  colorFrom,
  colorTo,
  delay = 0,
  children,
}) => {
  const [isLowPower, setIsLowPower] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setIsLowPower(isMobile || reducedMotion)
    }
  }, [])

  let from = colorFrom || '#f43f5e'
  let to = colorTo || '#06b6d4'

  if (colorVariant === 'colorful') {
    from = '#f43f5e'
    to = '#06b6d4'
  } else if (colorVariant === 'ocean') {
    from = '#3b82f6'
    to = '#8b5cf6'
  } else if (colorVariant === 'sunset') {
    from = '#f59e0b'
    to = '#ec4899'
  } else if (colorVariant === 'mono') {
    from = '#ffffff'
    to = '#52525b'
  }

  const BeamOverlay = (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
      style={{
        zIndex: 20,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        padding: `${borderWidth}px`,
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] aspect-square"
        style={{
          background: isLowPower
            ? `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
            : `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${from} 20%, ${to} 40%, transparent 60%)`,
          opacity: isLowPower ? 0.3 : 1,
          animationName: isLowPower ? 'none' : 'border-beam-rotate',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDelay: `-${delay}s`,
        }}
      />
    </div>
  )

  if (children) {
    return (
      <div className="relative rounded-[inherit] overflow-hidden">
        {children}
        {BeamOverlay}
      </div>
    )
  }

  return BeamOverlay
}

export default BorderBeam
