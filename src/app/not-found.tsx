import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-[1600px] flex-col justify-end px-5 pb-24 pt-40 md:px-10">
      <p className="eyebrow mb-6 text-muted">Fehler 404</p>
      <h1 className="display text-[16vw] md:text-[9vw]">
        Dieser Raum <span className="italic text-paper/60">existiert nicht.</span>
      </h1>
      <Link href="/" className="link-line mt-10 self-start pb-1 text-sm">
        Zur Startseite →
      </Link>
    </section>
  );
}
