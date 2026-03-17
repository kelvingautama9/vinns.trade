import type {NextConfig} from 'next';

// =================================================================================
// PENTING: Ganti '<YOUR_REPOSITORY_NAME>' dengan nama repository GitHub Anda.
// Contoh: jika URL repo Anda adalah https://github.com/user/my-trading-app,
// maka isi variabel di bawah ini dengan 'my-trading-app'.
// =================================================================================
const repositoryName = '<YOUR_REPOSITORY_NAME>';

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '/';
let basePath = '/';

// Ini memastikan aplikasi berjalan dengan benar di GitHub Pages
if (isGithubActions) {
  assetPrefix = `/${repositoryName}/`;
  basePath = `/${repositoryName}`;
}

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
