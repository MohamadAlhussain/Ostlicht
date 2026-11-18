import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { PageTransition } from "@/components/PageTransition";
import { FadeUp, ParallaxImage, SplitReveal } from "@/components/motion";
import { getProject, nextProject, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projekte/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.lead} ${p.typology} in ${p.location}, ${p.year}.` };
}

export default async function ProjectPage({ params }: PageProps<"/projekte/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);

  const facts = [
    ["Ort", p.location],
    ["Jahr", String(p.year)],
    ["Typologie", p.typology],
    ["Fläche", p.area],
    ["Leistung", p.phases],
    ["Materialien", p.materials],
    ["Status", p.status],
  ];

  return (
    <PageTransition>
      <article>
        <header className="mx-auto max-w-[1600px] px-5 pb-12 pt-36 md:px-10 md:pb-16 md:pt-44">
          <Link href="/projekte" className="group mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-paper">
            <span className="transition-transform duration-500 group-hover:-translate-x-1">←</span> Alle Projekte
          </Link>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-6 text-muted">
                {p.category} · {p.year}
              </p>
              <SplitReveal as="h1" onLoad delay={0.2} className="display text-[15vw] md:text-[7.5vw]">
                {p.title}
              </SplitReveal>
            </div>
            <FadeUp className="md:col-span-4" delay={0.4}>
              <p className="display text-2xl leading-snug text-paper/85 md:text-3xl">{p.lead}</p>
            </FadeUp>
          </div>
        </header>

        <div className="px-5 md:px-10">
          <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
            <ParallaxImage
              src={p.cover}
              alt={`${p.title}, ${p.location}`}
              className="mx-auto h-[62svh] max-w-[1600px] bg-ink-2 md:h-[88svh]"
              amount={8}
              preload
            />
          </ViewTransition>
        </div>

        <section className="mx-auto grid max-w-[1600px] gap-16 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start text-sm md:col-span-4 md:grid-cols-1">
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="eyebrow mb-2 text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-7 md:col-start-6">
            {p.body.map((para, i) => (
              <FadeUp key={i}>
                <p className={`leading-relaxed text-paper/80 ${i === 0 ? "display text-3xl leading-[1.2] text-paper md:text-[2.6rem]" : "mt-10 max-w-xl text-lg"}`}>
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1600px] gap-8 px-5 md:grid-cols-12 md:px-10">
          <ParallaxImage
            src={p.gallery[0]}
            alt={`${p.title} – Detail`}
            className="aspect-[4/5] bg-ink-2 md:col-span-5"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <div className="flex items-end md:col-span-6 md:col-start-7">
            {p.quote ? (
              <FadeUp>
                <blockquote className="display text-4xl italic leading-[1.1] text-paper md:text-6xl">„{p.quote}“</blockquote>
                <p className="mt-6 text-sm text-muted">Clara Weidner, Partnerin</p>
              </FadeUp>
            ) : (
              <FadeUp>
                <p className="max-w-md text-lg leading-relaxed text-paper/70">
                  {p.materials}. Wenige Materialien, sorgfältig gefügt – damit das Gebäude über Jahrzehnte gut altert.
                </p>
              </FadeUp>
            )}
          </div>
        </section>

        <section className="px-5 py-24 md:px-10 md:py-36">
          <ParallaxImage
            src={p.gallery[1]}
            alt={`${p.title} – Innenraum`}
            className="mx-auto h-[60svh] max-w-[1600px] bg-ink-2 md:h-[90svh]"
            amount={10}
            reveal
          />
        </section>

        {/* Nächstes Projekt */}
        <section className="border-t border-line">
          <Link href={`/projekte/${next.slug}`} className="group mx-auto grid max-w-[1600px] gap-10 px-5 py-20 md:grid-cols-12 md:items-center md:px-10 md:py-28">
            <div className="md:col-span-7">
              <p className="eyebrow mb-6 text-muted">Nächstes Projekt</p>
              <p className="display text-[13vw] transition-colors duration-700 group-hover:text-bronze md:text-[6.5vw]">{next.title}</p>
              <p className="mt-4 text-sm text-muted">
                {next.location} · {next.year} →
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <ViewTransition name={`project-${next.slug}`} share="morph" default="none">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
                  <Image
                    src={next.cover}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-105"
                  />
                </div>
              </ViewTransition>
            </div>
          </Link>
        </section>
      </article>
    </PageTransition>
  );
}
