"use client";

import { useEffect, useState, type FormEvent } from "react";

/**
 * Demo-Formular: Es wird nichts gesendet und nichts gespeichert.
 * In einem echten Projekt wird hier eine Server Action oder ein Mail-Dienst angebunden.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [fromPlanner, setFromPlanner] = useState(false);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("planer");
      if (s) {
        // Browser-Speicher gibt es erst nach dem Laden – einmaliges Übernehmen ist hier gewollt.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessage(`Meine Angaben aus dem Projektplaner:\n${s}\n\n`);
        setFromPlanner(true);
        sessionStorage.removeItem("planer");
      }
    } catch {}
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="border border-line bg-ink-2 p-8 md:p-12">
        <p className="eyebrow mb-6 text-bronze">Vielen Dank</p>
        <p className="display text-4xl md:text-5xl">Danke für Ihre Nachricht.</p>
        <p className="mt-6 max-w-md leading-relaxed text-paper/70">
          Wir melden uns innerhalb von zwei Werktagen bei Ihnen.
        </p>
        <p className="mt-8 border-t border-line pt-4 text-xs text-muted">
          Hinweis: Dies ist eine Konzept-Demo. Es wurden keine Daten übertragen oder gespeichert.
        </p>
      </div>
    );
  }

  const field =
    "peer w-full border-0 border-b border-line bg-transparent px-0 pb-3 pt-7 text-lg text-paper outline-none transition-colors focus:border-paper placeholder:text-transparent";
  const label =
    "pointer-events-none absolute left-0 top-7 text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {fromPlanner && (
        <p className="border border-bronze/40 bg-bronze/10 px-5 py-4 text-sm text-paper/85">
          Ihre Angaben aus dem Projektplaner sind bereits eingetragen.
        </p>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative">
          <input id="name" name="name" required autoComplete="name" placeholder="Name" className={field} />
          <label htmlFor="name" className={label}>
            Name *
          </label>
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="E-Mail" className={field} />
          <label htmlFor="email" className={label}>
            E-Mail *
          </label>
        </div>
      </div>
      <div className="relative">
        <input id="ort" name="ort" placeholder="Ort des Projekts" className={field} />
        <label htmlFor="ort" className={label}>
          Ort des Projekts
        </label>
      </div>
      <div className="relative">
        <textarea
          id="nachricht"
          name="nachricht"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht"
          className={`${field} resize-none`}
        />
        <label htmlFor="nachricht" className={label}>
          Ihr Vorhaben *
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" required className="mt-1 accent-[var(--color-bronze)]" />
        <span>Ich habe die Datenschutzhinweise gelesen. *</span>
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-paper px-8 py-4 text-sm text-ink transition-colors hover:bg-bronze"
        >
          Nachricht senden →
        </button>
        <p className="text-xs text-muted">Demo-Formular · es werden keine Daten übertragen.</p>
      </div>
    </form>
  );
}
