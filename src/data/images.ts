import type { Media } from "@/types/content";
// Temporary generated concept visuals. Replace paths and alt text with approved assets.
export const images = {
  hero: {
    src: "/images/automotive-hero.webp",
    alt: "Серебристый автомобиль в тёмной студии — концептуальная иллюстрация",
    position: "center",
  },
  electric: {
    src: "/images/electric-v2.webp",
    alt: "Светлый электрический кроссовер у современной архитектуры — иллюстрация категории",
    position: "center",
  },
  hybrid: {
    src: "/images/automotive-suv.webp",
    alt: "Серебристый кроссовер в светлой студии — концептуальная иллюстрация",
    position: "center 58%",
  },
  petrol: {
    src: "/images/petrol-v2.webp",
    alt: "Тёмно-зелёный бензиновый седан с открытой решёткой радиатора — иллюстрация категории",
    position: "center",
  },
  interior: {
    src: "/images/interior-v2.webp",
    alt: "Кожаное сиденье и центральная консоль современного автомобиля — иллюстрация деталей салона",
    position: "center",
  },
  final: {
    src: "/images/road-v2.webp",
    alt: "Бензиновый SUV на горной дороге в сумерках — концептуальная иллюстрация",
    position: "center 60%",
  },
} satisfies Record<string, Media>;
