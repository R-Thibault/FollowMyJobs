"use client";
import LangageSelector from "@/components/moleculs/LangageSelector";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("homePage");
  const locale = useLocale();
  return (
    <div className="grow min-h-screen bg-home-page bg-cover p-4 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-center gap-24 items-center mb-8 sticky top-0 z-50 py-4 backdrop-blur-sm">
        {/* Logo */}
        <div className="text-lg font-bold">JobApp Manager</div>

        {/* Burger Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-2xl">&#9776;</button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex text-lg space-x-4 justify-center items-center">
          <a href="#">{t("nav.home")}</a>
          <a href="#">{t("nav.getStarted")}</a>
          <a href="#">{t("nav.contact")}</a>
        </div>
        {/* Language Switcher */}
        <LangageSelector />
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex md:flex-row flex-col items-center justify-center text-center">
        <div className="max-w-md px-4">
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{t("description")}</p>
          {/* Call to Action */}
          <Link
            href={`/${locale}/login`}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600"
          >
            {t("cta")}
          </Link>
        </div>

        {/* Image Section */}
        <Image
          src="https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="App Preview"
          width={500}
          height={400}
          className="rounded-lg shadow-lg mt-8"
        />
      </div>
    </div>
  );
}
