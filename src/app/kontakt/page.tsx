import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { ContactForm } from "@/components/ContactForm";
import { FadeUp, ParallaxImage, SplitReveal } from "@/components/motion";
import { firm } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Erzählen Sie uns von Ihrem Vorhaben. Ostlicht Architekten, Berlin-Mitte.",
};

export default function KontaktPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-40 md:px-10 md:pt-52">
        <p className="eyebrow mb-6 text-muted">Kontakt</p>
        <SplitReveal as="h1" onLoad className="display max-w-[14ch] text-[14vw] md:text-[7.5vw]">
          Erzählen Sie uns von Ihrem Vorhaben.
        </SplitReveal>

        <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-12">
          <FadeUp className="md:col-span-7">
            <ContactForm />
          </FadeUp>
          <aside className="space-y-10 text-sm md:col-span-4 md:col-start-9">
            <ParallaxImage
              src="/images/atelierhaus-uckermark-2.jpg"
              alt="Atelier mit Nordlicht und Skulpturen"
              className="aspect-[4/5] bg-ink-2"
              sizes="(min-width: 768px) 30vw, 100vw"
            />
            <div className="border-t border-line pt-4">
              <p className="eyebrow mb-3 text-muted">Studio</p>
              <p>{firm.legalName}</p>
              <p>{firm.street}</p>
              <p>
                {firm.zip} {firm.city}
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="eyebrow mb-3 text-muted">E-Mail</p>
              <a href={`mailto:${firm.email}`} className="link-line break-all">
                {firm.email}
              </a>
            </div>
            <div className="border-t border-line pt-4">
              <p className="eyebrow mb-3 text-muted">Erreichbar</p>
              <p>{firm.hours}</p>
              <p className="mt-2 text-muted">Erstgespräche sind kostenfrei und dauern etwa eine Stunde.</p>
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}
