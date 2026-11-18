/**
 * Alle Inhalte der Website an einem Ort.
 * Später kann diese Datei 1:1 durch ein Headless-CMS ersetzt werden
 * (gleiche Felder, gleiche Typen), ohne die Komponenten anzufassen.
 */

export const firm = {
  name: "Ostlicht",
  legalName: "Ostlicht Architekten",
  tagline: "Architektur & Raum",
  city: "Berlin",
  street: "Linienstraße",
  zip: "10119",
  email: "studio@architektur.lexerno.com",
  founded: 2009,
  hours: "Mo–Fr · 9–18 Uhr",
};

/** Betreiber der Demo – wird im Impressum und Footer verwendet. */
export const operator = {
  name: "LEXERNO",
  url: "https://lexerno.com",
  impressumUrl: "https://lexerno.com/impressum",
  datenschutzUrl: "https://lexerno.com/datenschutz",
};

export type Category = "Wohnen" | "Arbeiten" | "Kultur" | "Umbau";

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: number;
  category: Category;
  typology: string;
  area: string;
  status: string;
  phases: string;
  materials: string;
  lead: string;
  body: string[];
  quote?: string;
  cover: string;
  gallery: [string, string];
};

export const projects: Project[] = [
  {
    slug: "haus-am-see",
    title: "Haus am See",
    location: "Potsdam",
    year: 2024,
    category: "Wohnen",
    typology: "Einfamilienhaus",
    area: "420 m²",
    status: "Fertiggestellt",
    phases: "LP 1–9",
    materials: "Sichtbeton, Lärche, Glas",
    lead: "Ein Haus, das sich zum Wasser hin öffnet und zur Straße hin schweigt.",
    body: [
      "Das Grundstück fällt sanft zum Ufer ab. Wir haben das Haus in drei versetzte Ebenen gegliedert, die dem Gelände folgen, statt es zu begradigen. Jede Ebene hat ihren eigenen Blick auf den See.",
      "Zur Straße zeigt sich das Haus geschlossen: eine Wand aus Sichtbeton mit einer einzigen tiefen Öffnung für den Eingang. Zum Wasser löst sich die Fassade in raumhohe Verglasung und eine umlaufende Terrasse aus Lärchenholz auf.",
    ],
    quote: "Wir wollten nicht auf den See schauen, sondern mit ihm wohnen.",
    cover: "/images/haus-am-see.jpg",
    gallery: ["/images/haus-am-see-2.jpg", "/images/haus-am-see-3.jpg"],
  },
  {
    slug: "speicher-spree",
    title: "Speicher an der Spree",
    location: "Berlin-Friedrichshain",
    year: 2023,
    category: "Umbau",
    typology: "Büro & Ateliers",
    area: "6.800 m²",
    status: "Fertiggestellt",
    phases: "LP 1–8",
    materials: "Klinker, Stahl, Eichenparkett",
    lead: "Ein Getreidespeicher von 1906 wird zum Arbeitsort für 400 Menschen.",
    body: [
      "Die massiven Klinkerwände und die gusseisernen Stützen sind geblieben. Neu ist ein Lichthof, den wir durch alle sechs Geschosse geschnitten haben. Er bringt Tageslicht bis ins Erdgeschoss und verbindet die Etagen über eine offene Stahltreppe.",
      "Wo wir eingreifen, zeigen wir es: Neue Bauteile sind aus geschwärztem Stahl und heben sich klar vom Bestand ab. So bleibt die Geschichte des Hauses lesbar.",
    ],
    quote: "Der beste Umbau ist der, bei dem man das Alte wieder sieht.",
    cover: "/images/speicher-spree.jpg",
    gallery: ["/images/speicher-spree-2.jpg", "/images/speicher-spree-3.jpg"],
  },
  {
    slug: "bibliothek-am-kanal",
    title: "Bibliothek am Kanal",
    location: "Berlin-Neukölln",
    year: 2022,
    category: "Kultur",
    typology: "Stadtteilbibliothek",
    area: "3.200 m²",
    status: "Fertiggestellt",
    phases: "LP 1–9 · Wettbewerb 1. Preis",
    materials: "Holz-Beton-Verbund, Recyclingziegel",
    lead: "Ein öffentliches Wohnzimmer für einen Stadtteil, der keines hatte.",
    body: [
      "Die Bibliothek ist um einen großen Lesesaal organisiert, der sich über eine Sitztreppe zum Kanal öffnet. Die Regale bilden Nischen, in denen man allein sein kann, ohne sich ausgeschlossen zu fühlen.",
      "Das Tragwerk aus Holz-Beton-Verbund bleibt sichtbar und bestimmt die Atmosphäre. Die Fassade aus Recyclingziegeln stammt zu großen Teilen aus dem Abbruch des Vorgängerbaus.",
    ],
    cover: "/images/bibliothek-am-kanal.jpg",
    gallery: ["/images/bibliothek-am-kanal-2.jpg", "/images/bibliothek-am-kanal-3.jpg"],
  },
  {
    slug: "wohnhof-pankow",
    title: "Wohnhof Pankow",
    location: "Berlin-Pankow",
    year: 2025,
    category: "Wohnen",
    typology: "48 Wohnungen",
    area: "5.400 m²",
    status: "Fertiggestellt",
    phases: "LP 1–8",
    materials: "Holzbau, Kalkputz, Klinkerboden",
    lead: "Gemeinschaftliches Wohnen um einen grünen Hof.",
    body: [
      "Vier Häuser in Holzbauweise umschließen einen gemeinsamen Garten. Laubengänge ersetzen dunkle Treppenhäuser und werden zu Orten, an denen man sich begegnet.",
      "Die Grundrisse lassen sich ohne große Umbauten verändern: Aus zwei kleinen Wohnungen kann eine große werden, wenn eine Familie wächst.",
    ],
    cover: "/images/wohnhof-pankow.jpg",
    gallery: ["/images/wohnhof-pankow-2.jpg", "/images/wohnhof-pankow-3.jpg"],
  },
  {
    slug: "atelierhaus-uckermark",
    title: "Atelierhaus Uckermark",
    location: "Uckermark",
    year: 2021,
    category: "Kultur",
    typology: "Atelier & Gästehaus",
    area: "260 m²",
    status: "Fertiggestellt",
    phases: "LP 1–9",
    materials: "Stampflehm, Douglasie, Reet",
    lead: "Ein Arbeitsort für eine Bildhauerin, gebaut aus dem, was die Landschaft hergibt.",
    body: [
      "Die Wände bestehen aus Stampflehm, der wenige Kilometer entfernt abgebaut wurde. Ihre horizontalen Schichten erzählen vom Bauprozess und verändern ihre Farbe mit dem Licht des Tages.",
      "Ein großes Nordlicht-Oberlicht gibt dem Atelier gleichmäßiges Licht für die Arbeit. Das Gästehaus duckt sich unter ein tief heruntergezogenes Reetdach.",
    ],
    quote: "Das Haus sieht aus, als hätte es schon immer hier gestanden.",
    cover: "/images/atelierhaus-uckermark.jpg",
    gallery: ["/images/atelierhaus-uckermark-2.jpg", "/images/atelierhaus-uckermark-3.jpg"],
  },
  {
    slug: "pavillon-havel",
    title: "Pavillon an der Havel",
    location: "Werder (Havel)",
    year: 2020,
    category: "Arbeiten",
    typology: "Bootshaus & Café",
    area: "180 m²",
    status: "Fertiggestellt",
    phases: "LP 1–9",
    materials: "Cortenstahl, Glas, Eiche",
    lead: "Ein leichtes Dach über dem Wasser.",
    body: [
      "Ein schlankes Stahldach ruht auf nur vier Stützen und schwebt scheinbar über dem Steg. Darunter liegen ein Café und ein Bootslager, die sich vollständig öffnen lassen.",
      "Im Winter schließen raumhohe Schiebeelemente den Pavillon. Im Sommer verschwindet die Grenze zwischen innen und außen.",
    ],
    cover: "/images/pavillon-havel.jpg",
    gallery: ["/images/pavillon-havel-2.jpg", "/images/pavillon-havel-3.jpg"],
  },
];

