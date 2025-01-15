"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";

import React, { useState } from "react";
import DialogOTP from "@/components/organisms/DialogOTP";
import LangageSelector from "@/components/molecules/LangageSelector";

export default function Page() {
  const t = useTranslations("signUpPage");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorSignUpMessage, setErrorSignUpMessage] = useState<boolean>(false);
  const [errorConfirmPasswordMessage, setErrorConfirmPasswordMessage] =
    useState<boolean>(false);
  const [errorEmailInput, setErrorEmailInput] = useState<boolean>(false);
  const [errorOTPEmailMessage, setErrorOTPEmailMessage] =
    useState<boolean>(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [checkPswd, setCheckPswnd] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setCheckPswnd(!passwordRegex.test(value));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setErrorEmailInput(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorConfirmPasswordMessage(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/sign-up", {
        email,
        password,
        confirmPassword,
      });

      if (response.data) {
        const responseOTP = await axiosInstance.post("/generate-otp", {
          email,
        });
        if (responseOTP.data) {
          setIsOtpModalOpen(true);
          setErrorSignUpMessage(false);
        } else {
          setErrorOTPEmailMessage(true);
        }
      } else {
        setErrorSignUpMessage(true);
      }
    } catch (error) {
      console.error("Error during sign up:", error);

      setErrorSignUpMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="fixed right-6 top-8 z-50">
        <LangageSelector />
      </div>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div>
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={errorEmailInput}
                  aria-describedby={errorEmailInput ? "email-error" : undefined}
                />
                {errorEmailInput && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="email-error"
                    aria-live="polite"
                  >
                    {t("errorEmailInput")}
                  </p>
                )}
              </div>

              {/* Password Input with Toggle */}
              <div>
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {passwordVisible ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {checkPswd && (
                <ul className="text-red-500 text-[0.75rem] mb-4 list-disc pl-5 space-y-1">
                  <li>{t("passwordRequirement.length")}</li>
                  <li>{t("passwordRequirement.uppercase")}</li>
                  <li>{t("passwordRequirement.lowercase")}</li>
                  <li>{t("passwordRequirement.number")}</li>
                  <li>{t("passwordRequirement.specialChar")}</li>
                </ul>
              )}

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">
                  {t("confirmPasswordLabel")}
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Messages */}
              {errorSignUpMessage && (
                <p className="text-red-500 text-sm mb-4">
                  {t("errorSignUpMessage")}
                </p>
              )}
              {errorConfirmPasswordMessage && (
                <p className="text-red-500 text-sm mb-4">
                  {t("errorConfirmPasswordMessage")}
                </p>
              )}
              {errorOTPEmailMessage && (
                <p className="text-red-500 text-sm mb-4">
                  {t("errorOTPEmailMessage")}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full px-4 py-2 text-white rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting || checkPswd}
              >
                {isSubmitting ? t("loading") : t("inscription")}
              </Button>
            </form>

            {/* OTP Dialog */}
            {isOtpModalOpen && <DialogOTP email={email} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
