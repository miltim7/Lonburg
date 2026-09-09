"use client";

import { useEffect } from "react";

/** Progressive enhancement: server HTML and keyboard navigation stay visible. */
export function LandingMotion() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 768px) and (pointer: fine)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      if (reduced.matches) return;

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".section .section-heading, .vehicle-showcase, .russia-selection-list > li, .process-track > li, .process-note, .cost-document, .recycling-guide, .direction-card, .estimate-form, .time-value, .timing-bottom, .contracts-visual, .delivery-route > li, .interior-figure, .advantages-list > li, .faq-list, .final-inner",
        ),
      );
      const reveal = (element: HTMLElement) => {
        element.classList.remove("reveal-pending");
        observer.unobserve(element);
      };
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          });
        },
        { rootMargin: "0px 0px -24px 0px", threshold: 0 },
      );

      targets.forEach((element) => {
        // Never hide content already on screen (including restored scroll positions).
        if (element.getBoundingClientRect().top < innerHeight) return;
        const siblings = Array.from(element.parentElement?.children ?? []);
        const delay =
          element.tagName === "LI" && desktop.matches
            ? Math.min(siblings.indexOf(element) % 4, 3) * 55
            : 0;
        element.style.setProperty("--reveal-delay", `${delay}ms`);
        element.classList.add("scroll-reveal", "reveal-pending");
        observer.observe(element);
      });
      const onFocus = (event: FocusEvent) => {
        const target = event.target as HTMLElement;
        targets.forEach((element) => {
          if (element.contains(target)) reveal(element);
        });
      };
      document.addEventListener("focusin", onFocus);

      const hero = document.querySelector<HTMLElement>(".hero");
      const visual = hero?.querySelector<HTMLElement>(".hero-image");
      let frame = 0;
      let visible = false;
      let heroHeight = hero?.offsetHeight ?? 1;
      const update = () => {
        frame = 0;
        if (!visual || !visible || document.hidden) return;
        // Only a transform write during scroll; dimensions are cached on resize.
        const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
        visual.style.transform = `translate3d(0, ${progress * 16}px, 0)`;
      };
      const schedule = () => {
        if (visible && !document.hidden && !frame)
          frame = requestAnimationFrame(update);
      };
      const resize = new ResizeObserver(() => {
        heroHeight = hero?.offsetHeight ?? 1;
        schedule();
      });
      const parallax = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visual) visual.style.willChange = visible ? "transform" : "auto";
        if (visible) schedule();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      if (desktop.matches && hero && visual) {
        resize.observe(hero);
        parallax.observe(hero);
        window.addEventListener("scroll", schedule, { passive: true });
        document.addEventListener("visibilitychange", schedule);
      }

      dispose = () => {
        observer.disconnect();
        parallax.disconnect();
        resize.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        document.removeEventListener("visibilitychange", schedule);
        document.removeEventListener("focusin", onFocus);
        targets.forEach((element) => {
          element.classList.remove("scroll-reveal", "reveal-pending");
          element.style.removeProperty("--reveal-delay");
        });
        if (visual) {
          visual.style.removeProperty("transform");
          visual.style.removeProperty("will-change");
        }
      };
    };

    setup();
    reduced.addEventListener("change", setup);
    desktop.addEventListener("change", setup);
    return () => {
      dispose();
      reduced.removeEventListener("change", setup);
      desktop.removeEventListener("change", setup);
    };
  }, []);

  return null;
}
