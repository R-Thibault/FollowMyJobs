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
import React, { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export default function Page() {
  const [emailResetPassword, setEmailResetPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations("forgotPasswordPage");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRegex.test(emailResetPassword)) {
      setErrorMessage(true);
      return;
    }
    try {
      const response = await axiosInstance.post("/send-reset-password-link", {
        email: emailResetPassword,
      });
      if (response.data) {
        setSuccessMessage(true);
        toast.success(t("resetPswdModalSuccessMessage"));
      }
    } catch {
      setErrorMessage(true);
      toast.error(t("errorMessageResetPswd"));
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          {successMessage ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("resetPswdModalSuccessTitle")}
                </CardTitle>
                <CardDescription>
                  {t("resetPswdModalSuccessMessage")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  <Link
                    href={`/${locale}/login`}
                    className="ml-auto inline-block text-sm"
                  >
                    {t("redirectHomePage")}
                  </Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("resetPswdModalTitle")}
                </CardTitle>
                <CardDescription>
                  {t("resetPswdModalDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t("emailLabel")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={emailResetPassword}
                        onChange={(e) => setEmailResetPassword(e.target.value)}
                        required
                      />
                    </div>
                    {errorMessage && (
                      <p className="text-red-500 mt-2">
                        {t("errorMessageResetPswd")}
                      </p>
                    )}

                    <Button type="submit" className="w-full">
                      {t("resetPswdModalAction")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
