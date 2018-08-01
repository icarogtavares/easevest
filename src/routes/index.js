const express = require('express')
const btgameRoutes = require('./btgame')
const seusTestesRoutes = require('./seusTestes')
const adminRoutes = require('./admin')

const router = express.Router()

router.use('/btgame', btgameRoutes)
router.use('/seus-testes', seusTestesRoutes)
router.use('/admin', adminRoutes)

router.get('/', (req, res) => {
  res.locals.homepage = true
  res.locals.btgame = false
  res.locals.seusTestes = false
  res.render('index.html', { page: 'index/index.html' })
})

module.exports = router
