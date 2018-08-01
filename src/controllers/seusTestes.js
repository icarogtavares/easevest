const { axiosInstance, getHeaderWithAuth } = require('../bin/api')

const index = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = true
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games`, {
      headers,
    })
    const jogosFinalizados = []
    const jogosPendentes = []
    if (result && result.data.docs && result.data.docs.constructor === Array) {
      result.data.docs.forEach((game) => {
        if (game.finalizado) {
          jogosFinalizados.push(game)
        } else {
          jogosPendentes.push(game)
        }
      })
    }
    return res.render('index.html', { page: 'seusTestes/index.html', jogosFinalizados, jogosPendentes })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
}
