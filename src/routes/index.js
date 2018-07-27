const express = require('express')
const btgameRoutes = require('./btgame')

const router = express.Router()

router.use('/btgame', btgameRoutes)

router.get('/', (req, res) => {
  res.render('index.html', { page: 'index/index.html' })
})

module.exports = router
