"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "../ui/button";
import LangageSelector from "../molecules/LangageSelector";

export default function Navbar() {
  const t = useTranslations("navBar");
  const locale = useLocale();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:8080/logout",
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
          <Link href={`/${locale}/dashboard`}>Dashboard</Link>
          <Link href={`/${locale}/my-profile`}>My Profile</Link>
          <Link href={`/${locale}/settings`}>Settings</Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </nav>
    </div>
  );
}
