const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    host: 'localhost', // ou 'localhost'
    port: 8080,
    client: {
      webSocketURL: 'ws://localhost:8080/ws' // Force le ws en localhost
    }
  } ,
  lintOnSave: false,
}
