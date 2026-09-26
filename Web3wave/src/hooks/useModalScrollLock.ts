"use client";

import { useEffect } from "react";

let activeModalCount = 0;

export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    activeModalCount++;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    return () => {
      activeModalCount = Math.max(0, activeModalCount - 1);

      if (activeModalCount === 0) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        if (typeof window !== "undefined" && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
      }
    };
  }, [isOpen]);
}
