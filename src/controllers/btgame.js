const { axiosInstance, getHeaderWithAuth } = require('../bin/api')
const { filter } = require('ramda')

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
  let currentGame = null
  const { gameId } = req.params
  if (gameId) {
    try {
      const headers = getHeaderWithAuth(req.session.token)
      const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games/${gameId}/stage/`, { // eslint-disable-line
        headers,
      })
      currentGame = result.data
      if (!currentGame) throw new Error('Jogo não encontrado ou já finalizado!')
      return res.render('index.html', { page: 'btgame/game.html', game: currentGame })
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
    return res.redirect(`/btgame/play/${result.data.id}`)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  playGame,
  createGame,
}
