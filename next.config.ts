import type { NextConfig } from "next";
import path from "path";

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
    
    // Handle Node.js modules in browser
    if (!isServer) {
      // Replace Node.js modules with empty modules in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        path: false,
        os: false,
      };
      
      // Alias the KafkaJS socketFactory to our polyfill
      config.resolve.alias = {
        ...config.resolve.alias,
        'kafkajs/src/network/socketFactory': path.resolve(__dirname, './src/lib/kafkajs-socket-polyfill.js'),
      };
    }
    
    return config;
  },
};

export default nextConfig;
