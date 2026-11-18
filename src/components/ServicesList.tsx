"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useDeferredAnimation } from "@/lib/gsap";

type Service = { title: string; text: string; image: string };

/**
 * Liste der Leistungen. Am Desktop folgt ein Bild dem Mauszeiger und wechselt
 * je nach Zeile. Auf Touch-Geräten öffnet sich das Bild direkt in der Zeile.
 */
export function ServicesList({ services }: { services: Service[] }) {
  const root = useRef<HTMLDivElement>(null);
  const floater = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useDeferredAnimation(root, () => {
    const el = root.current;
    const fl = floater.current;
    if (!el || !fl || prefersReducedMotion()) return;

    // Touch: Bilder öffnen sich wie ein Vorhang, wenn die Zeile die Mitte erreicht
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-svc-img]").forEach((box) => {
          gsap
            .timeline({ scrollTrigger: { trigger: box, start: "top 72%", toggleActions: "play none none reverse" } })
            .to(box.querySelectorAll("[data-curtain]"), { scaleY: 0, duration: 1.3, ease: "expo.inOut" }, 0)
            .fromTo(box.querySelector("[data-svc-inner]"), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
        });
      }, el);
      return () => ctx.revert();
    }

    const xTo = gsap.quickTo(fl, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(fl, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(fl, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      xTo(x);
      yTo(e.clientY - r.top);
      rTo(gsap.utils.clamp(-8, 8, (x - lastX) * 0.4));
      lastX = x;
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line-dark">
        {services.map((s, i) => (
          <li
            key={s.title}
            onPointerEnter={() => setActive(i)}
            className="group grid cursor-default gap-4 border-b border-line-dark py-8 transition-[padding] duration-700 ease-[var(--ease-expo)] md:grid-cols-12 md:items-baseline md:py-10 md:hover:pl-6"
          >
            <span className="text-xs tabular-nums text-muted-dark md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display text-4xl md:col-span-6 md:text-6xl">{s.title}</h3>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink/70 md:col-span-5">{s.text}</p>
            {/* Touch-Geräte: Bild öffnet sich in der Zeile, sobald sie die Mitte erreicht */}
            <div
              data-svc-img
              aria-hidden
              className="relative mt-3 aspect-[16/10] overflow-hidden bg-paper-2 md:col-span-12 [@media(hover:hover)_and_(pointer:fine)]:hidden"
            >
              <div data-svc-inner className="absolute inset-0 will-change-transform">
                <Image src={s.image} alt="" fill sizes="(min-width: 768px) 90vw, 100vw" className="object-cover" />
              </div>
              <div data-curtain className="absolute inset-x-0 top-0 h-[50.5%] origin-top bg-paper will-change-transform" />
              <div data-curtain className="absolute inset-x-0 bottom-0 h-[50.5%] origin-bottom bg-paper will-change-transform" />
            </div>
          </li>
        ))}
      </ul>

      <div
        ref={floater}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
      >
        <div
          className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[clip-path,opacity] duration-700 ease-[var(--ease-expo)]"
          style={{
            width: "clamp(220px, 20vw, 340px)",
            aspectRatio: "4 / 5",
            clipPath: active === null ? "inset(50% 50% 50% 50%)" : "inset(0% 0% 0% 0%)",
            opacity: active === null ? 0 : 1,
          }}
        >
          {services.map((s, i) => (
            <Image
              key={s.image}
              src={s.image}
              alt=""
              fill
              sizes="340px"
              className="object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.15)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
