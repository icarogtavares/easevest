const express = require('express')
const btgameRoutes = require('./btgame')
const seusTestesRoutes = require('./seusTestes')
const adminRoutes = require('./admin')
const { axiosInstance, getHeaderWithAuth } = require('../bin/api')

const router = express.Router()

router.use('/btgame', btgameRoutes)
router.use('/seus-testes', seusTestesRoutes)
router.use('/admin', adminRoutes)

router.get('/', async (req, res, next) => {
  res.locals.homepage = true
  res.locals.btgame = false
  res.locals.seusTestes = false
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
    return res.render('index.html', { page: 'index/index.html', jogosFinalizados, jogosPendentes })
  } catch (err) {
    return next(err)
  }
})

module.exports = router
