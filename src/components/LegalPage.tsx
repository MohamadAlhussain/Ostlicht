import type { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageTransition>
      <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-40 md:px-10 md:pt-52">
        <div className="grid gap-12 md:grid-cols-12">
          <h1 className="display text-6xl md:col-span-4 md:text-7xl">{title}</h1>
          <div className="space-y-10 leading-relaxed text-paper/80 md:col-span-7 md:col-start-6 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:display [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:text-paper [&_p+p]:mt-4">
            {children}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
