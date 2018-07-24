const express = require('express')
const chatbotController = require('../controllers/chatbot')

const router = express.Router()

router.route('/')
  .get(chatbotController.chatbot)

module.exports = router
