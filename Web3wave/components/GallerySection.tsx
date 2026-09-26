'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import { useModalScrollLock } from '@/src/hooks/useModalScrollLock'

const galleryImages = [
  {
    src: '/gallery/gallery-1.jpg',
    title: 'India Smart Cities Conclave 2023',
    category: 'Conclave',
    span: 'col-span-1 md:col-span-2 row-span-2',
  },
  {
    src: '/gallery/gallery-2.jpg',
    title: 'MOI Protocol & Central DAO Meetup',
    category: 'Meetups',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/gallery/gallery-3.jpg',
    title: 'Smart Cities Conclave Delegation',
    category: 'Conclave',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/gallery/gallery-4.jpg',
    title: 'Web3 Expo & Protocol Showcase',
    category: 'Workshops',
    span: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    src: '/gallery/gallery-5.jpg',
    title: 'IPS Academy Web3 Workshop',
    category: 'Workshops',
    span: 'col-span-1 row-span-1',
  },
]

const categories = ['All', 'Conclave', 'Meetups', 'Workshops']

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)
  useModalScrollLock(!!selectedImage)

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <section id="gallery" className="py-24 border-b border-zinc-800 bg-[#0c0c0e]">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              In the room.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {filteredImages.map((img) => (
            <div
              key={img.title}
              onClick={() => setSelectedImage(img)}
              className={`craft-card relative overflow-hidden cursor-pointer group ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75}
                loading="lazy"
                className="w-full h-full object-cover saturate-[0.85] group-hover:saturate-[1.1] group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-20">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                    {img.category}
                  </span>
                  <span className="text-sm font-bold">{img.title}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer overflow-y-auto overscroll-none"
          >
            <div
              className="relative max-w-4xl w-full my-auto max-h-[85vh] overflow-y-auto overscroll-contain"
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full h-[60vh] sm:h-[70vh]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  sizes="100vw"
                  quality={85}
                  className="object-contain rounded-xl border border-zinc-800"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-xs font-mono text-zinc-400">{selectedImage.category}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
