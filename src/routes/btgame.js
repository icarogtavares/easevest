const express = require('express')
const {
  index,
  playGame,
  createGame,
  sendAnswer,
} = require('../controllers/btgame')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/play/:gameId')
  .get(playGame)

router.route('/sendAnswer')
  .post(sendAnswer)

router.route('/:gameId')
  .post(createGame)

module.exports = router
