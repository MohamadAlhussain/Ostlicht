"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, firm } from "@/lib/data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0">
        <rect x="0.5" y="0.5" width="21" height="21" fill="none" stroke="currentColor" />
        <path d="M11 0.5 V21.5 M11 11 H21.5" stroke="currentColor" />
        <circle cx="16.25" cy="5.75" r="2.25" fill="var(--color-bronze)" />
      </svg>
      <span className="text-[0.95rem] font-medium tracking-[0.32em] uppercase">{firm.name}</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  // Beim Runterscrollen ausblenden, beim Hochscrollen zeigen
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 160 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";

    const el = menu.current;
    if (!el || !open || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-menu-item]", { yPercent: 110, duration: 1.1, stagger: 0.06, delay: 0.15 });
      gsap.from("[data-menu-meta]", { opacity: 0, duration: 1, delay: 0.5 });
    }, el);
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid && !open ? "border-b border-line bg-ink/75 backdrop-blur-md" : "border-b border-transparent"}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          <Link
            href="/"
            aria-label={`${firm.legalName} – Startseite`}
            className="relative z-10"
            onClick={() => setOpen(false)}
          >
            <Logo />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="link-line pb-1 text-sm text-paper/80 transition-colors hover:text-paper aria-[current=page]:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
            <span className="relative block h-3 w-7">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-500 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-500 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 md:hidden"
      >
        <nav aria-label="Mobile Navigation">
          <ul className="space-y-2">
            {[{ href: "/", label: "Start" }, ...nav].map((item) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  data-menu-item
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display block text-[13vw] leading-[1.05] text-paper"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-meta className="space-y-1 text-sm text-muted">
          <p>
            {firm.street}, {firm.zip} {firm.city}
          </p>
          <a href={`mailto:${firm.email}`} className="text-paper">
            {firm.email}
          </a>
        </div>
      </div>
    </>
  );
}
