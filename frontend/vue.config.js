const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})
module.exports = {
  devServer: {
    allowedHosts: 'all',
    port: '3001',
    client: {
      webSocketURL: {
        hostname: 'elwing.cs.hs-rm.de',
        port: '3001',
        protocol: 'wss',
        pathname: '/',
      }
    }
  }
};