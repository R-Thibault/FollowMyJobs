import React from "react";
import LangageSelector from "../molecules/LangageSelector";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function NavbarNoLogin() {
  const t = useTranslations("navBar");
  const locale = useLocale();
  return (
    <div className="fixed top-4 left-6">
      <div className="fixed right-6 top-8 z-50">
        <LangageSelector />
      </div>
      {/* Navbar */}
      <nav className="flex md:gap-8 gap-4 md:justify-center items-center md:mx-auto mb-8 sticky top-0 z-25 py-4 backdrop-blur-sm">
        {/* Logo */}
        <div className="text-lg font-bold">JobApp Manager</div>
        {/* Burger Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-2xl">&#9776;</button>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex text-lg space-x-4 justify-center items-center">
          <Link href={`/${locale}/login`}>{t("getStarted")}</Link>
          <Link href="#">{t("contact")}</Link>
        </div>
      </nav>
    </div>
  );
}
