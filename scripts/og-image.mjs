// Erzeugt das Vorschaubild für geteilte Links (WhatsApp, LinkedIn, Slack …)
// Aufruf: node scripts/og-image.mjs
import sharp from "sharp";

const W = 1200;
const H = 630;
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#0d0c0a" stop-opacity="0"/>
      <stop offset="1" stop-color="#0d0c0a" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g transform="translate(64 64)">
    <rect x="1" y="1" width="34" height="34" fill="none" stroke="#ece5da" stroke-width="2"/>
    <path d="M18 1 V35 M18 18 H35" stroke="#ece5da" stroke-width="2"/>
    <circle cx="26.5" cy="9.5" r="4" fill="#c4a47c"/>
    <text x="56" y="26" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="7" fill="#ece5da">OSTLICHT</text>
  </g>
  <text x="64" y="500" font-family="Georgia, 'Times New Roman', serif" font-size="92" fill="#ece5da">Räume, die <tspan font-style="italic">bleiben.</tspan></text>
  <text x="64" y="562" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" fill="#ece5da" fill-opacity="0.7">ARCHITEKTURSTUDIO · BERLIN</text>
</svg>`);

await sharp("public/images/haus-am-see.jpg")
  .resize(W, H, { fit: "cover", position: "centre" })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("src/app/opengraph-image.jpg");
console.log("src/app/opengraph-image.jpg erstellt");
