// app/[locale]/dashboard/layout.tsx

import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // ✅ If no token, redirect to login page
  if (!token) {
    console.warn("No token found on the server.");
    redirect(`/${params.locale}/login`);
  }

  try {
    // ✅ Ensure the backend properly validates the token
    const response = await axiosInstance.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `auth_token=${token}`,
      },
      withCredentials: true,
    });

    if (response.status !== 200) {
      redirect(`/${params.locale}/login`);
    }
  } catch (error) {
    console.error("Token validation error:", error);
    redirect(`/${params.locale}/login`);
  }

  return <main className="relative mx-auto min-h-screen">{children}</main>;
}
