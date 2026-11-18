import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { operator } from "@/lib/data";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <div className="border border-bronze/40 bg-bronze/10 p-6 text-paper">
        <p className="eyebrow mb-3 text-bronze">Konzept-Demo</p>
        <p>
          Diese Website ist eine Konzept-Demo von {operator.name}. Das dargestellte Architekturbüro „Ostlicht Architekten“, seine Projekte, Mitarbeitenden, Zahlen und Zitate sind frei erfunden. Ähnlichkeiten mit realen Büros oder Personen sind nicht beabsichtigt. Alle Bilder sind digital erzeugt.
        </p>
      </div>
      <div>
        <h2>Anbieter dieser Website</h2>
        <p>
          Verantwortlich für Inhalt und Betrieb dieser Website ist {operator.name}. Die vollständigen Angaben nach § 5 DDG finden Sie im{" "}
          <a href={operator.impressumUrl} target="_blank" rel="noopener">
            Impressum von {operator.name}
          </a>
          .
        </p>
      </div>
      <div>
        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Demo dienen ausschließlich der Darstellung gestalterischer und technischer Möglichkeiten. Es werden keine Architekturleistungen angeboten. Die Werte im Projektplaner sind Beispielwerte und keine Kostenschätzung.
        </p>
      </div>
    </LegalPage>
  );
}
