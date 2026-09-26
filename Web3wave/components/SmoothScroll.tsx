'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Routes where cinematic smooth scrolling (Lenis) should be active
const CINEMATIC_ROUTES = ['/', '/about', '/events', '/gallery']

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Disable Lenis if prefers-reduced-motion is active or on non-cinematic routes
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCinematicRoute = CINEMATIC_ROUTES.includes(pathname || '/')

    if (isReducedMotion || !isCinematicRoute) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null;
        (window as any).__lenis = null
      }
      return
    }

    const isMobile = window.innerWidth < 768

    // 2. Instantiate single Lenis instance for cinematic routes
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: isMobile ? 0.8 : 0.9,
      touchMultiplier: 1,
      syncTouch: false,
    })

    lenisRef.current = lenis
    ;(window as any).__lenis = lenis

    // 3. Synchronize Lenis scroll event with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // 4. Synchronize Lenis animation loop with GSAP's ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(500, 33)

    // Handle orientation changes smoothly on mobile
    const handleOrientation = () => {
      ScrollTrigger.refresh()
      lenis.resize()
    }
    window.addEventListener('orientationchange', handleOrientation)

    // Smooth scroll handling for all hash links (#events, #join, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (
        anchor &&
        anchor.hash &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        const targetElement = document.querySelector(anchor.hash)
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement as HTMLElement, { offset: 0, duration: 1.2 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('orientationchange', handleOrientation)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      lenisRef.current = null
      delete (window as any).__lenis
    }
  }, [pathname])

  return <>{children}</>
}

export default SmoothScroll
