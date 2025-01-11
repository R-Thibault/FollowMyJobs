"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "../ui/button";

export default function Navbar() {
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
    <nav className="flex m-2 p-2 gap-4">
      <Link href={`/${locale}/dashboard`}>Dashboard</Link>
      <Link href={`/${locale}/my-profile`}>My Profile</Link>
      <Link href={`/${locale}/settings`}>Settings</Link>
      <Button onClick={handleLogout}>Logout</Button>
    </nav>
  );
}
