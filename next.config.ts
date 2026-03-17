import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // NOTE: Konfigurasi GitHub Pages di bawah ini dinonaktifkan untuk sementara
  // agar pratinjau lokal berfungsi. Jika Anda ingin melakukan deploy ke GitHub Pages,
  // aktifkan kembali baris-baris di bawah ini.
  
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
  // basePath: process.env.NODE_ENV === 'production' ? "/vinnstrade" : "",
  // assetPrefix: process.env.NODE_ENV === 'production' ? "/vinnstrade/" : "",
};

export default nextConfig;
