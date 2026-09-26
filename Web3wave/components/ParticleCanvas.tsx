'use client'

import { useEffect, useRef } from 'react'
import { getDevicePerformanceConfig } from '@/src/lib/performance'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  baseAlpha: number
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const config = getDevicePerformanceConfig()

    // If reduced motion is requested, do not run animation loop
    if (config.reducedMotion) {
      return
    }

    let animationFrameId: number | null = null
    let lastFrameTime = performance.now()
    const frameInterval = config.targetFps > 0 ? 1000 / config.targetFps : 1000 / 60

    let width = 0
    let height = 0
    let dpr = 1

    const resizeCanvas = () => {
      if (!canvas.parentElement) return
      dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr)
      width = canvas.parentElement.clientWidth
      height = canvas.parentElement.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const particleCount = Math.min(
      Math.floor(width / (config.isMobile ? 24 : 18)),
      config.particleCount
    )

    const particles: Particle[] = []
    const colors = ['#8b5cf6', '#06b6d4', '#6366f1', '#a855f7']

    for (let i = 0; i < particleCount; i++) {
      const alpha = Math.random() * 0.5 + 0.2
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (config.isMobile ? 0.25 : 0.4),
        vy: (Math.random() - 0.5) * (config.isMobile ? 0.25 : 0.4),
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: alpha,
        baseAlpha: alpha,
      })
    }

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      if (config.isMobile) return // Save event listener work on touch devices
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouseX = -1000
      mouseY = -1000
    }

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    if (!config.isMobile) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    const render = (now: number) => {
      if (!isVisibleRef.current) {
        animationFrameId = null
        return
      }

      const elapsed = now - lastFrameTime
      if (elapsed >= frameInterval) {
        lastFrameTime = now - (elapsed % frameInterval)

        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i]
          p1.x += p1.vx
          p1.y += p1.vy

          if (p1.x < 0 || p1.x > width) p1.vx *= -1
          if (p1.y < 0 || p1.y > height) p1.vy *= -1

          if (!config.isMobile && mouseX > 0) {
            const dxMouse = mouseX - p1.x
            const dyMouse = mouseY - p1.y
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

            if (distMouse < 140) {
              p1.alpha = Math.min(1, p1.baseAlpha + (1 - distMouse / 140) * 0.6)
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(mouseX, mouseY)
              ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - distMouse / 140) * 0.35})`
              ctx.lineWidth = 1
              ctx.stroke()
            } else {
              p1.alpha = p1.baseAlpha
            }
          }

          ctx.beginPath()
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
          ctx.fillStyle = p1.color
          ctx.globalAlpha = p1.alpha
          ctx.fill()
          ctx.globalAlpha = 1

          // Limit connection checks on mobile to reduce O(N^2) work
          const connectDist = config.isMobile ? 80 : 110
          const maxConnections = config.isMobile ? Math.min(particles.length, i + 8) : particles.length

          for (let j = i + 1; j < maxConnections; j++) {
            const p2 = particles[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < connectDist) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / connectDist) * (config.isMobile ? 0.08 : 0.12)})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    const startAnimation = () => {
      if (!animationFrameId) {
        lastFrameTime = performance.now()
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? true
        isVisibleRef.current = isIntersecting
        if (isIntersecting) {
          startAnimation()
        } else {
          stopAnimation()
        }
      },
      { threshold: 0 }
    )

    observer.observe(canvas)

    return () => {
      stopAnimation()
      window.removeEventListener('resize', handleResize)
      if (!config.isMobile) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto w-full h-full opacity-70 z-0"
    />
  )
}
