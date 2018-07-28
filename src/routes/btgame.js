const express = require('express')
const { index, initGame } = require('../controllers/btgame')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/:gameId')
  .get(initGame)

module.exports = router
