const express = require('express')

const router = express.Router()

// router.use('/chatbot', chatbotRoutes)

router.get('/login', (req, res) => {
  res.redirect('/')
})

router.get('/', (req, res) => {
  const isLogged = true
  res.render('index.html', { page: 'index/index.html', isLogged })
})

module.exports = router
