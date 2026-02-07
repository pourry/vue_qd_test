const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  lintOnSave: false, // 关闭语法检查
  
  // TypeScript 配置
  configureWebpack: {
    name: '次元收藏',
    entry: {
      app: './src/main.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  
  devServer: {
    open: true,
    host: 'localhost',
    port: 9000,
    proxy: {
      // '/yu'为请求前缀，用于控制是不是走代理，想走代理时就在请求前缀前边加上这个请求前缀
      '/api': {
        target: 'http://localhost:8001',
        pathRewrite: { "^/api": "" }, // 重写路径  匹配以/yu为开头的路径都变为空字符串 
        ws: true, // 用于支持websocket
        changeOrigin: true // 用于控制请求头中的host值
      },
    },
    client: {
      overlay: false,
    }
  }
})
