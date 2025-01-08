"use client";

import { cn } from "@/lib/utils";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [errorMessageUnexpected, setErrorMessageUnexpected] =
    useState<boolean>(false);

  const router = useRouter();

  // Use for translation
  const t = useTranslations("loginPage");
  // Get the locale language
  const locale = useLocale();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 100);
      } else {
        setErrorMessageUnexpected(true);
      }
    } catch {
      setErrorMessage(true);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("passwordLabel")}</Label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="ml-auto inline-block text-sm  border-none underline underline-offset-4 hover:bg-white"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 mt-2">{t("errorMessageLogin")}</p>
              )}
              {errorMessageUnexpected && (
                <p className="text-red-500 mt-2">
                  {t("errorMessageUnexpected")}
                </p>
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
