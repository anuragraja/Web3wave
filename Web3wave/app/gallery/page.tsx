import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Flame, Image as ImageIcon, ArrowRight } from "lucide-react";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0d] text-white flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Fixed Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d10]/85 backdrop-blur-xl shadow-lg shadow-black/50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Image
              src="/web3wave-logo.png"
              alt="Web3Wave Logo"
              width={28}
              height={28}
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-rose-300 transition-colors">
              Web3Wave <span className="text-rose-400 font-mono text-xs font-normal">/ Gallery</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>BUILDER ARCHIVE</span>
          </div>
        </div>
      </header>

      {/* Main Native Scroll Track */}
      <main className="relative w-full pt-16">
        <ScrollMorphHero />
      </main>

      {/* Footer Section at end of scroll track */}
      <footer className="relative z-20 bg-[#0c0c10] border-t border-white/10 py-16 px-6 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            Ready to join our next event?
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mb-6">
            Subscribe to the Web3Wave community calendar to get instant invites for hack nights & workshops.
          </p>
          <Link
            href="/events"
            className="btn-luma-accent py-3 px-8 text-sm flex items-center gap-2"
          >
            <span>Explore Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
