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

const initGame = (req, res) => {
  console.log(req.session)
  if (req.session.game) {
    res.render('index.html', { page: 'btgame/game.html', game: req.session.game })
  } else {
    res.redirect('/btgame')
  }
}

const createGame = async (req, res, next) => {
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.post(`/alunos/${req.session.matricula}/games`, {
      doc: {
        gameId: req.params.gameId,
        aluno_matricula: req.session.matricula,
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
  initGame,
  createGame,
}
