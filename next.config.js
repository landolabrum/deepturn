const { merchants } = require('./merchants.config');

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'local.tiktok.soy',
    'http://localhost:3000',
    'https://tiktok.soy',
    'https://tiktok.soy:3000',
    'https://172.17.0.1:3000',
    '172.17.0.1'
    
  ], // ✅ Enables dev access from your tunnel domain

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      oneOf: [
        {
          resourceQuery: /raw/, // Handle imports with `?raw`
          use: ['style-loader', 'css-loader'],
        },
        {
          use: [
            defaultLoaders.babel,
            {
              loader: require('styled-jsx/webpack').loader,
              options: { type: 'scoped' },
            },
          ],
        },
      ],
    });

    // Handle ES modules in node_modules
    if (!isServer) {
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
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
