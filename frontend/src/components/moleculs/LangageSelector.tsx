"use client";

import { useRouter, usePathname, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1];
  const supportedLocales = React.useMemo(() => ["en", "fr"], []);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect the user's preferred language
      const browserLanguage = navigator.language.split("-")[0];

      // Redirect only on the first visit if the current locale is unsupported
      if (!supportedLocales.includes(currentLocale)) {
        const preferredLocale = supportedLocales.includes(browserLanguage)
          ? browserLanguage
          : "en"; // Default fallback to "en"

        const newPathname = `/${preferredLocale}${pathname}`;
        redirect(newPathname); // Redirect using i18n/routing's redirect
      }
    }
  }, [currentLocale, pathname, supportedLocales]);

  const handleSelect = (selectedLocale: string) => {
    if (currentLocale !== selectedLocale) {
      const newPathname = `/${selectedLocale}${pathname.substring(
        currentLocale.length + 1
      )}`;

      router.push(newPathname, { scroll: false });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        className="flex h-8 w-16 items-center justify-between rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentLocale.toUpperCase()}</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className="absolute z-50 mt-1 w-16 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none"
          tabIndex={-1}
          role="listbox"
        >
          {supportedLocales.map((locale) => (
            <li
              key={locale}
              className={`cursor-pointer select-none px-2 py-1 text-sm text-center hover:bg-gray-100 ${
                currentLocale === locale ? "font-bold" : ""
              }`}
              role="option"
              aria-selected={currentLocale === locale}
              onClick={() => handleSelect(locale)}
            >
              {locale.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
