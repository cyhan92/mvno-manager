import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Hydration 오류 방지를 위해 임시 비활성화
  // Emotion과 MUI를 위한 설정
  compiler: {
    emotion: true,
  },
  /* config options here */
};

export default nextConfig;
