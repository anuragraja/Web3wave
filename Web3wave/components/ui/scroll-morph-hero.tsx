"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useScroll } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 85;
const IMG_HEIGHT = 120;

function FlipCard({
    src,
    index,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 50,
                damping: 18,
            }}

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for 3D card flips
                perspective: "1000px",
            }}
            className="cursor-pointer group select-none"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180, scale: 1.08 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-zinc-900 border border-white/15"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={`web3wave-builder-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-10 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-zinc-300">
                        <span>#0{index + 1}</span>
                        <span className="text-rose-400 font-bold">W3W</span>
                    </div>
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-zinc-950 via-rose-950/40 to-zinc-900 flex flex-col items-center justify-center p-3 border border-rose-500/40 text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center flex flex-col items-center">
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1">WEB3WAVE</span>
                        <span className="text-xs font-bold text-white">Node #{index + 1}</span>
                        <span className="text-[9px] text-zinc-400 font-mono mt-1">BHOPAL MP</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;

// High quality Web3 & Developer community Unsplash images
const IMAGES = [
    "/gallery/gallery-1.jpg",
    "/gallery/gallery-2.jpg",
    "/gallery/gallery-3.jpg",
    "/gallery/gallery-4.jpg",
    "/gallery/gallery-5.jpg",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80",
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    // Track scroll position natively relative to parent container
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // --- Container Size ---
    useEffect(() => {
        if (!viewportRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(viewportRef.current);

        setContainerSize({
            width: viewportRef.current.offsetWidth,
            height: viewportRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 0.25
    const morphProgress = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 60, damping: 22 });

    // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 0.25)
    // Rotates the bottom arc as user continues scrolling
    const scrollRotate = useTransform(scrollYProgress, [0.25, 1], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 60, damping: 22 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 25 });

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = viewport.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 80);
        };
        viewport.addEventListener("mousemove", handleMouseMove);
        return () => viewport.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 400);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 1800);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1400,
            y: (Math.random() - 0.5) * 900,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Manual Calculation for Morph) ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // --- Content Opacity & Fade ---
    const contentOpacity = useTransform(smoothMorph, [0.6, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.6, 1], [25, 0]);

    return (
        <div ref={sectionRef} className="relative w-full h-[350vh] bg-[#0a0a0d]">
            {/* Sticky Screen Viewport */}
            <div
                ref={viewportRef}
                className="sticky top-0 w-full h-screen overflow-hidden text-white flex flex-col items-center justify-center select-none"
            >
                {/* Ambient Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.18)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30" />

                {/* Perspective Container */}
                <div className="relative flex h-full w-full flex-col items-center justify-center perspective-1000 z-10">

                    {/* Perfectly Centered Circle Intro Text (Fits 100% inside circle void) */}
                    <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4 max-w-xs md:max-w-md">
                        <motion.h1
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 1 }}
                            className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-2xl"
                        >
                            Building The <br /> Onchain Future
                        </motion.h1>
                    </div>

                    {/* Arc Active Content (Fades in as bottom arch forms) */}
                    <motion.div
                        style={{ opacity: contentOpacity, y: contentY }}
                        className="absolute top-[8%] md:top-[10%] z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4 max-w-2xl"
                    >
                        <span className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs mb-3 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.25)]">
                            WEB3WAVE BUILDER ARCHIVE
                        </span>
                        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-3">
                            Central India Builder Network
                        </h2>
                        <p className="text-xs md:text-base text-zinc-400 leading-relaxed">
                            A curated visual collection of hackathons, build nights, campus workshops, and protocol shipments.
                        </p>
                    </motion.div>

                    {/* Cards Container */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                            if (introPhase === "scatter") {
                                target = scatterPositions[i];
                            } else if (introPhase === "line") {
                                const lineSpacing = 75;
                                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                                const lineX = i * lineSpacing - lineTotalWidth / 2;
                                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                            } else {
                                // Circle & Morph Arc Logic
                                const isMobile = containerSize.width < 768;
                                const minDimension = Math.min(containerSize.width, containerSize.height);

                                // A. Calculate Circle Position (Slightly larger radius so text fits inside perfectly)
                                const circleRadius = Math.min(minDimension * 0.40, 410);
                                const circleAngle = (i / TOTAL_IMAGES) * 360;
                                const circleRad = (circleAngle * Math.PI) / 180;
                                const circlePos = {
                                    x: Math.cos(circleRad) * circleRadius,
                                    y: Math.sin(circleRad) * circleRadius,
                                    rotation: circleAngle + 90,
                                };

                                // B. Calculate Bottom Arc Position
                                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                                const arcRadius = baseRadius * (isMobile ? 1.35 : 1.15);

                                const arcApexY = containerSize.height * (isMobile ? 0.32 : 0.22);
                                const arcCenterY = arcApexY + arcRadius;

                                const spreadAngle = isMobile ? 105 : 135;
                                const startAngle = -90 - (spreadAngle / 2);
                                const step = spreadAngle / (TOTAL_IMAGES - 1);

                                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                                const maxRotation = spreadAngle * 0.85;
                                const boundedRotation = -scrollProgress * maxRotation;

                                const currentArcAngle = startAngle + (i * step) + boundedRotation;
                                const arcRad = (currentArcAngle * Math.PI) / 180;

                                const arcPos = {
                                    x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                    y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                    rotation: currentArcAngle + 90,
                                    scale: isMobile ? 1.4 : 1.75,
                                };

                                // C. Interpolate (Morph)
                                target = {
                                    x: lerp(circlePos.x, arcPos.x, morphValue),
                                    y: lerp(circlePos.y, arcPos.y, morphValue),
                                    rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                    scale: lerp(1, arcPos.scale, morphValue),
                                    opacity: 1,
                                };
                            }

                            return (
                                <FlipCard
                                    key={i}
                                    src={src}
                                    index={i}
                                    total={TOTAL_IMAGES}
                                    phase={introPhase}
                                    target={target}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
