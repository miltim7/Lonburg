import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`tabs keep their height and handle rapid input at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#vehicles").scrollIntoViewIfNeeded();
    await page
      .locator(".vehicle-panel img")
      .evaluateAll((images) =>
        Promise.all(
          images.map((image) => (image as HTMLImageElement).decode()),
        ),
      );
    const section = page.locator("#vehicles");
    const height = (await section.boundingBox())!.height;
    for (const index of [1, 2, 0, 2, 1, 0]) {
      await page.getByRole("tab").nth(index).click();
      await expect(page.getByRole("tab").nth(index)).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(
        Math.abs((await section.boundingBox())!.height - height),
      ).toBeLessThan(1);
      await expect(page.getByRole("tabpanel")).toHaveCount(1);
    }
    // Dispatch faster than the 350ms transition, including interruptions mid-fade.
    await page.getByRole("tab").evaluateAll(async (tabs) => {
      for (const i of [2, 1, 0, 1, 2]) {
        (tabs[i] as HTMLButtonElement).click();
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
    });
    await expect(page.getByRole("tab").nth(2)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText(
      "Обсудить бензиновый",
    );
    await expect(page.getByRole("tabpanel")).toHaveCSS("opacity", "1");
    expect(
      Math.abs((await section.boundingBox())!.height - height),
    ).toBeLessThan(1);
    await page.getByRole("tab").nth(2).focus();
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab").nth(0)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel").getByRole("link")).toBeFocused();
  });

  test(`FAQ animates both ways without clipping at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const trigger = page.locator(".faq-trigger").first();
    const answer = page.locator(".faq-collapse").first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(answer).toHaveCSS("opacity", "1");
    const expandedHeight = (await answer.boundingBox())!.height;
    expect(expandedHeight).toBeGreaterThan(30);
    expect(
      await answer
        .locator(".faq-answer-clip")
        .evaluate((el) => el.scrollHeight - el.clientHeight),
    ).toBeLessThanOrEqual(1);
    const closing = await trigger.evaluate(async (button) => {
      (button as HTMLButtonElement).click();
      await new Promise((resolve) => setTimeout(resolve, 90));
      return button
        .closest(".faq-item")!
        .querySelector(".faq-collapse")!
        .getBoundingClientRect().height;
    });
    expect(closing).toBeGreaterThan(0);
    expect(closing).toBeLessThan(expandedHeight);
    await expect.poll(async () => (await answer.boundingBox())!.height).toBe(0);
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.locator(".faq-trigger").nth(1).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator('.faq-trigger[aria-expanded="true"]'),
    ).toHaveCount(1);
  });
}

test("late image completion never overrides the latest tab choice", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/_next\/image.*automotive-suv/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("#vehicles").scrollIntoViewIfNeeded();
  await page
    .locator("#panel-electric img")
    .evaluate((image) => (image as HTMLImageElement).decode());
  await page.getByRole("tab").nth(1).click();
  await expect(page.locator(".vehicle-panels")).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-electric",
  );
  await page.getByRole("tab").nth(2).click();
  release();
  await expect(page.getByRole("tab").nth(2)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page
    .locator("#panel-hybrid img")
    .evaluate((image) => (image as HTMLImageElement).decode());
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-petrol",
  );
});

test("scroll reveal, desktop parallax, live reduced motion and anchor offset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".reveal-pending").first()).toBeAttached();
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(() =>
      page.locator(".hero-image").evaluate((el) => el.style.transform),
    )
    .not.toBe("");
  const y = await page
    .locator(".hero-image")
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  expect(y).toBeGreaterThan(0);
  expect(y).toBeLessThanOrEqual(16);
  await page.locator("#process").scrollIntoViewIfNeeded();
  await expect(page.locator("#process .section-heading")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".reveal-pending")).toHaveCount(0);
  await expect(page.locator(".hero-image")).toHaveCSS("transform", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.getByRole("tab").nth(1).click();
  await expect(page.getByRole("tabpanel")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.locator('.desktop-nav a[href="#cost"]').click();
  const top = (await page.locator("#cost").boundingBox())!.y;
  expect(top).toBeGreaterThanOrEqual(
    (await page.locator("header").boundingBox())!.height,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
  await expect(page.locator(".hero-image")).toHaveCSS("transform", "none");
});
