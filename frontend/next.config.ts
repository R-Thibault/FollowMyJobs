import { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = withNextIntl(nextConfig);
