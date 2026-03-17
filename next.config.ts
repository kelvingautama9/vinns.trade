import type { NextConfig } from "next";

// PENTING: Ganti nilai di bawah ini dengan nama repository GitHub Anda.
// Contoh: jika URL repo Anda adalah "https://github.com/john-doe/my-app",
// maka isi dengan "my-app".
const repositoryName = 'vinnstrade'; 

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'export',
  // basePath dan assetPrefix diperlukan agar file dapat ditemukan di GitHub Pages.
  basePath: isProd ? `/${repositoryName}` : "",
  // assetPrefix harus diakhiri dengan garis miring.
  assetPrefix: isProd ? `/${repositoryName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
