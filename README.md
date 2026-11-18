# Ostlicht Architekten – Konzept-Demo von LEXERNO

Premium-Demo eines fiktiven Architekturbüros: WebGL-Hero, Parallax, horizontale Projekt-Galerie,
Seitenübergänge mit View Transitions, interaktiver Projektplaner. Alle Inhalte sind erfunden.

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Bilder

Die Bilder in `public/images` sind Platzhalter, bis echte Bilder generiert sind.
Prompts und Bildliste: `scripts/images.mjs`.

```bash
npm run images -- --test     # ein Testbild
npm run images               # alle fehlenden Bilder
npm run images -- --force    # alles neu
```

Benötigt `GEMINI_API_KEY` in `.env` oder `.env.local` (wird nicht ins Git übernommen).
Die kostenlose Stufe von Google AI Studio enthält **keine** Bildgenerierung – dafür muss im
Google-AI-Studio-Projekt die Abrechnung aktiviert sein. Modell wählbar über `GEMINI_IMAGE_MODEL`.

## Veröffentlichen

Bei einer eigenen Domain (z. B. Subdomain von lexerno.com) in Vercel die Umgebungsvariable
`NEXT_PUBLIC_SITE_URL=https://architektur.lexerno.com` setzen – sonst zeigt das Vorschaubild
geteilter Links auf die Vercel-Adresse.

## Inhalte

Alle Texte und Projekte stehen in `src/lib/data.ts`. Die Struktur entspricht einem Headless-CMS –
bei Bedarf wird die Datei durch Abfragen an das CMS ersetzt, ohne die Komponenten zu ändern.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `src/components/HeroCanvas.tsx` | WebGL-Übergänge (Noise-Dissolve, Linse, Korn). Startet erst bei der ersten Interaktion. |
| `src/components/HorizontalProjects.tsx` | Fixierte Sektion mit horizontalem Scroll (ab 1024 px) |
| `src/components/motion.tsx` | Zeilen-Reveal, Wort-Scrub, Fade-Up, Parallax-Bild |
| `src/components/Planner.tsx` | Projektplaner mit Live-Einschätzung und Axonometrie |
| `src/lib/gsap.ts` | GSAP-Setup und Leerlauf-Warteschlange für Animationen unterhalb des Bildschirms |
