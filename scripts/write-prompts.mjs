// Schreibt IMAGE-PROMPTS.md aus scripts/images.mjs (eine Quelle für alle Prompts).
// Aufruf: node scripts/write-prompts.mjs
import { writeFileSync } from "node:fs";
import { IMAGES } from "./images.mjs";

const lines = [
  "# Image prompts – Ostlicht demo",
  "",
  "Generate each image below with the image generation tool.",
  "",
  "Rules:",
  "- Save every image into the folder `public/images/_neu/`.",
  "- File name = the name in the heading, e.g. `haus-am-see.png` (PNG, JPG or WEBP are all fine).",
  "- Use the given aspect ratio (16:9 = landscape, 4:5 = portrait), as large as possible.",
  "- Same calm photographic style for all images. No people, no text, no logos, no watermarks.",
  "- Do not change any other file in the project.",
  "",
];

IMAGES.forEach((img, i) => {
  lines.push(`## ${String(i + 1).padStart(2, "0")} · ${img.name}`);
  lines.push("");
  lines.push(`- File: \`public/images/_neu/${img.name}.png\``);
  lines.push(`- Aspect ratio: ${img.aspect} (${img.aspect === "16:9" ? "landscape" : "portrait"})`);
  lines.push("");
  lines.push("```text");
  lines.push(img.prompt);
  lines.push("```");
  lines.push("");
});

writeFileSync("IMAGE-PROMPTS.md", lines.join("\n"));
console.log(`IMAGE-PROMPTS.md mit ${IMAGES.length} Prompts geschrieben`);
