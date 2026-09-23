'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Builder Card', href: '#builder-pass' },
  { label: 'Gallery', href: '/gallery' },
]

interface FloatingNavProps {
  onOpenJoin: () => void
}

export function FloatingNav({ onOpenJoin }: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b ${
          scrolled
            ? 'bg-[#09090b]/90 backdrop-blur-md border-zinc-800'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="shell py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-extrabold text-xs text-black group-hover:scale-105 transition-transform">
              W3
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-bold tracking-wider text-white group-hover:text-rose-300 transition-colors">
                WEB3 BHOPAL
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                CENTRAL INDIA NODE
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>500+ BUILDERS</span>
            </div>

            <button onClick={onOpenJoin} className="btn-solid text-xs py-2.5 px-5">
              <span>Join Community</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-300 hover:text-white p-1"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-[#09090b] border-b border-zinc-800 p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-white py-2 border-b border-zinc-900"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenJoin()
              }}
              className="btn-accent text-sm py-3 mt-2 w-full justify-center"
            >
              <span>Join Community</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
