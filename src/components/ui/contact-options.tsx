import { ArrowUpRight, Mail, Phone, Send } from "lucide-react";
import type { CompanyConfig } from "@/types/content";

/** Preview values are presentation only: never turn them into outgoing links. */
export function ContactOptions({
  company,
  compact = false,
}: {
  company: CompanyConfig;
  compact?: boolean;
}) {
  const options = [
    {
      label: "Telegram",
      value: company.telegram ? "Написать в Telegram" : "@username",
      href: company.telegram,
      Icon: Send,
    },
    {
      label: "Телефон",
      value: company.phone ?? "+7 (___) ___-__-__",
      href: company.phone
        ? `tel:${company.phone.replace(/[^+\d]/g, "")}`
        : null,
      Icon: Phone,
    },
    {
      label: "Почта",
      value: company.email ?? "mail@example.com",
      href: company.email ? `mailto:${company.email}` : null,
      Icon: Mail,
    },
    ...(company.max
      ? [
          {
            label: "MAX",
            value: "Написать в MAX",
            href: company.max,
            Icon: Send,
          },
        ]
      : []),
  ];
  const hasContacts = options.some((option) => option.href);
  const visibleOptions = hasContacts
    ? options.filter((option) => option.href)
    : options;
  return (
    <div
      className={`contact-options ${compact ? "contact-options--compact" : ""}`}
    >
      <h3>{compact ? "Связаться с нами" : "Удобнее обсудить напрямую?"}</h3>
      <ul>
        {visibleOptions.map(({ label, value, href, Icon }) => {
          const content = (
            <>
              <Icon size={18} aria-hidden="true" />
              <span>
                <small>{label}</small>
                <span>{value}</span>
              </span>
              {href && <ArrowUpRight size={17} aria-hidden="true" />}
            </>
          );
          return (
            <li key={label}>
              {href ? (
                <a href={href}>{content}</a>
              ) : (
                <div className="contact-placeholder">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      {!hasContacts && (
        <p className="contact-preview-note">
          Контакты в макете — для примера. Заменим перед запуском.
        </p>
      )}
    </div>
  );
}
