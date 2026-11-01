import path from 'node:path';
import type { NextConfig } from 'next';

// Địa chỉ backend. Trình duyệt chỉ gọi /api/... trên cùng cổng 3000,
// Next.js chuyển tiếp sang backend nên không cần cấu hình CORS.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  devIndicators: false, // tắt nút tròn của Next.js để không che thanh điều hướng trên điện thoại
  turbopack: {
    root: path.resolve(__dirname), // gốc là thư mục frontend, tránh nhầm với package-lock.json ở thư mục cha
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
