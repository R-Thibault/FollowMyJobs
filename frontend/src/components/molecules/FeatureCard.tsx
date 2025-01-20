import { motion } from "framer-motion";
import React from "react";

export default function FeatureCard({
  icon,
  title,
  description,
  bgColor,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`flex flex-col items-center p-6 rounded-lg shadow-md ${bgColor}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <div className="text-5xl">{icon}</div>
      <h3 className="text-xl font-semibold mt-4 text-gray-900">{title}</h3>
      <p className="text-gray-700 mt-2 max-w-sm">{description}</p>
    </motion.div>
  );
}
