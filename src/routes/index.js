const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index.html', { page: 'index/index.html' })
})

module.exports = router
