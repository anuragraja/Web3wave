'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Check,
  Sparkles,
  Loader2,
  Phone,
  Mail
} from 'lucide-react'

import { useAuth } from '@/src/context/AuthContext'
import { isUserAdmin } from '@/src/utils/eventUtils'
import {
  getAdminEventsApi,
  deleteEventApi,
  publishEventApi,
  unpublishEventApi
} from '@/src/api/events'
import {
  getAdminDashboardOverviewApi,
  getAdminUsersApi,
  getAdminCompaniesApi,
  DashboardOverviewData,
  AdminCompany
} from '@/src/api/admin'
import { BackendEvent } from '@/src/api/events/types'
import { User } from '@/src/api/auth/types'
import { LumaCreateEventModal } from '@/components/LumaCreateEventModal'
import { LumaNav } from '@/components/LumaNav'
import HoverFooter from '@/components/ui/hover-footer'

import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'

type AdminTab = 'overview' | 'events' | 'users' | 'companies'

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading, logoutUser } = useAuth()
  const isAdmin = isUserAdmin(user)

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  // Overview Data
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)

  // Events Data
  const [events, setEvents] = useState<BackendEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventCategoryFilter, setEventCategoryFilter] = useState('ALL')
  const [eventStatusFilter, setEventStatusFilter] = useState('ALL')
  const [eventSearch, setEventSearch] = useState('')

  // Users Data
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  // Companies Data
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companySearch, setCompanySearch] = useState('')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<BackendEvent | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  useModalScrollLock(!!deletingEventId)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  // Fetch Dashboard Overview
  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true)
    try {
      const res = await getAdminDashboardOverviewApi()
      if (res.success && res.data) {
        setOverview(res.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard overview:', err)
    } finally {
      setOverviewLoading(false)
    }
  }, [])

  // Fetch Admin Events
  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const query: any = {}
      if (eventCategoryFilter !== 'ALL') query.category = eventCategoryFilter
      if (eventStatusFilter !== 'ALL') query.status = eventStatusFilter
      if (eventSearch.trim()) query.search = eventSearch.trim()

      const res = await getAdminEventsApi(query)
      if (res.success && res.data) {
        setEvents(res.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch admin events:', err)
    } finally {
      setEventsLoading(false)
    }
  }, [eventCategoryFilter, eventStatusFilter, eventSearch])

  // Fetch Admin Users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const query: any = {}
      if (userSearch.trim()) query.search = userSearch.trim()

      const res = await getAdminUsersApi(query)
      if (res.success && res.data) {
        setUsers(res.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch admin users:', err)
    } finally {
      setUsersLoading(false)
    }
  }, [userSearch])

  // Fetch Admin Companies
  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true)
    try {
      const query: any = {}
      if (companySearch.trim()) query.search = companySearch.trim()

      const res = await getAdminCompaniesApi(query)
      if (res.success && res.data) {
        setCompanies(res.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch admin companies:', err)
    } finally {
      setCompaniesLoading(false)
    }
  }, [companySearch])

  useEffect(() => {
    if (isAdmin) {
      fetchOverview()
      fetchEvents()
      fetchUsers()
      fetchCompanies()
    }
  }, [isAdmin, fetchOverview, fetchEvents, fetchUsers, fetchCompanies])

  const handleRefreshAll = () => {
    fetchOverview()
    fetchEvents()
    fetchUsers()
    fetchCompanies()
  }

  // Handle Event Actions
  const handleTogglePublish = async (evt: BackendEvent) => {
    setActionError('')
    setActionSuccess('')
    try {
      if (evt.status === 'PUBLISHED') {
        await unpublishEventApi(evt._id)
        setActionSuccess(`Event "${evt.title}" unpublished successfully.`)
      } else {
        await publishEventApi(evt._id)
        setActionSuccess(`Event "${evt.title}" published successfully.`)
      }
      fetchEvents()
      fetchOverview()
    } catch (err: any) {
      setActionError(err.message || 'Failed to update event status.')
    }
  }

  const handleDeleteEventConfirm = async () => {
    if (!deletingEventId) return
    setIsDeleting(true)
    setActionError('')
    setActionSuccess('')
    try {
      await deleteEventApi(deletingEventId)
      setActionSuccess('Event deleted successfully from backend.')
      setDeletingEventId(null)
      fetchEvents()
      fetchOverview()
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete event.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090d] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Verifying Admin Credentials...</span>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#09090d] text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
        <LumaNav isAdminNav={true} onOpenSubscribe={() => {}} onOpenCreateEvent={() => {}} />

        <main className="pt-32 pb-20 px-4 max-w-lg mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-3xl font-black text-white">Access Restricted</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              You must be logged in with an <strong className="text-white">Admin</strong> account to access the Web3Wave Admin Dashboard.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/"
              className="btn-luma-primary py-3 px-6 text-xs font-bold justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Web3Wave Homepage</span>
            </Link>
          </div>
        </main>

        <HoverFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-white selection:bg-rose-500 selection:text-white font-sans antialiased relative">
      {/* Top Header Navigation */}
      <LumaNav isAdminNav={true} onOpenSubscribe={() => {}} onOpenCreateEvent={() => setCreateModalOpen(true)} />

      {/* Main Admin Content */}
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#13141f] to-[#09090d] border border-rose-500/20 p-6 md:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full filter blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  ADMIN CONTROL CENTER
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Signed in as: <strong className="text-white">{user.name}</strong> ({user.email})
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Web3Wave Admin Dashboard
              </h1>
              <p className="text-xs md:text-sm text-zinc-400">
                Manage live events, view user statistics, and control public community listings.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleRefreshAll}
                className="btn-luma-secondary py-2.5 px-4 text-xs flex items-center gap-1.5"
                title="Refresh Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${eventsLoading || overviewLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>

              <button
                onClick={() => {
                  setEditingEvent(null)
                  setCreateModalOpen(true)
                }}
                className="btn-luma-accent py-2.5 px-4 text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Action Banner Notifications */}
        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError('')} className="text-rose-300 hover:text-white">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-300 hover:text-white">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'events', label: 'Events Management', icon: Calendar },
            { id: 'users', label: 'Registered Users', icon: Users },
            { id: 'companies', label: 'Registered Companies', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>TOTAL EVENTS</span>
                  <Calendar className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white">{overview?.events.total ?? 0}</div>
                <div className="text-[11px] text-zinc-400 font-medium pt-1">
                  <span className="text-emerald-400 font-bold">{overview?.events.published ?? 0}</span> Published · <span className="text-amber-400 font-bold">{overview?.events.draft ?? 0}</span> Drafts
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>PUBLICLY PUBLISHED</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">{overview?.events.published ?? 0}</div>
                <div className="text-[11px] text-zinc-400 font-medium pt-1">Visible on public events page</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>REGISTERED USERS</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white">{overview?.users.total ?? 0}</div>
                <div className="text-[11px] text-zinc-400 font-medium pt-1">
                  <span className="text-cyan-400 font-bold">{overview?.users.verified ?? 0}</span> Verified Builders
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>REGISTERED COMPANIES</span>
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{overview?.companies?.total ?? companies.length}</div>
                <div className="text-[11px] text-zinc-400 font-medium pt-1">
                  <span className="text-emerald-400 font-bold">{overview?.companies?.verified ?? companies.filter(c => c.isVerified).length}</span> Verified Orgs
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                  <span>ADMINISTRATORS</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-purple-400">{overview?.users.admins ?? 0}</div>
                <div className="text-[11px] text-zinc-400 font-medium pt-1">
                  {overview?.users.regularUsers ?? 0} Regular Users
                </div>
              </div>
            </div>

            {/* Event Category Breakdown & Recent Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Events by Category</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Workshops', key: 'WORKSHOP', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
                    { label: 'Hackathons', key: 'HACKATHON', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
                    { label: 'Meetups', key: 'MEETUP', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
                    { label: 'Grant Sprints', key: 'GRANT_SPRINT', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
                  ].map((cat) => {
                    const count = overview?.events.byCategory?.[cat.key] || 0
                    return (
                      <div key={cat.key} className={`p-4 rounded-2xl border ${cat.color} space-y-1`}>
                        <span className="text-[10px] font-mono font-bold uppercase">{cat.label}</span>
                        <div className="text-2xl font-black text-white">{count}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Events List */}
              <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Recent Backend Events</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {(!overview?.recentEvents || overview.recentEvents.length === 0) ? (
                    <p className="text-xs text-zinc-500 py-6 text-center">No recent events created yet.</p>
                  ) : (
                    overview.recentEvents.slice(0, 4).map((evt: any) => (
                      <div key={evt._id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{evt.title}</span>
                          <span className="text-zinc-500 text-[11px]">{evt.location} · {evt.category}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                          evt.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {evt.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-[#181822] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={eventCategoryFilter}
                  onChange={(e) => setEventCategoryFilter(e.target.value)}
                  className="bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="WORKSHOP">Workshops</option>
                  <option value="HACKATHON">Hackathons</option>
                  <option value="MEETUP">Meetups</option>
                  <option value="GRANT_SPRINT">Grant Sprints</option>
                </select>

                {/* Status Filter */}
                <select
                  value={eventStatusFilter}
                  onChange={(e) => setEventStatusFilter(e.target.value)}
                  className="bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Found <strong className="text-white">{events.length}</strong> events
              </div>
            </div>

            {/* Events Table / List */}
            {eventsLoading ? (
              <div className="py-20 text-center text-zinc-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span className="text-xs font-mono">Loading Events from MongoDB...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121217] border border-white/10 space-y-3">
                <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Events Found</h3>
                <p className="text-xs text-zinc-400">No events match your selected filters or search query.</p>
                <button
                  onClick={() => {
                    setEditingEvent(null)
                    setCreateModalOpen(true)
                  }}
                  className="btn-luma-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Event</span>
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#121217] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#181822] text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Event Title</th>
                        <th className="px-4 py-4">Category</th>
                        <th className="px-4 py-4">Date & Time</th>
                        <th className="px-4 py-4">Venue</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {events.map((evt) => (
                        <tr key={evt._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-white">
                            <div className="flex flex-col">
                              <span>{evt.title}</span>
                              <span className="text-[11px] text-zinc-500 font-mono font-normal">Host: {evt.organizerName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-rose-300">
                              {evt.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono">
                            <div>{new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="text-zinc-500 text-[11px]">{evt.startTime}</div>
                          </td>
                          <td className="px-4 py-4 max-w-xs truncate">{evt.location}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              evt.status === 'PUBLISHED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : evt.status === 'DRAFT'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {evt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Publish Toggle Button */}
                              <button
                                onClick={() => handleTogglePublish(evt)}
                                className={`p-1.5 rounded-lg border text-xs transition-all ${
                                  evt.status === 'PUBLISHED'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                                title={evt.status === 'PUBLISHED' ? 'Unpublish Event' : 'Publish Event'}
                              >
                                {evt.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingEvent(evt)
                                  setCreateModalOpen(true)
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                                title="Edit Event Details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeletingEventId(evt._id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-white/10 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, phone..."
                  className="w-full bg-[#181822] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Found <strong className="text-white">{users.length}</strong> users
              </div>
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div className="py-20 text-center text-zinc-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span className="text-xs font-mono">Loading Registered Users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121217] border border-white/10 space-y-2">
                <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Users Found</h3>
                <p className="text-xs text-zinc-400">No users match your query.</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#121217] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#181822] text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-4 py-4">Email</th>
                        <th className="px-4 py-4">Phone Number</th>
                        <th className="px-4 py-4">Role</th>
                        <th className="px-4 py-4">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => {
                        const userIsAdmin = typeof u.role === 'object' ? u.role?.name?.toLowerCase() === 'admin' : typeof u.role === 'string' ? u.role.toLowerCase() === 'admin' : false
                        return (
                          <tr key={u._id || u.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                            <td className="px-4 py-4 font-mono text-zinc-400">{u.email}</td>
                            <td className="px-4 py-4 font-mono text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-zinc-500" />
                                {u.number || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                userIsAdmin
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                              }`}>
                                {userIsAdmin ? 'ADMIN' : 'USER'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {u.isVerified ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              ) : (
                                <span className="text-zinc-500 text-[11px]">Unverified</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMPANIES MANAGEMENT */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-white/10 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Search companies by name, email, phone..."
                  className="w-full bg-[#181822] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Found <strong className="text-white">{companies.length}</strong> companies
              </div>
            </div>

            {/* Companies Table */}
            {companiesLoading ? (
              <div className="py-20 text-center text-zinc-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span className="text-xs font-mono">Loading Registered Companies...</span>
              </div>
            ) : companies.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121217] border border-white/10 space-y-2">
                <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Companies Found</h3>
                <p className="text-xs text-zinc-400">No registered companies match your query.</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#121217] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#181822] text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Company Name</th>
                        <th className="px-4 py-4">Email</th>
                        <th className="px-4 py-4">Phone</th>
                        <th className="px-4 py-4">Verification</th>
                        <th className="px-4 py-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {companies.map((c) => (
                        <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span>{c.companyName}</span>
                          </td>
                          <td className="px-4 py-4 font-mono text-zinc-400">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              {c.email}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono text-zinc-400">
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-zinc-500" />
                              {c.phone || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {c.isVerified ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-amber-400/80 text-[11px] flex items-center gap-1">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-zinc-500 font-mono text-[11px]">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Event Confirmation Modal */}
      <AnimatePresence>
        {deletingEventId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingEventId(null)}
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              className="bg-[#121217] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.2)] my-auto max-h-[85vh] overflow-y-auto overscroll-contain"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Event?</h3>
                <p className="text-xs text-zinc-400">
                  Are you sure you want to delete this event from the MongoDB backend? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingEventId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEventConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-500/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / Edit Event Modal */}
      <LumaCreateEventModal
        isOpen={createModalOpen}
        initialEvent={editingEvent}
        onClose={() => {
          setCreateModalOpen(false)
          setEditingEvent(null)
        }}
        onSuccess={() => {
          fetchEvents()
          fetchOverview()
        }}
      />

      <HoverFooter />
    </div>
  )
}
