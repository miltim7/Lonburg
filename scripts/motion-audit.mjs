import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const origin = "http://localhost:3000";
const auditName = process.argv[2] || "motion";
if (!/^[a-z-]+$/.test(auditName)) throw new Error("Invalid audit name");
const directory = `output/${auditName}-audit`;
await mkdir(directory, { recursive: true });
let server;
let browser;
try {
  if (
    !(await fetch(origin)
      .then((response) => response.ok)
      .catch(() => false))
  ) {
    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start"],
      {
        windowsHide: true,
        stdio: "ignore",
      },
    );
    for (let attempt = 0; attempt < 100; attempt++) {
      if (
        await fetch(origin)
          .then((response) => response.ok)
          .catch(() => false)
      )
        break;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  });
  const reports = [];
  for (const [name, width, height, dpr, mobile] of [
    ["desktop", 1440, 960, 1, false],
    ["mobile", 390, 844, 2, true],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: dpr,
      isMobile: mobile,
      hasTouch: mobile,
    });
    const errors = [];
    const responses = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.url().includes("/_next/image"))
        responses.push({
          url: response.url(),
          status: response.status(),
          format: response.headers()["content-type"],
        });
    });
    await page.addInitScript(() => {
      window.__audit = { shifts: [], longTasks: [], lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput)
            window.__audit.shifts.push({
              value: entry.value,
              time: entry.startTime,
              sources: entry.sources.map(
                (source) => source.node?.className ?? source.node?.nodeName,
              ),
            });
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        window.__audit.longTasks.push(
          ...list.getEntries().map((entry) => ({
            duration: entry.duration,
            time: entry.startTime,
          })),
        );
      }).observe({ type: "longtask", buffered: true });
      new PerformanceObserver((list) => {
        window.__audit.lcp = list.getEntries().at(-1)?.startTime ?? 0;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".hero-image img").evaluate((image) => image.decode());
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => {})),
      ),
    );
    await page.screenshot({ path: `${directory}/${name}-hero.png` });
    const initialLcp = await page.evaluate(() => window.__audit.lcp);

    // A bounded diagnostic traversal, not a loop shipped to site visitors.
    const frames = await page.evaluate(async () => {
      const intervals = [];
      const start = performance.now();
      let previous = start;
      const distance = document.documentElement.scrollHeight - innerHeight;
      await new Promise((resolve) => {
        const step = (time) => {
          intervals.push(time - previous);
          previous = time;
          const progress = Math.min((time - start) / 6500, 1);
          scrollTo({ top: distance * progress, behavior: "instant" });
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      return { start, end: performance.now(), intervals: intervals.slice(1) };
    });
    await page
      .locator("img")
      .evaluateAll((images) =>
        Promise.all(images.map((image) => image.decode())),
      );
    const imageReport = await page.locator("img").evaluateAll((images) =>
      images.map((image) => ({
        alt: image.alt,
        src: image.currentSrc,
        sizes: image.sizes,
        loading: image.loading,
        cssWidth: image.getBoundingClientRect().width,
        selectedWidth: new URL(image.currentSrc).searchParams.get("w"),
        complete: image.complete && image.naturalWidth > 0,
      })),
    );
    // Performance above uses real motion; screenshots inspect the fully revealed design.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const id of [
      "vehicles",
      "process",
      "cost",
      "estimate",
      "timing",
      "contracts",
      "delivery",
      "approach",
      "faq",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((a) => a.finished.catch(() => {})),
        ),
      );
      await page.locator(`#${id}`).screenshot({
        path: `${directory}/${name}-${id}.png`,
        style: ".header, .skip-link { visibility: hidden !important; }",
      });
    }
    await page.locator(".faq-trigger").first().click();
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => {})),
      ),
    );
    await page.locator("#faq").screenshot({
      path: `${directory}/${name}-faq-open.png`,
      style: ".header, .skip-link { visibility: hidden !important; }",
    });
    for (const [label, selector] of [
      ["final", ".final-cta"],
      ["footer", "#footer"],
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.locator(selector).screenshot({
        path: `${directory}/${name}-${label}.png`,
        style: ".header, .skip-link { visibility: hidden !important; }",
      });
    }
    const metrics = await page.evaluate(() => window.__audit);
    const sorted = frames.intervals.toSorted((a, b) => a - b);
    reports.push({
      name,
      viewport: { width, height, dpr },
      cls: metrics.shifts.reduce((sum, entry) => sum + entry.value, 0),
      shifts: metrics.shifts,
      lcpMs: initialLcp,
      scroll: {
        samples: sorted.length,
        medianFrameMs: sorted[Math.floor(sorted.length / 2)],
        p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
        framesOver50ms: sorted.filter((ms) => ms > 50).length,
        longTasks: metrics.longTasks.filter(
          (entry) => entry.time >= frames.start && entry.time <= frames.end,
        ),
      },
      images: imageReport,
      responses,
      errors,
    });
    await page.close();
  }
  await writeFile(
    `${directory}/browser-report.json`,
    JSON.stringify(reports, null, 2),
  );
  console.log(
    reports.map(({ name, cls, lcpMs, scroll, errors }) => ({
      name,
      cls,
      lcpMs,
      scroll,
      errors,
    })),
  );
} finally {
  await browser?.close();
  server?.kill();
}
