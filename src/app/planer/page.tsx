import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { Planner } from "@/components/Planner";
import { SplitReveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Projektplaner",
  description: "In fünf Schritten zu einer ersten Einschätzung von Baukosten, Honorar und Zeitrahmen Ihres Projekts.",
};

export default function PlanerPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-40 md:px-10 md:pt-52">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-6 text-bronze">Projektplaner</p>
            <SplitReveal as="h1" onLoad className="display text-[14vw] md:text-[7vw]">
              Ihr Projekt in fünf Schritten.
            </SplitReveal>
          </div>
          <p className="max-w-sm leading-relaxed text-paper/70 md:col-span-4">
            Beantworten Sie fünf kurze Fragen. Sie sehen sofort eine Orientierung zu Baukosten, Honorar und Zeitrahmen – und können die Angaben direkt an uns senden.
          </p>
        </div>
        <Planner />
      </section>
    </PageTransition>
  );
}
