// next.config.js
/* eslint-disable no-console */
const { merchants, deploy } = require('./merchants.config');

// Resolve merchant from deploy target (e.g., "deepturn")
const merchant = merchants?.[deploy];
const customDomain = Boolean(merchant?.url && !merchant.url.includes('github.io'));

// For GitHub Pages–style subfolder hosting only (NOT used for custom domains)
const subfolder = !customDomain && merchant?.name ? `/${merchant.name}` : '';

// Helpful diagnostics during builds
console.log('[next.config.js] DEPLOY_TARGET:', process.env.DEPLOY_TARGET || deploy || '(unset)');
console.log('[next.config.js] MERCHANT:', merchant?.name || 'undefined');
console.log('[next.config.js] SITE_URL:', merchant?.url || '(unset)');
console.log('[next.config.js] customDomain:', customDomain);
console.log('[next.config.js] basePath:', subfolder || '(root)');

const nextConfig = {
  reactStrictMode: true,

  // Static export for Caddy file_server
  output: 'export',

  // Create directory-style URLs so Caddy can serve /page/ -> /page/index.html
  trailingSlash: true,

  // Only set basePath/assetPrefix when deploying to a subfolder (e.g., GitHub Pages).
  ...(subfolder && {
    basePath: subfolder,
    assetPrefix: `${subfolder}/`,
  }),

  // Static export = no Next image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Expose the resolved public URL to client code
  env: {
    SITE_URL: merchant?.url || '',
  },

  /**
   * Not a Next option, but harmless as an app-level constant you can import.
   * Keep here if your code reads from next.config.js via transpile-time replacement.
   */
  allowedDevOrigins: [
    'local.tiktok.soy',
    'http://localhost:3000',
    'https://tiktok.soy',
    'https://tiktok.soy:3000',
  ],

  // Keep your css/styled-jsx handling and ESM resolution relaxation for some deps
  webpack: (config, { defaultLoaders, isServer }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      oneOf: [
        // Import raw CSS via `?raw` when you need it
        { resourceQuery: /raw/, use: ['style-loader', 'css-loader'] },
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

    // Some node_modules ship ESM without full specifiers; allow it on the client
    if (!isServer) {
      config.module.rules.push({
        test: /\.m?js$/,
        include: /node_modules/,
        resolve: { fullySpecified: false },
      });
    }

    return config;
  },
};

module.exports = nextConfig;
