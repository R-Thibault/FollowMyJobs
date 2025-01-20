"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "../ui/button";
import LangageSelector from "../molecules/LangageSelector";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("navBar");
  const locale = useLocale();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.message === "Logout successful") {
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      console.error("Error during Logout:", error);
      alert("Failed to Logout");
    }
  };

  return (
    <div className="fixed w-full left-0  shadow-sm z-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-sm">
        {/* Logo (Left-aligned) */}
        <div className="flex items-center space-x-4 text-lg font-bold">
          <Link href={`/${locale}/dashboard`}>JobApp Manager</Link>
          <Link href={`/${locale}/dashboard`} className="hidden md:block">
            {t("dashboard")}
          </Link>
        </div>

        {/* Desktop Nav Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href={`/${locale}/my-profile`}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-400 hover:scale-110"
          >
            <CircleUserRound />
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
          <LangageSelector />
        </div>

        {/* Burger Menu Button (Visible on Mobile) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>
      </nav>

      {/* Mobile Nav Menu (Toggles on click) */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center  shadow-md py-4">
          <Link href={`/${locale}/dashboard`} className="py-2">
            {t("dashboard")}
          </Link>
          <Link href={`/${locale}/my-profile`} className="py-2">
            My Profile
          </Link>
          <Button onClick={handleLogout} className="py-2">
            Logout
          </Button>
          <LangageSelector />
        </div>
      )}
    </div>
  );
}
