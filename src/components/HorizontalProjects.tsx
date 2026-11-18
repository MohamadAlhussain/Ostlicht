"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, ViewTransition } from "react";
import type { Project } from "@/lib/data";
import { gsap, prefersReducedMotion, useDeferredAnimation } from "@/lib/gsap";

/**
 * Die Sektion wird fixiert und die Projekte laufen horizontal vorbei, während man
 * vertikal scrollt – am Desktop und auf dem Handy. Mit „Bewegung reduzieren“
 * (oder ohne JavaScript) bleibt eine normale, wischbare Leiste.
 */
export function HorizontalProjects({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useDeferredAnimation(section, () => {
    const sec = section.current;
    if (!sec || !track.current || prefersReducedMotion()) return;
    sec.classList.add("h-pinned");

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ small: "(max-width: 1023px)", large: "(min-width: 1024px)" }, (c) => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        // Auf dem Handy läuft die Leiste schneller als der Finger scrollt,
        // damit die fixierte Strecke nicht zu lang wird
        const speed = c.conditions?.small ? 0.7 : 1;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${distance() * speed}`,
            pin: true,
            refreshPriority: 1,
            scrub: c.conditions?.small ? 0.4 : 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });

        // Bilder bewegen sich in ihren Rahmen gegenläufig (Parallax in der Horizontalen)
        gsap.utils.toArray<HTMLElement>("[data-h-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
    }, sec);

    return () => {
      ctx.revert();
      sec.classList.remove("h-pinned");
    };
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-ink" aria-labelledby="projekte-titel">
      <div data-h-inner className="flex h-full flex-col justify-center py-20">
        <div className="mx-auto mb-8 flex w-full max-w-[1600px] items-end justify-between px-5 md:px-10 lg:mb-12">
          <div>
            <p className="eyebrow mb-4 text-muted">Ausgewählte Arbeiten</p>
            <h2 id="projekte-titel" className="display text-5xl md:text-7xl">
              Projekte
            </h2>
          </div>
          <Link href="/projekte" className="link-line pb-1 text-sm text-paper/80 hover:text-paper">
            Alle Projekte ansehen
          </Link>
        </div>

        <div
          data-h-scroller
          className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-5 px-5 will-change-transform md:gap-8 md:px-10">
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projekte/${p.slug}`}
                className="group block w-[min(78vw,calc((100svh-300px)*0.8))] shrink-0 snap-start sm:w-[min(52vw,calc((100svh-300px)*0.8))] lg:w-[min(34vw,calc((100svh-320px)*0.8))] xl:w-[min(30vw,calc((100svh-320px)*0.8))]"
              >
                <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                    <div data-h-img className="absolute inset-y-0 -left-[12%] -right-[12%]">
                      <Image
                        src={p.cover}
                        alt={`${p.title}, ${p.location}`}
                        fill
                        sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 40vw, (min-width: 640px) 60vw, 85vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </ViewTransition>
                <span className="sr-only">Projekt {i + 1}</span>
                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <h3 className="display text-2xl md:text-3xl">{p.title}</h3>
                  <span className="shrink-0 text-xs text-muted">
                    {p.category} · {p.year}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.location}</p>
              </Link>
            ))}
            <Link
              href="/projekte"
              className="group flex w-[60vw] shrink-0 snap-start items-center justify-center border border-line sm:w-[40vw] lg:w-[24vw]"
            >
              <span className="display text-center text-4xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105">
                Alle
                <br />
                <span className="italic text-bronze">Projekte →</span>
              </span>
            </Link>
          </div>
        </div>

        <div data-h-bar className="mx-auto mt-8 hidden w-full max-w-[1600px] px-5 md:px-10 lg:mt-10">
          <div className="h-px w-full bg-line">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-paper" />
          </div>
        </div>
      </div>
    </section>
  );
}
