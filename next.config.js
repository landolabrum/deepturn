const { merchants }= require('./merchants.config');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Rule for .scss or .css files
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

    // Add this to handle ES modules in node_modules
    if (!isServer) {
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // disable the behavior
        },
        include: /node_modules/,
      });
    }

    return config;
  },
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    SITE_URL: merchants.mb1.url,
  },
};

module.exports = nextConfig;
