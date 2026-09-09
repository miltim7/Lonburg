import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("launch preview has honest contacts and no invented orders or prices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-facts")).toContainText("Новые и с пробегом");
  await expect(page.locator("#russia-selection")).toContainText(
    "Профессиональный подбор",
  );
  await expect(page.locator("#directions")).toContainText(
    "Крупная строительная техника",
  );
  await expect(page.locator(".machinery-gallery figure")).toHaveCount(4);
  await expect(page.locator(".cost-document > .cost-items > li")).toHaveCount(
    4,
  );
  await expect(page.locator(".cost-registration li")).toHaveCount(2);
  await expect(page.locator(".cost-registration")).toContainText(
    "самостоятельно",
  );
  await expect(page.locator("#contacts .contact-placeholder")).toHaveCount(0);
  await expect(page.locator('#contacts a[href^="tel:"]')).toHaveAttribute(
    "href",
    "tel:+79111365346",
  );
  await expect(page.locator('#contacts a[href^="mailto:"]')).toHaveAttribute(
    "href",
    "mailto:bovart.1979@gmail.com",
  );
  await expect(page.locator('a[href*="t.me/"]')).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(
    /Алексей|52 дня|Демонстрационная смета|₽/,
  );
  await expect(page.locator("#contacts")).not.toContainText(
    "Заменим перед запуском",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const tabs = (await page.locator(".vehicle-tabs").boundingBox())!;
  const photos = (await page.locator(".vehicle-panels").boundingBox())!;
  expect(Math.abs(tabs.width - photos.width)).toBeLessThan(1);
  expect(tabs.height).toBeLessThan(300);
});

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
      .poll(
        () =>
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
        { timeout: 15000 },
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
  const first = page.locator(".faq-trigger").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-trigger").first()).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.locator(".faq-trigger").nth(1).click();
  await expect(page.locator('.faq-trigger[aria-expanded="true"]')).toHaveCount(
    1,
  );
});

test("form validates and submits a Netlify Forms request", async ({ page }) => {
  const submissions: string[] = [];
  await page.route("**/", async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      submissions.push(request.postData() ?? "");
      await route.fulfill({ status: 200, body: "" });
      return;
    }
    await route.fallback();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.locator(".field-error")).toHaveCount(3);
  await expect(page.getByLabel("Марка / модель")).toBeFocused();
  await page.getByLabel("Марка / модель").fill("Тестовая модель");
  await page.getByLabel("Состояние").fill("Новый");
  await page.getByLabel("Год выпуска").fill("2026");
  await page.getByLabel("Мощность").fill("180 л.с.");
  await page.getByLabel("Объём двигателя").fill("1.5 л");
  await page.getByLabel("Город доставки").fill("Казань");
  await expect(page.getByLabel("Ваше имя")).toBeHidden();
  await page.getByLabel("Телефон / Telegram").fill("не контакт");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.locator("#error-contact")).toBeVisible();
  await page.getByLabel("Телефон / Telegram").fill("@example_user");
  await page.getByText("Добавить оформление и пожелания").click();
  await page.getByLabel("Таможня и утильсбор").fill("Через Лонбург");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByRole("status")).toContainText("Заявка отправлена");
  await expect(
    page.getByRole("button", { name: "Отправить заявку" }),
  ).toBeEnabled();
  expect(submissions).toHaveLength(1);
  const submitted = new URLSearchParams(submissions[0]);
  expect(submitted?.get("form-name")).toBe("lonburg-request");
  expect(submitted?.get("model")).toBe("Тестовая модель");
  expect(submitted?.get("condition")).toBe("Новый");
  expect(submitted?.get("year")).toBe("2026");
  expect(submitted?.get("power")).toBe("180 л.с.");
  expect(submitted?.get("engineVolume")).toBe("1.5 л");
  expect(submitted?.get("city")).toBe("Казань");
  expect(submitted?.get("contact")).toBe("@example_user");
  expect(submitted?.get("registration")).toBe("Через Лонбург");
});

test("accessibility of desktop, mobile menu, expanded FAQ and invalid form", async ({
  page,
}) => {
  // Audit final colors and semantics; motion.spec.ts exercises the actual transitions.
  // Scroll reveals otherwise let axe sample text halfway through an opacity fade.
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await page.locator(".faq-trigger").first().click();
  await page.getByRole("button", { name: "Отправить заявку" }).click();
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
