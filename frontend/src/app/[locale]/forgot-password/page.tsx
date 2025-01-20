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
import NavbarNoLogin from "@/components/organisms/NavbarNoLogin";
import { motion } from "framer-motion"; // Import for animations

export default function Page() {
  const [emailResetPassword, setEmailResetPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations("forgotPasswordPage");

  // Email validation regex
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
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-100 to-gray-300">
      <NavbarNoLogin />
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="shadow-lg rounded-lg bg-white">
          {successMessage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
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
            </motion.div>
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
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="flex flex-col gap-6">
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Label htmlFor="email">{t("emailLabel")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={emailResetPassword}
                        onChange={(e) => setEmailResetPassword(e.target.value)}
                        className={errorMessage ? "border-red-500" : ""}
                        required
                      />
                    </motion.div>

                    {errorMessage && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {t("errorMessageResetPswd")}
                      </motion.p>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button type="submit" className="w-full">
                        {t("resetPswdModalAction")}
                      </Button>
                    </motion.div>
                  </div>
                </motion.form>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
