
const nextConfig = {
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
  // basePath:  '/nirvana-energy',
  // assetPrefix: '/nirvana-energy/',
  // redirects: () => {
  //   return [
  //     { source: '/r/:sponsor', destination: '/enroll/:sponsor', permanent: false },
  //     { source: '/r/:sponsor/:destination', destination: '/enroll/:sponsor/:destination', permanent: false },
  //   ]
  // }
};

module.exports = nextConfig;
