"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* Beispielwerte – in einem echten Projekt kommen sie vom Büro         */
/* ------------------------------------------------------------------ */
const TYPES = [
  { id: "efh", label: "Einfamilienhaus", hint: "Neubau für eine Familie", rate: 2700, perFloor: 140, min: 90, max: 600 },
  { id: "mfh", label: "Mehrfamilienhaus", hint: "Wohnungen, Baugruppe, Genossenschaft", rate: 2900, perFloor: 420, min: 400, max: 8000 },
  { id: "umbau", label: "Umbau im Bestand", hint: "Sanierung, Aufstockung, Umnutzung", rate: 1900, perFloor: 300, min: 60, max: 6000 },
  { id: "buero", label: "Büro & Gewerbe", hint: "Arbeitsorte, Praxis, Studio", rate: 2600, perFloor: 600, min: 150, max: 8000 },
  { id: "innen", label: "Innenarchitektur", hint: "Ausbau, Möbel, Licht", rate: 950, perFloor: 400, min: 40, max: 3000 },
] as const;

const STANDARDS = [
  { id: "solide", label: "Solide", hint: "Robuste Materialien, klare Details", factor: 0.9 },
  { id: "gehoben", label: "Gehoben", hint: "Hochwertige Oberflächen, maßgefertigte Elemente", factor: 1.15 },
  { id: "exklusiv", label: "Exklusiv", hint: "Besondere Materialien, Sonderlösungen", factor: 1.55 },
] as const;

const SCOPES = [
  { id: "lp4", label: "Entwurf & Genehmigung", hint: "Leistungsphasen 1–4", share: 0.27 },
  { id: "lp7", label: "Planung & Ausschreibung", hint: "Leistungsphasen 1–7", share: 0.66 },
  { id: "lp8", label: "Komplett mit Bauüberwachung", hint: "Leistungsphasen 1–8", share: 0.98 },
] as const;

const TIMES = [
  { id: "bald", label: "So bald wie möglich" },
  { id: "jahr", label: "In 6–12 Monaten" },
  { id: "offen", label: "Noch offen" },
] as const;

type State = {
  type?: (typeof TYPES)[number]["id"];
  area: number;
  standard?: (typeof STANDARDS)[number]["id"];
  scope?: (typeof SCOPES)[number]["id"];
  time?: (typeof TIMES)[number]["id"];
};

const STEPS = ["Projektart", "Fläche", "Standard", "Leistung", "Zeitplan"] as const;

const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const round = (n: number) => (n > 200000 ? Math.round(n / 10000) * 10000 : Math.round(n / 1000) * 1000);

function estimate(s: State) {
  const type = TYPES.find((t) => t.id === s.type);
  if (!type) return null;
  const std = STANDARDS.find((x) => x.id === s.standard) ?? STANDARDS[1];
  const scope = SCOPES.find((x) => x.id === s.scope) ?? SCOPES[2];
  const build = s.area * type.rate * std.factor;
  const fee = build * 0.135 * scope.share;
  const planMonths = Math.round(5 + s.area / 350);
  const buildMonths = type.id === "innen" ? Math.round(2 + s.area / 300) : Math.round(8 + s.area / 260);
  return {
    buildLow: round(build * 0.88),
    buildHigh: round(build * 1.12),
    feeLow: round(fee * 0.9),
    feeHigh: round(fee * 1.1),
    planMonths,
    buildMonths,
    floors: Math.min(7, Math.max(1, Math.round(s.area / type.perFloor))),
  };
}

