"use client";

import React, { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutSection1() {
  const heroRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 30,
      opacity: 0,
    },
  };

  const revealVariants2 = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: -30,
      opacity: 0,
    },
  };

  const revealVariants3 = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
    hidden: {
      opacity: 0,
    },
  };

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0d] text-white overflow-hidden border-b border-white/10"
      ref={heroRef}
    >
      {/* SVG Clip Paths for 3 Artistic Gallery Cards */}
      <svg className="absolute -top-[999px] -left-[999px] w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="clip-squiggle" clipPathUnits="objectBoundingBox">
            <path
              d="M0.434125 0.00538712C0.56323 -0.00218488 0.714575 -0.000607013 0.814404 0.00302954L0.802642 0.163537C0.813884 0.167475 0.824927 0.172002 0.835358 0.177236C0.869331 0.194281 0.909224 0.225945 0.90824 0.27348C0.907177 0.324883 0.858912 0.354946 0.822651 0.36933C0.857426 0.376783 0.894591 0.387558 0.925837 0.404287C0.968002 0.426862 1.00569 0.464702 0.999287 0.515878C0.993163 0.564818 0.950731 0.597642 0.904098 0.615682C0.88204 0.624216 0.858239 0.62992 0.834803 0.633808C0.858076 0.639299 0.881603 0.646639 0.90267 0.656757C0.946271 0.677698 0.986875 0.715485 0.978905 0.768037C0.972241 0.811979 0.93615 0.843109 0.895204 0.862035C0.858032 0.879217 0.815169 0.887544 0.778534 0.892219C0.704792 0.901628 0.614366 0.901003 0.535183 0.899176C0.508115 0.898551 0.482286 0.89779 0.45773 0.897065C0.404798 0.895504 0.357781 0.894117 0.317008 0.894657C0.301552 0.894862 0.289265 0.895348 0.279749 0.895976C0.251913 0.937168 0.226467 0.980907 0.216015 1L0 0.941216C0.0140558 0.915539 0.051354 0.851547 0.0902557 0.797766C0.118421 0.758828 0.1722 0.745373 0.200402 0.740217C0.168437 0.733484 0.134299 0.723597 0.105102 0.708076C0.0614715 0.684884 0.0263696 0.64687 0.0325498 0.596965C0.0385804 0.548267 0.0803829 0.515256 0.12709 0.496909C0.146901 0.489127 0.168128 0.483643 0.189242 0.479724C0.163739 0.476035 0.137977 0.471053 0.115188 0.463936C0.0874831 0.455285 0.00855855 0.424854 0.016569 0.357817C0.0231721 0.302559 0.0838593 0.276249 0.116031 0.266164C0.149646 0.255625 0.188201 0.2505 0.221821 0.247468C0.208809 0.243824 0.195905 0.239492 0.183801 0.234287C0.152543 0.220846 0.101565 0.189547 0.105449 0.136312C0.108467 0.0949629 0.144168 0.0682612 0.171101 0.0543099C0.197578 0.0405945 0.227933 0.032236 0.25348 0.0267029C0.305656 0.0154021 0.370636 0.00911076 0.434125 0.00538712Z"
              fill="black"
            />
          </clipPath>
          <clipPath id="differentone8" clipPathUnits="objectBoundingBox">
            <path
              d="M0.830625 0.5C0.883908 0.453139 0.926579 0.395449 0.955787 0.330781C0.984995 0.266114 1.00007 0.195958 1 0.125C1 0.0918481 0.98683 0.0600539 0.963388 0.0366119C0.939946 0.0131698 0.908152 2.32816e-07 0.875 2.32816e-07C0.725625 2.32816e-07 0.591667 0.0654169 0.5 0.169375C0.453139 0.116092 0.395449 0.0734212 0.330781 0.0442131C0.266114 0.0150049 0.195958 -6.83243e-05 0.125 2.32816e-07C0.0918481 2.32816e-07 0.0600539 0.0131698 0.0366119 0.0366119C0.0131698 0.0600539 2.32816e-07 0.0918481 2.32816e-07 0.125C2.32816e-07 0.274375 0.0654169 0.408333 0.169375 0.5C0.116092 0.546861 0.0734212 0.604551 0.0442131 0.669219C0.0150049 0.733887 -6.83243e-05 0.804042 2.32816e-07 0.875C2.32816e-07 0.908152 0.0131698 0.939946 0.0366119 0.963388C0.0600539 0.98683 0.0918481 1 0.125 1C0.274375 1 0.408333 0.934583 0.5 0.830625C0.546861 0.883908 0.604551 0.926579 0.669219 0.955787C0.733887 0.984995 0.804042 1.00007 0.875 1C0.908152 1 0.939946 0.98683 0.963388 0.963388C0.98683 0.939946 1 0.908152 1 0.875C1 0.725625 0.934583 0.591667 0.830625 0.5Z"
              fill="black"
            />
          </clipPath>
          <clipPath id="clip-rect" clipPathUnits="objectBoundingBox">
            <path
              d="M0.5 0L0.550709 0.0460541C0.541963 0.0640581 0.528578 0.0791151 0.513027 0.0917341C0.520456 0.0907291 0.527892 0.0897201 0.535322 0.0887131C0.611493 0.0783851 0.687008 0.0681471 0.74727 0.0620541C0.784018 0.0583381 0.81958 0.0556691 0.848085 0.0560471C0.861663 0.0562271 0.879579 0.0571111 0.897003 0.0610981C0.909779 0.0640211 0.953305 0.0757431 0.966627 0.113912C0.981722 0.157163 0.941632 0.185488 0.934622 0.19038C0.921226 0.199729 0.905329 0.206897 0.892499 0.212115C0.870649 0.221001 0.842659 0.230142 0.811999 0.239254C0.83681 0.236656 0.861008 0.235257 0.882435 0.23621C0.898377 0.236918 0.921559 0.239201 0.943733 0.24826C0.970081 0.259024 0.995291 0.280051 0.999439 0.311122C1.00342 0.340933 0.985349 0.363373 0.972847 0.375304C0.959707 0.387843 0.943414 0.397844 0.928912 0.405582C0.908422 0.416516 0.883341 0.427176 0.856112 0.437447C0.864364 0.436866 0.872329 0.436539 0.879902 0.436521C0.894726 0.436485 0.918867 0.437439 0.942277 0.446087C0.955191 0.450858 0.970509 0.458949 0.982453 0.472319C0.994857 0.486205 0.999891 0.501633 0.999891 0.515923C0.999891 0.545114 0.979611 0.565612 0.967435 0.575746C0.953994 0.586934 0.937862 0.595927 0.923325 0.603007C0.898842 0.614932 0.868113 0.626538 0.834975 0.637664C0.839838 0.637396 0.844565 0.637223 0.849131 0.637157C0.862911 0.636959 0.885294 0.637431 0.907315 0.644301C0.91929 0.648037 0.935423 0.654982 0.948734 0.667909C0.96307 0.681831 0.969583 0.69831 0.969583 0.714241C0.969583 0.756168 0.930027 0.781711 0.913544 0.791403C0.891777 0.804203 0.864569 0.815187 0.838085 0.824629C0.790903 0.84145 0.729751 0.858922 0.669115 0.876246C0.66103 0.878556 0.652955 0.880864 0.644923 0.883166C0.574356 0.903398 0.504814 0.923898 0.447288 0.945539C0.385857 0.968649 0.354123 0.98743 0.343618 0.999097L0.202975 0.923461C0.215492 0.909559 0.231313 0.896865 0.249116 0.885256C0.245423 0.885811 0.241771 0.886347 0.238165 0.886862C0.198801 0.892483 0.158749 0.89657 0.125136 0.895416C0.10872 0.894852 0.0869431 0.892883 0.0658381 0.885656C0.0427861 0.877762 0.014566 0.861068 0.00449603 0.831173C-0.00578897 0.800641 0.00946505 0.775473 0.0227 0.761104C0.035552 0.747151 0.0521941 0.73661 0.0660451 0.729015C0.0763781 0.723348 0.0879781 0.717821 0.10046 0.712441C0.0918191 0.7114 0.0828791 0.709795 0.0740171 0.70737C0.0519021 0.701317 0.021352 0.687312 0.00720103 0.65819C-0.00776397 0.627392 0.00549305 0.600161 0.018904 0.584108C0.03142 0.569125 0.048329 0.557944 0.061925 0.550133C0.0899171 0.534051 0.127869 0.51891 0.167323 0.504992C0.189196 0.497276 0.213195 0.489371 0.238664 0.48135C0.201179 0.486283 0.163943 0.489581 0.131973 0.488597C0.114641 0.488064 0.0935231 0.486164 0.0730311 0.480032C0.0519071 0.47371 0.024429 0.460566 0.00936805 0.434874C-0.00727695 0.406482 0.000740049 0.379077 0.014172 0.360311C0.026036 0.343734 0.043174 0.331657 0.0566 0.32353C0.084167 0.306842 0.121704 0.291789 0.159992 0.278421C0.179936 0.271457 0.2017 0.264408 0.224764 0.257328C0.191619 0.258997 0.158935 0.259269 0.131101 0.256364C0.115367 0.254721 0.0954681 0.251528 0.0765251 0.244134C0.0569951 0.236512 0.030269 0.220901 0.019911 0.192566C0.00630305 0.155339 0.028173 0.125216 0.050968 0.10819C0.070358 0.0937081 0.094464 0.0847721 0.112073 0.0791001C0.142823 0.0691931 0.183388 0.0604071 0.219871 0.0525041C0.226304 0.0511111 0.232611 0.0497451 0.238714 0.0484051C0.283575 0.0385571 0.323527 0.0289901 0.35429 0.0175781L0.5 0Z"
              fill="black"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Radial Glow Background */}
      <TimelineContent
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, rgba(244, 63, 94, 0.18) 0%, rgba(13, 13, 16, 0) 70%)
          `,
          backgroundSize: "100% 100%",
        }}
        animationNum={2}
        customVariants={revealVariants3}
        timelineRef={heroRef}
      />
      <TimelineContent
        className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] sm:bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_110%)] pointer-events-none"
        animationNum={3}
        customVariants={revealVariants3}
        timelineRef={heroRef}
      />

      {/* Content Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="text-rose-400 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-widest mb-4 inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-sm shadow-rose-950/40">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>ABOUT WEB3WAVE</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 sm:mb-6 tracking-tight leading-[1.15]">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.12}
            staggerFrom="first"
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 26,
              delay: 0.1,
            }}
            containerClassName="text-white text-center justify-center items-center"
          >
            {
              "A Legacy of Builder Excellence, How Our Dedication Fuels Everything We Do"
            }
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          customVariants={revealVariants}
          timelineRef={heroRef}
          className="text-zinc-400 text-xs sm:text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto px-2"
        >
          From day one, Web3Wave has been building the premiere ecosystem for developers, protocol founders, and researchers in Central India. Empowering open-source software, hackathons, and onchain accountability.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          customVariants={revealVariants3}
          timelineRef={heroRef}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <Link
            href="/events"
            className="bg-rose-500 hover:bg-rose-600 active:scale-95 shadow-lg shadow-rose-500/25 border border-rose-400/30 flex items-center gap-2 hover:gap-3 transition-all duration-300 text-white px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <span>Explore Community Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </TimelineContent>
      </div>

      {/* Styled Responsive 3-Image Community Showcase (Abhishek Patidar spotlight removed as requested) */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Card 1: India Smart Cities Conclave Delegation */}
          <TimelineContent
            as="div"
            animationNum={2}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="group relative w-full h-72 sm:h-80 md:h-[22rem] lg:h-[25rem] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-rose-500/40 bg-zinc-900/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(244,63,94,0.25)] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: "url(#clip-squiggle)" }}
            >
              <img
                src="/gallery/gallery-1.jpg"
                alt="Smart Cities Conclave Delegation"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content overlay safely positioned inside */}
            <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent rounded-b-2xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 border border-rose-300/30">
                Community Meetup
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-md group-hover:text-rose-200 transition-colors">
                Smart Cities Conclave
              </h4>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Developer delegation representing Web3Wave at high-level state tech summits.
              </p>
            </div>
          </TimelineContent>

          {/* Card 2: Web3 Expo Showcase & Demo Days */}
          <TimelineContent
            as="div"
            animationNum={3}
            timelineRef={heroRef}
            customVariants={revealVariants2}
            className="group relative w-full h-72 sm:h-80 md:h-[22rem] lg:h-[25rem] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-rose-500/40 bg-zinc-900/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(244,63,94,0.25)] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: "url(#differentone8)" }}
            >
              <img
                src="/gallery/gallery-4.jpg"
                alt="Web3 Expo Showcase"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content overlay safely positioned inside */}
            <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent rounded-b-2xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 border border-rose-300/30">
                Expo Showcase
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-md group-hover:text-rose-200 transition-colors">
                Decentralized Demo Days
              </h4>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Founder and student pitches presenting innovative onchain projects to ecosystem mentors.
              </p>
            </div>
          </TimelineContent>

          {/* Card 3: Hands-on BUIDL Workshop & Hackathon Night */}
          <TimelineContent
            as="div"
            animationNum={4}
            timelineRef={heroRef}
            customVariants={revealVariants2}
            className="group relative w-full h-72 sm:h-80 md:h-[22rem] lg:h-[25rem] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-rose-500/40 bg-zinc-900/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(244,63,94,0.25)] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: "url(#clip-rect)" }}
            >
              <img
                src="/gallery/gallery-5.jpg"
                alt="IPS Academy Web3 Workshop"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content overlay safely positioned inside */}
            <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent rounded-b-2xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 border border-rose-300/30">
                Workshop & Hackathon
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-md group-hover:text-rose-200 transition-colors">
                Hands-on Smart Contracts
              </h4>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Intensive coding bootcamps, dApp engineering, and hackathon preparation nights.
              </p>
            </div>
          </TimelineContent>
        </div>
      </div>
    </section>
  );
}
