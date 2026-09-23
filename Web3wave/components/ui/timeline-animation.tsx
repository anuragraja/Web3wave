"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface TimelineContentProps {
  as?: any;
  animationNum?: number;
  customVariants?: Variants;
  timelineRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function TimelineContent({
  as = "div",
  animationNum = 0,
  customVariants,
  timelineRef,
  className,
  style,
  children,
  ...props
}: TimelineContentProps) {
  const MotionComponent = (motion as any)[as] || motion.div;

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: (i || 0) * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={animationNum}
      variants={variants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export default TimelineContent;
