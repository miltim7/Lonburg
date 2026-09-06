import type { SEOConfig } from "@/types/content";
function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}
export const seo: SEOConfig = {
  title: "Автомобили из Китая под заказ с доставкой по России | Лонбург",
  description:
    "Подбор и доставка автомобилей из Китая под заказ. Электромобили, гибриды и бензиновые автомобили. Прозрачный расчёт стоимости и доставка по России.",
  siteUrl: getSiteUrl(),
  locale: "ru_RU",
};
