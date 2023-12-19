const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 9000,
    proxy: {
        //  '/yu'为请求前缀，用于控制是不是走代理，想走代理时就在请求前缀前边加上这个请求前缀
        '/api': {
            target: 'http://localhost:8081',
            pathRewrite: { "^/api": "" }, //重写路径  匹配以/yu为开头的路径都变为空字符串 
            ws: true, //用于支持websocket
            changeOrigin: true //用于控制请求头中的host值
        },
    }
  }
})
