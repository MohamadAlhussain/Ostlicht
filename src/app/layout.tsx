import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const text = Inter({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: { type: "website", locale: "de_DE", siteName: "Ostlicht Architekten" },
  title: {
    default: "Ostlicht Architekten — Architektur & Raum, Berlin",
    template: "%s — Ostlicht Architekten",
  },
  description:
    "Ostlicht ist ein Architekturstudio in Berlin. Wir entwerfen Wohnhäuser, Arbeitsorte und öffentliche Gebäude – präzise im Detail und gebaut für Generationen. (Konzept-Demo von LEXERNO)",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <SmoothScroll />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
