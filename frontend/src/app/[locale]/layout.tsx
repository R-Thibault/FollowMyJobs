import { Metadata } from "next";
import { metadataFr, metadataEn } from "../../metadata/metadata";
import "./globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { Toaster } from "react-hot-toast";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "fr") {
    return metadataFr;
  }
  return metadataEn; // Default to English metadata for non-French locales
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" /> */}
      </head>
      <body className="relative mx-auto min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Toaster position="bottom-right" />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
