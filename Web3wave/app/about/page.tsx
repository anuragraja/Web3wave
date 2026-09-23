"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Code2, Users, Rocket, ArrowRight } from "lucide-react";
import AboutSection1 from "@/components/ui/about-section-1";
import { TeamSection, TeamMember, SocialLink } from "@/components/ui/team-section-1";

// Custom SVG Icons for Socials
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "Abhishek Patidar",
      designation: "Founder & Community Lead",
      imageSrc: "/abhishek-patidar.jpg",
      socialLinks: [
        { icon: TwitterIcon, href: "https://x.com" },
        { icon: GithubIcon, href: "https://github.com" },
        { icon: LinkedinIcon, href: "https://linkedin.com" },
      ],
    },
    {
      name: "Krishna Patidar",
      designation: "Core Protocol & Smart Contracts Lead",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      socialLinks: [
        { icon: TwitterIcon, href: "https://x.com" },
        { icon: GithubIcon, href: "https://github.com" },
        { icon: LinkedinIcon, href: "https://linkedin.com" },
      ],
    },
    {
      name: "Krishna Pagrutkar",
      designation: "Ecosystem Growth & Operations Lead",
      imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      socialLinks: [
        { icon: TwitterIcon, href: "https://x.com" },
        { icon: GithubIcon, href: "https://github.com" },
        { icon: LinkedinIcon, href: "https://linkedin.com" },
      ],
    },
  ];

  const mainSocialLinks: SocialLink[] = [
    { icon: TwitterIcon, href: "https://x.com" },
    { icon: GithubIcon, href: "https://github.com" },
    { icon: LinkedinIcon, href: "https://linkedin.com" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0d0d10] text-white flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Header Bar */}
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
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src="/web3wave-logo.png"
              alt="Web3Wave Logo"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-rose-300 transition-colors">
              Web3Wave <span className="text-rose-400 font-mono text-xs font-normal">/ About Us</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs hover:bg-rose-500/20 transition-all"
          >
            <span>JOIN NETWORK</span>
          </Link>
        </div>
      </header>

      {/* Main Page Section */}
      <main className="relative pt-16">
        {/* Integrated AboutSection1 Component */}
        <AboutSection1 />

        {/* Reusable TeamSection Component */}
        <TeamSection
          title="CORE COMMUNITY LEADERSHIP"
          description="Meet the core architects driving open-source software, Web3 hackathons, and developer education across Central India."
          members={teamMembers}
          registerLink="/members"
          logo="WEB3WAVE"
          socialLinksMain={mainSocialLinks}
        />

        {/* Pillars / Values Section */}
        <section className="py-24 px-6 bg-[#0c0c10] border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold uppercase tracking-widest">
                OUR CORE PILLARS
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 mb-4">
                Empowering Central India Builders
              </h3>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                We unite developers, protocol founders, researchers, and students to build open-source decentralized systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-rose-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Technical Mastery</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Hands-on smart contract engineering, ZK cryptography workshops, and full-stack dApp hackathons.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-rose-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Proof of Community</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Weekly build nights, peer accountability cohorts, and direct mentorship from ecosystem veterans.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-rose-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Protocol Launchpad</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Grants guidance, ecosystem connections, and investor showcases for promising MP Web3 & AI startups.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0d] py-12 px-6 text-center border-t border-white/10">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h4 className="text-xl font-bold text-white mb-2">Ready to build with Web3Wave?</h4>
          <p className="text-xs text-zinc-400 mb-6">
            Join 500+ builders in Central India shaping the future of decentralized tech.
          </p>
          <Link
            href="/events"
            className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-rose-500/25"
          >
            <span>Explore Events & Hack Nights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

