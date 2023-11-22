/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, './'); // Assuming your root is where the 'pages' directory resides
    return config;
  },
}

module.exports = nextConfig
