'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll with luxurious inertia
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    })

    lenisRef.current = lenis

    // Synchronize Lenis scroll event with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Synchronize Lenis animation loop with GSAP's high-precision ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Smooth scroll handling for all hash links (#events, #join, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (anchor && anchor.hash && anchor.origin === window.location.origin && anchor.pathname === window.location.pathname) {
        const targetElement = document.querySelector(anchor.hash)
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement as HTMLElement, { offset: 0, duration: 1.5 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    // Attach Lenis reference to window for route restoration & global scroll control
    if (typeof window !== 'undefined') {
      (window as any).__lenis = lenis
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      if (typeof window !== 'undefined') {
        delete (window as any).__lenis
      }
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
