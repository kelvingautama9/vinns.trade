/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // Tambahkan ini untuk memperbaiki 404 pada GitHub Pages
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/vinns.trade' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vinns.trade' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;