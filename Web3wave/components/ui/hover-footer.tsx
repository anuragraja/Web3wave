"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  MessageSquare,
} from "lucide-react";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 520 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="25%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="75%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#f43f5e] font-[helvetica] text-7xl font-bold dark:stroke-[#f43f5e99]"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, rgba(244, 63, 94, 0.15) 100%)",
      }}
    />
  );
};

export function HoverFooter({ onOpenSubscribe }: { onOpenSubscribe?: () => void }) {
  // Footer link data
  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Upcoming Events", href: "#events" },
        { label: "Campus Guilds", href: "#guilds" },
        { label: "Shipped Projects", href: "#projects" },
        { label: "Builder Pass", href: "#builder-pass" },
      ],
    },
    {
      title: "Community Nodes",
      links: [
        { label: "MANIT Chapter", href: "#guilds" },
        { label: "LNCT Nest", href: "#guilds" },
        { label: "MP Startup Hub", href: "#guilds" },
        {
          label: "Live Discord",
          href: "https://discord.com",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#f43f5e]" />,
      text: "hello@web3wave.in",
      href: "mailto:hello@web3wave.in",
    },
    {
      icon: <Phone size={18} className="text-[#f43f5e]" />,
      text: "+91 88156 80076",
      href: "tel:+918815680076",
    },
    {
      icon: <MapPin size={18} className="text-[#f43f5e]" />,
      text: "Bhopal, MP · Central India",
    },
  ];

  // Social media icons using SVG/Lucide
  const socialLinks = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      label: "GitHub",
      href: "https://github.com",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: "Twitter/X",
      href: "https://x.com",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Discord",
      href: "https://discord.com",
    },
    {
      icon: <Globe size={20} />,
      label: "Globe",
      href: "https://web3wave.in",
    },
  ];

  return (
    <footer className="bg-[#0F0F11]/60 border border-white/10 relative h-fit rounded-3xl overflow-hidden m-4 sm:m-8 text-white backdrop-blur-xl">
      <div className="max-w-7xl mx-auto p-8 sm:p-14 z-40 relative">
        {/* Subscription Callout */}
        <div className="luma-card p-6 sm:p-10 mb-12 text-center bg-gradient-to-b from-[#181820] to-[#121217] border border-white/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Stay updated on Web3Wave events.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Join 500+ developers receiving instant invites for workshops, hackathons, and community meetups.
          </p>
          {onOpenSubscribe && (
            <button onClick={onOpenSubscribe} className="btn-luma-accent py-3 px-8 text-sm mx-auto">
              <Bell className="w-4 h-4" />
              <span>Subscribe to Calendar</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  window.scrollTo(0, 0);
                }
              }}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <img
                src="/web3wave-logo.png"
                alt="Web3Wave Logo"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform"
              />
              <span className="text-white text-2xl font-bold tracking-tight group-hover:text-rose-300 transition-colors">
                Web3Wave
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Web3Wave is Central India&apos;s premier Web3 builder network, protocol incubator, and event calendar.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="text-zinc-400 hover:text-[#f43f5e] transition-colors"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-1 right-[-12px] w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#f43f5e] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-[#f43f5e] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 text-zinc-400">
          {/* Social icons */}
          <div className="flex space-x-6">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="hover:text-[#f43f5e] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-xs font-mono text-zinc-500">
            &copy; {new Date().getFullYear()} Web3Wave. All rights reserved. Central India Node.
          </p>
        </div>
      </div>

      {/* Interactive Text hover effect */}
      <div
        onClick={() => {
          if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.location.href = '/';
          }
        }}
        className="lg:flex hidden h-[30rem] -mt-52 -mb-36 pointer-events-auto cursor-pointer"
      >
        <TextHoverEffect text="Web3Wave" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
