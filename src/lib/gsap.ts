"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
  // Auf dem Handy ändert die ein-/ausfahrende Adressleiste die Höhe –
  // ohne diese Einstellung würden fixierte Sektionen dabei springen.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* Animationen unterhalb des sichtbaren Bereichs erst einrichten, wenn  */
/* der Browser Leerlauf hat. Das hält den Seitenaufbau schnell (TBT).   */
/* ------------------------------------------------------------------ */
type Cleanup = (() => void) | void;
const queue: (() => void)[] = [];
let pumping = false;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;

function requestIdle(cb: (d: { timeRemaining(): number; didTimeout: boolean }) => void) {
  if ("requestIdleCallback" in window) window.requestIdleCallback(cb, { timeout: 1500 });
  else setTimeout(() => cb({ timeRemaining: () => 8, didTimeout: true }), 60);
}

function pump() {
  if (pumping) return;
  pumping = true;
  requestIdle((deadline) => {
    pumping = false;
    let ran = 0;
    while (queue.length && (deadline.timeRemaining() > 4 || (deadline.didTimeout && ran === 0))) {
      queue.shift()!();
      ran++;
    }
    if (queue.length) pump();
    else {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    }
  });
}

/**
 * Wie useLayoutEffect – aber nur sofort, wenn das Element schon im ersten
 * Bildschirm liegt. Sonst wird die Einrichtung in eine Leerlauf-Warteschlange gelegt.
 */
export function useDeferredAnimation(ref: RefObject<HTMLElement | null>, setup: () => Cleanup, deps: DependencyList) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: Cleanup;
    let cancelled = false;
    const job = () => {
      if (!cancelled) cleanup = setup();
    };
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight) job();
    else {
      queue.push(job);
      pump();
    }
    return () => {
      cancelled = true;
      const i = queue.indexOf(job);
      if (i >= 0) queue.splice(i, 1);
      if (typeof cleanup === "function") cleanup();
    };
  }, deps);
}
