import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function CTAButton({
  href,
  text,
  primary,
}: {
  href: string;
  text: string;
  primary?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className={`py-3 px-8 rounded-lg text-lg transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none ${
          primary
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "border border-gray-700 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {text}
      </Link>
    </motion.div>
  );
}
