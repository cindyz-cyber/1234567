import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  /** 部署在域名根路径时使用 `/`；若挂在子目录需改为 `'/子路径/'` */
  base: '/',
  /** 默认 `assets`，构建后冥想音视频为 `/assets/*-hash.ext`（由源码 `import` 保证） */
  build: {
    assetsDir: 'assets',
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // 开发时把 /api 转发到后端，便于 wx.config 拉取签名（按需改 target）
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
});
