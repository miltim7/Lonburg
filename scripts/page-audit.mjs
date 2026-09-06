import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const phase = process.argv[2] || "after";
if (!/^[a-z-]+$/.test(phase)) throw new Error("Invalid audit name");
const directory = `output/audit-${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:3000");
await page.evaluate(() => document.fonts.ready);
const sections = page.locator("main section");
const report = [];
for (let i = 0; i < (await sections.count()); i++) {
  const section = sections.nth(i);
  await section.scrollIntoViewIfNeeded();
  await section
    .locator("img")
    .evaluateAll((images) =>
      Promise.all(images.map((img) => img.decode().catch(() => {}))),
    );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const name =
    (await section.getAttribute("id")) || (i === 0 ? "hero" : "final");
  await section.screenshot({
    path: `${directory}/${String(i).padStart(2, "0")}-${name}.png`,
  });
  report.push(
    await section.evaluate((el) => ({
      section: el.id || el.className,
      heading: el.querySelector("h1,h2")?.textContent,
      height: Math.round(el.getBoundingClientRect().height),
      copy: [...el.querySelectorAll("p,h3,label,a,button")].map((item) => ({
        text: item.textContent?.trim().slice(0, 120),
        font: getComputedStyle(item).fontSize,
        lineHeight: getComputedStyle(item).lineHeight,
      })),
    })),
  );
}
await page.locator("footer").screenshot({ path: `${directory}/11-footer.png` });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.screenshot({
  path: `${directory}/full-desktop.png`,
  fullPage: true,
});
await writeFile(
  `${directory}/typography.json`,
  JSON.stringify(report, null, 2),
);
await browser.close();
console.log(`Captured ${report.length} sections and footer in ${directory}`);
