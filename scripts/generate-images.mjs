// Generiert die Website-Bilder mit der Gemini API (Google AI Studio).
//
//   npm run images              -> alle noch nicht generierten Bilder
//   npm run images -- haus-am-see   -> nur bestimmte Bilder
//   npm run images -- --force   -> alles neu generieren
//   npm run images -- --test    -> nur ein Testbild
//
// Der Schlüssel wird aus .env.local gelesen (GEMINI_API_KEY=...).
// Optional: GEMINI_IMAGE_MODEL=<modellname>
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { IMAGES } from "./images.mjs";

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
if (!KEY) {
  console.error("GEMINI_API_KEY fehlt. Bitte in .env.local eintragen.");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const test = args.includes("--test");
const only = args.filter((a) => !a.startsWith("--"));

const out = join(process.cwd(), "public", "images");
mkdirSync(out, { recursive: true });
const manifestFile = join(out, "generated.json");
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};

let list = IMAGES.filter((i) => (only.length ? only.includes(i.name) : true));
if (!force && !only.length) list = list.filter((i) => !manifest[i.name]);
if (test) list = list.slice(0, 1);

async function generate(img, attempt = 1) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: img.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: img.aspect } },
      }),
    },
  );
  if (res.status === 429 && attempt <= 3) {
    const wait = 20000 * attempt;
    console.log(`  Limit erreicht, warte ${wait / 1000}s …`);
    await new Promise((r) => setTimeout(r, wait));
    return generate(img, attempt + 1);
  }
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${json.error?.message ?? JSON.stringify(json).slice(0, 300)}`);
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error(`Kein Bild in der Antwort: ${JSON.stringify(json).slice(0, 300)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

console.log(`Modell: ${MODEL} · ${list.length} Bild(er)`);
let ok = 0;
for (const img of list) {
  process.stdout.write(`→ ${img.name} (${img.aspect}) … `);
  try {
    const buf = await generate(img);
    const meta = await sharp(buf).metadata();
    await sharp(buf)
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(out, `${img.name}.jpg`));
    manifest[img.name] = { model: MODEL, width: meta.width, height: meta.height, at: new Date().toISOString() };
    writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    console.log(`ok (${meta.width}×${meta.height})`);
    ok++;
  } catch (e) {
    console.log(`Fehler\n  ${e.message}`);
    if (/quota|billing|not found|permission|API key/i.test(e.message)) break;
  }
}
console.log(`Fertig: ${ok}/${list.length}`);
