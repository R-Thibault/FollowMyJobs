"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();

  const handleLogout = async () => {
    // ✅ Clear the token and redirect to login
    try {
      const response = await axiosInstance.post("logout");
      if (response.status !== 200) {
        console.log("error");
      }
      router.push(`/${locale}/login`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex m-2 p-2 gap-4">
      <Link href={`/${locale}/dashboard`}>Dashboard</Link>
      <Link href={`/${locale}/my-profile`}>My Profile</Link>
      <Link href={`/${locale}/settings`}>Settings</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
