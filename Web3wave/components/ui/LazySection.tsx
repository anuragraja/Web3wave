'use client'

import React, { useState, useEffect, useRef } from 'react'

interface LazySectionProps {
  children: React.ReactNode
  rootMargin?: string
  minHeight?: string | number
  className?: string
  fallback?: React.ReactNode
}

export function LazySection({
  children,
  rootMargin = '300px 0px 300px 0px',
  minHeight = '300px',
  className = '',
  fallback,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // If IntersectionObserver is not supported, mount immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  const styleMinHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: shouldRender ? undefined : styleMinHeight }}
    >
      {shouldRender ? (
        children
      ) : (
        fallback || (
          <div
            className="w-full flex items-center justify-center bg-transparent"
            style={{ height: styleMinHeight }}
          />
        )
      )}
    </div>
  )
}
