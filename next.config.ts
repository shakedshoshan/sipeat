import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      '@supabase/realtime-js': '@supabase/realtime-js/dist/cjs/index.js',
    },
  },
  webpack: (config, { isServer }) => {
    // Ignore the critical dependency warning from @supabase/realtime-js
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ }
    ];
    // If client-side, don't include server-only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        tty: false
      };
    }
    return config;
  },
};

export default nextConfig;
