import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

test("all required widths have no overflow, broken images, or console errors", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const width of [1600, 1440, 1280, 1024, 768, 430, 390, 375, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `overflow at ${width}`,
    ).toBeTruthy();
    const sections = page.locator("main section");
    for (let i = 0; i < (await sections.count()); i++) {
      await sections.nth(i).scrollIntoViewIfNeeded();
    }
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
          ),
      )
      .toBeTruthy();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `test-results/width-${width}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("mobile menu supports keyboard focus, Escape and anchor navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Открыть меню" });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Закрыть меню" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Закрыть меню" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#mobile-menu a").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await toggle.click();
  await page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Стоимость", exact: false })
    .click();
  await expect(page).toHaveURL(/#cost$/);
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.locator("#cost")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("vehicle tabs and FAQ work with keyboard", async ({ page }) => {
  await page.goto("/");
  const electric = page.getByRole("tab", { name: /Электромобили/ });
  await electric.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /Гибриды/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText("Обсудить гибрид");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Бензиновые/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const first = page.locator(".faq-list summary").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-list details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".faq-list summary").nth(1).click();
  await expect(page.locator(".faq-list details[open]")).toHaveCount(1);
});

test("form validates, never fakes sending, and downloads the real local draft", async ({
  page,
}) => {
  const sent: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") sent.push(request.url());
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Сохранить запрос", exact: true })
    .click();
  await expect(page.locator(".field-error")).toHaveCount(3);
  await expect(page.getByLabel("Марка / модель")).toBeFocused();
  await page.getByLabel("Марка / модель").fill("Тестовая модель");
  await page.getByLabel("Город доставки").fill("Казань");
  await expect(page.getByLabel("Ваше имя")).toBeHidden();
  await page.getByLabel("Телефон / Telegram").fill("не контакт");
  await page
    .getByRole("button", { name: "Сохранить запрос", exact: true })
    .click();
  await expect(page.locator("#error-contact")).toBeVisible();
  await page.getByLabel("Телефон / Telegram").fill("@example_user");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Сохранить запрос" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("lonburg-request.txt");
  const path = await download.path();
  expect(path).toBeTruthy();
  const draft = await readFile(path!, "utf8");
  expect(draft).toContain("Тестовая модель");
  expect(draft).toContain("Казань");
  expect(draft).toContain("Черновик, не отправлен");
  await expect(page.getByRole("status")).toContainText("Он не отправлен");
  await expect(page.getByRole("button", { name: "Сохранить запрос" })).toBeEnabled();
  expect(sent).toEqual([]);
});

test("accessibility of desktop, mobile menu, expanded FAQ and invalid form", async ({
  page,
}) => {
  await page.goto("/");
  // Audit the fully rendered interface, not the intermediate opacity of the entrance animation.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.locator(".faq-list summary").first().click();
  await page
    .getByRole("button", { name: "Сохранить запрос", exact: true })
    .click();
  result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("reduced motion, metadata and real anchors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
  await expect(page).toHaveTitle(
    "Автомобили из Китая под заказ с доставкой по России | Лонбург",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Лонбург/,
  );
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((anchors) =>
      anchors
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && h !== "#" && !document.getElementById(h.slice(1))),
    );
  expect(missing).toEqual([]);
  expect((await page.request.get("/robots.txt")).ok()).toBeTruthy();
  expect((await page.request.get("/sitemap.xml")).ok()).toBeTruthy();
});
