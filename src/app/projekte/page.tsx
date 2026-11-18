import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SplitReveal } from "@/components/motion";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projekte",
  description: "Ausgewählte Projekte von Ostlicht Architekten: Wohnhäuser, Umbauten, Arbeitsorte und Kulturbauten in Berlin und Brandenburg.",
};

export default function ProjektePage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-40 md:px-10 md:pt-52">
        <div className="mb-16 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-6 text-muted">Arbeiten 2020 – 2025</p>
            <SplitReveal as="h1" onLoad className="display text-[18vw] md:text-[10vw]">
              Projekte
            </SplitReveal>
          </div>
          <p className="max-w-sm leading-relaxed text-paper/70 md:col-span-4">
            Eine Auswahl unserer realisierten Bauten. Jedes Projekt ist eine Antwort auf einen bestimmten Ort und die Menschen, die ihn nutzen.
          </p>
        </div>
        <ProjectGrid projects={projects} />
      </section>
    </PageTransition>
  );
}
