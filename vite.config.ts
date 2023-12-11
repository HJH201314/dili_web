import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import sassDts from 'vite-plugin-sass-dts'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    sassDts({
      enabledMode: ['development', 'production'],
      global: {
        generate: true,
        outputFilePath: path.resolve(__dirname, './src/style.d.ts'),
      },
      sourceDir: path.resolve(__dirname, './src'),
      outputDir: path.resolve(__dirname, './dist'),
    }),
  ],
  css: {
    // 对css的行为进行配置
    // modules配置最终会丢给postcss modules
    modules: {
      // 是对css模块化的默认行为进行覆盖
      localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
      scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
      generateScopedName: '[name]_[local]_[hash:5]', // 配置生成的类名的格式
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4753,
    proxy: {
      '/api/security': {
        //target: 'http://172.29.16.13:8848/',
        target: 'http://127.0.0.1:4523/m1/3578335-0-default/',
        //target: 'http://localhost:8848/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/security/, ''),
      },
      '/api/manage': {
        target: 'http://localhost:8849/',
        //target: 'http://172.29.16.13:8849/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/manage/, ''),
      },
      '/api/admin': {
        target: 'http://127.0.0.1:4523/m1/3578335-0-b56c7805/',
        //target: 'http://localhost:8850/',
        //target: 'http://172.29.16.13:8850/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, ''),
      },
      '/api/comment': {
        target: 'http://localhost:8851/',
        //target: 'http://172.29.16.13:8851/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/comment/, ''),
      }
    }
  },
})
