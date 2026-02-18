/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // В dev всегда memory-кэш, чтобы не ломались стили из-за ENOENT .pack.gz
  webpack: (config, { dev }) => {
    if (dev) config.cache = { type: 'memory' };
    return config;
  },
  images: {
    // Мы используем unoptimized в компонентах, поэтому доп. настройка доменов не обязательна
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;

