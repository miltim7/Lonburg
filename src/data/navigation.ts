import type { CTA } from "@/types/content";
export const navigation: CTA[] = [
  { label: "Автомобили", href: "#vehicles" },
  { label: "Как это работает", href: "#process" },
  { label: "Стоимость", href: "#cost" },
  { label: "Сроки", href: "#timing" },
  { label: "FAQ", href: "#faq" },
];
export const mainCta: CTA = {
  label: "Рассчитать автомобиль",
  href: "#estimate",
};
export const interfaceText = {
  skip: "Перейти к содержимому",
  openMenu: "Открыть меню",
  closeMenu: "Закрыть меню",
  navigation: "Основная навигация",
  home: "На главную",
  backToTop: "Наверх",
  telegram: "Написать в Telegram",
  phone: "Позвонить",
  email: "Написать на почту",
  max: "Написать в MAX",
  footerNav: "Навигация в подвале",
  vehicleTabs: "Тип автомобиля",
};
