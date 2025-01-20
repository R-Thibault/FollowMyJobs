"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import axios from "axios";

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Use for translation
  const t = useTranslations("loginPage");
  // Get the locale language
  const locale = useLocale();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset previous error message
    try {
      const response = await axiosInstance.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 100);
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        setErrorMessage(t("errorMessageLogin"));
      } else {
        setErrorMessage(t("errorMessageUnexpected"));
      }
      toast.error(t("errorMessageUnexpected"));
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-invalid={errorMessage ? "true" : "false"}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("passwordLabel")}</Label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="ml-auto text-sm text-blue-600 hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    aria-invalid={errorMessage ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>
              </div>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
              <Button type="submit" className="w-full">
                {t("loginbtn")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("noAccount")}{" "}
              <Link
                href={`/${locale}/sign-up`}
                className="ml-auto inline-block text-sm  border-none underline underline-offset-4 hover:bg-white"
              >
                {t("signUp")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
