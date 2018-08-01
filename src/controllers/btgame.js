const { axiosInstance, getHeaderWithAuth } = require('../bin/api')
const { filter, contains } = require('ramda')
const gameStages = require('../models/GameStages')
const GameStagesEnum = require('../models/GameStagesEnum')
/* eslint-disable no-underscore-dangle */

const render = (res, params) => {
  res.render('index.html', params)
}

const index = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = true
  res.locals.seusTestes = false
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
    return render(res, {
      page: 'btgame/index.html',
      jogosPendentes,
    })
  } catch (err) {
    return next(err)
  }
}


const playGame = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = true
  res.locals.seusTestes = false
  let currentGame = null
  const { gameId } = req.params
  if (gameId) {
    try {
      const headers = getHeaderWithAuth(req.session.token)
      const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games/${gameId}/stage/`, { // eslint-disable-line
        headers,
      })

      currentGame = result.data
      if (!currentGame) throw new Error('Jogo não encontrado!')
      if (currentGame.finalizado) {
        req.session.game = currentGame
        return res.redirect(`/btgame/resultado/${currentGame._id}`)
      }
      const isCorrectAnswer = answer => answer.correta
      const numCorrectAnswers = filter(isCorrectAnswer, currentGame.respostas).length // eslint-disable-line max-len
      currentGame.numCorrectAnswers = numCorrectAnswers
      req.session.game = currentGame
      return res.render('index.html', { page: 'btgame/game.html', game: currentGame })
    } catch (err) {
      return next(err)
    }
  } else {
    return res.redirect('/btgame')
  }
}

const createGame = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = true
  res.locals.seusTestes = false
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
    return res.redirect(`/btgame/play/${result.data.id}`)
  } catch (err) {
    return next(err)
  }
}

const sendAnswer = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = true
  res.locals.seusTestes = false
  const { respostas } = req.body
  const { game } = req.session
  try {
    if (game.numCorrectAnswers !== respostas.length) throw new Error('Número de respostas marcadas não está de acordo com o número de respostas corretas!')

    const doc = {}
    doc[game.estagio] = {
      respostas,
      respondido: true,
    }
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.put(`/alunos/${req.session.matricula}/games/${game._id}`, {
      doc,
    }, {
      headers,
    })
    return res.redirect(`/btgame/play/${result.data.id}`)
  } catch (err) {
    return next(err)
  }
}

const resultado = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = true
  res.locals.seusTestes = false
  try {
    let { game } = req.session
    const { gameId } = req.params
    const headers = getHeaderWithAuth(req.session.token)
    if (!game) {
      const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games/${gameId}/stage/`, { // eslint-disable-line
        headers,
      })
      game = result.data
    }
    const gameOficialResult = await axiosInstance.get(`/btgames/${game.gameId}`, {
      headers,
    })

    const gameOficial = gameOficialResult.data
    let totalAcertos = 0
    let totalErros = 0
    gameStages.forEach((stage) => {
      let acertos = 0
      let total = 0
      gameOficial[stage].forEach((answer) => {
        if (contains(answer.id.toString(), game[stage].respostas)) {
          acertos += answer.correta ? 1 : 0
        }
        total += 1
      })
      game[stage].nome = GameStagesEnum[stage]
      game[stage].acertos = acertos
      game[stage].erros = total - acertos
      totalAcertos += acertos
      totalErros += game[stage].erros
    })
    game.acertos = totalAcertos
    game.erros = totalErros
    return res.render('index.html', { page: 'btgame/resultado.html', game, stages: gameStages })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  playGame,
  createGame,
  sendAnswer,
  resultado,
}
