import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [path.resolve(process.cwd(), "app/(dashboard)")],
      loader: "ignore-loader", // Use ignore-loader instead of null-loader
    });
    return config;
  },
};

export default nextConfig;
