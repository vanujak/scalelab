import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: 'identity-credentials-get=(self "https://accounts.google.com")',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
