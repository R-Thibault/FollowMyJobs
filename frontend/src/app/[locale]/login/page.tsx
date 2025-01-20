"use client";

import React from "react";
import { LoginForm } from "@/components/organisms/login-form";
import { useTranslations } from "next-intl";

import { motion } from "framer-motion"; // Import for animations
import NavbarNoLogin from "@/components/organisms/NavbarNoLogin";

export default function Login() {
  const t = useTranslations("loginPage");

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Navbar */}
      <NavbarNoLogin />

      {/* Left Section - Animated Welcome Text */}
      <motion.div
        className="hidden md:flex w-1/2 items-center justify-center p-10 text-gray-700"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold">{t("welcomeTitle")}</h1>
          <p className="text-lg">{t("welcomeText1")}</p>
          <p className="text-md">{t("welcomeText2")}</p>
          <p className="text-md">{t("welcomeText3")}</p>
        </div>
      </motion.div>

      {/* Right Section - Animated Login Form */}
      <motion.div
        className="flex flex-col gap-6 w-full md:w-1/2 items-center justify-center bg-white p-6 md:p-10 rounded-lg shadow-lg"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="md:hidden text-center text-3xl font-bold">
          {t("welcomeTitle")}
        </h1>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
