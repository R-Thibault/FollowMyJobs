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
import React, { useState, useEffect } from "react";
import DialogOTP from "@/components/organisms/DialogOTP";
import { motion } from "framer-motion"; // Import for animations
import NavbarNoLogin from "@/components/organisms/NavbarNoLogin";

export default function Page() {
  const t = useTranslations("signUpPage");

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for error handling
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<
    string | null
  >(null);
  const [, setErrorSignUp] = useState<string | null>(null);

  // Other states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Password Validation State
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Regex for validation
  // Live email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setErrorEmail(t("errorEmailInput"));
    } else {
      setErrorEmail(null);
    }
  }, [email, t]);

  // Live password validation with individual criteria
  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  // Live confirm password validation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setErrorConfirmPassword(t("errorConfirmPasswordMessage"));
    } else {
      setErrorConfirmPassword(null);
    }
  }, [confirmPassword, password, t]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !email ||
      errorEmail ||
      errorConfirmPassword ||
      Object.values(passwordCriteria).includes(false)
    ) {
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
        setIsOtpModalOpen(true);
        setErrorSignUp(null);
      } else {
        setErrorSignUp(t("errorSignUpMessage"));
      }
    } catch (error) {
      console.error("Sign-Up Error:", error);
      setErrorSignUp(t("errorSignUpMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Navbar */}
      <NavbarNoLogin />

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="shadow-lg rounded-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.form
              className="space-y-4"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Email Input */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errorEmail ? "border-red-500" : ""}
                  required
                />
                {errorEmail && <ErrorMessage text={errorEmail} />}
              </motion.div>

              {/* Password Input */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <PasswordCriteria criteria={passwordCriteria} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Label htmlFor="confirmPassword">
                  {t("confirmPasswordLabel")}
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errorConfirmPassword ? "border-red-500" : ""}
                  required
                />
                {errorConfirmPassword && (
                  <ErrorMessage text={errorConfirmPassword} />
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-md"
                  disabled={
                    isSubmitting ||
                    Object.values(passwordCriteria).includes(false)
                  }
                >
                  {isSubmitting ? t("loading") : t("inscription")}
                </Button>
              </motion.div>
            </motion.form>

            {/* OTP Dialog */}
            {isOtpModalOpen && <DialogOTP email={email} />}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const PasswordCriteria = ({
  criteria,
}: {
  criteria: Record<string, boolean>;
}) => {
  const t = useTranslations("signUpPage");

  // Map to match criteria keys with their corresponding translation keys
  const passwordCriteriaLabels: Record<string, string> = {
    length: t("passwordRequirement.length"),
    uppercase: t("passwordRequirement.uppercase"),
    lowercase: t("passwordRequirement.lowercase"),
    number: t("passwordRequirement.number"),
    specialChar: t("passwordRequirement.specialChar"),
  };

  return (
    <ul className="text-sm mt-2 space-y-1">
      {Object.entries(criteria).map(([key, met]) => (
        <motion.li
          key={key}
          className={`flex items-center ${
            met ? "text-green-600" : "text-red-500"
          }`}
        >
          {met ? "✔️" : "❌"} {passwordCriteriaLabels[key] || key}
        </motion.li>
      ))}
    </ul>
  );
};

/** Error Message Component */
const ErrorMessage = ({ text }: { text: string }) => (
  <motion.p
    className="text-red-500 text-sm mt-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {text}
  </motion.p>
);