export const categories: ("Alle" | Category)[] = ["Alle", "Wohnen", "Arbeiten", "Kultur", "Umbau"];

export const heroSlides = ["haus-am-see", "bibliothek-am-kanal", "atelierhaus-uckermark"];

export const services = [
  {
    title: "Architektur",
    text: "Neubauten vom ersten Entwurf bis zur Schlüsselübergabe – Wohnhäuser, Arbeitsorte und öffentliche Gebäude.",
    image: "/images/wohnhof-pankow-2.jpg",
  },
  {
    title: "Umbau & Bestand",
    text: "Wir verwandeln bestehende Gebäude, statt sie abzureißen. Das ist nachhaltiger und oft schöner.",
    image: "/images/speicher-spree-2.jpg",
  },
  {
    title: "Innenarchitektur",
    text: "Räume, Möbel und Licht aus einer Hand – abgestimmt auf die Architektur, die sie umgibt.",
    image: "/images/haus-am-see-3.jpg",
  },
  {
    title: "Wettbewerbe",
    text: "Für öffentliche Bauherren entwickeln wir Konzepte, die über den einzelnen Bau hinausdenken.",
    image: "/images/bibliothek-am-kanal-2.jpg",
  },
];

export const stats = [
  { value: 17, suffix: "", label: "Jahre Praxis" },
  { value: 64, suffix: "", label: "realisierte Projekte" },
  { value: 28, suffix: "", label: "Menschen im Studio" },
  { value: 92, suffix: "%", label: "Folgeaufträge & Empfehlungen" },
];

