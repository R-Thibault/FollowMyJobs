import React, { useState } from "react";
import LangageSelector from "../molecules/LangageSelector";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function NavbarNoLogin() {
  const t = useTranslations("navBar");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  return (
    <header className="w-full py-4 px-6 bg-white bg-opacity-70 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800">
          <Link href={`/${locale}`}>JobApp Manager</Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <Link href={`/${locale}/login`} className="hover:text-blue-600">
            {t("getStarted")}
          </Link>
          <Link href="#" className="hover:text-blue-600">
            {t("contact")}
          </Link>
        </nav>

        {/* Language Selector */}
        <div className="hidden md:block">
          <LangageSelector />
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4">
          <Link
            href={`/${locale}/login`}
            className="hover:text-blue-600 text-lg"
          >
            {t("getStarted")}
          </Link>
          <Link href="#" className="hover:text-blue-600 text-lg">
            {t("contact")}
          </Link>
          <LangageSelector />
        </nav>
      )}
    </header>
  );
}
