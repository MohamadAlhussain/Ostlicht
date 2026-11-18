"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useDeferredAnimation } from "@/lib/gsap";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useDeferredAnimation(ref, () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    const tween = gsap.to(obj, {
      v: value,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = `${value}${suffix}`;
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
