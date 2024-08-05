import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { './runtimeConfig': './runtimeConfig.browser' } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      manifest: {
        name: 'Tokk AI Platform',
        short_name: 'Tokk Platform',
        description: 'Tokk AWS Based Platform',
        start_url: '/index.html',
        display: 'standalone',
        theme_color: '#232F3E',
        icons: [
          {
            src: '/images/72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/images/bedrock_icon_96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/images/128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/images/144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/images/152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/images/bedrock_icon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/bedrock_icon_384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/images/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/images/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  server: { host: true },
});
