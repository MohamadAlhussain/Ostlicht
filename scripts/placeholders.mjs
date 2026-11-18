// Erzeugt ruhige Platzhalterbilder, bis die echten Bilder generiert sind.
// Aufruf: node scripts/placeholders.mjs   (überschreibt keine vorhandenen Bilder)
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { IMAGES } from "./images.mjs";

const out = join(process.cwd(), "public", "images");
mkdirSync(out, { recursive: true });

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function svg(name, i) {
  const r = rand(i * 7919 + 17);
  const W = 2000;
  const H = 1333;
  const hue = 25 + r() * 25;
  const sky1 = `hsl(${hue} 22% ${18 + r() * 10}%)`;
  const sky2 = `hsl(${hue + 10} 30% ${48 + r() * 14}%)`;
  const ground = H * (0.62 + r() * 0.12);
  let blocks = "";
  let x = -50 + r() * 200;
  while (x < W) {
    const w = 180 + r() * 520;
    const h = 160 + r() * 520;
    const l = 8 + r() * 14;
    blocks += `<rect x="${x}" y="${ground - h}" width="${w}" height="${h + 4}" fill="hsl(${hue} 12% ${l}%)"/>`;
    const cols = Math.floor(w / 70);
    const rows = Math.floor(h / 90);
    for (let c = 0; c < cols; c++)
      for (let rr = 0; rr < rows; rr++)
        if (r() > 0.55)
          blocks += `<rect x="${x + 22 + c * 70}" y="${ground - h + 30 + rr * 90}" width="34" height="50" fill="hsl(${hue + 15} 70% ${55 + r() * 20}%)" opacity="${0.25 + r() * 0.5}"/>`;
    x += w + r() * 160;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient>
    <radialGradient id="g" cx="${0.2 + r() * 0.6}" cy="${0.35 + r() * 0.2}" r="0.45"><stop offset="0" stop-color="hsl(${hue + 10} 80% 80%)" stop-opacity="0.55"/><stop offset="1" stop-color="hsl(${hue} 80% 70%)" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#s)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${blocks}
  <rect y="${ground}" width="${W}" height="${H - ground}" fill="hsl(${hue} 10% 7%)"/>
  <text x="60" y="${H - 60}" font-family="Arial" font-size="34" fill="#ffffff" opacity="0.35">${name}</text>
</svg>`;
}

let made = 0;
for (const [i, img] of IMAGES.entries()) {
  const file = join(out, `${img.name}.jpg`);
  if (existsSync(file)) continue;
  await sharp(Buffer.from(svg(img.name, i + 1)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
  made++;
}
console.log(`${made} Platzhalter erstellt in ${out}`);
