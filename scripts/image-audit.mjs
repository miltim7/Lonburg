import sharp from "sharp";
import { readFile, writeFile, stat, mkdir } from "node:fs/promises";

// Regenerate the six tiny placeholders without recompressing approved photographs.
const file = "src/data/images.ts";
let source = await readFile(file, "utf8");
const report = [];
for (const match of source.matchAll(/src: "(\/images\/[^\"]+)"/g)) {
  const path = `public${match[1]}`;
  const { width, height, format } = await sharp(path).metadata();
  const preview = await sharp(path)
    .resize(8, 5, { fit: "inside" })
    .webp({ quality: 35 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${preview.toString("base64")}`;
  const escaped = match[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  source = source.replace(
    new RegExp(
      `src: "${escaped}",\\r?\\n(?:    blurDataURL:\\s*"[^\"]+",\\r?\\n)?`,
    ),
    `src: "${match[1]}",\n    blurDataURL: "${blurDataURL}",\n`,
  );
  report.push({
    path,
    width,
    height,
    format,
    bytes: (await stat(path)).size,
    placeholderBytes: preview.length,
  });
}
await writeFile(file, source);
await mkdir("output/motion-audit", { recursive: true });
await writeFile(
  "output/motion-audit/image-sources.json",
  JSON.stringify(report, null, 2),
);
console.log(report);
