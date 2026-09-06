import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
});
const page = await browser.newPage({ reducedMotion: "reduce" });
await mkdir("output/screenshots", { recursive: true });
for (const [label, width, height] of [
  ["desktop", 1440, 960],
  ["mobile", 390, 844],
  ["small-mobile", 360, 800],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://localhost:3000");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".hero-image img").evaluate((img) => img.decode());
  await page.screenshot({ path: `output/screenshots/${label}-hero.png` });
  if (label === "mobile")
    console.log(
      await page
        .locator(".hero-image img")
        .evaluate((img) => ({
          src: img.currentSrc,
          rect: img.getBoundingClientRect().toJSON(),
          style: getComputedStyle(img).cssText,
          naturalWidth: img.naturalWidth,
        })),
    );
  await page.locator("#vehicles").scrollIntoViewIfNeeded();
  await page.locator(".vehicle-panel img").evaluate((img) => img.decode());
  await page.screenshot({ path: `output/screenshots/${label}-vehicles.png` });
  if (label === "desktop") {
    await page.getByRole("tab", { name: /Гибриды/ }).click();
    await page.locator(".vehicle-panel img").evaluate((img) => img.decode());
    await page.screenshot({ path: "output/screenshots/desktop-hybrid.png" });
  }
}
await browser.close();
