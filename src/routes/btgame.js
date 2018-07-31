const express = require('express')
const {
  index,
  playGame,
  createGame,
  sendAnswer,
  resultado,
} = require('../controllers/btgame')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/resultado/:gameId')
  .get(resultado)

router.route('/play/:gameId')
  .get(playGame)

router.route('/sendAnswer')
  .post(sendAnswer)

router.route('/:gameId')
  .post(createGame)

module.exports = router
