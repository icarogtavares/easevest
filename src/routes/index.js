const express = require('express')
const assistantRoutes = require('./watson-assistant')
const chatbotRoutes = require('./chatbot')

const router = express.Router()

router.use('/api/message', assistantRoutes)
router.use('/chatbot', chatbotRoutes)

router.get('/', (req, res) => {
  res.render('index.html', { absoluteUrl: req.absoluteUrl })
})
module.exports = router
