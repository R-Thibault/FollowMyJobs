"use client";

import React from "react";
import { LoginForm } from "@/components/organisms/login-form";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations("loginPage"); // Hook pour traductions

  return (
    <div className="flex min-h-svh w-full">
      {/* Section gauche - Texte de présentation */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-10 text-gray-700">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold">{t("welcomeTitle")}</h1>
          <p className="text-lg">{t("welcomeText1")}</p>
          <p className="text-md">{t("welcomeText2")}</p>
          <p className="text-md">{t("welcomeText3")}</p>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="flex flex-col gap-6 w-full md:w-1/2 items-center justify-center bg-white p-6 md:p-10">
        <h1 className="md:hidden text-center text-3xl font-bold">
          {t("welcomeTitle")}
        </h1>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
