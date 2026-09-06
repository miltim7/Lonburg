import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";
import { seo } from "@/config/seo";
import { interfaceText } from "@/data/navigation";
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  metadataBase: seo.siteUrl ? new URL(seo.siteUrl) : undefined,
  alternates: seo.siteUrl ? { canonical: seo.siteUrl } : undefined,
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: seo.locale,
    type: "website",
    ...(seo.siteUrl
      ? {
          url: seo.siteUrl,
          images: [
            {
              url: `${seo.siteUrl}/images/og.jpg`,
              width: 1200,
              height: 630,
              alt: seo.title,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    ...(seo.siteUrl ? { images: [`${seo.siteUrl}/images/og.jpg`] } : {}),
  },
  robots: seo.siteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main">
          {interfaceText.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
