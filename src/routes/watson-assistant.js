const express = require('express')
const assistantController = require('../controllers/watson.assistant')

const router = express.Router()

router.route('/')
  .post(assistantController.message)

module.exports = router
