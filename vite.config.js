import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default defineConfig((command) => {
  return {
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 2023,
      proxy: {}
    },
    plugins: createVitePlugins(command === 'build'),
    build: {
      rollupOptions: {
        output: {
          // 自定义输出目录结构
          entryFileNames: `js/[name].[hash].js`,
          chunkFileNames: `js/[name].[hash].js`,
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'images/[name].[hash][extname]'
            }
            if (/\.css$/.test(name ?? '')) {
              return 'css/[name].[hash][extname]'
            }
            // 其他文件保持默认的 assets 目录
            return 'assets/[name].[hash][extname]'
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
