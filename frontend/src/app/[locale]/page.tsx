"use client";

import NavbarNoLogin from "@/components/organisms/NavbarNoLogin";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion"; // 🎥 Import de Framer Motion pour l'animation
import FeatureCard from "@/components/molecules/FeatureCard";
import CTAButton from "@/components/atoms/CTAButton";

export default function HomePage() {
  const t = useTranslations("homePage");
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Navbar */}
      <NavbarNoLogin />

      {/* Hero Section avec Fade-In */}
      <motion.main
        className="flex flex-col items-center text-center px-6 md:px-12 py-20 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }} // Effet d’apparition progressive
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mt-4">
          {t("description")}
        </p>

        {/* CTA Buttons avec Animation de Survol */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <CTAButton href={`/${locale}/login`} text={t("cta")} primary />
          <CTAButton href="#" text={t("learnMore")} />
        </div>

        {/* Illustration avec Animation de Slide-In */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }} // Apparition avec léger retard
        >
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop"
            alt="Dashboard Preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </motion.div>
      </motion.main>

      {/* Features Section avec Effet Slide-In */}
      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/** Cartes des fonctionnalités animées */}
          <FeatureCard
            icon="🚀"
            title={t("feature1Title")}
            description={t("feature1Description")}
            bgColor="bg-blue-100"
            delay={0}
          />
          <FeatureCard
            icon="📊"
            title={t("feature2Title")}
            description={t("feature2Description")}
            bgColor="bg-gray-100"
            delay={0.2}
          />
          <FeatureCard
            icon="⚡"
            title={t("feature3Title")}
            description={t("feature3Description")}
            bgColor="bg-yellow-100"
            delay={0.4}
          />
        </div>
      </section>
    </div>
  );
}
