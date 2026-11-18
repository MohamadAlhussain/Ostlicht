"use client";

import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import { categories, type Category, type Project } from "@/lib/data";
import { ParallaxImage } from "./motion";

// Redaktionelles Raster: Größen und Versätze wechseln sich ab
const layout = [
  { col: "md:col-span-7", aspect: "aspect-[4/3]", offset: "" },
  { col: "md:col-span-4 md:col-start-9", aspect: "aspect-[4/5]", offset: "md:mt-48" },
  { col: "md:col-span-5 md:col-start-2", aspect: "aspect-[4/5]", offset: "" },
  { col: "md:col-span-6 md:col-start-7", aspect: "aspect-[4/3]", offset: "md:mt-32" },
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<"Alle" | Category>("Alle");
  const visible = filter === "Alle" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div role="group" aria-label="Projekte filtern" className="mb-16 flex flex-wrap gap-2 md:mb-24">
        {categories.map((c) => {
          const count = c === "Alle" ? projects.length : projects.filter((p) => p.category === c).length;
          const active = c === filter;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => startTransition(() => setFilter(c))}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors duration-500 ${
                active ? "border-paper bg-paper text-ink" : "border-line text-paper/75 hover:border-paper/50 hover:text-paper"
              }`}
            >
              {c} <sup className="ml-0.5 text-[0.65em] opacity-60">{count}</sup>
            </button>
          );
        })}
      </div>

      <ul className="grid gap-x-8 gap-y-20 md:grid-cols-12 md:gap-y-28">
        {visible.map((p, i) => {
          const l = layout[i % layout.length];
          return (
            <ViewTransition key={p.slug} enter="card-in" exit="card-out" default="none">
              <li className={`${l.col} ${l.offset}`}>
                <Link href={`/projekte/${p.slug}`} className="group block">
                  <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
                    <ParallaxImage
                      src={p.cover}
                      alt={`${p.title}, ${p.location}`}
                      className={`${l.aspect} bg-ink-2`}
                      sizes="(min-width: 768px) 55vw, 100vw"
                      amount={7}
                      preload={i === 0}
                    />
                  </ViewTransition>
                  <div className="mt-5 flex items-baseline justify-between gap-6">
                    <h2 className="display text-3xl transition-colors duration-500 group-hover:text-bronze md:text-4xl">
                      {p.title}
                    </h2>
                    <span className="shrink-0 text-xs text-muted">{p.year}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {p.location} · {p.typology}
                  </p>
                </Link>
              </li>
            </ViewTransition>
          );
        })}
      </ul>
    </>
  );
}
