"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Media } from "@/types/content";

export function MachineryGallery({ images }: { images: Media[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : images[activeIndex];

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [active]);

  return (
    <>
      <div className="machinery-gallery">
        {images.map((image, imageIndex) => (
          <figure key={image.src}>
            <button
              type="button"
              className="machinery-gallery-button"
              aria-label={`Открыть фото ${imageIndex + 1} крупнее`}
              onClick={() => setActiveIndex(imageIndex)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1099px) calc((100vw - 72px) / 2), (max-width: 1464px) calc((100vw - 192px) / 4), 300px"
                loading="lazy"
                quality={90}
                style={{ objectPosition: image.position }}
              />
              <span className="gallery-zoom-label">Открыть</span>
            </button>
            <figcaption>{String(imageIndex + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>

      {active && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии техники"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Закрыть фото"
            onClick={() => setActiveIndex(null)}
          >
            <X size={22} aria-hidden="true" />
          </button>
          <figure
            className="gallery-lightbox-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.fullSrc ?? active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              quality={94}
              priority
            />
            <figcaption>{active.alt}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
