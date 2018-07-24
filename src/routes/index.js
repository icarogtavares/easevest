const express = require('express')

const router = express.Router()

// router.use('/chatbot', chatbotRoutes)

router.get('/', (req, res) => {
  res.render('index.html', { absoluteUrl: req.absoluteUrl })
})
module.exports = router
