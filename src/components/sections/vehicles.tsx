"use client";
import Image from "next/image";
import { useRef, useState } from "react";
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
  const category = content.categories[active];
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
                onClick={() => setActive(i)}
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
                  setActive(next);
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
          <div
            className="vehicle-panel"
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            tabIndex={0}
            key={category.id}
          >
            <div className="vehicle-photograph">
              <Image
                src={category.image.src}
                alt={category.image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 66vw"
                style={{ objectPosition: category.image.position }}
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
        </div>
        <p className="image-note">{content.note}</p>
      </div>
    </section>
  );
}
