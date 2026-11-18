"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroCanvas } from "./HeroCanvas";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

type Slide = { slug: string; title: string; location: string; year: number; cover: string };

const DURATION = 7000;

export function Hero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [useGL, setUseGL] = useState(false);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const sources = useRef(slides.map((s) => s.cover)).current;

  // WebGL nur, wenn verfügbar und keine reduzierte Bewegung gewünscht ist
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Kein Test-Kontext: das Erzeugen eines WebGL-Kontexts ist teuer.
    // Schlägt WebGL später fehl, bleibt einfach die CSS-Überblendung.
    if ("WebGLRenderingContext" in window) setUseGL(true);
    // Autoplay startet in jedem Fall nach kurzer Zeit (auch ohne WebGL)
    const t = setTimeout(() => setPlaying(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const onReady = useCallback(() => setPlaying(true), []);

  useEffect(() => {
    if (!playing) return;
    let timer = setTimeout(function next() {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
      timer = setTimeout(next, DURATION);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [playing, slides.length, index]);

  // Beim Herausscrollen: Inhalt hebt ab, Bild zoomt leicht
  useIsoLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(content.current, { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to(media.current, { scale: 1.08, yPercent: 12, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  const current = slides[index];

  return (
    <section ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink" aria-label="Einleitung">
      <div ref={media} className="absolute inset-0 will-change-transform">
        {/* Bilder: LCP + Fallback ohne WebGL */}
        {slides.map((s, i) => (
          <div
            key={s.slug}
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-[var(--ease-quart)]"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={s.cover}
              alt=""
              fill
              sizes="100vw"
              preload={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              className="object-cover"
            />
          </div>
        ))}
        {/* Die Leinwand blendet sich selbst ein, sobald alle Texturen geladen sind */}
        {useGL && <HeroCanvas sources={sources} index={index} onReady={onReady} />}
      </div>

      {/* Lesbarkeit */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/50" />

      <div
        ref={content}
        className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 md:px-10 md:pb-14"
      >
        <p className="eyebrow fade-in mb-6 text-paper/75" style={{ animationDelay: "0.6s" }}>
          Architekturstudio · Berlin
        </p>
        <h1 className="display text-[19vw] text-paper md:text-[11.5vw]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="rise block" style={{ animationDelay: "0.15s" }}>
              Räume, die
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="rise block italic text-paper/90" style={{ animationDelay: "0.3s" }}>
              bleiben.
            </span>
          </span>
        </h1>

        <div
          className="fade-in mt-10 grid gap-8 border-t border-line pt-6 md:mt-14 md:grid-cols-12 md:items-end"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="max-w-md text-[0.95rem] leading-relaxed text-paper/75 md:col-span-5">
            Wir entwerfen Wohnhäuser, Arbeitsorte und öffentliche Gebäude, die aus ihrem Ort heraus entstehen.
          </p>

          <div className="md:col-span-4 md:col-start-7">
            <p className="eyebrow mb-2 text-muted">Ausgewähltes Projekt</p>
            <Link
              href={`/projekte/${current.slug}`}
              className="group inline-flex items-baseline gap-3"
              aria-live="polite"
            >
              <span key={current.slug} className="display fade-in text-2xl md:text-3xl">
                {current.title}
              </span>
              <span className="text-sm text-muted transition-transform duration-500 group-hover:translate-x-1">
                {current.location}, {current.year} →
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:col-span-2 md:col-start-11 md:justify-end">
            <span className="whitespace-nowrap text-xs tabular-nums text-paper/70">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setPlaying(true);
                  }}
                  aria-label={`Projekt ${i + 1}: ${s.title}`}
                  aria-current={i === index}
                  className="group relative h-6 w-8 md:w-10"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-paper/25" />
                  {i === index && (
                    <span
                      key={`${index}-${playing}`}
                      className="absolute inset-x-0 top-1/2 h-px origin-left bg-paper"
                      style={{
                        animation: playing ? `progress ${DURATION}ms linear both` : undefined,
                        transform: playing ? undefined : "scaleX(1)",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
