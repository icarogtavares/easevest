const { axiosInstance, getHeaderWithAuth } = require('../bin/api')
const { filter } = require('ramda')
const gameStages = require('../models/GameStages')

const index = async (req, res, next) => {
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games`, {
      headers,
    })
    let jogosPendentes = []
    if (result && result.data && result.data.docs.constructor === Array) {
      const estaPendente = game => !game.finalizado
      jogosPendentes = filter(estaPendente, result.data.docs)
    }
    return res.render('index.html', { page: 'btgame/index.html', jogosPendentes })
  } catch (err) {
    return next(err)
  }
}


const playGame = async (req, res, next) => {
  const { game } = req.session
  let currentGame = null
  if (game) {
    try {
      console.log('GAME', game)
      let stageNotAnswered = null
      gameStages.forEach((stage) => {
        if (!game[stage].respondido && !stageNotAnswered) {
          stageNotAnswered = stage
        }
      })
      console.log('STAGE', stageNotAnswered)
      console.log(`/alunos/${req.session.matricula}/games/${game._id}/${stageNotAnswered}`)
      const headers = getHeaderWithAuth(req.session.token)
      const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games/${game._id}/${stageNotAnswered}`, {
        headers,
      })
      console.log('DATA', result.data)
      currentGame = result.data
      if (!currentGame) throw new Error('Jogo não encontrado ou já finalizado!')
      return res.render('index.html', { page: 'btgame/game.html', game: currentGame })
      // return res.render('index.html', { page: 'btgame/game.html', game: currentGame })
    } catch (err) {
      return next(err)
    }
  } else {
    return res.redirect('/btgame')
  }
}

const createGame = async (req, res, next) => {
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.post(`/alunos/${req.session.matricula}/games`, {
      doc: {
        gameId: req.params.gameId,
        aluno_matricula: req.session.matricula,
        finalizado: false,
      },
    }, {
      headers,
    })
    const game = await axiosInstance.get(`/alunos/${req.session.matricula}/games/${result.data.id}`, {
      headers,
    })
    req.session.game = game.data
    return res.redirect('/btgame/play')
    // res.render('index.html', { page: 'btgame/game.html', game: game.data })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  playGame,
  createGame,
}
