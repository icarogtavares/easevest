const express = require('express')
const { index, playGame, createGame } = require('../controllers/btgame')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/:gameId')
  .post(createGame)

router.route('/play')
  .get(playGame)


module.exports = router
