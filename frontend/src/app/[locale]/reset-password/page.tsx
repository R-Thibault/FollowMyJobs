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

export default function Page() {
  const [emailResetPassword, setEmailResetPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [, setErrorTokenMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [checkPswd, setCheckPswnd] = useState(
    "Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial (@ $ ! % * ? &)."
  );
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const locale = useLocale();
  const t = useTranslations("resetPasswordPage");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordRegex.test(value)) {
      setCheckPswnd("");
    } else {
      setCheckPswnd(
        "Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial (@ $ ! % * ? &)."
      );
    }
  };
  // Extract the token from the URL when the page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractedToken = params.get("token");

    if (extractedToken) {
      setToken(extractedToken);
      sendTokenToBackend(extractedToken);
    } else {
      setIsTokenValid(false);
    }
  }, []);
  // Function to send the extracted token to the backend
  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await axiosInstance.post("/verify-reset-password-link", {
        token,
      });
      if (response.data) {
        setIsTokenValid(true);
      } else {
        setErrorTokenMessage(true);
        toast.error(t("errorTokenMessage"));
        setIsTokenValid(false);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setErrorTokenMessage(true);
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
          password: password,
          confirmPassword: confirmPassword,
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
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <p className="text-center">{t("tokenVerificationWait")}</p>
        </div>
      </div>
    );
  } else if (isTokenValid === false) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <p className="text-red-500 text-center">{t("tokenErrorMessage")}</p>
        </div>
      </div>
    );
  } else {
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
                          value={emailResetPassword}
                          onChange={(e) =>
                            setEmailResetPassword(e.target.value)
                          }
                          required
                          readOnly
                          className="outline-none pointer-events-none"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">{t("passwordLabel")}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      {checkPswd && (
                        <p className="text-red-500 text-sm mb-4">{checkPswd}</p>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="confirm password">
                          {t("confirmPasswordLabel")}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
}
