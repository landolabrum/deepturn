 const { i18n } = require('./next-i18next.config');
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        defaultLoaders.babel,
        {
          loader: require("styled-jsx/webpack").loader,
          options: { type: "scoped" },
        },
      ],
    });
    return config;
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // redirects: () => {
  //   return [
  //     { source: '/r/:sponsor', destination: '/enroll/:sponsor', permanent: false },
  //     { source: '/r/:sponsor/:destination', destination: '/enroll/:sponsor/:destination', permanent: false },
  //   ]
  // }
};

module.exports = nextConfig;
