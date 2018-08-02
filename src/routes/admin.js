const express = require('express')
const {
  index,
  view,
  getEdit,
  postEdit,
  create,
  destroy,
  resultados,
} = require('../controllers/admin')
const alunoRoutes = require('./admin/alunos')
const administradoresRoutes = require('./admin/administradores')

const router = express.Router()

router.route('/')
  .get(index)

router.use('/alunos', alunoRoutes)
router.use('/administradores', administradoresRoutes)

router.route('/users/')
  .post(create)

router.route('/users/resultados')
  .get(resultados)

router.route('/users/destroy')
  .post(destroy)

router.route('/users/:userId/view')
  .get(view)

router.route('/users/:userId/edit')
  .get(getEdit)
  .post(postEdit)

module.exports = router
