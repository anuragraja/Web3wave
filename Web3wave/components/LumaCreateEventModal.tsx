'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Clock, CheckCircle2, ArrowUpRight, Plus, QrCode, AlertCircle, Loader2, Upload, Image as ImageIcon } from 'lucide-react'
import { LumaEvent } from './LumaEventGrid'
import { BackendEvent } from '@/src/api/events/types'
import { createEventApi, updateEventApi } from '@/src/api/events'
import { categoryToBackend, categoryToFrontend, mapBackendEventToLumaEvent } from '@/src/utils/eventUtils'
import { EventPoster } from '@/components/EventPoster'

import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'

interface LumaCreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent?: (event: LumaEvent) => void
  initialEvent?: BackendEvent | null
  onSuccess?: () => void
}

export function LumaCreateEventModal({
  isOpen,
  onClose,
  onAddEvent,
  initialEvent,
  onSuccess,
}: LumaCreateEventModalProps) {
  useModalScrollLock(isOpen)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Workshops')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [hostName, setHostName] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [hostPhone, setHostPhone] = useState('')
  const [capacity, setCapacity] = useState('60')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('PUBLISHED')
  const [poster, setPoster] = useState('')
  
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdEvent, setCreatedEvent] = useState<LumaEvent | null>(null)
  const [success, setSuccessState] = useState(false)

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '')
      setCategory(categoryToFrontend(initialEvent.category))
      if (initialEvent.date) {
        const d = new Date(initialEvent.date)
        if (!isNaN(d.getTime())) {
          setDate(d.toISOString().split('T')[0])
        }
      }
      setTime(initialEvent.startTime || '')
      setVenue(initialEvent.location || '')
      setHostName(initialEvent.organizerName || '')
      setHostEmail(initialEvent.organizerEmail || '')
      setHostPhone(initialEvent.organizerPhone || '')
      setCapacity(String(initialEvent.capacity || 60))
      setDescription(initialEvent.description || '')
      setStatus(initialEvent.status || 'PUBLISHED')
      setPoster(initialEvent.poster || '')
    } else {
      setTitle('')
      setCategory('Workshops')
      setDate('')
      setTime('')
      setVenue('')
      setHostName('')
      setHostEmail('')
      setHostPhone('')
      setCapacity('60')
      setDescription('')
      setStatus('PUBLISHED')
      setPoster('')
    }
  }, [initialEvent, isOpen])

  if (!isOpen) return null

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    const numericOnly = rawVal.replace(/\D/g, '').slice(0, 10)
    setHostPhone(numericOnly)
    if (errorMsg) setErrorMsg('')
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image file size must be less than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPoster(reader.result as string)
        if (errorMsg) setErrorMsg('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!title.trim()) {
      setErrorMsg('Event / Workshop Title is required.')
      return
    }
    if (!capacity || parseInt(capacity) <= 0) {
      setErrorMsg('Target Capacity must be a positive number.')
      return
    }
    if (!date) {
      setErrorMsg('Please select an event date.')
      return
    }
    if (!time.trim()) {
      setErrorMsg('Time Slot is required (e.g. 12:30 PM Onwards).')
      return
    }
    if (!venue.trim()) {
      setErrorMsg('Venue / Location is required.')
      return
    }
    if (!hostName.trim()) {
      setErrorMsg('Host / Organizer Name is required.')
      return
    }
    if (!hostEmail.trim() || !/\S+@\S+\.\S+/.test(hostEmail)) {
      setErrorMsg('Please enter a valid Organizer Contact Email.')
      return
    }
    if (!description.trim()) {
      setErrorMsg('Session Description is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        category: categoryToBackend(category),
        description: description.trim(),
        capacity: parseInt(capacity) || 60,
        date: new Date(date).toISOString(),
        startTime: time.trim(),
        location: venue.trim(),
        organizerName: hostName.trim(),
        organizerEmail: hostEmail.trim(),
        organizerPhone: hostPhone.trim() || undefined,
        poster: poster.trim() || undefined,
        status: status || 'PUBLISHED',
      }

      let resBackendEvent: BackendEvent

      if (initialEvent?._id) {
        const res = await updateEventApi(initialEvent._id, payload)
        resBackendEvent = res.data
      } else {
        const res = await createEventApi(payload)
        resBackendEvent = res.data
      }

      const lumaEvt = mapBackendEventToLumaEvent(resBackendEvent)

      if (onAddEvent) {
        onAddEvent(lumaEvt)
      }
      if (onSuccess) {
        onSuccess()
      }

      setCreatedEvent(lumaEvt)
      setSuccessState(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save event to backend server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseAndReset = () => {
    setSuccessState(false)
    setCreatedEvent(null)
    setErrorMsg('')
    setTitle('')
    setDate('')
    setTime('')
    setVenue('')
    setHostName('')
    setHostEmail('')
    setHostPhone('')
    setDescription('')
    setPoster('')
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseAndReset}
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto overscroll-none"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          className="relative max-w-lg w-full bg-[#121217] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] my-auto max-h-[85vh] overflow-y-auto overscroll-contain"
        >
          <button
            onClick={handleCloseAndReset}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {success && createdEvent ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                  {initialEvent ? 'EVENT UPDATED IN BACKEND' : 'EVENT LIVE ON COMMUNITY CALENDAR'}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {initialEvent ? 'Updated Successfully!' : 'Published Successfully!'}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto">
                  Your <span className="text-rose-300 font-bold">{createdEvent.category}</span> session has been saved to the MongoDB backend database.
                </p>
              </div>

              {/* Event Card Summary */}
              <div className="bg-[#181822] border border-white/10 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">EVENT TITLE</span>
                    <span className="font-bold text-white">{createdEvent.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">CATEGORY</span>
                    <span className="font-mono text-rose-400 font-bold">{createdEvent.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">DATE & TIME</span>
                    <span className="font-semibold text-zinc-200">{createdEvent.dateString} ({createdEvent.timeString})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">VENUE</span>
                    <span className="text-xs text-zinc-300 font-medium">{createdEvent.venue}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] text-rose-400 font-mono">
                    <span className="block font-bold">HOST: {createdEvent.hostName}</span>
                    {hostPhone && <span className="text-zinc-400">PHONE: +91 {hostPhone}</span>}
                  </div>
                  <QrCode className="w-8 h-8 text-zinc-400" />
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                Close & Refresh View
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-2">
                <Plus className="w-4 h-4" />
                <span>{initialEvent ? 'Edit Event' : 'Create Event (Admin)'}</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                {initialEvent ? 'Update Backend Event' : 'Create New Event'}
              </h2>
              <p className="text-xs text-zinc-400 mb-5">
                All fields marked with <span className="text-rose-400 font-bold">*</span> are required.
              </p>

              {/* Error Message Banner */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Event / Workshop Title <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="e.g. Solidity Smart Contract & Foundry Masterclass"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Category <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Workshops">Workshops</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Meetups">Meetups</option>
                      <option value="Grant Sprints">Grant Sprints</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Status <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Capacity <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="60"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Poster Image Upload & Preview */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Event Poster / Cover Image (URL or Local Upload)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={poster}
                        onChange={(e) => setPoster(e.target.value)}
                        placeholder="Paste image URL (https://...)"
                        className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                      <label className="cursor-pointer py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-rose-300 whitespace-nowrap flex items-center gap-1.5 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                      </label>
                    </div>

                    {/* Image Live Preview */}
                    {poster ? (
                      <div className="relative rounded-xl overflow-hidden max-h-36 border border-white/10 bg-black/40 flex items-center justify-center group p-1">
                        <img src={poster} alt="Poster Preview" className="max-h-32 w-auto object-contain rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setPoster('')}
                          className="absolute top-2 right-2 bg-black/80 hover:bg-rose-500 text-white p-1 rounded-full text-xs transition-colors shadow-md"
                          title="Remove Poster"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[11px] text-zinc-500 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-zinc-600 shrink-0" />
                        <span>No poster attached. Event will be published without a custom image.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Date <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Time Slot <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={time}
                      onChange={(e) => { setTime(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      placeholder="12:30 PM Onwards"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Venue / Location <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={venue}
                    onChange={(e) => { setVenue(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="Nexians Academy, Transport Nagar, Near Bansal College, Bhopal"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Organizer Name <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={hostName}
                    onChange={(e) => { setHostName(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="Web3Wave by Nexians Academy"
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Organizer Contact Email <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={hostEmail}
                      onChange={(e) => { setHostEmail(e.target.value); if(errorMsg) setErrorMsg(''); }}
                      placeholder="organizer@web3wave.in"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={hostPhone}
                      onChange={handlePhoneChange}
                      placeholder="9876543210"
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Session Description <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if(errorMsg) setErrorMsg(''); }}
                    placeholder="Describe what developers will learn or build during this session..."
                    className="w-full bg-[#181822] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-xs font-extrabold text-white transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Backend Database...</span>
                    </>
                  ) : (
                    <>
                      <span>{initialEvent ? 'Save Event Changes' : 'Publish Event to Backend'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
