const express = require('express')
const { index, initGame, createGame } = require('../controllers/btgame')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/:gameId')
  .post(createGame)

router.route('/play')
  .get(initGame)


module.exports = router
