import Link from "next/link";
import { firm, nav, operator } from "@/lib/data";
import { Logo } from "./Header";
import { SplitReveal } from "./motion";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-24 md:px-10 md:pt-36">
        <p className="eyebrow mb-8 text-muted">Neues Projekt</p>
        <Link href="/kontakt" className="group block">
          <SplitReveal as="p" className="display max-w-[14ch] text-[13vw] text-paper md:text-[8.5vw]">
            Lassen Sie uns über Ihr Projekt sprechen.
          </SplitReveal>
          <span className="mt-10 inline-flex items-center gap-4 text-sm text-paper/80 transition-colors group-hover:text-paper">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-all duration-700 ease-[var(--ease-expo)] group-hover:scale-110 group-hover:border-bronze group-hover:bg-bronze group-hover:text-ink">
              →
            </span>
            Gespräch vereinbaren
          </span>
        </Link>

        <div className="mt-24 grid gap-12 border-t border-line pt-12 text-sm md:mt-36 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-muted">
              {firm.tagline} — Architekturstudio in {firm.city} seit {firm.founded}.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-muted">Studio</p>
            <p>{firm.street}</p>
            <p>
              {firm.zip} {firm.city}
            </p>
            <p className="mt-3 text-muted">{firm.hours}</p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-muted">Kontakt</p>
            <a href={`mailto:${firm.email}`} className="link-line break-all">
              {firm.email}
            </a>
          </div>
          <nav aria-label="Footer" className="md:col-span-2">
            <p className="eyebrow mb-5 text-muted">Seiten</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-line">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            Konzept-Demo · Design &amp; Entwicklung{" "}
            <a href={operator.url} className="link-line text-paper/80" target="_blank" rel="noopener">
              {operator.name}
            </a>{" "}
            · Ostlicht ist ein fiktives Studio.
          </p>
          <div className="flex gap-6">
            <Link href="/impressum" className="link-line">
              Impressum
            </Link>
            <Link href="/datenschutz" className="link-line">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
