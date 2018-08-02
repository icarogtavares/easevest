const express = require('express')
const {
  index,
  view,
  getEdit,
  postEdit,
} = require('../controllers/admin')
const alunoRoutes = require('./admin/alunos')
const administradoresRoutes = require('./admin/administradores')

const router = express.Router()

router.route('/')
  .get(index)

router.use('/alunos', alunoRoutes)
router.use('/administradores', administradoresRoutes)

router.route('/users/:userId/view')
  .get(view)

router.route('/users/:userId/edit')
  .get(getEdit)
  .post(postEdit)

module.exports = router
