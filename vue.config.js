const fs = require('fs'),
  Config = require('./src/Config')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: Config.title
    }
  },
  devServer: {
    host:'www.dev.kungfoo.local',
    allowedHosts: [
      '.kungfoo.home',
      '.kungfoo.local'
    ],
    https: {
      key: fs.readFileSync('./ssl/server.key'),
      cert: fs.readFileSync('./ssl/server.crt')
    }
  }
}
