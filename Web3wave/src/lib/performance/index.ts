"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "mobile-low" | "mobile-mid" | "mobile-high" | "desktop-mid" | "desktop-high";

export interface PerformanceConfig {
  tier: DeviceTier;
  isMobile: boolean;
  particleCount: number;
  targetFps: number;
  maxDpr: number;
  enableParallax: boolean;
  enableComplexBlur: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  slowNetwork: boolean;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  tier: "desktop-high",
  isMobile: false,
  particleCount: 250,
  targetFps: 60,
  maxDpr: 1.5,
  enableParallax: true,
  enableComplexBlur: true,
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
};

export function getDevicePerformanceConfig(): PerformanceConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;

  const width = window.innerWidth;
  const isMobile = width < 768;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Inspect hardware and connection constraints if supported
  const nav = navigator as any;
  const hardwareConcurrency = nav.hardwareConcurrency || 4;
  const deviceMemory = nav.deviceMemory || 4;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const effectiveType = connection?.effectiveType || "4g";
  const slowNetwork = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";

  let tier: DeviceTier = "desktop-high";

  if (isMobile) {
    if (hardwareConcurrency <= 4 || deviceMemory <= 3 || width < 400 || saveData || slowNetwork) {
      tier = "mobile-low";
    } else if (hardwareConcurrency <= 6 || deviceMemory <= 4) {
      tier = "mobile-mid";
    } else {
      tier = "mobile-high";
    }
  } else {
    if (hardwareConcurrency <= 4 || deviceMemory <= 4 || saveData) {
      tier = "desktop-mid";
    } else {
      tier = "desktop-high";
    }
  }

  if (reducedMotion) {
    return {
      tier,
      isMobile,
      particleCount: 0,
      targetFps: 0,
      maxDpr: 1,
      enableParallax: false,
      enableComplexBlur: false,
      reducedMotion: true,
      saveData,
      slowNetwork,
    };
  }

  switch (tier) {
    case "mobile-low":
      return {
        tier,
        isMobile: true,
        particleCount: 35,
        targetFps: 30,
        maxDpr: 1.25,
        enableParallax: false,
        enableComplexBlur: false,
        reducedMotion: false,
        saveData,
        slowNetwork,
      };
    case "mobile-mid":
      return {
        tier,
        isMobile: true,
        particleCount: 75,
        targetFps: 30,
        maxDpr: 1.5,
        enableParallax: false,
        enableComplexBlur: false,
        reducedMotion: false,
        saveData,
        slowNetwork,
      };
    case "mobile-high":
      return {
        tier,
        isMobile: true,
        particleCount: 110,
        targetFps: 60,
        maxDpr: 1.5,
        enableParallax: false,
        enableComplexBlur: true,
        reducedMotion: false,
        saveData,
        slowNetwork,
      };
    case "desktop-mid":
      return {
        tier,
        isMobile: false,
        particleCount: 180,
        targetFps: 60,
        maxDpr: 1.5,
        enableParallax: true,
        enableComplexBlur: true,
        reducedMotion: false,
        saveData,
        slowNetwork,
      };
    case "desktop-high":
    default:
      return {
        tier,
        isMobile: false,
        particleCount: 260,
        targetFps: 60,
        maxDpr: 1.5,
        enableParallax: true,
        enableComplexBlur: true,
        reducedMotion: false,
        saveData,
        slowNetwork,
      };
  }
}

export function usePerformanceConfig(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(() => {
    if (typeof window !== "undefined") {
      return getDevicePerformanceConfig();
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getDevicePerformanceConfig());
    };

    window.addEventListener("resize", handleUpdate);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleUpdate);
    }

    return () => {
      window.removeEventListener("resize", handleUpdate);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleUpdate);
      }
    };
  }, []);

  return config;
}

export function useTabVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState !== "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
