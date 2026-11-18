"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * WebGL-Bühne für den Hero: organischer Übergang zwischen Bildern (Noise-Dissolve
 * mit Verzerrung), langsamer Zoom, Linse unter dem Mauszeiger und feines Korn.
 * Rendert nur, wenn der Hero sichtbar ist. Fällt still auf die Bilder darunter
 * zurück, wenn WebGL fehlt.
 */

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform vec2 uRes;
uniform vec2 uSize0;
uniform vec2 uSize1;
uniform float uProgress;
uniform float uTime;
uniform float uZoom0;
uniform float uZoom1;
uniform vec2 uMouse;
uniform float uHover;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float f = 0.0;
  f += 0.5 * snoise(p); p *= 2.02;
  f += 0.25 * snoise(p); p *= 2.03;
  f += 0.125 * snoise(p);
  return f * 0.5 + 0.5;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec2 cover(vec2 uv, vec2 size, float zoom) {
  float rs = uRes.x / uRes.y;
  float ri = size.x / size.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s / zoom + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);

  // Linse unter dem Mauszeiger
  float d = distance(uv * aspect, uMouse * aspect);
  float lens = smoothstep(0.42, 0.0, d) * uHover;
  uv -= (uv - uMouse) * lens * 0.07;

  // Organische Übergangsmaske
  float n = fbm(uv * vec2(2.4, 1.6) + vec2(0.0, uTime * 0.04));
  float w = 0.18;
  float thr = mix(-w, 1.0 + w, uProgress);
  float k = 1.0 - smoothstep(thr - w, thr + w, n);

  // Verzerrung entlang der Kante
  float edge = 1.0 - abs(k - 0.5) * 2.0;
  vec2 dir = vec2(0.0, (n - 0.5) * 0.9);
  vec2 uv0 = uv + dir * uProgress * 0.22 + vec2(0.0, edge * 0.015);
  vec2 uv1 = uv - dir * (1.0 - uProgress) * 0.22;

  vec4 c0 = texture2D(uTex0, cover(uv0, uSize0, uZoom0));
  vec4 c1 = texture2D(uTex1, cover(uv1, uSize1, uZoom1));
  vec3 col = mix(c0.rgb, c1.rgb, k);

  // Leichter Lichtsaum an der Übergangskante
  col += vec3(0.85, 0.72, 0.55) * pow(edge, 6.0) * 0.12 * step(0.001, uProgress) * step(uProgress, 0.999);

  // Korn
  col += (hash(vUv * uRes + fract(uTime) * 100.0) - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}`;

type Props = {
  sources: string[];
  index: number;
  onReady: () => void;
};

function optimized(src: string) {
  // Passende Breite aus den Next.js-deviceSizes wählen (Handy lädt kleinere Texturen)
  const need = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);
  const w = [828, 1080, 1200, 1920].find((s) => s >= need) ?? 1920;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}

/**
 * WebGL startet erst bei der ersten Interaktion (Maus, Touch, Scrollen, Taste)
 * oder spätestens nach einigen Sekunden. Bis dahin übernimmt die CSS-Überblendung –
 * so kostet der Effekt beim Laden der Seite nichts.
 */
let engaged = false;
function whenEngaged() {
  return new Promise<void>((resolve) => {
    // Schon einmal interagiert (z. B. Rückkehr auf die Startseite): sofort starten
    if (engaged) {
      requestAnimationFrame(() => resolve());
      return;
    }
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      engaged = true;
      events.forEach((e) => window.removeEventListener(e, go));
      clearTimeout(timer);
      const run = () => resolve();
      if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 800 });
      else setTimeout(run, 50);
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    const timer = setTimeout(go, 9000);
  });
}

export function HeroCanvas({ sources, index, onReady }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<{ goTo: (i: number) => void } | null>(null);
  const latest = useRef(index);

  useEffect(() => {
    // WebGL erst starten, wenn die Seite geladen ist – das Bild darunter ist sofort da
    let dispose: (() => void) | undefined;
    let stopped = false;
    whenEngaged().then(() => {
      if (!stopped) dispose = setup();
    });
    return () => {
      stopped = true;
      dispose?.();
    };

    function setup(): (() => void) | undefined {
    const box = container.current;
    if (!box) return;
    // Bei jedem Start eine neue Leinwand: Next.js hält besuchte Seiten im Hintergrund
    // (Activity). Ein alter, beim Verlassen freigegebener Kontext wäre sonst leer.
    const el = document.createElement("canvas");
    el.setAttribute("aria-hidden", "true");
    el.className = "absolute inset-0 h-full w-full";
    el.style.opacity = "0";
    el.style.transition = "opacity 1s ease";
    box.appendChild(el);
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      el.remove();
      return;
    }

    // --- Shader ---
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      el.remove();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      tex0: u("uTex0"),
      tex1: u("uTex1"),
      res: u("uRes"),
      size0: u("uSize0"),
      size1: u("uSize1"),
      progress: u("uProgress"),
      time: u("uTime"),
      zoom0: u("uZoom0"),
      zoom1: u("uZoom1"),
      mouse: u("uMouse"),
      hover: u("uHover"),
    };
    gl.uniform1i(U.tex0, 0);
    gl.uniform1i(U.tex1, 1);

    // --- Texturen ---
    const textures: { tex: WebGLTexture; w: number; h: number }[] = [];
    // Bilder werden außerhalb des Hauptthreads dekodiert (createImageBitmap)
    // und je Frame nur eine Textur hochgeladen – so bleibt die Seite flüssig.
    const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
    const loadTexture = async (src: string) => {
      const blob = await (await fetch(optimized(src))).blob();
      const bmp = await createImageBitmap(blob, { imageOrientation: "flipY" });
      await nextFrame();
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, bmp);
      const t = { tex, w: bmp.width, h: bmp.height };
      bmp.close();
      return t;
    };

    // --- Zustand ---
    const state = {
      current: 0,
      next: 0,
      progress: 0,
      zoomStart: [performance.now(), performance.now()],
      mouse: { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 },
      hover: 0,
      hoverTarget: 0,
      visible: true,
      ready: false,
      tween: null as gsap.core.Tween | null,
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(U.res, el.width, el.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const zoomFor = (start: number, now: number) => {
      const t = Math.min((now - start) / 9000, 1);
      return 1.0 + 0.07 * (1 - Math.pow(1 - t, 2));
    };

    const bind = (unit: number, i: number) => {
      const t = textures[i];
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.uniform2f(unit === 0 ? U.size0 : U.size1, t.w, t.h);
    };

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!state.ready || !state.visible) return;
      const m = state.mouse;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;
      state.hover += (state.hoverTarget - state.hover) * 0.05;

      bind(0, state.current);
      bind(1, state.next);
      gl.uniform1f(U.progress, state.progress);
      gl.uniform1f(U.time, (now - t0) / 1000);
      gl.uniform1f(U.zoom0, zoomFor(state.zoomStart[0], now));
      gl.uniform1f(U.zoom1, zoomFor(state.zoomStart[1], now));
      gl.uniform2f(U.mouse, m.x, m.y);
      gl.uniform1f(U.hover, state.hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    api.current = {
      goTo(i: number) {
        if (!state.ready || i === state.current) return;
        state.tween?.progress(1);
        state.next = i;
        state.zoomStart[1] = performance.now();
        state.progress = 0;
        state.tween = gsap.to(state, {
          progress: 1,
          duration: 2.1,
          ease: "power2.inOut",
          onComplete: () => {
            state.current = i;
            state.zoomStart[0] = state.zoomStart[1];
            state.progress = 0;
          },
        });
      },
    };

    // Maus – auf der ganzen Hero-Sektion (der Text liegt über der Leinwand)
    const host = (box.closest("section") as HTMLElement | null) ?? box;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      state.mouse.tx = (e.clientX - r.left) / r.width;
      state.mouse.ty = 1 - (e.clientY - r.top) / r.height;
      state.hoverTarget = e.pointerType === "mouse" ? 1 : 0;
    };
    const onLeave = () => (state.hoverTarget = 0);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    // Nur rendern, wenn sichtbar
    const io = new IntersectionObserver(([entry]) => (state.visible = entry.isIntersecting));
    io.observe(el);

    // Erst das erste Bild laden, dann den Rest
    let cancelled = false;
    (async () => {
      try {
        for (let i = 0; i < sources.length; i++) {
          if (cancelled) return;
          textures[i] = await loadTexture(sources[i]);
        }
        if (cancelled) return;
        // Mit dem Bild starten, das die CSS-Überblendung gerade zeigt
        state.current = state.next = latest.current;
        state.ready = true;
        requestAnimationFrame(() => (el.style.opacity = "1"));
        onReady();
      } catch {
        /* Fallback: die Bilder darunter bleiben sichtbar */
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      state.tween?.kill();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      api.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      el.remove();
    };
    }
  }, [sources, onReady]);

  useEffect(() => {
    latest.current = index;
    api.current?.goTo(index);
  }, [index]);

  return <div ref={container} className="absolute inset-0" />;
}
