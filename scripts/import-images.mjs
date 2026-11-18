// Übernimmt neue Bilder aus public/images/_neu/ in die Website:
// prüft Namen und Seitenverhältnis, schneidet auf das Zielformat zu,
// verkleinert auf max. 2400 px und speichert als optimiertes JPG.
// Aufruf: npm run import-images
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync, readFileSync } from "node:fs";
import { join, parse } from "node:path";
import { IMAGES } from "./images.mjs";

const root = join(process.cwd(), "public", "images");
const inbox = join(root, "_neu");
const done = join(inbox, "_uebernommen");
if (!existsSync(inbox)) {
  console.error("Ordner public/images/_neu/ fehlt.");
  process.exit(1);
}
mkdirSync(done, { recursive: true });

const manifestFile = join(root, "generated.json");
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};
const byName = new Map(IMAGES.map((i) => [i.name, i]));
const files = readdirSync(inbox).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

let ok = 0;
const unknown = [];
for (const file of files) {
  // Erlaubt auch "01-haus-am-see.png" oder "Haus-am-See.PNG"
  const base = parse(file).name.toLowerCase().replace(/^\d+[\s._-]*/, "").replace(/\s+/g, "-");
  const img = byName.get(base);
  if (!img) {
    unknown.push(file);
    continue;
  }
  const [aw, ah] = img.aspect.split(":").map(Number);
  const src = join(inbox, file);
  const meta = await sharp(src).metadata();
  const width = Math.min(2400, meta.width ?? 2400);
  await sharp(src)
    .resize({ width, height: Math.round((width * ah) / aw), fit: "cover", position: "attention" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(root, `${img.name}.jpg`));
  renameSync(src, join(done, file));
  manifest[img.name] = { source: file, width: meta.width, height: meta.height, at: new Date().toISOString() };
  console.log(`✓ ${img.name}  (${meta.width}×${meta.height} → ${img.aspect})`);
  ok++;
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

const missing = IMAGES.filter((i) => !manifest[i.name]).map((i) => i.name);
console.log(`\n${ok} Bild(er) übernommen.`);
if (unknown.length) console.log(`Unbekannte Dateinamen (nicht übernommen): ${unknown.join(", ")}`);
console.log(missing.length ? `Noch fehlend (${missing.length}): ${missing.join(", ")}` : "Alle Bilder sind echt – keine Platzhalter mehr.");
