"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Weiches Scrollen (Lenis) – synchronisiert mit GSAP ScrollTrigger. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Auf Touch-Geräten ist natives Scrollen besser und spart Rechenzeit
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Neue Seite: oben beginnen und alle Trigger neu vermessen
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
