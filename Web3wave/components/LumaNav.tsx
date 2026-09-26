'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Bell, Menu, X, LogIn, User, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { isUserAdmin } from '@/src/utils/eventUtils'

interface LumaNavProps {
  onOpenSubscribe?: () => void
  onOpenCreateEvent?: () => void
  onOpenAuthModal?: () => void
  isAdminNav?: boolean
}

export function LumaNav({ onOpenSubscribe, onOpenCreateEvent, onOpenAuthModal, isAdminNav }: LumaNavProps) {
  const { user, company, logoutUser, logoutCompany } = useAuth()
  const isAdmin = isUserAdmin(user)
  const pathname = usePathname()
  const hideAdminItems = Boolean(isAdmin || isAdminNav || pathname === '/admin' || pathname?.startsWith('/admin'))

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#0d0d10]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="shell flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/web3wave-logo.png"
                alt="Web3Wave Logo"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1 group-hover:text-rose-300 transition-colors">
                Web3Wave <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Events & Builder Calendar
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <a
              href="/about"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-all"
            >
              About
            </a>
            <a
              href="/events"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-all"
            >
              Events
            </a>
            <a
              href="/companies"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-all"
            >
              Companies
            </a>
            
            {/* Members button removed from Admin Navigation */}
            {!hideAdminItems && (
              <a
                href="/members"
                className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-all"
              >
                Members
              </a>
            )}

            <a
              href="/gallery"
              className="text-xs font-semibold text-rose-300 hover:text-white px-3 py-1 rounded-full hover:bg-rose-500/20 transition-all flex items-center gap-1"
            >
              <span>Gallery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            </a>

            {/* Admin Dashboard Link (Only visible to Admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-bold text-amber-300 hover:text-white px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Show Create Event Button ONLY if Admin */}
            {isAdmin && (
              <button
                onClick={() => onOpenCreateEvent?.()}
                className="btn-luma-secondary text-xs py-2 px-3 border-rose-500/40 text-rose-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Event</span>
              </button>
            )}

            {user || company ? (
              <div className="flex items-center gap-2">
                <Link
                  href={company ? "/companies" : isAdmin ? "/admin" : "/members"}
                  className="btn-luma-secondary text-xs py-2 px-3 border-rose-500/30 bg-rose-500/10 text-rose-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{company ? company.companyName : user?.name || "Account"}</span>
                </Link>
                <button
                  onClick={() => (company ? logoutCompany() : logoutUser())}
                  className="text-xs text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="btn-luma-secondary text-xs py-2 px-4 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Login</span>
                </button>
              )
            )}

            {/* Subscribe button removed from Admin Navigation */}
            {!hideAdminItems && (
              <button
                onClick={onOpenSubscribe}
                className="btn-luma-accent text-xs py-2 px-4"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            )}
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

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#0d0d10] border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
          >
            {onOpenAuthModal && !(user || company) && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenAuthModal()
                }}
                className="btn-luma-accent text-sm py-2.5 justify-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Login</span>
              </button>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-amber-300 py-2 border-b border-white/5 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <a
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-white py-2 border-b border-white/5"
            >
              About Us
            </a>
            <a
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-white py-2 border-b border-white/5"
            >
              Explore Events
            </a>
            <a
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-white py-2 border-b border-white/5"
            >
              Companies Portal
            </a>
            
            {!hideAdminItems && (
              <a
                href="/members"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-white py-2 border-b border-white/5"
              >
                Members Portal
              </a>
            )}

            <a
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-rose-300 py-2 border-b border-white/5"
            >
              Builder Gallery
            </a>

            <div className="flex flex-col gap-2 pt-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenCreateEvent?.()
                  }}
                  className="btn-luma-secondary text-sm py-2.5 justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event (Admin)</span>
                </button>
              )}
              {!hideAdminItems && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenSubscribe?.()
                  }}
                  className="btn-luma-accent text-sm py-2.5 justify-center"
                >
                  <Bell className="w-4 h-4" />
                  <span>Subscribe to Calendar</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
