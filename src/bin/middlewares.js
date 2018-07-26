const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const path = require('path')
const ejs = require('ejs')

const routes = require('../routes/')

const configureExpress = () => {
  const app = express()

  app.set('port', process.env.PORT || '4000')
  app.set('views', path.join(__dirname, '..', 'views'))
  app.set('view engine', 'ejs')
  app.engine('html', ejs.renderFile)

  app.use(helmet({
    frameguard: false,
  }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, '..', '..', 'public')))

  app.use((req, res, next) => {
    req.absoluteUrl = `https://${req.get('host')}`
    next()
  })

  app.use('/', routes)

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => { // eslint-disable-line max-params, no-unused-vars
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || err.statusCode || 500)
    res.send(res.locals.error)
  })

  return app
}

module.exports = {
  configureExpress,
}
