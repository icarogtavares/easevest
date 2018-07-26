const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const session = require('express-session')

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

  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'provisorio',
  }))

  app.use((req, res, next) => {
    req.absoluteUrl = `https://${req.get('host')}`
    next()
  })

  app.use((req, res, next) => {
    const err = req.session.error
    const msg = req.session.success
    delete req.session.error
    delete req.session.success
    res.locals.message = ''
    if (err) res.locals.message = `<p class="msg error"> ${err} </p>`
    if (msg) res.locals.message = `<p class="msg success"> ${msg} </p>`
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
