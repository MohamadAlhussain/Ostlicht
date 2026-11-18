"use client";

import Image from "next/image";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useDeferredAnimation, prefersReducedMotion } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* Zeilen, die aus einer Maske nach oben gleiten                       */
/* ------------------------------------------------------------------ */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
  onLoad = false,
  stagger = 0.09,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** true = beim Laden animieren statt beim Scrollen */
  onLoad?: boolean;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useDeferredAnimation(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: "visible" });
      return;
    }
    let split: SplitText | undefined;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        aria: "none",
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.3,
            stagger,
            delay,
            ease: "expo.out",
            scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    };
    // Erst nach dem Laden der Schrift splitten, sonst stimmen die Zeilen nicht
    if (document.fonts?.status === "loaded") run();
    else document.fonts.ready.then(run);
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [delay, onLoad, stagger]);

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Wörter, die beim Scrollen von blass zu voll werden                  */
/* ------------------------------------------------------------------ */
export function WordScrub({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useDeferredAnimation(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: "visible" });
      return;
    }
    let split: SplitText | undefined;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: "words",
        autoSplit: true,
        aria: "none",
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.fromTo(
            self.words,
            // 0.4 = noch lesbar (Kontrast ≥ 3:1 für große Schrift), wird beim Scrollen voll
            { opacity: 0.4 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            },
          );
        },
      });
    };
    if (document.fonts?.status === "loaded") run();
    else document.fonts.ready.then(run);
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, []);

  return (
    <p ref={ref} data-split className={className}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Sanftes Einblenden beliebiger Inhalte                               */
/* ------------------------------------------------------------------ */
export function FadeUp({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 40,
  stagger,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Wenn gesetzt, werden die direkten Kinder nacheinander eingeblendet */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useDeferredAnimation(ref, () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1.2,
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Bild, das sich in seinem Rahmen langsamer bewegt als die Seite      */
/* ------------------------------------------------------------------ */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  amount = 9,
  preload = false,
  reveal = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Verschiebung in Prozent der Bildhöhe */
  amount?: number;
  preload?: boolean;
  /** Bild öffnet sich zusätzlich wie ein Vorhang */
  reveal?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useDeferredAnimation(frame, () => {
    if (!frame.current || !inner.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ small: "(max-width: 767px)", large: "(min-width: 768px)" }, (c) => {
        const a = c.conditions?.small ? amount * 0.5 : amount;
        gsap.fromTo(
          inner.current,
          { yPercent: -a },
          {
            yPercent: a,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      if (reveal) {
        gsap.fromTo(
          frame.current,
          { clipPath: "inset(18% 0% 18% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "top 25%", scrub: true },
          },
        );
      }
    });
    return () => ctx.revert();
  }, [amount, reveal]);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div
        ref={inner}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${amount}%`, bottom: `-${amount}%` }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
    </div>
  );
}
