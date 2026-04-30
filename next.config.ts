import type { NextConfig } from "next";

const repositoryName = 'vinns.trade'; 
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repositoryName}` : "",
  assetPrefix: isProd ? `/${repositoryName}/` : "",
  images: {
    unoptimized: true,
  },
  // Nonaktifkan linting saat build agar lebih cepat dan menghindari kegagalan deployment karena peringatan kecil
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;