const express = require('express')
const btgameRoutes = require('./btgame')
const seusTestesRoutes = require('./seusTestes')

const router = express.Router()

router.use('/btgame', btgameRoutes)
router.use('/seus-testes', seusTestesRoutes)

router.get('/', (req, res) => {
  res.render('index.html', { page: 'index/index.html' })
})

module.exports = router
