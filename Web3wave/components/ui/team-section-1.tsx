import * as React from "react";
import { cn } from "@/lib/utils";

// Define interfaces for props
export interface SocialLink {
  icon: React.ElementType; // For Shadcn icons or any SVG component
  href: string;
}

export interface TeamMember {
  name: string;
  designation: string;
  imageSrc: string;
  socialLinks?: SocialLink[];
}

export interface TeamSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  members: TeamMember[];
  registerLink?: string;
  logo?: React.ReactNode; // For a custom logo, or you can use a string src
  socialLinksMain?: SocialLink[]; // Main social links for the company/section
}

// TeamSection Component
export const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  (
    {
      title,
      description,
      members,
      registerLink,
      logo,
      socialLinksMain,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden bg-[#0a0a0d] text-white py-16 md:py-24 border-b border-white/10",
          className
        )}
        {...props}
      >
        <div className="max-w-6xl mx-auto grid items-center justify-center gap-10 px-4 text-center md:px-6">
          {/* Background Grid - for visual appeal */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <svg className="h-full w-full" fill="none">
              <defs>
                <pattern
                  id="grid"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M24 0L0 0 0 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-rose-500/40"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Header Section */}
          <div className="relative z-10 flex w-full flex-col items-center justify-between gap-6 md:flex-row md:items-start md:text-left">
            <div className="grid gap-3 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase tracking-widest w-fit mx-auto md:mx-0">
                O U R L E A D E R S H I P
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
                {title}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              {logo && <div className="text-2xl font-black text-rose-400 font-mono tracking-wider">{logo}</div>}
              {registerLink && (
                <a
                  href={registerLink}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-rose-500 px-8 text-xs font-bold font-mono tracking-wider text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  JOIN NETWORK
                </a>
              )}
            </div>
          </div>

          {/* Main Social Links */}
          {socialLinksMain && socialLinksMain.length > 0 && (
            <div className="relative z-10 flex w-full items-center justify-center gap-4 py-2">
              {socialLinksMain.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
              <span className="text-zinc-500 font-mono text-xs ml-2">
                web3wave.in
              </span>
            </div>
          )}

          {/* Team Members Grid */}
          <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
            {members.map((member, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-950/30"
              >
                {/* Background wave animation */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2 origin-bottom scale-y-0 transform rounded-t-full bg-gradient-to-t from-rose-500/20 via-purple-500/10 to-transparent transition-transform duration-500 ease-out group-hover:scale-y-100"
                  style={{ transitionDelay: `${index * 50}ms` }}
                />

                {/* Member Image with mask and border animation */}
                <div
                  className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-4 border-white/10 bg-black/40 shadow-xl transition-all duration-500 ease-out group-hover:border-rose-500 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                <h3 className="relative z-10 mt-5 text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-rose-300 transition-colors">
                  {member.name}
                </h3>
                <p className="relative z-10 text-xs font-mono font-medium text-rose-400/90 mt-1">
                  {member.designation}
                </p>

                {/* Social Links for individual members */}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="relative z-10 mt-4 flex gap-3 opacity-90 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                    {member.socialLinks.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-400/40 transition-all"
                      >
                        <link.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";
