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
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import LangageSelector from "@/components/molecules/LangageSelector";
import NavbarNoLogin from "@/components/organisms/NavbarNoLogin";
import { motion } from "framer-motion"; // Import for animations

export default function Page() {
  const [emailResetPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const t = useTranslations("resetPasswordPage");
  const locale = useLocale();

  // Password validation states
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Update password validation state
    setPasswordCriteria({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
  };

  // Extract the token from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractedToken = params.get("token");

    if (extractedToken) {
      setToken(extractedToken);
      sendTokenToBackend(extractedToken);
    } else {
      setIsTokenValid(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send token to backend for verification
  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await axiosInstance.post("/verify-reset-password-link", {
        token,
      });
      setIsTokenValid(response.data ? true : false);
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error(t("errorTokenMessage"));
      setIsTokenValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        const response = await axiosInstance.post("/reset-password", {
          email: emailResetPassword,
          password,
          confirmPassword,
          tokenString: token,
        });
        if (response.data) {
          setSuccessMessage(true);
          setErrorMessage(false);
        }
      }
    } catch {
      setSuccessMessage(false);
      setErrorMessage(true);
      toast.error(t("errorMessageResetPswd"));
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="fixed right-6 top-8 z-50">
          <LangageSelector />
        </div>
        <p className="text-center">{t("tokenVerificationWait")}</p>
      </div>
    );
  } else if (isTokenValid === false) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="fixed right-6 top-8 z-50">
          <LangageSelector />
        </div>
        <p className="text-red-500 text-center">{t("tokenErrorMessage")}</p>
      </div>
    );
  } else {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
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
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("emailLabel")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={emailResetPassword}
                          readOnly
                          className="outline-none pointer-events-none"
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Label htmlFor="password">{t("passwordLabel")}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <PasswordCriteria criteria={passwordCriteria} />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Label htmlFor="confirmPassword">
                          {t("confirmPasswordLabel")}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </motion.div>
                      {errorMessage && (
                        <p className="text-red-500 mt-2">
                          {t("errorMessageResetPswd")}
                        </p>
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
                  </form>
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }
}

/** Password Criteria Component */
const PasswordCriteria = ({
  criteria,
}: {
  criteria: Record<string, boolean>;
}) => {
  const t = useTranslations("resetPasswordPage");

  return (
    <ul className="text-sm mt-2 space-y-1">
      {Object.entries(criteria).map(([key, met]) => (
        <motion.li
          key={key}
          className={`flex items-center ${
            met ? "text-green-600" : "text-red-500"
          }`}
        >
          {met ? "✔️" : "❌"} {t(`passwordRequirement.${key}`)}
        </motion.li>
      ))}
    </ul>
  );
};
