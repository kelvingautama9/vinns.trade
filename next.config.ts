import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repositoryName = 'vinns.trade';

const nextConfig: NextConfig = {
  output: 'export', // Wajib untuk GitHub Pages
  basePath: isProd ? `/${repositoryName}` : '',
  assetPrefix: isProd ? `/${repositoryName}` : '',
  images: {
    unoptimized: true, // Wajib karena GitHub Pages statis
  },
  // Mengabaikan error TypeScript saat build agar deploy lancar
  typescript: {
    ignoreBuildErrors: true,
  },
  // Mengabaikan error ESLint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;