export const principles = [
  {
    no: "01",
    title: "Vom Ort aus denken",
    text: "Jedes Projekt beginnt mit Zeit vor Ort. Licht, Wind, Nachbarschaft und Geschichte bestimmen den Entwurf, bevor wir die erste Linie zeichnen.",
  },
  {
    no: "02",
    title: "Weniger, aber besser",
    text: "Wenige Materialien, sorgfältig gefügt. Was nicht gebraucht wird, lassen wir weg. Was bleibt, soll Jahrzehnte halten.",
  },
  {
    no: "03",
    title: "Bestand vor Neubau",
    text: "Die grauen Emissionen eines Gebäudes stecken im Rohbau. Wo immer es möglich ist, bauen wir um statt neu.",
  },
];

export const timeline = [
  { year: "2009", text: "Gründung in einem Hinterhofatelier in Berlin-Mitte." },
  { year: "2014", text: "Erster gewonnener Wettbewerb und erster öffentlicher Bau." },
  { year: "2018", text: "Umzug in das heutige Studio, Erweiterung auf 20 Mitarbeitende." },
  { year: "2022", text: "Eröffnung der Bibliothek am Kanal." },
  { year: "2025", text: "Schwerpunkt auf Holzbau und Umbau im Bestand." },
];

export const team = [
  { name: "Clara Weidner", role: "Partnerin · Architektin" },
  { name: "Jonas Albrecht", role: "Partner · Architekt" },
  { name: "Mira Haddad", role: "Projektleitung" },
  { name: "Paul Lindqvist", role: "Innenarchitektur" },
  { name: "Ana Petrović", role: "Wettbewerbe" },
  { name: "Tobias Krämer", role: "Bauleitung" },
];

export const nav = [
  { href: "/projekte", label: "Projekte" },
  { href: "/studio", label: "Studio" },
  { href: "/planer", label: "Projektplaner" },
  { href: "/kontakt", label: "Kontakt" },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
