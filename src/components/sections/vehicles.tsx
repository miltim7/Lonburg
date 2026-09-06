"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
import { useRequest } from "@/components/ui/request-context";
export function Vehicles({
  content,
  tabLabel,
}: {
  content: LandingPageContent["vehicles"];
  tabLabel: string;
}) {
  const [active, setActive] = useState(0);
  const { selectCategory } = useRequest();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const ready = useRef(new Set<number>());
  const requested = useRef(0);
  const [pending, setPending] = useState(false);
  const select = (index: number) => {
    requested.current = index;
    if (ready.current.has(index) || index === active) {
      setActive(index);
      setPending(false);
    } else setPending(true);
  };

  useEffect(() => {
    const update = () => {
      const button = buttons.current[active];
      if (!button || !indicator.current) return;
      indicator.current.style.transform = `translateY(${button.offsetTop}px) scaleY(${button.offsetHeight})`;
    };
    update();
    const observer = new ResizeObserver(update);
    buttons.current.forEach((button) => button && observer.observe(button));
    return () => observer.disconnect();
  }, [active]);
  return (
    <section className="section vehicles" id="vehicles" tabIndex={-1}>
      <div className="container">
        <div className="section-top">
          <SectionHeading content={content} />
          <span className="section-side-note">
            {content.categories.length.toString().padStart(2, "0")} /{" "}
            {content.categories.map((c) => c.title).join(" · ")}
          </span>
        </div>
        <div className="vehicle-showcase">
          <div
            className="vehicle-tabs"
            role="tablist"
            aria-label={tabLabel}
            aria-orientation="vertical"
          >
            <span
              ref={indicator}
              className="vehicle-tab-indicator"
              aria-hidden="true"
            />
            {content.categories.map((item, i) => (
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={`tab-${item.id}`}
                role="tab"
                aria-selected={active === i}
                aria-controls={`panel-${item.id}`}
                tabIndex={active === i ? 0 : -1}
                className={`vehicle-tab ${active === i ? "is-active" : ""}`}
                key={item.id}
                type="button"
                onClick={() => select(i)}
                onKeyDown={(event) => {
                  let next = i;
                  if (event.key === "ArrowDown" || event.key === "ArrowRight")
                    next = (i + 1) % content.categories.length;
                  else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
                    next =
                      (i - 1 + content.categories.length) %
                      content.categories.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End")
                    next = content.categories.length - 1;
                  else return;
                  event.preventDefault();
                  select(next);
                  buttons.current[next]?.focus();
                }}
              >
                <span className="tab-number">{item.index}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="vehicle-panels" aria-busy={pending}>
            {content.categories.map((category, index) => (
              <div
                className={`vehicle-panel ${active === index ? "is-active" : ""}`}
                role="tabpanel"
                id={`panel-${category.id}`}
                aria-labelledby={`tab-${category.id}`}
                tabIndex={active === index ? 0 : -1}
                aria-hidden={active !== index}
                inert={active !== index}
                key={category.id}
              >
                <div className="vehicle-photograph">
                  <Image
                    src={category.image.src}
                    alt={category.image.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) calc(55vw - 21px), (max-width: 1279px) calc(60vw - 23px), (max-width: 1464px) calc(60vw - 36px), 829px"
                    loading="lazy"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={category.image.blurDataURL}
                    style={{ objectPosition: category.image.position }}
                    onLoad={() => {
                      ready.current.add(index);
                      if (requested.current === index) {
                        setActive(index);
                        setPending(false);
                      }
                    }}
                    onError={() => {
                      // Keep every category usable even when its photo fails to load.
                      ready.current.add(index);
                      if (requested.current === index) {
                        setActive(index);
                        setPending(false);
                      }
                    }}
                  />
                </div>
                <div className="vehicle-panel-content">
                  <p>{category.description}</p>
                  <a
                    href={category.cta.href}
                    onClick={() => selectCategory(category.title)}
                  >
                    {category.cta.label}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="image-note">{content.note}</p>
      </div>
    </section>
  );
}
