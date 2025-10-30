/* eslint-disable no-console */
require("dotenv").config(); // loads .env into process.env
const { merchants, deploy } = require("./merchants.config"); // assumes CJS export

const target = process.env.DEPLOY_TARGET || deploy;
const merchant = merchants[target];

if (!merchant) {
  console.error(`[next.config] Invalid DEPLOY_TARGET "${target}"`);
  process.exit(1);
}

console.log("[next.config] DEPLOY_TARGET:", target);
console.log("[next.config] SITE_URL:", merchant.url);

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: { SITE_URL: merchant.url },
  webpack: (config, { defaultLoaders, isServer }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      oneOf: [
        { resourceQuery: /raw/, use: ["style-loader", "css-loader"] },
        {
          use: [
            defaultLoaders.babel,
            {
              loader: require("styled-jsx/webpack").loader, // CJS, fine
              options: { type: "scoped" },
            },
          ],
        },
      ],
    });

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