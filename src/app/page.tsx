import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { ServicesList } from "@/components/ServicesList";
import { Counter } from "@/components/Counter";
import { PageTransition } from "@/components/PageTransition";
import { FadeUp, ParallaxImage, SplitReveal, WordScrub } from "@/components/motion";
import { getProject, heroSlides, principles, projects, services, stats } from "@/lib/data";

export default function Home() {
  const slides = heroSlides.map((slug) => {
    const p = getProject(slug)!;
    return { slug: p.slug, title: p.title, location: p.location, year: p.year, cover: p.cover };
  });

  return (
    <PageTransition>
      <Hero slides={slides} />

      {/* Haltung */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">Haltung</p>
          <WordScrub className="display text-[9vw] leading-[1.02] md:col-span-9 md:text-[4.6vw]">
            Wir entwerfen Gebäude, die aus ihrem Ort heraus entstehen – präzise im Detail, ruhig in der Wirkung und gebaut für Generationen.
          </WordScrub>
        </div>
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <FadeUp className="md:col-span-4 md:col-start-4">
            <p className="leading-relaxed text-paper/70">
              Seit 2009 arbeiten wir in Berlin an Wohnhäusern, Arbeitsorten und öffentlichen Bauten. Wir bauen um, bevor wir neu bauen, und verwenden wenige Materialien, die gut altern.
            </p>
          </FadeUp>
          <FadeUp className="md:col-span-3 md:col-start-9" delay={0.1}>
            <Link href="/studio" className="group inline-flex items-center gap-3 text-sm">
              <span className="link-line pb-1">Das Studio kennenlernen</span>
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </FadeUp>
        </div>
      </section>

      <HorizontalProjects projects={projects} />

      {/* Zahlen */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <FadeUp className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4" stagger={0.1}>
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

      {/* Bild mit Vorhang */}
      <section className="px-5 md:px-10">
        <ParallaxImage
          src="/images/pavillon-havel-3.jpg"
          alt="Café im Pavillon an der Havel mit geöffneten Glaswänden zum Steg"
          className="mx-auto h-[70svh] max-w-[1600px] md:h-[92svh]"
          amount={12}
          reveal
        />
        <div className="mx-auto grid max-w-[1600px] gap-6 py-8 text-sm text-muted md:grid-cols-12">
          <p className="md:col-span-4">Pavillon an der Havel, 2020</p>
          <p className="md:col-span-5 md:col-start-8">
            Im Sommer öffnen sich die Glaswände vollständig. Dann verschwindet die Grenze zwischen innen und außen.
          </p>
        </div>
      </section>

      {/* Leistungen – heller Abschnitt */}
      <section className="mt-28 bg-paper text-ink md:mt-40">
        <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
          <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
            <p className="eyebrow text-muted-dark md:col-span-3">Leistungen</p>
            <SplitReveal className="display text-5xl md:col-span-9 md:text-7xl">
              Vom ersten Gedanken bis zur Übergabe – aus einer Hand.
            </SplitReveal>
          </div>
          <ServicesList services={services} />
        </div>
      </section>

      {/* Prinzipien */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:sticky md:top-32 md:col-span-5 md:self-start">
            <p className="eyebrow mb-6 text-muted">Arbeitsweise</p>
            <SplitReveal className="display text-5xl md:text-7xl">Drei Grundsätze, die jeden Entwurf leiten.</SplitReveal>
            <ParallaxImage
              src="/images/haus-am-see-2.jpg"
              alt="Detail einer Holzfassade aus Lärche"
              className="mt-12 hidden aspect-[4/5] w-3/4 md:block"
              sizes="30vw"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {principles.map((p) => (
              <FadeUp key={p.no} className="border-t border-line py-12 md:py-16">
                <p className="text-xs tabular-nums text-bronze">{p.no}</p>
                <h3 className="display mt-6 text-4xl md:text-5xl">{p.title}</h3>
                <p className="mt-6 max-w-md leading-relaxed text-paper/70">{p.text}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Projektplaner-Teaser */}
      <section className="px-5 pb-28 md:px-10 md:pb-40">
        <Link
          href="/planer"
          className="group relative mx-auto block max-w-[1600px] overflow-hidden border border-line bg-ink-2 px-6 py-16 md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-bronze/10 blur-3xl transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-125" />
          <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow mb-6 text-bronze">Projektplaner</p>
              <p className="display text-5xl md:text-7xl">
                Was kostet Ihr Projekt? <span className="italic text-paper/60">In zwei Minuten zur ersten Einschätzung.</span>
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <span className="inline-flex items-center gap-4 text-sm">
                Planer starten
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-all duration-700 ease-[var(--ease-expo)] group-hover:border-bronze group-hover:bg-bronze group-hover:text-ink">
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>
      </section>
    </PageTransition>
  );
}
