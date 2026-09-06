"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingPageContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/primitives";
export function FAQ({ content }: { content: LandingPageContent["faq"] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="section faq" id="faq" tabIndex={-1}>
      <div className="container faq-grid">
        <SectionHeading content={content} />
        <div className="faq-list">
          {content.items.map((item, i) => (
            <div className="faq-item" key={item.id}>
              <h3>
                <button
                  className="faq-trigger"
                  type="button"
                  id={`faq-trigger-${item.id}`}
                  aria-expanded={open === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                >
                  <span className="faq-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="faq-question">{item.question}</span>
                  <ChevronDown size={20} aria-hidden="true" />
                </button>
              </h3>
              <div
                className={`faq-collapse ${open === item.id ? "is-open" : ""}`}
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                aria-hidden={open !== item.id}
                inert={open !== item.id}
              >
                <div className="faq-answer-clip">
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
