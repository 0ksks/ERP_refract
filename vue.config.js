import { defineConfig } from "@vue/cli-service"
import webpack from "webpack"
export default defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: "all",
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 将 '/api' 前缀代理到后端
        },
      },
    },
  },
  pages: { 
    index: {
      entry: 'src/main.js', // 入口文件
      title: 'MM'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": "/src/",
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    ]
  },
})