/* ------------------------------------------------------------------ */
/* Axonometrisches Volumen, das mit der Fläche wächst                   */
/* ------------------------------------------------------------------ */
function Massing({ area, floors }: { area: number; floors: number }) {
  const [v, setV] = useState({ side: 60, floors: 1 });
  const ref = useRef({ side: 60, floors: 1 });

  useEffect(() => {
    const side = Math.min(150, 34 + Math.sqrt(area / floors) * 4.2);
    const t = gsap.to(ref.current, {
      side,
      floors,
      duration: prefersReducedMotion() ? 0 : 1.1,
      ease: "expo.out",
      onUpdate: () => setV({ ...ref.current }),
    });
    return () => {
      t.kill();
    };
  }, [area, floors]);

  const cos = Math.cos(Math.PI / 6);
  const sin = 0.5;
  const iso = (x: number, y: number, z: number) => [200 + (x - y) * cos, 300 + (x + y) * sin - z] as const;
  const s = v.side;
  const fh = 26;
  const h = v.floors * fh;
  const pts = (arr: (readonly [number, number])[]) => arr.map((p) => p.join(",")).join(" ");
  const top = [iso(0, 0, h), iso(s, 0, h), iso(s, s, h), iso(0, s, h)];
  const left = [iso(0, s, 0), iso(s, s, 0), iso(s, s, h), iso(0, s, h)];
  const right = [iso(s, 0, 0), iso(s, s, 0), iso(s, s, h), iso(s, 0, h)];
  const lines = Array.from({ length: Math.max(0, Math.floor(v.floors) - 1) }, (_, i) => (i + 1) * fh);
  const ground = [iso(-40, -40, 0), iso(s + 40, -40, 0), iso(s + 40, s + 40, 0), iso(-40, s + 40, 0)];

  return (
    <svg viewBox="0 0 400 360" className="h-auto w-full" aria-hidden>
      <polygon points={pts(ground)} fill="none" stroke="var(--color-line)" strokeDasharray="3 5" />
      <polygon points={pts(left)} fill="#2a2721" stroke="var(--color-paper)" strokeOpacity="0.5" strokeWidth="0.8" />
      <polygon points={pts(right)} fill="#1c1a16" stroke="var(--color-paper)" strokeOpacity="0.5" strokeWidth="0.8" />
      <polygon points={pts(top)} fill="var(--color-bronze)" fillOpacity="0.85" stroke="var(--color-paper)" strokeWidth="0.8" />
      {lines.map((z) => (
        <g key={z} stroke="var(--color-paper)" strokeOpacity="0.28" strokeWidth="0.8">
          <polyline points={pts([iso(0, s, z), iso(s, s, z), iso(s, 0, z)])} fill="none" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
function Option({
  name,
  value,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={`group flex cursor-pointer items-center justify-between gap-6 border px-6 py-5 transition-colors duration-500 ${
        checked ? "border-bronze bg-bronze/10" : "border-line hover:border-paper/40"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span>
        <span className="display block text-2xl md:text-3xl">{label}</span>
        {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? "border-bronze bg-bronze" : "border-line group-hover:border-paper/40"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-ink" />}
      </span>
    </label>
  );
}

export function Planner() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [s, setS] = useState<State>({ area: 180 });
  const result = useMemo(() => estimate(s), [s]);
  const type = TYPES.find((t) => t.id === s.type);
  const done = step >= STEPS.length;

  const canNext = [!!s.type, s.area > 0, !!s.standard, !!s.scope, !!s.time][step] ?? true;
  const go = (n: number) => startTransition(() => setStep(n));

  const pick = <K extends keyof State>(k: K, v: State[K]) => {
    setS((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "type") {
        const t = TYPES.find((x) => x.id === v)!;
        next.area = Math.min(t.max, Math.max(t.min, prev.area));
      }
      return next;
    });
  };

  const send = () => {
    const summary = [
      `Projektart: ${type?.label}`,
      `Fläche: ca. ${s.area} m²`,
      `Standard: ${STANDARDS.find((x) => x.id === s.standard)?.label}`,
      `Leistung: ${SCOPES.find((x) => x.id === s.scope)?.label}`,
      `Zeitplan: ${TIMES.find((x) => x.id === s.time)?.label}`,
      result ? `Orientierung Baukosten: ${eur(result.buildLow)} – ${eur(result.buildHigh)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      sessionStorage.setItem("planer", summary);
    } catch {}
    router.push("/kontakt");
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      {/* Schritte */}
      <div className="lg:col-span-7">
        <ol className="mb-12 flex gap-2" aria-label="Fortschritt">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={i > step && !done}
                onClick={() => go(i)}
                className="group block w-full text-left disabled:cursor-not-allowed"
                aria-current={i === step ? "step" : undefined}
                aria-label={`Schritt ${i + 1}: ${label}`}
              >
                <span className="block h-px w-full overflow-hidden bg-line">
                  <span
                    className="block h-full origin-left bg-paper transition-transform duration-700 ease-[var(--ease-expo)]"
                    style={{ transform: `scaleX(${i < step || done ? 1 : i === step ? 0.5 : 0})` }}
                  />
                </span>
                <span className={`mt-3 hidden text-xs sm:block ${i <= step || done ? "text-paper" : "text-muted"}`}>
                  {String(i + 1).padStart(2, "0")} {label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <ViewTransition key={step} enter="step-in" exit="step-out" default="none">
          <fieldset className="min-h-[420px]">
            {step === 0 && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Was möchten Sie bauen?</legend>
                <div className="grid gap-3">
                  {TYPES.map((t) => (
                    <Option key={t.id} name="type" value={t.id} checked={s.type === t.id} onChange={() => pick("type", t.id)} label={t.label} hint={t.hint} />
                  ))}
                </div>
              </>
            )}
            {step === 1 && type && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Wie groß soll es werden?</legend>
                <p className="display text-7xl tabular-nums md:text-8xl">
                  {s.area.toLocaleString("de-DE")} <span className="text-3xl text-muted">m²</span>
                </p>
                <label htmlFor="area" className="sr-only">
                  Fläche in Quadratmetern
                </label>
                <input
                  id="area"
                  type="range"
                  min={type.min}
                  max={type.max}
                  step={10}
                  value={s.area}
                  onChange={(e) => pick("area", Number(e.target.value))}
                  className="mt-10 w-full accent-[var(--color-bronze)]"
                />
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>{type.min} m²</span>
                  <span>{type.max.toLocaleString("de-DE")} m²</span>
                </div>
                <p className="mt-10 max-w-md text-sm leading-relaxed text-muted">
                  Gemeint ist die Brutto-Grundfläche – also alle Geschosse zusammen. Eine grobe Schätzung genügt.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Welcher Standard?</legend>
                <div className="grid gap-3">
                  {STANDARDS.map((t) => (
                    <Option key={t.id} name="standard" value={t.id} checked={s.standard === t.id} onChange={() => pick("standard", t.id)} label={t.label} hint={t.hint} />
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Wie weit sollen wir Sie begleiten?</legend>
                <div className="grid gap-3">
                  {SCOPES.map((t) => (
                    <Option key={t.id} name="scope" value={t.id} checked={s.scope === t.id} onChange={() => pick("scope", t.id)} label={t.label} hint={t.hint} />
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Wann möchten Sie starten?</legend>
                <div className="grid gap-3">
                  {TIMES.map((t) => (
                    <Option key={t.id} name="time" value={t.id} checked={s.time === t.id} onChange={() => pick("time", t.id)} label={t.label} />
                  ))}
                </div>
              </>
            )}
            {done && result && (
              <>
                <legend className="display mb-8 text-4xl md:text-5xl">Ihre erste Einschätzung</legend>
                <p className="max-w-lg leading-relaxed text-paper/75">
                  Auf Basis Ihrer Angaben rechnen wir mit Baukosten zwischen{" "}
                  <strong className="font-normal text-paper">{eur(result.buildLow)}</strong> und{" "}
                  <strong className="font-normal text-paper">{eur(result.buildHigh)}</strong>. Im Gespräch klären wir, was diese Spanne beeinflusst – und wo sich sparen lässt, ohne an Qualität zu verlieren.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={send}
                    className="inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 text-sm text-ink transition-colors hover:bg-bronze"
                  >
                    Anfrage mit diesen Angaben senden →
                  </button>
                  <button type="button" onClick={() => go(0)} className="rounded-full border border-line px-7 py-4 text-sm hover:border-paper/50">
                    Neu beginnen
                  </button>
                </div>
              </>
            )}
          </fieldset>
        </ViewTransition>

        {!done && (
          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="text-sm text-muted hover:text-paper disabled:opacity-0">
              ← Zurück
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 text-sm text-ink transition-all hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-30"
            >
              {step === STEPS.length - 1 ? "Einschätzung ansehen" : "Weiter"} →
            </button>
          </div>
        )}
      </div>

      {/* Live-Einschätzung */}
      <aside className="lg:col-span-4 lg:col-start-9" aria-live="polite">
        <div className="border border-line bg-ink-2 p-6 lg:sticky lg:top-28 md:p-8">
          <p className="eyebrow text-muted">Live-Einschätzung</p>
          <div className="my-4">
            <Massing area={s.area} floors={result?.floors ?? 1} />
          </div>
          {result ? (
            <dl className="space-y-5 text-sm">
              <div className="border-t border-line pt-4">
                <dt className="text-muted">Baukosten (KG 300 + 400)</dt>
                <dd className="display mt-1 text-2xl tabular-nums md:text-3xl">
                  {eur(result.buildLow)} – {eur(result.buildHigh)}
                </dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-muted">Architektenhonorar</dt>
                <dd className="display mt-1 text-2xl tabular-nums">
                  {eur(result.feeLow)} – {eur(result.feeHigh)}
                </dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-muted">Zeitrahmen</dt>
                <dd className="mt-3">
                  <div className="flex h-2 w-full gap-1">
                    <span className="h-full rounded-full bg-paper/80" style={{ flex: result.planMonths }} />
                    <span className="h-full rounded-full bg-bronze" style={{ flex: result.buildMonths }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>Planung ca. {result.planMonths} Monate</span>
                    <span>Bau ca. {result.buildMonths} Monate</span>
                  </div>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="border-t border-line pt-4 text-sm text-muted">Wählen Sie eine Projektart, um die Einschätzung zu sehen.</p>
          )}
          <p className="mt-6 text-xs leading-relaxed text-muted">
            Unverbindliche Orientierung. In dieser Demo sind alle Werte beispielhaft und ersetzen keine Kostenschätzung nach DIN 276.
          </p>
        </div>
      </aside>
    </div>
  );
}
