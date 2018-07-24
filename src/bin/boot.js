const { configureExpress } = require('./middlewares')
const debug = require('debug')

const startApp = (id) => {
  const watsonDebug = debug(`easevest:server:${id}:`)

  const app = configureExpress()
  app.listen(app.get('port'), () => {
    watsonDebug(`Listening on port ${app.get('port')}`)
  })
}

module.exports = {
  startApp,
}
