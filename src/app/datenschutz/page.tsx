import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { operator } from "@/lib/data";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <div className="border border-bronze/40 bg-bronze/10 p-6 text-paper">
        <p className="eyebrow mb-3 text-bronze">Konzept-Demo</p>
        <p>
          Diese Website ist eine Konzept-Demo von {operator.name}. Formulare senden keine Daten, es werden keine Cookies gesetzt und keine Analyse- oder Tracking-Dienste eingesetzt.
        </p>
      </div>
      <div>
        <h2>Verantwortlicher</h2>
        <p>
          Verantwortlich im Sinne der DSGVO ist {operator.name}. Kontaktdaten und weitere Informationen finden Sie in der{" "}
          <a href={operator.datenschutzUrl} target="_blank" rel="noopener">
            Datenschutzerklärung von {operator.name}
          </a>
          .
        </p>
      </div>
      <div>
        <h2>Hosting und Server-Logfiles</h2>
        <p>
          Die Website wird bei Vercel Inc. gehostet. Beim Aufruf verarbeitet der Hoster technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser), um die Website auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </div>
      <div>
        <h2>Schriftarten</h2>
        <p>Die Schriftarten werden lokal von unserem Server geladen. Es besteht keine Verbindung zu Servern von Google.</p>
      </div>
      <div>
        <h2>Kontaktformular und Projektplaner</h2>
        <p>
          Eingaben im Kontaktformular werden nicht übertragen und nicht gespeichert. Die Angaben aus dem Projektplaner werden nur kurzzeitig im Speicher Ihres Browsers (Session Storage) abgelegt, um sie in das Kontaktformular zu übernehmen, und danach gelöscht.
        </p>
      </div>
      <div>
        <h2>Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit sowie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde.
        </p>
      </div>
    </LegalPage>
  );
}
