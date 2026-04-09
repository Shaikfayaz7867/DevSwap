import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
})(nextConfig);
