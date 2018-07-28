const axiosInstance = require('../bin/api')
const { filter } = require('ramda')

const index = async (req, res, next) => {
  try {
    const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games`, {
      headers: {
        Authorization: `JWT ${req.session.token}`,
      },
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

module.exports = {
  index,
}
