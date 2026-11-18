import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { Counter } from "@/components/Counter";
import { FadeUp, ParallaxImage, SplitReveal, WordScrub } from "@/components/motion";
import { principles, stats, team, timeline } from "@/lib/data";

export const metadata: Metadata = {
  title: "Studio",
  description: "Ostlicht ist ein Architekturstudio mit 28 Menschen in Berlin-Mitte. Haltung, Geschichte und Team.",
};

export default function StudioPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-40 md:px-10 md:pb-28 md:pt-52">
        <p className="eyebrow mb-6 text-muted">Studio</p>
        <SplitReveal as="h1" onLoad className="display max-w-[16ch] text-[14vw] md:text-[7.5vw]">
          Architektur ist für uns Handwerk mit Haltung.
        </SplitReveal>
      </section>

      <div className="px-5 md:px-10">
        <ParallaxImage
          src="/images/speicher-spree-3.jpg"
          alt="Arbeitsplätze im Studio unter Holzbalken und gusseisernen Stützen"
          className="mx-auto h-[60svh] max-w-[1600px] bg-ink-2 md:h-[85svh]"
          amount={10}
          preload
          reveal
        />
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">Über uns</p>
          <WordScrub className="display text-[8.5vw] leading-[1.05] md:col-span-9 md:text-[3.8vw]">
            Wir sind 28 Architektinnen, Innenarchitekten und Bauleiter in einem Hinterhof in Berlin-Mitte. Wir arbeiten in kleinen Teams, die ein Projekt vom ersten Gespräch bis zur Übergabe begleiten.
          </WordScrub>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <FadeUp className="grid grid-cols-2 gap-x-6 gap-y-14 border-b border-line pb-28 md:grid-cols-4 md:pb-40" stagger={0.1}>
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line pt-6">
              <p className="display text-6xl md:text-8xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </FadeUp>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">Grundsätze</p>
          <SplitReveal className="display text-5xl md:col-span-9 md:text-7xl">Was uns leitet</SplitReveal>
        </div>
        <FadeUp className="grid gap-px bg-line md:grid-cols-3" stagger={0.12}>
          {principles.map((p) => (
            <div key={p.no} className="bg-ink p-8 md:p-12">
              <p className="text-xs tabular-nums text-bronze">{p.no}</p>
              <h3 className="display mt-10 text-4xl">{p.title}</h3>
              <p className="mt-6 leading-relaxed text-paper/70">{p.text}</p>
            </div>
          ))}
        </FadeUp>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:grid-cols-12 md:px-10 md:py-40">
          <div className="md:col-span-4">
            <p className="eyebrow mb-6 text-muted-dark">Geschichte</p>
            <SplitReveal className="display text-5xl md:text-6xl">Seit 2009 in Berlin</SplitReveal>
          </div>
          <FadeUp as="ol" stagger={0.1} className="md:col-span-7 md:col-start-6">
            {timeline.map((t) => (
              <li key={t.year} className="grid grid-cols-[5rem_1fr] gap-6 border-t border-line-dark py-7 md:grid-cols-[8rem_1fr]">
                <span className="display text-3xl md:text-4xl">{t.year}</span>
                <span className="self-center leading-relaxed text-ink/75">{t.text}</span>
              </li>
            ))}
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">Team</p>
          <SplitReveal className="display text-5xl md:col-span-9 md:text-7xl">Die Menschen hinter den Projekten</SplitReveal>
        </div>
        <FadeUp className="grid gap-x-8 sm:grid-cols-2 md:grid-cols-3" stagger={0.06}>
          {team.map((m) => (
            <div key={m.name} className="group flex items-baseline justify-between gap-4 border-t border-line py-6">
              <p className="display text-3xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">{m.name}</p>
              <p className="shrink-0 text-right text-xs text-muted">{m.role}</p>
            </div>
          ))}
        </FadeUp>
      </section>
    </PageTransition>
  );
}
